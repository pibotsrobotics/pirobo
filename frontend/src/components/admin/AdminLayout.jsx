import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

const pageVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const AdminLayout = () => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"
                />
            </div>
        );
    }

    if (!currentUser) return <Navigate to="/admin/login" replace />;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-black transition-colors duration-500 overflow-hidden selection:bg-orange-500/30">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

                {/* Top bar */}
                <motion.header
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 flex items-center justify-end px-6 shadow-md z-10 sticky top-0 transition-colors"
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="text-gray-500 dark:text-gray-400 text-sm mr-4 font-medium flex items-center gap-2"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                            className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                        />
                        Logged in as <span className="text-gray-900 dark:text-white font-bold">{currentUser.email}</span>
                    </motion.span>
                </motion.header>

                {/* Page content with transition */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent relative z-0 p-6">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
