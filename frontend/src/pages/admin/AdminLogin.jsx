import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const { login, currentUser } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [currentUser, navigate]);

    const onSubmit = async (data) => {
        try {
            setError('');
            await login(data.email, data.password);
            // Navigation handled by useEffect when currentUser updates
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated background blobs */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
            />
            <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"
            />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 26 }}
                className="w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl"
                    />
                    <motion.h1
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-extrabold text-white mb-2 relative tracking-tight"
                    >
                        Admin Login
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-400 font-medium"
                    >
                        Access the Pi Bots Dashboard
                    </motion.p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 flex items-center gap-2 text-sm overflow-hidden"
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors z-10" size={18} />
                            <Input
                                type="email"
                                placeholder="admin@pirobo.com"
                                className="pl-11 py-3 bg-black/50 border border-gray-700/50 text-white rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all w-full"
                                {...register('email', { required: 'Email is required' })}
                            />
                        </div>
                        {errors.email && <span className="text-xs text-red-500 mt-1.5 block">{errors.email.message}</span>}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors z-10" size={18} />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-11 py-3 bg-black/50 border border-gray-700/50 text-white rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all w-full"
                                {...register('password', { required: 'Password is required' })}
                            />
                        </div>
                        {errors.password && <span className="text-xs text-red-500 mt-1.5 block">{errors.password.message}</span>}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        className="pt-2"
                    >
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(249,115,22,0.5)' }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:opacity-60 text-sm"
                        >
                            {isSubmitting ? 'Authenticating...' : 'Login to Dashboard'}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
