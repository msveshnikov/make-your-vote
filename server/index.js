import express from 'express';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import morgan from 'morgan';
import compression from 'compression';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { getTextGemini } from './gemini.js';
import { getUnsplashImages } from './unsplash.js';
import User from './models/User.js';
import Vote from './models/Vote.js';
import Topic from './models/Topic.js';
import { load } from 'cheerio';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

app.set('trust proxy', 1);
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.static(join(__dirname, '../dist'), { maxAge: '3d' }));
app.use(morgan('dev'));
app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', limiter);

mongoose.connect(process.env.MONGODB_URI, {});

const cleanGeneratedCode = (code) => {
    const codeBlockRegex = /```(?:json)?\n([\s\S]*?)\n```/;
    const match = code.match(codeBlockRegex);
    return match ? match[1] : code;
};

const generateSitemap = async () => {
    const topics = await Topic.find({}, '_id').lean();
    const baseUrl = 'https://makeyour.vote';
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    sitemap += `  <url><loc>${baseUrl}</loc></url>\n`;

    topics.forEach((topic) => {
        sitemap += `  <url><loc>${baseUrl}/topic/${topic._id}</loc></url>\n`;
    });

    sitemap += '</urlset>';
    fs.writeFileSync(join(__dirname, '../dist/sitemap.xml'), sitemap);
};

const generateTopicPairs = async () => {
    try {
        const prompt =
            "Generate 20 pairs of comparable items/people for voting (e.g., 'Ronaldo vs Messi'). Format as JSON array of objects with properties: title, optionA, optionB, category.";
        const geminiResponse = await getTextGemini(prompt, 'gemini-exp-1206', 1.0);
        const geminiPairs = JSON.parse(cleanGeneratedCode(geminiResponse));

        for (const pair of geminiPairs) {
            const [optionAImages, optionBImages] = await Promise.all([
                getUnsplashImages(pair.optionA),
                getUnsplashImages(pair.optionB)
            ]);
            pair.optionAImage = optionAImages[0];
            pair.optionBImage = optionBImages[0];
        }

        await Topic.insertMany(geminiPairs);
        await generateSitemap();
    } catch (error) {
        console.error(error);
        console.error('Failed to generate topic pairs:', error);
    }
};

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        req.user = null;
        return next();
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        req.user = err ? null : user;
        next();
    });
};

app.get('/api/topic/:id', async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        res.json(topic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
        res.json({
            token,
            user: {
                email: user.email,
                role: user.role,
                subscription: user.subscription
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export const getIpFromRequest = (req) => {
    let ips = (
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        ''
    ).split(',');
    return ips[0].trim();
};

app.post('/api/vote', authenticateToken, async (req, res) => {
    try {
        const { topicId, value, context, metadata } = req.body;
        const userId = req.user?.id;
        const countryCode = req.headers['geoip_country_code'];
        const countryName = req.headers['geoip_country_name'];
        const browserLanguage = req.headers['accept-language'];
        const ip = getIpFromRequest(req);

        const vote = new Vote({
            user: userId,
            topic: topicId,
            value,
            context,
            metadata: {
                ...metadata,
                userAgent: req.headers['user-agent'],
                countryCode,
                countryName,
                browserLanguage,
                ip
            },
            isAnonymous: !userId
        });

        await vote.save();
        res.json(vote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/topics', authenticateToken, async (req, res) => {
    try {
        const { title, optionA, optionB, category } = req.body;
        const [optionAImages, optionBImages] = await Promise.all([
            getUnsplashImages(optionA),
            getUnsplashImages(optionB)
        ]);

        const topic = new Topic({
            title,
            optionA,
            optionB,
            category,
            creator: req.user?.id,
            optionAImage: optionAImages[0],
            optionBImage: optionBImages[0]
        });
        await topic.save();
        await generateSitemap();
        res.status(201).json(topic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/topics', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const query = category ? { category } : {};

        const [mostVotedTopics, newTopics, total] = await Promise.all([
            Topic.aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: 'votes',
                        localField: '_id',
                        foreignField: 'topic',
                        as: 'votes'
                    }
                },
                {
                    $addFields: {
                        totalVotes: { $size: '$votes' },
                        optionAVotes: {
                            $size: {
                                $filter: {
                                    input: '$votes',
                                    as: 'vote',
                                    cond: { $eq: ['$$vote.value', -1] }
                                }
                            }
                        },
                        optionBVotes: {
                            $size: {
                                $filter: {
                                    input: '$votes',
                                    as: 'vote',
                                    cond: { $eq: ['$$vote.value', 1] }
                                }
                            }
                        }
                    }
                },
                { $sort: { totalVotes: -1 } },
                { $skip: skip },
                { $limit: limit / 2 }
            ]),
            Topic.aggregate([
                { $match: query },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit / 2 }
            ]),
            Topic.countDocuments(query)
        ]);

        const uniqueTopics = new Map();
        [...mostVotedTopics, ...newTopics].forEach((topic) => {
            if (!uniqueTopics.has(topic._id.toString())) {
                uniqueTopics.set(topic._id.toString(), topic);
            }
        });

        const topics = Array.from(uniqueTopics.values());

        res.json({
            topics,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export const enrichMetadata = async (html, slug) => {
    try {
        if (!slug) return html;
        const topic = await Topic.findById(slug);
        if (!topic) return html;

        const $ = load(html);
        $('title').text(`${topic.title} - MakeYour.vote`);
        $('meta[name="description"]').attr(
            'content',
            `Vote on ${topic.title}: ${topic.optionA} vs ${topic.optionB} | MakeYour.vote`
        );
        $('meta[property="og:title"]').attr('content', topic.title);
        $('meta[property="og:description"]').attr(
            'content',
            `Vote on ${topic.title}: ${topic.optionA} vs ${topic.optionB}`
        );
        $('meta[property="og:url"]').attr('content', `https://makeyour.vote/topic/${slug}`);
        if (topic.optionAImage) {
            $('meta[property="og:image"]').attr('content', topic.optionAImage);
        }
        return $.html();
    } catch (error) {
        console.error(error);
        return html;
    }
};

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(join(__dirname, '../dist/sitemap.xml'));
});

app.get('/', async (req, res) => {
    const html = fs.readFileSync(join(__dirname, '../dist/landing.html'), 'utf8');
    res.send(html);
});

app.get('*', async (req, res) => {
    const html = fs.readFileSync(join(__dirname, '../dist/index.html'), 'utf8');
    if (!req.path.startsWith('/topic/')) {
        return res.send(html);
    }
    const slug = req.path.substring(7);
    const enrichedHtml = await enrichMetadata(html, slug);
    res.send(enrichedHtml);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

process.on('uncaughtException', (err, origin) => {
    console.error(`Caught exception: ${err}`, `Exception origin: ${origin}`);
});

httpServer.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    if (process.env.NODE_ENV === 'production2') {
        await generateTopicPairs();
    }
});

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './google.json';
