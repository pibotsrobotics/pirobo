import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Upload, Trash2, Eye, Pencil } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { galleryService } from '../../services';
import uploadService from '../../services/uploadService';

const ManageGallery = () => {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        setIsLoading(true);
        const data = await galleryService.getAll();
        setImages(data);
        setIsLoading(false);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleEdit = (img) => {
        setEditingImage(img);
        setIsEditMode(true);
        setIsModalOpen(true);
        setValue('title', img.title);
        setValue('category', img.category);
    };

    const onSubmit = async (data) => {
        if (!selectedFile && !isEditMode) {
            alert('Please select an image file to upload.');
            return;
        }

        try {
            setIsUploading(true);

            let fileUrl = editingImage?.src;
            
            // Only upload if a new file is selected
            if (selectedFile) {
                fileUrl = await uploadService.uploadFile(selectedFile, 'gallery-images');
            }

            const imageData = {
                src: fileUrl,
                category: data.category,
                title: data.title,
                alt: data.title
            };

            if (isEditMode && editingImage) {
                await galleryService.update(editingImage.id, imageData);
                alert('Image updated successfully!');
            } else {
                await galleryService.create(imageData);
                alert('Image uploaded successfully!');
            }

            await loadImages();
            
            // Cleanup
            closeModal();
        } catch (error) {
            console.error("Gallery management error:", error);
            alert('Failed to save gallery item.');
        } finally {
            setIsUploading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingImage(null);
        setSelectedFile(null);
        reset();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this image?")) {
            await galleryService.delete(id);
            await loadImages();
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Gallery Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Upload and manage showcase images.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all uppercase tracking-wide font-extrabold rounded-xl bg-orange-500 hover:bg-orange-600">
                    <Upload size={18} /> Upload Image
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-12 text-gray-500 flex items-center justify-center gap-2 font-medium">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <Eye size={20} className="text-orange-500" />
                        </motion.div>
                        Loading gallery...
                    </div>
                ) : (
                    <>
                        {images.map((img) => (
                            <div key={img.id} className="group relative rounded-3xl overflow-hidden aspect-square bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 shadow-md hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
                                <img src={img.src} alt={img.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 backdrop-blur-[2px]">
                                    <p className="text-white font-bold truncate text-base tracking-tight mb-0.5">{img.title}</p>
                                    <p className="text-[10px] font-black text-orange-400 mb-3 tracking-[0.2em] uppercase">{img.category}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(img)} className="p-2.5 bg-white/10 text-white rounded-xl hover:bg-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all backdrop-blur-md border border-white/20">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(img.id)} className="p-2.5 bg-white/10 text-white rounded-xl hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all backdrop-blur-md border border-white/20">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {images.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-gray-900/30 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center text-gray-400 mt-4">
                                <Eye size={48} className="mb-4 opacity-20" />
                                <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">No images in gallery</p>
                                <p className="text-sm">Click "Upload Image" to start your showcase.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditMode ? "Edit Image Details" : "Upload New Image"}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Image Title</label>
                        <Input placeholder="Describe the image" className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 w-full font-medium" {...register('title', { required: true })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Category</label>
                        <select {...register('category')} className="flex w-full rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-black/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none font-medium" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}>
                            <option value="Robotics">Robotics</option>
                            <option value="AI">AI</option>
                            <option value="Events">Events</option>
                            <option value="Workshops">Workshops</option>
                            <option value="Internship">Internship</option>
                            <option value="Coding">Coding</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Image File</label>
                        <div className="relative border-2 border-dashed border-gray-200 dark:border-gray-700/50 rounded-2xl p-10 text-center bg-gray-50 dark:bg-black/40 hover:bg-gray-100 dark:hover:bg-black/60 transition-all cursor-pointer group overflow-hidden">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {selectedFile ? (
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                    <div className="mx-auto w-20 h-20 mb-4 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border-2 border-orange-500 shadow-xl shadow-orange-500/20">
                                        <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-orange-600 dark:text-orange-400 font-bold text-sm tracking-wide">{selectedFile.name}</p>
                                    <p className="text-gray-400 text-xs mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <Button variant="outline" size="sm" className="mt-4 pointer-events-none">Change File</Button>
                                </motion.div>
                            ) : (
                                <div>
                                    <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload size={32} className="text-orange-500" />
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 font-bold text-sm">Click to browse or drag and drop</p>
                                    <p className="text-gray-400 text-xs mt-1 font-medium">Supports JPG, PNG, WEBP (Max 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="pt-4">
                        <Button 
                            type="submit" 
                            size="lg" 
                            disabled={isUploading}
                            className={`w-full tracking-widest font-black uppercase rounded-xl transition-all h-14 ${isUploading ? 'bg-orange-500/50 cursor-not-allowed text-white/50' : 'bg-orange-600 hover:bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]'}`}
                        >
                            {isUploading ? (isEditMode ? 'Updating...' : 'Uploading...') : (isEditMode ? 'Save Changes' : 'Upload to Gallery')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageGallery;
