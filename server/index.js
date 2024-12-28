import express from 'express';
import cors from 'cors';
import fs from 'fs';
import OpenAI from 'openai';
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
import { Server } from 'socket.io';
import { createServer } from 'http';
import { getTextClaude } from './claude.js';
import { getTextGemini } from './gemini.js';
import User from './models/User.js';
import Vote from './models/Vote.js';
import Topic from './models/Topic.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

app.set('trust proxy', 1);
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '15mb' }));
app.use(express.static(join(__dirname, '../dist'), { maxAge: '3d' }));
app.use(morgan('dev'));
app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

mongoose.connect(process.env.MONGODB_URI, {});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

const generateAIResponse = async (prompt, model, temperature = 0.7) => {
    switch (model) {
        case 'gpt-4':
        case 'gpt-3.5-turbo': {
            const completion = await openai.chat.completions.create({
                model,
                messages: [{ role: 'user', content: prompt }],
                temperature
            });
            return completion.choices[0].message.content;
        }
        case 'claude-3':
            return await getTextClaude(prompt, model, temperature);
        case 'gemini-pro':
            return await getTextGemini(prompt, model, temperature);
        default:
            throw new Error('Invalid model specified');
    }
};

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
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
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/vote', authenticateToken, async (req, res) => {
    try {
        const { topicId, vote } = req.body;
        const userId = req.user.id;

        const result = await Vote.create({
            user: userId,
            topic: topicId,
            vote
        });

        io.emit('newVote', {
            topicId,
            voteCount: await Vote.countDocuments({ topic: topicId })
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/topics', async (req, res) => {
    try {
        const topics = await Topic.find().sort({ createdAt: -1 }).limit(20);
        res.json(topics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

io.on('connection', (socket) => {
    socket.on('joinTopic', (topicId) => {
        socket.join(`topic:${topicId}`);
    });

    socket.on('leaveTopic', (topicId) => {
        socket.leave(`topic:${topicId}`);
    });
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

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './google.json';
