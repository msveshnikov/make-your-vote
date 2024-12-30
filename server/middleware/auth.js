import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) return res.sendStatus(403);
        next();
    } catch {
        res.sendStatus(500);
    }
};
