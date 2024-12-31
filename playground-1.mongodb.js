/* eslint-disable react-hooks/rules-of-hooks */
/* global use, db */

use('vote');
db.users.updateOne({ email: 'msveshnikov@gmail.com' }, { $set: { isAdmin: true } });

db.topics.deleteMany({ optionAImage: { $exists: false } });

db.votes.dropIndex('topic_1_user_1');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.topics.createIndex({ slug: 1 }, { unique: true });
db.topics.createIndex({ tags: 1 });
db.votes.createIndex({ createdAt: 1 });

// Sample user data
db.users.insertMany([
    {
        email: 'test@example.com',
        name: 'Test User',
        authProvider: 'google',
        createdAt: new Date(),
        lastLogin: new Date()
    }
]);

// Sample topic data
db.topics.insertMany([
    {
        title: 'Climate Change Action',
        slug: 'climate-change-action',
        description: 'Should governments take immediate action on climate change?',
        tags: ['environment', 'policy', 'global'],
        createdAt: new Date(),
        optionAImage: 'https://example.com/image1.jpg',
        optionBImage: 'https://example.com/image2.jpg',
        aiAnalysis: {
            gemini: { relevance: 0.9, categories: ['environmental', 'political'] }
        }
    }
]);

// Analytics aggregation pipeline
db.votes.aggregate([
    {
        $group: {
            _id: '$topicId',
            totalVotes: { $sum: 1 },
            averageValue: { $avg: '$value' },
            latestVote: { $max: '$createdAt' }
        }
    },
    {
        $lookup: {
            from: 'topics',
            localField: '_id',
            foreignField: '_id',
            as: 'topic'
        }
    },
    {
        $unwind: '$topic'
    }
]);

// Trending topics query
db.votes.aggregate([
    {
        $match: {
            createdAt: {
                $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        }
    },
    {
        $group: {
            _id: '$topicId',
            voteCount: { $sum: 1 }
        }
    },
    {
        $sort: { voteCount: -1 }
    },
    {
        $limit: 10
    }
]);
