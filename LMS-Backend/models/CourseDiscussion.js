const mongoose = require('mongoose');

const courseDiscussionSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isInstructorMessage: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('CourseDiscussion', courseDiscussionSchema);