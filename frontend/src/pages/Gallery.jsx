import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import { X } from 'lucide-react';
import { galleryService } from '../services';

// Workshop Photos
import workshop1 from '../assets/gallery/nilgiri-workshop/workshop_1.jpg';
import workshop2 from '../assets/gallery/nilgiri-workshop/workshop_2.jpg';
import workshop3 from '../assets/gallery/nilgiri-workshop/workshop_3.jpg';
import workshop4 from '../assets/gallery/nilgiri-workshop/workshop_4.jpg';

    const loadImages = async () => {
        setLoading(true);
        try {
            const data = await galleryService.getAll();
            setImages(data);
        } catch (error) {
            console.error("Failed loading gallery", error);
        }
        setLoading(false);
    };

    const categories = ['All', 'Robotics', 'AI', 'Coding', 'Workshops', 'Events', 'Internship'];

    const filteredImages = filter === 'All'
        ? images
        : images.filter(img => img.category === filter);

    return (
        <div className="bg-gray-50 dark:bg-black transition-colors duration-500 min-h-screen py-12 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16" data-aos="fade-down">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white transition-colors mb-4 tracking-tight">Our <span className="text-orange-500">Gallery</span></h1>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors text-lg max-w-2xl mx-auto">Glimpses of our vibrant community, workshops, and student projects.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat
                                ? 'bg-orange-600 text-gray-900 dark:text-white transition-colors shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                                : 'bg-gray-900 text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:bg-gray-800 border border-gray-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6" data-aos="fade-up">
                    {loading ? (
                        <div className="text-center text-gray-500 col-span-full">Loading images...</div>
                    ) : filteredImages.length > 0 ? (
                        filteredImages.map((image) => (
                            <motion.div
                                key={image.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] hover:border-orange-500/30 transition-all duration-500 transform hover:-translate-y-2 bg-white/80 dark:bg-gray-900/40 backdrop-blur-sm"
                                onClick={() => setSelectedImage(image)}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-auto transform transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <span className="text-gray-900 dark:text-white transition-colors font-bold text-lg mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {image.alt}
                                    </span>
                                    <span className="text-orange-400 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                        {image.category}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 col-span-full">No images in this category.</div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <div className="relative max-w-5xl w-full max-h-screen">
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-12 right-0 text-gray-900 dark:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                            >
                                <X size={24} />
                            </button>
                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl border border-gray-800"
                            />
                            <div className="absolute bottom-4 left-0 right-0 text-center text-gray-900 dark:text-white transition-colors/80">
                                <span className="bg-white dark:bg-black/50 px-3 py-1 rounded-full text-sm border border-gray-200 dark:border-gray-700">
                                    {selectedImage.alt} • {selectedImage.category}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
