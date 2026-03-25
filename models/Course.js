const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String }, // Markdown content
    videoUrl: { type: String }, // Optional video embed URL
    quiz: [{
        question: String,
        options: [String],
        correctAnswerIndex: Number
    }]
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['academic', 'trading'], required: true },
    lessons: [LessonSchema],
    thumbnail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
