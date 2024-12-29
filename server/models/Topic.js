import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        optionA: {
            type: String,
            required: true,
            trim: true
        },
        optionB: {
            type: String,
            required: true,
            trim: true
        },
        optionAImage: {
            type: String,
            trim: true
        },
        optionBImage: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        category: {
            type: String
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['active', 'closed', 'pending', 'moderated'],
            default: 'pending'
        },
        aiAnalysis: {
            sentiment: {
                type: String,
                enum: ['positive', 'negative', 'neutral']
            },
            keywords: [String],
            cluster: String,
            moderationScore: Number
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date
        },
        totalVotes: {
            type: Number,
            default: 0
        },
        tags: [
            {
                type: String,
                trim: true
            }
        ],
        visibility: {
            type: String,
            enum: ['public', 'private', 'restricted'],
            default: 'public'
        },
        allowedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        metadata: {
            source: String,
            externalId: String,
            lastAnalyzed: Date,
            lastModerated: Date
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

topicSchema.virtual('votes', {
    ref: 'Vote',
    localField: '_id',
    foreignField: 'topic'
});

topicSchema.index({ title: 'text', description: 'text' });
topicSchema.index({ category: 1, status: 1 });
topicSchema.index({ creator: 1 });

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
