/* eslint-disable react-hooks/rules-of-hooks */
/* global use, db */

use('vote');
db.votes.deleteMany({ countryCode: "CZ" });
db.users.updateOne({ email: 'msveshnikov@gmail.com' }, { $set: { isAdmin: true } });


db.votes.dropIndex('topic_1_user_1');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.topics.createIndex({ slug: 1 }, { unique: true });
db.topics.createIndex({ tags: 1 });
db.votes.createIndex({ createdAt: 1 });
db.votes.createIndex({ topic: 1, user: 1 });

// Admin setup
db.users.updateOne(
    { email: 'msveshnikov@gmail.com' },
    { $set: { isAdmin: true, role: 'admin' } }
);

// Sample user data
db.users.insertMany([
    {
        email: 'test@example.com',
        name: 'Test User',
        authProvider: 'google',
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
            notifications: true,
            theme: 'light'
        }
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
            gemini: {
                relevance: 0.9,
                categories: ['environmental', 'political'],
                sentiment: 'positive'
            }
        },
        engagement: {
            views: 0,
            shares: 0,
            comments: 0
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
    { $unwind: '$topic' }
]);

// Trending topics query
db.votes.aggregate([
    {
        $match: {
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
    },
    {
        $group: {
            _id: '$topicId',
            voteCount: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' }
        }
    },
    {
        $addFields: {
            engagementScore: {
                $multiply: [
                    '$voteCount',
                    { $size: '$uniqueUsers' }
                ]
            }
        }
    },
    { $sort: { engagementScore: -1 } },
    { $limit: 10 }
]);

// User activity analysis
db.votes.aggregate([
    {
        $group: {
            _id: '$userId',
            voteCount: { $sum: 1 },
            topicsVoted: { $addToSet: '$topicId' },
            firstVote: { $min: '$createdAt' },
            lastVote: { $max: '$createdAt' }
        }
    },
    {
        $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
        }
    }
]);

// Clear metadata location
db.votes.updateMany(
    {},
    { $unset: { 'metadata.location': '' } }
);