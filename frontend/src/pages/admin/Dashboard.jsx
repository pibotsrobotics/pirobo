import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import { Users, BookOpen, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import { courseService, eventService, enquiryService } from '../../services';

const Dashboard = () => {
    const navigate = useNavigate();
    // Mock Data
    const [stats, setStats] = useState([
        { label: 'Total Enquiries', value: '0', icon: MessageSquare, color: 'text-blue-500 bg-blue-500/10' },
        { label: 'Active Courses', value: '0', icon: BookOpen, color: 'text-orange-500 bg-orange-500/10' },
        { label: 'Upcoming Events', value: '0', icon: Calendar, color: 'text-purple-500 bg-purple-500/10' },
        { label: 'Internship Applications', value: '0', icon: Users, color: 'text-green-500 bg-green-500/10' },
    ]);
    const [recentEnquiries, setRecentEnquiries] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [courses, events, enquiries] = await Promise.all([
                courseService.getAll(),
                eventService.getAll(),
                enquiryService.getAll()
            ]);

            // Stats Logic
            const internshipCount = enquiries.filter(e => e.source === 'Internship Application').length;
            const otherEnquiriesCount = enquiries.length - internshipCount; // or enquiries.length if 'Total' means ANY

            setStats([
                { label: 'Total Enquiries', value: otherEnquiriesCount.toString(), icon: MessageSquare, color: 'text-blue-500 bg-blue-500/10' },
                { label: 'Active Courses', value: courses.length.toString(), icon: BookOpen, color: 'text-orange-500 bg-orange-500/10' },
                { label: 'Upcoming Events', value: events.length.toString(), icon: Calendar, color: 'text-purple-500 bg-purple-500/10' },
                { label: 'Internship Applications', value: internshipCount.toString(), icon: Users, color: 'text-green-500 bg-green-500/10' },
            ]);

            // Recent Enquiries Logic (Show only Pending)
            const pendingEnquiries = enquiries
                .filter(e => e.status === 'Pending')
                .reverse() // Show newest first (assuming append-only)
                .slice(0, 5); // Limit to 5

            setRecentEnquiries(pendingEnquiries);

        } catch (error) {
            console.error("Failed to load dashboard data", error);
        }
    };

    const handleEnquiryClick = async (enquiry) => {
        // Mark as viewed in background (optimistic)
        enquiryService.update(enquiry.id, { status: 'Viewed' });

        // Remove from local list immediately so it "disappears"
        setRecentEnquiries(prev => prev.filter(e => e.id !== enquiry.id));

        // Navigate based on source - wait slightly for effect or just go
        if (enquiry.source === 'Internship Application' || enquiry.interest?.includes('Internship')) {
            navigate('/admin/internships');
        } else {
            navigate('/admin/enquiries');
        }
    };

    return (
        <div className="space-y-8">
            <motion.h1
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight"
            >
                Dashboard Overview
            </motion.h1>

            {/* Stats Grid */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={{ hidden: { opacity: 0, y: 32, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } } }}
                    >
                        <Card hover className="p-6 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase tracking-widest">{stat.label}</p>
                                    <motion.h3
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 300 }}
                                        className="text-3xl font-extrabold text-gray-900 dark:text-white"
                                    >
                                        {stat.value}
                                    </motion.h3>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.12, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 400 }}
                                    className={`p-4 rounded-2xl ${stat.color} shadow-lg backdrop-blur-sm border border-white/5`}
                                >
                                    <stat.icon size={26} />
                                </motion.div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                <Card className="p-6 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/5">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Enquiries</h3>
                        <Link to="/admin/enquiries" className="text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors">View All →</Link>
                    </div>
                    <div className="space-y-3">
                        {recentEnquiries.length === 0 ? (
                            <div className="text-gray-400 dark:text-gray-500 text-sm text-center py-12 bg-gray-50 dark:bg-black/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                                <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
                                No new enquiries to review.
                            </div>
                        ) : (
                            <AnimatePresence>
                                {recentEnquiries.map((enquiry, i) => (
                                    <motion.div
                                        key={enquiry.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                                        transition={{ delay: i * 0.07, duration: 0.3 }}
                                        className="p-4 bg-gray-50/50 dark:bg-black/40 rounded-xl border border-gray-100 dark:border-white/5 cursor-pointer hover:bg-white dark:hover:bg-gray-800/60 hover:border-orange-500/30 transition-all duration-300 group relative shadow-sm hover:shadow-md"
                                        onClick={() => handleEnquiryClick(enquiry)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                                                    {enquiry.name ? enquiry.name.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <span className="font-bold text-gray-900 dark:text-white tracking-wide">{enquiry.name || 'Anonymous'}</span>
                                            </div>
                                            <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-black/50 px-2 py-1 rounded">{enquiry.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 pl-10 mb-2 leading-relaxed">{enquiry.message || 'No message content'}</p>
                                        <div className="mt-3 pl-10 flex items-center justify-between">
                                            <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20 font-medium">
                                                {enquiry.source || 'Enquiry'}
                                            </span>
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                                className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5 font-medium bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <CheckCircle size={13} /> Mark as Read
                                            </motion.span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Dashboard;
