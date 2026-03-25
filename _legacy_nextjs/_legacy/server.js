require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Course = require('./models/Course');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_tradesovereign_key_99';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Mongoose)
const uri = process.env.MONGODB_URI;
if (uri) {
    mongoose.connect(uri)
      .then(() => console.log("Connected successfully to MongoDB via Mongoose."))
      .catch(e => console.error("MongoDB connection error:", e));
} else {
    console.warn("WARNING: MONGODB_URI is not defined in .env file. Running without database connection.");
}

// Authentication Middleware
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if(!req.user) return res.status(401).json({ error: 'User not found' });
            next();
        } catch (error) {
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};

// ==========================================
// API ROUTES
// ==========================================

// -- Auth Routes --
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'User already exists' });
        
        const user = await User.create({ email, password });
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({ _id: user._id, email: user.email, token });
    } catch (e) {
        res.status(500).json({ error: 'Registration failed: ' + e.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
            res.json({ _id: user._id, email: user.email, token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Login failed: ' + e.message });
    }
});

app.get('/api/auth/me', protect, (req, res) => {
    res.json(req.user);
});

// -- Course Routes --
app.get('/api/courses', async (req, res) => {
    try {
        // Find all courses, but don't return full lesson content to save bandwidth on lists
        const courses = await Course.find({}).select('-lessons.content');
        
        // Mock fallback if DB is empty
        if (!courses || courses.length === 0) {
            return res.json([
                { _id: 'mock1', title: 'Intro to Price Action', category: 'trading', description: 'Master the basics of PA.' },
                { _id: 'mock2', title: 'CBSE Class 12 Physics', category: 'academic', description: 'Complete NCERT solutions.' }
            ]);
        }
        res.json(courses);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch courses.' });
    }
});

app.get('/api/courses/:id', async (req, res) => {
    try {
        if(req.params.id.startsWith('mock')) return res.json({ _id: req.params.id, title: 'Mock Course', lessons: [{ _id: 'l1', title: 'Lesson 1', content: 'Mock Content...', videoUrl: '' }] });
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch course details.' });
    }
});

// -- Progress Tracking Routes --
app.post('/api/progress/:courseId/:lessonId', protect, async (req, res) => {
    try {
        const user = req.user;
        const { courseId, lessonId } = req.params;
        
        let courseProgress = user.progress.find(p => p.courseId && p.courseId.toString() === courseId);
        if (!courseProgress) {
            user.progress.push({ courseId: courseId, completedLessons: [lessonId] });
        } else {
            if (!courseProgress.completedLessons.includes(lessonId)) {
                courseProgress.completedLessons.push(lessonId);
            }
        }
        await user.save();
        res.json({ message: 'Progress updated successfully', progress: user.progress });
    } catch (e) {
        res.status(500).json({ error: 'Failed to update progress: ' + e.message });
    }
});

// -- Legacy Trade Route --
app.get('/api/trades/live', async (req, res) => {
    res.json({
        status: 'success',
        source: 'database-mongoose',
        data: [{ symbol: 'BTC/USD', price: 65432.10, change: '+2.4%', volume: '1.2B' }]
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
