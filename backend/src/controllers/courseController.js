// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
    try {
        // Mock data for now
        res.status(200).json([
            { id: 1, title: 'Robotics 101', level: 'Beginner' },
            { id: 2, title: 'AI Masterclass', level: 'Advanced' },
        ]);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Admin)
const createCourse = async (req, res, next) => {
    try {
        res.status(201).json({ message: 'Course created', data: req.body });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCourses,
    createCourse,
};
