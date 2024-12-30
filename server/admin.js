import { authenticateToken, isAdmin } from './middleware/auth.js';
import Topic from './models/Topic.js';
import User from './models/User.js';
import Vote from './models/Vote.js';
import { getUnsplashImages } from './unsplash.js';
// import { analyzeTopicTrends } from './gemini.js';

const adminRoutes = (app) => {
    app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
        try {
            const users = await User.find().select('-password');
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/api/votes', authenticateToken, isAdmin, async (req, res) => {
        try {
            const votes = await Vote.find().limit(20).populate('topic');
            res.json(votes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.put('/api/topic/:id/image/:option', authenticateToken, isAdmin, async (req, res) => {
        try {
            const { id, option } = req.params;
            const topic = await Topic.findById(id);
            if (!topic) return res.status(404).json({ error: 'Topic not found' });

            const image = await getUnsplashImages(option === '-1' ? topic.optionA : topic.optionB);
            if (option === '-1') {
                topic.optionAImage = image[0];
            } else {
                topic.optionBImage = image[0];
            }
            await topic.save();

            res.json(topic);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to regenerate image' });
        }
    });

    app.delete('/api/topics/:id', authenticateToken, isAdmin, async (req, res) => {
        try {
            const topic = await Topic.findById(req.params.id);
            if (!topic) return res.status(404).json({ error: 'Topic not found' });

            await Vote.deleteMany({ topicId: req.params.id });
            await Topic.findByIdAndDelete(req.params.id);

            res.json({ message: 'Topic and related votes deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/api/admin/dashboard', authenticateToken, isAdmin, async (req, res) => {
        try {
            const [totalUsers, totalTopics, totalVotes] = await Promise.all([
                User.countDocuments(),
                Topic.countDocuments(),
                Vote.countDocuments()
            ]);

            const topVotedTopics = await Topic.find()
                .sort({ totalVotes: -1 })
                .limit(5)
                .select('title totalVotes optionA optionB');

            const recentVotes = await Vote.find().sort({ createdAt: -1 }).limit(10);
            // .populate('topicId', 'title')
            // .populate('userId', 'username');

            // const trendAnalysis = await analyzeTopicTrends(topVotedTopics);

            res.json({
                stats: {
                    totalUsers,
                    totalTopics,
                    totalVotes
                },
                topVotedTopics,
                recentVotes
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.put('/api/users/:id/role', authenticateToken, isAdmin, async (req, res) => {
        try {
            const { role } = req.body;
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { role },
                { new: true }
            ).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.delete('/api/users/:id', authenticateToken, isAdmin, async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            await Vote.deleteMany({ userId: req.params.id });
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: 'User and related data deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};

export default adminRoutes;
