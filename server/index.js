import express from 'express';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { getTextGemini } from './gemini.js';
import { getUnsplashImages } from './unsplash.js';
import { getTextClaude } from './claude.js';
import User from './models/User.js';
import Vote from './models/Vote.js';
import Topic from './models/Topic.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

app.set('trust proxy', 1);
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
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

const generateTopicPairs = async () => {
    try {
        const prompt =
            "Generate 20 pairs of comparable items/people for voting (e.g., 'Ronaldo vs Messi'). Format as JSON array of objects with properties: title, optionA, optionB, category.";
        const [geminiResponse, claudeResponse] = await Promise.all([
            getTextGemini(prompt, 'gemini-exp-1206', 1.0),
            getTextClaude(prompt, 'claude-3-haiku-20240307', 1.0)
        ]);

        const geminiPairs = JSON.parse(cleanGeneratedCode(geminiResponse));
        const claudePairs = JSON.parse(cleanGeneratedCode(claudeResponse));
        const combinedPairs = [...geminiPairs, ...claudePairs];

        for (const pair of combinedPairs) {
            const [optionAImages, optionBImages] = await Promise.all([
                getUnsplashImages(pair.optionA),
                getUnsplashImages(pair.optionB)
            ]);
            pair.optionAImage = optionAImages[0];
            pair.optionBImage = optionBImages[0];
        }

        await Topic.insertMany(combinedPairs);
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

app.post('/api/vote', authenticateToken, async (req, res) => {
    try {
        const { topicId, value } = req.body;
        const userId = req.user?.id;

        const result = await Vote.create({
            user: userId,
            topic: topicId,
            value
        });

        res.json(result);
    } catch (error) {
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
        res.status(201).json(topic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/topics', async (req, res) => {
    try {
        const { page = 1, limit = 20, category } = req.query;
        const query = category ? { category } : {};

        const topics = await Topic.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const topicsWithVotes = await Promise.all(
            topics.map(async (topic) => {
                const votes = await Vote.find({ topic: topic._id });
                const totalVotes = votes.length;
                const optionAVotes = votes.filter((v) => v.value === 'A').length;
                const optionBVotes = votes.filter((v) => v.value === 'B').length;
                return {
                    ...topic.toObject(),
                    totalVotes,
                    optionAVotes,
                    optionBVotes
                };
            })
        );

        const total = await Topic.countDocuments(query);

        res.json({
            topics: topicsWithVotes,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/', async (req, res) => {
    const html = fs.readFileSync(join(__dirname, '../dist/landing.html'), 'utf8');
    res.send(html);
});

app.get('*', async (req, res) => {
    const html = fs.readFileSync(join(__dirname, '../dist/index.html'), 'utf8');
    res.send(html);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

process.on('uncaughtException', (err, origin) => {
    console.error(`Caught exception: ${err}`, `Exception origin: ${origin}`);
});

httpServer.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    if (process.env.NODE_ENV === 'production') {
        await generateTopicPairs();
    }
});

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './google.json';
