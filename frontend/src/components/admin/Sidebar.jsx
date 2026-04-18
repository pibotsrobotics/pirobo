import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Calendar, Image, MessageSquare, LogOut, Users, ClipboardList, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const handleLogout = async () => {
        try { await logout(); }
        catch (error) { console.error('Failed to log out', error); }
    };

    const navItems = [
        { label: 'Dashboard',     path: '/admin/dashboard',     icon: LayoutDashboard },
        { label: 'Courses',       path: '/admin/courses',       icon: BookOpen },
        { label: 'Events',        path: '/admin/events',        icon: Calendar },
        { label: 'Gallery',       path: '/admin/gallery',       icon: Image },
        { label: 'Registrations', path: '/admin/registrations', icon: ClipboardList },
        { label: 'Internships',   path: '/admin/internships',   icon: Briefcase },
        { label: 'Team',          path: '/admin/team',          icon: Users },
        { label: 'Enquiries',     path: '/admin/enquiries',     icon: MessageSquare },
    ];

    return (
        <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.05 }}
            className="w-64 bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl h-full border-r border-gray-200 dark:border-white/5 flex flex-col relative z-20 transition-colors duration-500"
        >
            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20"
            >
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-wider flex items-center gap-2">
                    Pi Robo{' '}
                    <motion.span
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        className="text-orange-500 text-xs px-2 py-0.5 bg-orange-500/10 rounded-full border border-orange-500/20"
                    >
                        ADMIN
                    </motion.span>
                </h2>
            </motion.div>

            {/* Nav Items */}
            <nav className="flex-1 py-6 space-y-1 px-4">
                {navItems.map((item, i) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + i * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                        >
                            <Link to={item.path}>
                                <motion.div
                                    whileHover={{ x: isActive ? 0 : 4, scale: 1.01 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors relative overflow-hidden
                                        ${isActive
                                            ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_0_18px_rgba(249,115,22,0.35)]'
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-orange-500 dark:hover:text-white'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl -z-10"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <item.icon size={18} className={isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'} />
                                    <span className="text-sm">{item.label}</span>

                                    {isActive && (
                                        <motion.div
                                            layoutId="activeDot"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Logout */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20"
            >
                <motion.button
                    whileHover={{ x: -2, scale: 1.01, backgroundColor: 'rgba(239,68,68,0.15)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 w-full transition-colors font-medium border border-transparent hover:border-red-500/20"
                >
                    <LogOut size={18} />
                    <span className="text-sm">Logout</span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default Sidebar;
