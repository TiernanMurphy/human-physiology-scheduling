import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planName: {
        type: String,
        required: true,
        default: 'Schedule Draft'
    },
    semesters: [{
        name: String,
        courses: [{
            courseCode: String,
            courseName: String
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Plan', planSchema);