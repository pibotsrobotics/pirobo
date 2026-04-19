const { db } = require('../config/firebase');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
    try {
        const snapshot = await db.collection('courses').orderBy('createdAt', 'asc').get();
        const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(courses);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
    try {
        const docRef = db.collection('courses').doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Admin)
const createCourse = async (req, res, next) => {
    try {
        const payload = { ...req.body, createdAt: Date.now() };
        const docRef = await db.collection('courses').add(payload);
        res.status(201).json({ id: docRef.id, ...payload });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
const updateCourse = async (req, res, next) => {
    try {
        const docRef = db.collection('courses').doc(req.params.id);
        await docRef.update({ ...req.body, updatedAt: Date.now() });
        res.status(200).json({ id: req.params.id, ...req.body });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
const deleteCourse = async (req, res, next) => {
    try {
        await db.collection('courses').doc(req.params.id).delete();
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
};
