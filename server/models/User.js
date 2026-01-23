import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    major: {
        type: String,
        required: true
    },
    minor: {
        type: String,
        default: 'none'
    },
    abroad: {
        type: String,
        enum: ['yes', 'no', 'undecided'],
        required: true
    },
    career: {
        type: String,
        required: true
    },
    clubs: {
        type: String,
        default: ''
    },
    additional: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);