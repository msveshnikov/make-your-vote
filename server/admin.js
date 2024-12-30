import { authenticateToken, isAdmin } from './middleware/auth.js';
import Topic from './model/Topic.js';
import User from './model/User.js';
import { getUnsplashImages } from './unsplash';

const adminRoutes = (app) => {
    app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
        try {
            const users = await User.find().select('-password');
            res.json(users);
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.put('/api/topic/:id/image/:index', authenticateToken, isAdmin, async (req, res) => {
        try {
            const { id, index } = req.params;
            let topic =
                (await Topic.findOne({ slug: id })) || (await Topic.findById(id));
            if (!topic) return res.status(404).json({ error: 'Topic not found' });

            const images = await getUnsplashImages(topic.destination, topic.topic);
            topic.images[index] = images.urls[index];
            topic.credits[index] = images.credits[index];
            await topic.save();

            res.json(topic);
        } catch {
            res.status(500).json({ error: 'Failed to update image' });
        }
    });

    app.delete('/api/topics/:id', authenticateToken, isAdmin, async (req, res) => {
        try {
            await Topic.findByIdAndDelete(req.params.id);
            res.json({ message: 'Topic deleted successfully' });
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/api/admin/dashboard', authenticateToken, isAdmin, async (req, res) => {
        try {
            const [
                totalUsers,
                totalItineraries,
                totalAudioGuides,
                totalPhotos,
                totalChats,
                mediaStats
            ] = await Promise.all([User.countDocuments(), Topic.countDocuments()]);

            res.json({
                totalUsers,
                totalItineraries,
                totalAudioGuides,
                totalPhotos,
                totalChats,
                mediaStats
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};

export default adminRoutes;
