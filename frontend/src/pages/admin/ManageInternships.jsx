import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Mail, FileText, Calendar, ExternalLink, Edit2, Trash2, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { enquiryService } from '../../services';
import { useForm } from 'react-hook-form';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ManageInternships = () => {
    const [internships, setInternships] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit State
    const [editingApp, setEditingApp] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();


    useEffect(() => {
        loadInternships();
    }, []);

    const loadInternships = async () => {
        setIsLoading(true);
        try {
            const data = await enquiryService.getAll();
            // Filter strictly for Internship Applications
            const internshipApps = data.filter(item =>
                item.source === 'Internship Application' ||
                (item.interest && item.interest.startsWith('Internship'))
            );
            setInternships(internshipApps.reverse());
        } catch (error) {
            console.error("Failed to load internships", error);
        }
        setIsLoading(false);
    };

    const filteredInternships = internships.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.interest?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this application? This cannot be undone.")) {
            await enquiryService.delete(id);
            setInternships(prev => prev.filter(app => app.id !== id));
        }
    };

    const openEditModal = (app) => {
        setEditingApp(app);
        setValue('name', app.name);
        setValue('email', app.email);
        setValue('phone', app.phone);
        setValue('message', app.message);
        // Extract plain domain from "Internship - Domain"
        const domain = app.interest?.replace('Internship - ', '') || '';
        setValue('domain', domain);
    };

    const closeEditModal = () => {
        setEditingApp(null);
        reset();
    };

    const exportToPDF = (app) => {
        try {
            const doc = new jsPDF();
            
            // Header
            doc.setFontSize(22);
            doc.setTextColor(249, 115, 22); // Orange
            doc.text("Pi Bots - Internship Application", 14, 25);
            
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);
            
            // Branding Line
            doc.setDrawColor(249, 115, 22);
            doc.setLineWidth(0.5);
            doc.line(14, 35, 196, 35);
            
            // Application Details Table
            const tableRows = [
                ["Applicant Name", app.name],
                ["Email Address", app.email],
                ["Phone Number", app.phone],
                ["Domain of Interest", app.interest?.replace('Internship - ', '') || 'General'],
                ["Date Applied", app.date || "N/A"],
                ["Current Status", "Applied / Under Review"]
            ];
            
            autoTable(doc, {
                startY: 45,
                head: [["Field", "Details"]],
                body: tableRows,
                theme: 'grid',
                styles: { fontSize: 11, cellPadding: 5 },
                headStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255] },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 50 },
                }
            });
            
            // Message Section
            const finalY = doc.lastAutoTable.finalY + 15;
            doc.setFontSize(14);
            doc.setTextColor(31, 41, 55);
            doc.text("Statement of Interest / Message:", 14, finalY);
            
            doc.setFontSize(10);
            doc.setTextColor(50, 50, 50);
            const splitMessage = doc.splitTextToSize(app.message || "No additional message provided.", 180);
            doc.text(splitMessage, 14, finalY + 8);
            
            // Footer
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text("Pi Bots Education - Transforming the Future with Technology", 14, pageHeight - 15);
            doc.text("www.pibots.in", 196, pageHeight - 15, { align: 'right' });

            doc.save(`Internship_Application_${app.name.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("PDF Export Error:", error);
            alert("Failed to generate PDF. Check console for details.");
        }
    };

    const onUpdate = async (data) => {
        if (!editingApp) return;

        const updatedData = {
            ...editingApp,
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
            interest: `Internship - ${data.domain}`
        };

        await enquiryService.update(editingApp.id, updatedData);

        // Update local state
        setInternships(prev => prev.map(app => app.id === editingApp.id ? updatedData : app));
        closeEditModal();
        alert("Application updated successfully!");
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Internship Records</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Review and process student applications for internship programs.</p>
                </div>
            </div>

            {/* Search Bar */}
            <Card className="mb-6 p-5 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-100 dark:border-white/5 flex items-center gap-4 shadow-xl rounded-3xl">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10" size={20} />
                    <Input
                        placeholder="Search by student name, email or domain..."
                        className="pl-12 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-2xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all w-full font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            {/* List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500 flex items-center justify-center gap-2 font-medium">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <FileText size={24} className="text-orange-500" />
                        </motion.div>
                        Processing applications...
                    </div>
                ) : filteredInternships.length === 0 ? (
                    <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/30 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center text-gray-400">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">No applications found</p>
                        <p className="text-sm">Try adjusting your search or check back later.</p>
                    </div>
                ) : (
                    filteredInternships.map((app) => (
                        <Card key={app.id} className="p-8 bg-white/50 dark:bg-gray-900/40 backdrop-blur-md border border-gray-100 dark:border-white/5 shadow-md hover:bg-white dark:hover:bg-gray-800/60 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 group rounded-3xl overflow-hidden">
                            <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors uppercase tracking-tight leading-none">{app.name}</h3>
                                        <span className="text-[10px] px-3 py-1.5 bg-orange-500/10 font-black text-orange-600 dark:text-orange-500 rounded-lg border border-orange-500/20 shadow-sm uppercase tracking-widest">
                                            {app.interest?.replace('Internship - ', '') || 'General'}
                                        </span>
                                        {app.college && (
                                            <span className="text-[10px] px-3 py-1.5 bg-blue-500/10 font-black text-blue-600 dark:text-blue-400 rounded-lg border border-blue-500/20 shadow-sm uppercase tracking-widest">
                                                {app.college}
                                            </span>
                                        )}
                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 ml-2 uppercase tracking-widest">
                                            <Calendar size={14} className="text-orange-500" /> {app.date}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm font-bold text-gray-500 dark:text-gray-400 mb-6">
                                        <div className="flex items-center gap-3 group/info">
                                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover/info:bg-orange-500 transition-colors">
                                                <Mail size={16} className="text-gray-600 dark:text-gray-400 group-hover/info:text-white" />
                                            </div>
                                            <span className="group-hover/info:text-gray-900 dark:group-hover/info:text-white transition-colors">{app.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 group/info">
                                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover/info:bg-orange-500 transition-colors">
                                                <Phone size={16} className="text-gray-600 dark:text-gray-400 group-hover/info:text-white" />
                                            </div>
                                            <span className="group-hover/info:text-gray-900 dark:group-hover/info:text-white transition-colors">{app.phone}</span>
                                        </div>
                                        <div className="col-span-1 md:col-span-2 mt-2 p-6 bg-gray-50 dark:bg-black/50 border border-gray-100 dark:border-white/5 rounded-2xl text-gray-700 dark:text-gray-300 shadow-inner relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-600"></div>
                                            <p className="whitespace-pre-wrap font-medium text-sm leading-relaxed">{app.message}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 min-w-[160px] md:opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-500">
                                    {/* Download Action */}
                                    <button
                                        className="text-center p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 cursor-pointer hover:bg-blue-600 hover:border-blue-500 hover:text-white group/btn transition-all duration-300 shadow-lg shadow-blue-500/10"
                                        onClick={() => exportToPDF(app)}
                                    >
                                        <FileText size={28} className="mx-auto mb-2 text-blue-600 dark:text-blue-400 group-hover/btn:text-white transition-colors" />
                                        <span className="block text-[10px] font-black uppercase tracking-widest">
                                            Generate Report
                                        </span>
                                    </button>

                                    {/* View Resume if exists */}
                                    {app.resume && (
                                        <button
                                            className="text-center p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-orange-500 text-gray-500 dark:text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-white/10"
                                            onClick={() => window.open(app.resume, '_blank')}
                                        >
                                            View CV / Portfolio
                                        </button>
                                    )}

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-white hover:bg-blue-500 border-transparent rounded-xl"
                                            onClick={() => openEditModal(app)}
                                            title="Edit Application"
                                        >
                                            <Edit2 size={16} className="mx-auto" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 bg-red-600/10 text-red-600 hover:text-white hover:bg-red-600 border-transparent rounded-xl"
                                            onClick={() => handleDelete(app.id)}
                                            title="Delete Application"
                                        >
                                            <Trash2 size={16} className="mx-auto" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingApp}
                onClose={closeEditModal}
                title="Update App Details"
            >
                <form onSubmit={handleSubmit(onUpdate)} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Student Full Name</label>
                        <Input className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 w-full font-medium" {...register('name', { required: true })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
                        <Input type="email" className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 w-full font-medium" {...register('email', { required: true })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Phone Contact</label>
                        <Input type="tel" className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 w-full font-medium" {...register('phone', { required: true })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Internship Domain</label>
                        <select
                            {...register('domain', { required: true })}
                            className="flex w-full rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-black/50 px-3 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none font-medium"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                        >
                            <option value="Web Development">Web Development</option>
                            <option value="AI & ML">AI & ML</option>
                            <option value="Robotics">Robotics</option>
                            <option value="IoT">IoT</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Application Statement</label>
                        <textarea
                            {...register('message')}
                            rows={4}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-black/50 px-3 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all custom-scrollbar font-medium"
                            style={{ resize: 'none' }}
                        />
                    </div>
                    <div className="pt-4">
                        <Button type="submit" size="lg" className="w-full tracking-widest font-black uppercase rounded-xl h-14 bg-orange-600 hover:bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all">Update Application</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageInternships;
