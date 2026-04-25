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

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await galleryService.getAll();
      setImages(data || []);
    } catch (error) {
      console.error('Failed loading gallery', error);
      setImages([]);
    }
    setLoading(false);
  };

  const categories = ['All', 'Robotics', 'AI', 'Coding', 'Workshops', 'Events', 'Internship'];

  const filteredImages = (images || []).filter((img) => {
    if (filter === 'All') return true;
    return img.category === filter;
  });

  return (
    <div className="bg-gray-50 dark:bg-black transition-colors duration-500 min-h-screen py-12 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white transition-colors mb-4 tracking-tight">Our <span className="text-orange-500">Gallery</span></h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors text-lg max-w-2xl mx-auto">Glimpses of our vibrant community, workshops, and student projects.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {loading ? (
            <div className="text-center text-gray-500 col-span-full py-20">Loading images...</div>
          ) : filteredImages.length > 0 ? (
            filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-orange-500/20 transition-all duration-500 bg-white/80 dark:bg-gray-900/40"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt || 'Gallery Image'}
                  className="w-full h-auto transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-white font-bold text-lg mb-1">{image.alt || 'Pi Bots Action'}</span>
                  <span className="text-orange-400 text-sm font-medium">{image.category}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-500 col-span-full py-20">No images in this category.</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl w-full max-h-screen" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt || 'Gallery View'}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
              />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white border border-white/20">
                  {selectedImage.alt || 'Details'} • {selectedImage.category}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Gallery;
