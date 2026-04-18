import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, User, Camera, Loader2, RefreshCw, Save, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import { teamService, uploadService } from '../../services';
import Cropper from 'react-easy-crop';

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
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

    return new Promise((resolve) => {
        canvas.toBlob((file) => {
            resolve(file);
        }, 'image/jpeg', 0.9);
    });
}

const defaultForm = { name: '', role: '', image: null };

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: {
        opacity: 1, y: 0, scale: 1,
        transition: { type: 'spring', stiffness: 260, damping: 22 }
    },
    exit: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } }
};

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const modalOverlayVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
};

const modalPanelVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
    exit: { opacity: 0, scale: 0.92, y: 30, transition: { duration: 0.18 } }
};

const ManageTeam = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const [formData, setFormData] = useState(defaultForm);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    // Cropping State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [rawImageUrl, setRawImageUrl] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => { fetchMembers(); }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const data = await teamService.getAll();
            setMembers(data);
        } catch (error) {
            console.error('Failed to load team members', error);
        } finally {
            setLoading(false);
        }
    };


    const openAddModal = () => {
        setIsEditMode(false);
        setEditingMember(null);
        setFormData(defaultForm);
        setPreviewUrl(null);
        setFormError('');
        setIsCropping(false);
        setRawImageUrl(null);
        setShowModal(true);
    };

    const openEditModal = (member) => {
        setIsEditMode(true);
        setEditingMember(member);
        setFormData({ name: member.name || '', role: member.role || '', image: null });
        setPreviewUrl(member.image || null);
        setFormError('');
        setIsCropping(false);
        setRawImageUrl(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => {
            setEditingMember(null);
            setFormData(defaultForm);
            setPreviewUrl(null);
            setFormError('');
            setIsCropping(false);
            setRawImageUrl(null);
        }, 200);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Reset crop tools
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setRawImageUrl(reader.result);
            setIsCropping(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async () => {
        try {
            const croppedBlob = await getCroppedImg(rawImageUrl, croppedAreaPixels);
            const croppedFile = new File([croppedBlob], "profile.jpeg", { type: "image/jpeg" });
            
            // Set for preview
            const reader = new FileReader();
            reader.readAsDataURL(croppedBlob);
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setFormData(prev => ({ ...prev, image: croppedFile }));
                setIsCropping(false);
                setRawImageUrl(null);
            };
        } catch (e) {
            console.error('Crop failed', e);
            setFormError("Failed to crop image.");
            setIsCropping(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!formData.name.trim()) { setFormError('Name is required.'); return; }
        if (!formData.role.trim()) { setFormError('Role is required.'); return; }
        if (!isEditMode && !formData.image) { setFormError('Please upload a photo.'); return; }

        setSubmitting(true);
        try {
            let imageUrl = isEditMode ? (editingMember?.image || null) : null;

            if (formData.image instanceof File) {
                try {
                    imageUrl = await uploadService.uploadFile(formData.image, 'team');
                } catch {
                    imageUrl = previewUrl; // data URL fallback
                }
            }

            const memberData = { name: formData.name.trim(), role: formData.role.trim(), image: imageUrl };

            if (isEditMode) {
                await teamService.update(editingMember.id, memberData);
            } else {
                await teamService.create(memberData);
            }

            closeModal();
            await fetchMembers();
        } catch (error) {
            console.error('Submit failed', error);
            setFormError('Failed to save. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this team member?')) return;
        try {
            await teamService.delete(id);
            setMembers(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                variants={headerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Team</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Add or edit the minds behind the mission.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <motion.button
                        whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(249,115,22,0.5)' }}
                        whileTap={{ scale: 0.96 }}
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-all text-sm font-semibold shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                    >
                        <Plus size={16} /> Add Member
                    </motion.button>
                </div>
            </motion.div>

            {/* Grid */}
            {loading ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-3"
                >
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <Loader2 size={24} className="text-orange-500" />
                    </motion.div>
                    Loading team members...
                </motion.div>
            ) : members.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="py-24 text-center bg-white dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-200 dark:border-white/5 text-gray-400 dark:text-gray-500 shadow-sm"
                >
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    >
                        <User size={52} className="mx-auto mb-4 opacity-20" />
                    </motion.div>
                    <p className="font-semibold text-xl text-gray-800 dark:text-gray-200">No team members yet</p>
                    <p className="text-sm mt-1">Click "Add Member" to get started.</p>
                </motion.div>
            ) : (() => {
                const founderIndex = members.findIndex(m => m.role?.toLowerCase().includes('founder') || m.role?.toLowerCase().includes('ceo'));
                const founder = members[founderIndex !== -1 ? founderIndex : 0];
                const others = members.filter((_, idx) => idx !== (founderIndex !== -1 ? founderIndex : 0));

                const renderCard = (member, isFounder = false) => (
                    <motion.div
                        key={member.id}
                        variants={cardVariants}
                        exit="exit"
                        layout
                        className={isFounder ? "w-full max-w-sm mx-auto z-10 relative" : "w-full z-10"}
                    >
                        <Card className={`group relative overflow-hidden bg-white dark:bg-gray-900/60 backdrop-blur-md transition-all duration-300 ${isFounder ? 'border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.15)]' : 'border-gray-100 dark:border-white/5 hover:border-orange-500/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.12)] shadow-sm'}`}>
                            {/* Photo */}
                            <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                                {member.image ? (
                                    <motion.img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-700">
                                        <User size={56} />
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-5 gap-3"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.15, backgroundColor: '#F97316' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => openEditModal(member)}
                                        className="p-3 bg-white text-gray-900 rounded-full shadow-lg transition-colors"
                                        title="Edit member"
                                    >
                                        <Edit2 size={15} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.15, backgroundColor: '#dc2626' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(member.id)}
                                        className="p-3 bg-white text-red-500 rounded-full shadow-lg transition-colors"
                                        title="Delete member"
                                    >
                                        <Trash2 size={15} />
                                    </motion.button>
                                </motion.div>
                            </div>

                            {/* Info */}
                            <div className={`p-5 text-center ${isFounder ? 'bg-orange-500/5' : ''}`}>
                                <h3 className={`font-bold transition-colors tracking-wide truncate ${isFounder ? 'text-xl text-gray-900 dark:text-white' : 'text-base text-gray-800 dark:text-white group-hover:text-orange-500'}`}>{member.name}</h3>
                                <p className="text-orange-600 dark:text-orange-500/80 text-sm font-bold mt-1 truncate uppercase tracking-wide">{member.role}</p>
                            </div>
                        </Card>
                    </motion.div>
                );

                return (
                    <div className="space-y-12">
                        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 dark:border-white/5">
                            <h2 className="text-lg font-bold text-gray-500 dark:text-gray-300">Pyramid View Hierarchy</h2>
                            <span className="text-xs text-orange-600 dark:text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 font-bold">Active on Website</span>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 items-center justify-center relative w-full pt-4">
                            {/* Column 1: Founder */}
                            <div className="w-full lg:w-1/3 flex justify-center pb-8 lg:pb-0 z-10 relative">
                                {founder && renderCard(founder, true)}
                                {/* Desktop connecting dot */}
                                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full z-20"></div>
                            </div>

                            {/* Middle Connector */}
                            <div className="hidden lg:block flex-1 min-w-[80px] max-w-[150px] h-[300px] relative z-0">
                                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0 text-orange-500/40">
                                    {others.map((_, i) => {
                                        const yPos = others.length > 1 ? (20 + (60 / (others.length - 1)) * i) : 50;
                                        return <path key={i} d={`M0,50 C 40,50 60,${yPos} 100,${yPos}`} stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" fill="none" strokeDasharray="4 4" />;
                                    })}
                                </svg>
                            </div>

                            {/* Column 2: Others */}
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="w-full lg:w-[50%] grid grid-cols-1 sm:grid-cols-2 gap-6 z-10"
                            >
                                <AnimatePresence>
                                    {others.map(member => renderCard(member))}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                );
            })()}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        variants={modalOverlayVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && closeModal()}
                    >
                        <motion.div
                            variants={modalPanelVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl transition-colors duration-500"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                                    {isCropping ? 'Crop Photo' : (isEditMode ? 'Edit Member' : 'Add Team Member')}
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={isCropping ? () => setIsCropping(false) : closeModal}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                                >
                                    <X size={18} />
                                </motion.button>
                            </div>

                            {isCropping ? (
                                <div className="space-y-4">
                                    <div className="relative w-full h-[300px] bg-gray-100 dark:bg-black rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                                        <Cropper
                                            image={rawImageUrl}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            cropShape="round"
                                            showGrid={false}
                                            onCropChange={setCrop}
                                            onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                                            onZoomChange={setZoom}
                                        />
                                    </div>
                                    <div className="px-2">
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Zoom Level</label>
                                        <input
                                            type="range"
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            value={zoom}
                                            onChange={(e) => setZoom(e.target.value)}
                                            className="w-full accent-orange-500"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setIsCropping(false); setRawImageUrl(null); setZoom(1); }}
                                            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-semibold text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCropComplete}
                                            className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.35)] text-sm"
                                        >
                                            Apply Crop
                                        </button>
                                    </div>
                                </div>
                            ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Photo Upload */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">
                                        Member Photo{' '}
                                        {isEditMode && <span className="text-gray-400 font-normal normal-case">(optional)</span>}
                                    </label>
                                    <motion.div
                                        whileHover={{ borderColor: 'rgba(249,115,22,0.5)', backgroundColor: 'rgba(249,115,22,0.03)' }}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="cursor-pointer border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-all text-center group"
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <AnimatePresence mode="wait">
                                            {previewUrl ? (
                                                <motion.div
                                                    key="preview"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div className="relative">
                                                        <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.3)]" />
                                                        <motion.div
                                                            whileHover={{ opacity: 1 }}
                                                            initial={{ opacity: 0 }}
                                                            className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center"
                                                        >
                                                            <Camera size={18} className="text-white" />
                                                        </motion.div>
                                                    </div>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 font-medium">Click to change photo</p>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="empty"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        className="inline-block"
                                                    >
                                                        <Camera size={28} className="mx-auto mb-2 text-gray-400 dark:text-gray-600 group-hover:text-orange-500 transition-colors" />
                                                    </motion.div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-500 font-bold">Click to upload photo</p>
                                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Arun Kumar"
                                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/60 transition-colors placeholder-gray-400 text-sm font-medium"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Role / Position</label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Founder & CEO"
                                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/60 transition-colors placeholder-gray-400 text-sm font-medium"
                                    />
                                </div>

                                {/* Error */}
                                <AnimatePresence>
                                    {formError && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 font-medium"
                                        >
                                            {formError}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={closeModal}
                                        className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-bold text-sm"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        disabled={submitting}
                                        whileHover={{ scale: submitting ? 1 : 1.03, boxShadow: '0 0 30px rgba(249,115,22,0.5)' }}
                                        whileTap={{ scale: 0.97 }}
                                        className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.35)] disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                                    >
                                        {submitting ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                                                <Loader2 size={16} />
                                            </motion.div>
                                        ) : (
                                            <Save size={16} />
                                        )}
                                        {isEditMode ? 'Update Member' : 'Save Member'}
                                    </motion.button>
                                </div>
                            </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageTeam;
