import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['coach', 'club'],
            default: 'coach'
        },
        name: {
            type: String,
            trim: true
        },
        certifications: [
            {
                type: String,
                trim: true
            }
        ],
        experience: {
            type: String,
            trim: true
        },
        achievements: [
            {
                type: String,
                trim: true
            }
        ],
        teams: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Team'
            }
        ],
        preferences: {
            type: Map,
            of: String,
            default: {}
        },
        analytics: {
            lastLogin: Date,
            loginCount: Number,
            exercisesCreated: Number
        },
        subscription: {
            type: String,
            enum: ['free', 'premium'],
            default: 'free'
        },
        permissions: [
            {
                type: String,
                enum: ['create_exercise', 'manage_team', 'view_analytics', 'admin']
            }
        ],
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
        timestamps: true
    }
);

UserSchema.index({ role: 1 });

const User = mongoose.model('User', UserSchema);

export default User;
