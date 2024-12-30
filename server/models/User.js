import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
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
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String
    },
    subscriptionStatus: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },
    subscriptionId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationToken: String,
    emailVerified: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 3600000;
    return resetToken;
};

userSchema.methods.updatePreferences = function (newPreferences) {
    this.preferences = { ...this.preferences, ...newPreferences };
    return this.save();
};

userSchema.methods.upgradeSubscription = function (subscriptionId) {
    this.subscriptionStatus = 'premium';
    this.subscriptionId = subscriptionId;
    return this.save();
};

userSchema.methods.downgradeSubscription = function () {
    this.subscriptionStatus = 'free';
    this.subscriptionId = null;
    return this.save();
};

userSchema.methods.addVisitedCountry = function (countryCode, countryName) {
    if (!this.visitedCountries.some((country) => country.code === countryCode)) {
        this.visitedCountries.push({
            code: countryCode,
            name: countryName
        });
        return this.save();
    }
    return this;
};

userSchema.methods.canCreateAudioGuide = function () {
    if (this.isAdmin) return true;
    let can;
    if (!this.lastAudioGuideCreated) {
        can = true;
    } else {
        can = (Date.now() - this.lastAudioGuideCreated) / (1000 * 60 * 60) > 24;
    }
    if (can) {
        this.lastAudioGuideCreated = Date.now();
        this.save();
    }
    return can;
};

const User = mongoose.model('User', userSchema);

export default User;
