import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Check, X, FileText, Trash2, Edit2, Download } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { enquiryService } from '../../services';
import { useForm } from 'react-hook-form';

const ManageEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Edit Handling
    const [editingItem, setEditingItem] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        loadEnquiries();
    }, []);

    const loadEnquiries = async () => {
        setIsLoading(true);
        const data = await enquiryService.getAll();
        // Sort by newest first (assuming ID or date sorting, here simply reversing if appended)
        setEnquiries(data.reverse());
        setIsLoading(false);
    };

    const updateStatus = async (id, newStatus) => {
        // Optimistic update
        setEnquiries(enquiries.map(enq => enq.id === id ? { ...enq, status: newStatus } : enq));
        await enquiryService.update(id, { status: newStatus });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this enquiry permanently?")) {
            await enquiryService.delete(id);
            setEnquiries(prev => prev.filter(e => e.id !== id));
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setValue('name', item.name);
        setValue('email', item.email);
        setValue('phone', item.phone);
        setValue('message', item.message);
    };

    const closeEditModal = () => {
        setEditingItem(null);
        reset();
    };

    const onUpdate = async (data) => {
        if (!editingItem) return;
        const updated = { ...editingItem, ...data };

        await enquiryService.update(editingItem.id, updated);
        setEnquiries(prev => prev.map(e => e.id === editingItem.id ? updated : e));

        closeEditModal();
    };

    const openResume = (url) => {
        if (url) window.open(url, '_blank');
        else alert("No resume file available");
    };

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Enquiries & Applications</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">View and manage support tickets, contact requests, and internship applications.</p>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500 flex items-center justify-center gap-2 font-medium">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <Mail size={20} className="text-orange-500" />
                        </motion.div>
                        Loading enquiries...
                    </div>
                ) : (
                    <>
                        {enquiries.map((enq) => (
                            <Card key={enq.id} className="p-6 bg-white/50 dark:bg-gray-900/40 backdrop-blur-md border border-gray-100 dark:border-white/5 shadow-md hover:bg-white dark:hover:bg-gray-800/60 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 group">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors uppercase tracking-tight">{enq.name}</h3>
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm ${enq.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20'}`}>
                                                {enq.status}
                                            </span>
                                            {enq.source === 'Internship Application' && (
                                                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                                                    Internship
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-5 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
                                            <span className="flex items-center gap-1.5"><Mail size={15} className="text-orange-500" /> {enq.email}</span>
                                            <span className="flex items-center gap-1.5"><Phone size={15} className="text-orange-500" /> {enq.phone}</span>
                                            <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-200 dark:border-orange-500/20"><Calendar size={15} className="mr-1" /> {enq.date}</span>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-black/50 p-5 rounded-2xl border border-gray-100 dark:border-white/5 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line shadow-inner relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                            <span className="font-bold text-gray-900 dark:text-white block mb-3 border-b border-gray-200 dark:border-gray-800 pb-2 uppercase tracking-widest text-[10px]">Subject: <span className="text-orange-600 dark:text-orange-400">{enq.interest}</span></span>
                                            <span className="leading-relaxed font-medium">{enq.message}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300 self-end md:self-start">
                                        {enq.status === 'Pending' && (
                                            <Button size="sm" onClick={() => updateStatus(enq.id, 'Contacted')} className="bg-green-600 hover:bg-green-500 text-white border-transparent shadow-lg shadow-green-500/20 rounded-xl" title="Mark as Contacted">
                                                <Check size={18} />
                                            </Button>
                                        )}

                                        {/* Resume Action */}
                                        {enq.resume && (
                                            <Button size="sm" variant="outline" onClick={() => openResume(enq.resume)} className="bg-blue-600 hover:bg-blue-500 text-white border-transparent shadow-lg shadow-blue-500/20 rounded-xl" title="Download Resume">
                                                <Download size={18} />
                                            </Button>
                                        )}

                                        <Button size="sm" variant="outline" onClick={() => openEditModal(enq)} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white border-transparent rounded-xl" title="Edit">
                                            <Edit2 size={18} />
                                        </Button>

                                        <Button size="sm" variant="outline" onClick={() => handleDelete(enq.id)} className="bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white border-transparent rounded-xl" title="Delete">
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {enquiries.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center text-gray-400">
                                <FileText size={48} className="mb-4 opacity-20" />
                                <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">Inbox Zero</p>
                                <p className="text-sm font-medium">No active enquiries or applications found.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Modal isOpen={!!editingItem} onClose={closeEditModal} title="Update Enquiry Details">
                <form onSubmit={handleSubmit(onUpdate)} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                        <Input className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 w-full font-medium" {...register('name', { required: true })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
                        <Input className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 w-full font-medium" {...register('email', { required: true })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Phone Number</label>
                        <Input className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 w-full font-medium" {...register('phone', { required: true })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Message Content</label>
                        <textarea
                            {...register('message')}
                            rows={4}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-black/50 px-3 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all custom-scrollbar font-medium"
                            style={{ resize: 'none' }}
                        />
                    </div>
                    <div className="pt-4">
                        <Button type="submit" size="lg" className="w-full tracking-widest font-black uppercase rounded-xl h-14 bg-orange-600 hover:bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all">Save Changes</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageEnquiries;

