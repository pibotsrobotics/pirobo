import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import { Search, Filter, Clock, BookOpen, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { courseService, registrationService } from '../services';

const initialData = [
    {
        id: 1,
        title: 'Robotics for Beginners',
        category: 'Robotics',
        level: 'Beginner',
        duration: '8 Weeks',
        features: ['Build 5 Robots', 'Kit Included'],
        rating: 4.8,
        reviews: 120,
        price: '₹4,999',
        image: 'bg-orange-900/50',
    },
    {
        id: 2,
        title: 'Advanced AI & ML',
        category: 'AI',
        level: 'Advanced',
        duration: '12 Weeks',
        features: ['Python Mastery', 'Neural Nets'],
        rating: 4.9,
        reviews: 85,
        price: '₹7,999',
        image: 'bg-purple-900/50',
    },
    {
        id: 3,
        title: 'Web Development Bootcamp',
        category: 'Coding',
        level: 'Intermediate',
        duration: '10 Weeks',
        features: ['React & Node.js', 'Full Stack Project'],
        rating: 4.7,
        reviews: 200,
        price: '₹5,999',
        image: 'bg-blue-900/50',
    },
];

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');

    // Auth / Modal State
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        setLoading(true);
        try {
            let data = await courseService.getAll();
            if (data.length === 0) {
                if (!localStorage.getItem('courses')) {
                    for (const c of initialData) await courseService.create(c);
                    data = await courseService.getAll();
                }
            }
            setCourses(data);
        } catch (error) {
            console.error("Failed to load courses", error);
        }
        setLoading(false);
    };

    const openModal = (course) => {
        setSelectedCourse(course);
        reset();
    }

    const closeModal = () => {
        setSelectedCourse(null);
    }

    const onSubmit = async (data) => {
        try {
            const registrationData = {
                ...data,
                itemTitle: selectedCourse.title,
                itemId: selectedCourse.id,
                type: 'Course',
                date: new Date().toLocaleDateString(),
                status: 'Registered',
                price: selectedCourse.price
            };

            await registrationService.create(registrationData);
            setToastMessage(`Registration successful! We will contact you soon.`);
            closeModal();
            setShowToast(true);
        } catch (error) {
            console.error("Registration failed", error);
            // alert("Registration failed. Please try again.");
        }
    };

    const filteredCourses = courses.filter((course) => {
        const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        const level = course.level || 'Beginner';
        const matchesLevel = selectedLevel === 'All' || level === selectedLevel;
        return matchesSearch && matchesCategory && matchesLevel;
    });

    const categories = ['All', 'Robotics', 'AI', 'Coding', 'IoT'];
    const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    return (
        <div className="bg-gray-50 dark:bg-black transition-colors duration-500 min-h-screen py-12 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6" data-aos="fade-down">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white transition-colors mb-4 tracking-tight">Explore Our <span className="text-orange-500">Courses</span></h1>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors max-w-2xl text-lg">
                            Find the perfect course to upgrade your skills. From Robotics to AI, we have something for everyone.
                        </p>
                    </div>
                </div>

                {/* Filters & Search - Glassmorphism */}
                <div className="p-6 mb-12 sticky top-[80px] z-30 shadow-2xl backdrop-blur-2xl bg-white/80 dark:bg-gray-900/40 border border-gray-200 dark:border-white/10 rounded-2xl" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <Input
                                placeholder="Search courses..."
                                className="pl-10 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white transition-colors placeholder-gray-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <select
                                className="h-10 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 px-3 py-2 text-sm text-gray-900 dark:text-white transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>

                            <select
                                className="h-10 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 px-3 py-2 text-sm text-gray-900 dark:text-white transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors"
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                            >
                                {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-600 dark:text-gray-400 transition-colors">Loading courses...</div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                                className="h-full"
                            >
                                <div className="h-full flex flex-col group bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                                    {/* Abstract header representation instead of solid image */}
                                    <div
                                        className={`h-48 relative overflow-hidden flex items-center justify-center bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${course.image ? '' : 'bg-gradient-to-tr from-gray-900 to-black'}`}
                                        style={course.image ? { backgroundImage: `url(${course.image})` } : {}}
                                    >
                                        {!course.image && (
                                            <div className="absolute inset-0 flex mt-12 items-center justify-center opacity-10">
                                                <BookOpen size={120} />
                                            </div>
                                        )}
                                        {/* Overlay for readability */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent"></div>

                                        <div className="absolute top-4 right-4 bg-orange-500/10 backdrop-blur-md border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold text-orange-400 z-10">
                                            {course.level || 'Beginner'}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20">{course.category}</span>
                                            <div className="flex items-center text-yellow-500 text-sm font-bold gap-1">
                                                <Star size={14} fill="currentColor" /> {course.rating || 4.5} <span className="text-gray-500 font-normal">({course.reviews || 0})</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors mb-3 group-hover:text-orange-500 transition-colors">
                                            {course.title}
                                        </h3>

                                        <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-gray-500" /> {course.duration || 'Flexible'}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={16} className="text-gray-500" /> {course.features ? course.features[0] : 'Hands-on'}
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="text-xl font-bold text-gray-900 dark:text-white transition-colors flex items-center gap-1">
                                                <span className="text-orange-500 mr-0.5">₹</span>
                                                <span>{course.price?.toString().replace('₹', '') || '0'}</span>
                                            </div>
                                            <Button size="sm" className="bg-orange-600 hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all duration-300 rounded-full px-6" onClick={() => openModal(course)}>Register</Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors">No courses found</h3>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors">Try adjusting your filters or search terms.</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedLevel('All'); }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Registration Modal */}
            <Modal
                isOpen={!!selectedCourse}
                onClose={closeModal}
                title={`Register for ${selectedCourse?.title}`}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-1">Full Name</label>
                        <Input
                            placeholder="John Doe"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-1">Email Address</label>
                        <Input
                            type="email"
                            placeholder="john@example.com"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-1">Phone Number</label>
                        <Input
                            type="tel"
                            placeholder="+91 85472 44223"
                            {...register('phone', { required: 'Phone is required' })}
                        />
                        {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors">
                        <div className="flex justify-between">
                            <span>Course Fee:</span>
                            <span className="font-bold text-gray-900 dark:text-white transition-colors">
                                <span className="text-orange-500 mr-0.5">₹</span>
                                {selectedCourse?.price?.toString().replace('₹', '')}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Registering...' : 'Confirm Registration'}
                        </Button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            We will contact you shortly to complete the enrollment process.
                        </p>
                    </div>
                </form>
            </Modal>

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default Courses;
