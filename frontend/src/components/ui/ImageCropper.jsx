import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

// Helper to crop the image on an offscreen canvas and return a base64 data URL
const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );
            resolve(canvas.toDataURL('image/jpeg', 0.92));
        });
        image.addEventListener('error', reject);
        image.src = imageSrc;
    });
};

/**
 * ImageCropper – a full-screen overlay crop modal.
 * Props:
 *   imageSrc   {string}   – the raw image data URL to crop
 *   aspect     {number}   – desired aspect ratio (default 16/9)
 *   onCrop     {function} – called with the cropped base64 string
 *   onCancel   {function} – called when the user dismisses the modal
 */
const ImageCropper = ({ imageSrc, aspect = 16 / 9, onCrop, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleConfirm = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCrop(croppedImage);
        } catch (e) {
            console.error('Crop error:', e);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div>
                    <h3 className="text-white font-bold text-lg">Crop Image</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Drag to reposition · Scroll to zoom</p>
                </div>
                <button
                    onClick={onCancel}
                    className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Crop Area */}
            <div className="relative flex-1">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    style={{
                        containerStyle: { background: 'transparent' },
                        cropAreaStyle: {
                            border: '2px solid #f97316',
                            boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)'
                        }
                    }}
                />
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-white/10 bg-black/60">
                {/* Zoom + Rotate */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setZoom(z => Math.max(1, +(z - 0.1).toFixed(1)))}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <ZoomOut size={18} />
                        </button>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.05}
                            value={zoom}
                            onChange={(e) => setZoom(+e.target.value)}
                            className="w-28 accent-orange-500"
                        />
                        <button
                            onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(1)))}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <ZoomIn size={18} />
                        </button>
                    </div>
                    <button
                        onClick={() => setRotation(r => (r + 90) % 360)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                    >
                        <RotateCw size={15} /> Rotate
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-extrabold shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all"
                    >
                        <Check size={16} /> Apply Crop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
