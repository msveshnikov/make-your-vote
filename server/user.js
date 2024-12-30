import User from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authenticateToken } from './middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const transporter = nodemailer.createTransport({
    service: 'icloud',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const userRoutes = (app) => {
    app.post('/api/signup', async (req, res) => {
        try {
            const { credential, firstName, lastName, email, password } = req.body;
            let user;
            if (credential) {
                const ticket = await googleClient.verifyIdToken({
                    idToken: credential,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                const { email: googleEmail, given_name, family_name } = ticket.getPayload();

                user = await User.findOne({ email: googleEmail });
                if (!user) {
                    user = new User({
                        email: googleEmail,
                        firstName: given_name,
                        lastName: family_name,
                        password: bcrypt.hashSync(Math.random().toString(36), 10),
                        emailVerified: true
                    });
                    await user.save();
                }
            } else {
                user = new User({
                    firstName,
                    lastName,
                    email,
                    password,
                    verificationToken: crypto.randomBytes(32).toString('hex')
                });
                await user.save();

                // const welcomeEmail = {
                //     to: email,
                //     from: process.env.FROM_EMAIL,
                //     subject: 'Welcome to MyTrip.city - Verify Your Email',
                //     html: `
                //         <h1>Welcome to MyTrip.city!</h1>
                //         <p>Thank you for joining our community of travel enthusiasts.</p>
                //         <p>Please verify your email by clicking this link: ${process.env.FRONTEND_URL}/api/verify/${user.verificationToken}</p>
                //         <p>With MyTrip.city you can:</p>
                //         <ul>
                //             <li>Generate AI-powered travel itineraries</li>
                //             <li>Get personalized recommendations</li>
                //             <li>Access interactive maps and guides</li>
                //             <li>Track your carbon footprint</li>
                //         </ul>
                //         <p>Start planning your next adventure now!</p>
                //     `
                // };
                // await transporter.sendMail(welcomeEmail);
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.status(201).json({ message: 'User registered successfully', token });
        } catch {
            res.status(500).json({ error: 'Registration failed' });
        }
    });

    app.get('/api/verify/:token', async (req, res) => {
        try {
            const user = await User.findOne({ verificationToken: req.params.token });
            if (!user) {
                return res.status(400).send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Verification Failed</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                margin: 0;
                                background-color: #f5f5f5;
                            }
                            .container {
                                text-align: center;
                                padding: 40px;
                                background-color: white;
                                border-radius: 8px;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }
                            .error {
                                color: #dc3545;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1 class="error">Verification Failed</h1>
                            <p>Invalid or expired verification link.</p>
                        </div>
                    </body>
                    </html>
                `);
            }

            user.emailVerified = true;
            user.verificationToken = undefined;
            await user.save();

            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Email Verified</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #f5f5f5;
                        }
                        .container {
                            text-align: center;
                            padding: 40px;
                            background-color: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .success {
                            color: #28a745;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1 class="success">Email Verified Successfully!</h1>
                        <p>You can now close this window and login to your account.</p>
                    </div>
                </body>
                </html>
            `);
        } catch {
            res.status(500).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Error</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #f5f5f5;
                        }
                        .container {
                            text-align: center;
                            padding: 40px;
                            background-color: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .error {
                            color: #dc3545;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1 class="error">Verification Failed</h1>
                        <p>An error occurred during verification. Please try again later.</p>
                    </div>
                </body>
                </html>
            `);
        }
    });

    app.post('/api/reset-password', async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: 'User not found' });

            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000;
            await user.save();

            const resetEmail = {
                to: email,
                from: process.env.FROM_EMAIL,
                subject: 'Password Reset Request - MakeYour.Vote',
                html: `
                    <h1>Password Reset Request</h1>
                    <p>You requested to reset your password.</p>
                    <p>Click this link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${resetToken}</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                `
            };
            await transporter.sendMail(resetEmail);

            res.json({ message: 'Password reset email sent' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Failed to send reset email' });
        }
    });

    app.post('/api/reset-password/:token', async (req, res) => {
        try {
            const { password } = req.body;
            const user = await User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() }
            });
            if (!user) return res.status(400).json({ error: 'Invalid or expired reset token' });

            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.json({ message: 'Password reset successful' });
        } catch {
            res.status(500).json({ error: 'Password reset failed' });
        }
    });

    app.post('/api/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: 'User not found' });

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ token });
        } catch {
            res.status(500).json({ error: 'Login failed' });
        }
    });

    app.get('/api/user', authenticateToken, async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.json(user);
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.put('/api/user', authenticateToken, async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                email,
                preferences: {
                    language,
                    currency,
                    travelStyle,
                    interests,
                    dietaryRestrictions,
                    accessibility,
                    bio,
                    carbon,
                    notifications
                }
            } = req.body;

            const user = await User.findByIdAndUpdate(
                req.user.id,
                {
                    firstName,
                    lastName,
                    email,
                    preferences: {
                        language,
                        currency,
                        travelStyle,
                        interests,
                        dietaryRestrictions,
                        accessibility,
                        bio,
                        carbon,
                        notifications
                    }
                },
                { new: true }
            ).select('-password');

            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};

export default userRoutes;
