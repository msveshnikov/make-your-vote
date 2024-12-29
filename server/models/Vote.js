import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic',
            required: true
        },
        value: {
            type: Number,
            required: true,
            min: -1,
            max: 1
        },
        sentiment: {
            type: String,
            enum: ['positive', 'negative', 'neutral'],
            default: 'neutral'
        },
        context: {
            type: String,
            maxLength: 1000
        },
        metadata: {
            device: String,
            location: {
                type: { type: String },
                coordinates: [Number]
            },
            userAgent: String,
            browserLanguage: String,
            countryCode: {
                type: String,
                trim: true,
                maxLength: 2
            },
            countryName: {
                type: String,
                trim: true,
                maxLength: 100
            },
            ip: {
                type: String,
                trim: true
            }
        },
        isAnonymous: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

voteSchema.index({ topic: 1, createdAt: -1 });
voteSchema.index({ user: 1, createdAt: -1 });
voteSchema.index({ countryCode: 1 });

voteSchema.statics.getTopicStats = async function (topicId) {
    return this.aggregate([
        { $match: { topic: new mongoose.Types.ObjectId(topicId) } },
        {
            $group: {
                _id: null,
                totalVotes: { $sum: 1 },
                positiveVotes: { $sum: { $cond: [{ $gt: ['$value', 0] }, 1, 0] } },
                negativeVotes: { $sum: { $cond: [{ $lt: ['$value', 0] }, 1, 0] } },
                neutralVotes: { $sum: { $cond: [{ $eq: ['$value', 0] }, 1, 0] } }
            }
        }
    ]);
};

voteSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
