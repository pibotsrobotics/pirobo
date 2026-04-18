import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import ImageCropper from '../../components/ui/ImageCropper';
import { courseService } from '../../services';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State
    const [editingCourse, setEditingCourse] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [cropSrc, setCropSrc] = useState(null); // raw image waiting to be cropped

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

    // Load Courses on Mount
    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        setIsLoading(true);
        const data = await courseService.getAll();
        setCourses(data);
        setIsLoading(false);
    };

    const openModal = (course = null) => {
        if (course) {
            setEditingCourse(course);
            setValue('title', course.title);
            setValue('category', course.category);
            setValue('level', course.level || 'Beginner'); // default if missing
            setValue('price', course.price);
            setValue('image', course.image || '');
            setPreviewImage(course.image || '');
        } else {
            setEditingCourse(null);
            reset();
            setPreviewImage('');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
        reset();
    };

    const onSubmit = async (data) => {
        if (editingCourse) {
            // Update existing
            await courseService.update(editingCourse.id, data);
            setToastMessage(`${data.title} updated successfully!`);
        } else {
            // Add new
            await courseService.create(data);
            setToastMessage(`${data.title} successfully added!`);
        }
        await loadCourses(); // Reload list
        closeModal();
        setShowToast(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            await courseService.delete(id);
            await loadCourses();
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Manage Courses</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Create, update, and remove courses.</p>
                </div>
                <Button onClick={() => openModal()} className="gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all uppercase tracking-wide font-extrabold rounded-xl bg-orange-500 hover:bg-orange-600">
                    <Plus size={18} /> Add New Course
                </Button>
            </div>

            {/* Search & Filter Bar */}
            <Card className="mb-6 p-4 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 flex items-center gap-4 shadow-md">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10" size={18} />
                    <Input placeholder="Search courses..." className="pl-11 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all w-full relative z-0 font-medium" />
                </div>
            </Card>

            {/* Courses List */}
            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500 flex items-center justify-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <Search size={20} className="text-orange-500" />
                        </motion.div>
                        Loading courses...
                    </div>
                ) : (
                    <>
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-100 dark:border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:bg-white dark:hover:bg-gray-800/60 hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.08)] transition-all duration-300 shadow-sm">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-black/50 border border-gray-200 dark:border-white/10 flex-shrink-0 group-hover:border-orange-500/50 transition-colors">
                                        {course.image ? (
                                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-700 text-xs text-center p-1 font-bold italic">PI ROBO</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-orange-600 transition-colors">{course.title}</h3>
                                        <div className="flex items-center gap-3 mt-1.5 cursor-default">
                                            <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-black/50 text-xs font-bold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 uppercase tracking-wider">{course.category}</span>
                                            <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-xs font-bold text-orange-600 dark:text-orange-500 border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]">{course.price}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                    <button
                                        onClick={() => openModal(course)}
                                        className="p-2.5 text-blue-500 hover:text-white hover:bg-blue-500 rounded-xl transition-all border border-blue-500/10 shadow-sm"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all border border-red-500/10 shadow-sm"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {courses.length === 0 && (
                            <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/30 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                                <Search size={40} className="mb-4 opacity-20" />
                                <p className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">No courses found</p>
                                <p className="text-sm">Click "Add New Course" to create one.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingCourse ? 'Edit Course' : 'Add New Course'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Image Upload Section */}
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Course Image</label>
                        <div className="flex items-start gap-4">
                            <div className={`w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-black/40 ${previewImage ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : ''} transition-all`}>
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-center text-gray-400 font-medium p-2">No Image</span>
                                )}
                            </div>
                            <div className="flex-1 space-y-3">
                                <Input
                                    placeholder="Paste Image URL"
                                    className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 w-full"
                                    {...register('image')}
                                    onChange={(e) => setPreviewImage(e.target.value)}
                                />
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="course-image-upload"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => setCropSrc(reader.result);
                                                reader.readAsDataURL(file);
                                            }
                                            // Reset input so same file can be re-selected
                                            e.target.value = '';
                                        }}
                                    />
                                    <label
                                        htmlFor="course-image-upload"
                                        className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-white/5 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white cursor-pointer transition-all shadow-sm"
                                    >
                                        Or Upload & Crop
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Course Title</label>
                        <Input
                            placeholder="e.g. Robotics 101"
                            className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 w-full font-medium"
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && <span className="text-xs text-red-500 font-medium block mt-1">{errors.title.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Category</label>
                            <select
                                {...register('category', { required: 'Category is required' })}
                                className="flex w-full rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-black/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none font-medium"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                            >
                                <option value="">Select...</option>
                                <option value="Robotics">Robotics</option>
                                <option value="AI">AI</option>
                                <option value="Coding">Coding</option>
                                <option value="IoT">IoT</option>
                            </select>
                            {errors.category && <span className="text-xs text-red-500 font-medium block mt-1">{errors.category.message}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Level</label>
                            <select
                                {...register('level', { required: 'Level is required' })}
                                className="flex w-full rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-black/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none font-medium"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                            {errors.level && <span className="text-xs text-red-500 font-medium block mt-1">{errors.level.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Price</label>
                            <Input
                                placeholder="e.g. ₹4,999"
                                className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/60 transition-colors placeholder-gray-400 text-sm font-medium w-full"
                                {...register('price', { required: 'Price is required' })}
                            />
                            {errors.price && <span className="text-xs text-red-500 font-medium block mt-1">{errors.price.message}</span>}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" size="lg" className="w-full tracking-wide font-extrabold shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all uppercase rounded-xl bg-orange-600 hover:bg-orange-500">
                            {editingCourse ? 'Update Course' : 'Create Course'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Success Notification */}
            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            {/* Image Crop Overlay */}
            {cropSrc && (
                <ImageCropper
                    imageSrc={cropSrc}
                    aspect={16 / 9}
                    onCrop={(croppedDataUrl) => {
                        setPreviewImage(croppedDataUrl);
                        setValue('image', croppedDataUrl);
                        setCropSrc(null);
                    }}
                    onCancel={() => setCropSrc(null)}
                />
            )}
        </div>
    );
};

export default ManageCourses;
