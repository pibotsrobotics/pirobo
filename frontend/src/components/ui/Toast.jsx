import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const Toast = ({ message, isVisible, onClose, duration = 2000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed top-6 right-6 z-50 flex items-center md:min-w-[320px] p-4 rounded-xl bg-gray-900/90 backdrop-blur-md border border-green-500/30 shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]"
                >
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-500">
                        <Check size={20} strokeWidth={3} />
                    </div>

                    <div className="ml-4 flex-1">
                        <h4 className="text-sm font-bold text-white">Success!</h4>
                        <p className="text-sm text-gray-300 mt-0.5 leading-tight">{message}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="ml-4 p-1 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>

                    {/* Progress Bar */}
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: duration / 1000, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-b-xl"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
