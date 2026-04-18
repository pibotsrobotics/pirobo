import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const AccordionItem = ({ title, children, isOpen, onClick, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl border transition-all duration-300 transform
                ${isOpen 
                    ? 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20 my-2' 
                    : 'border-gray-200 dark:border-white/10 hover:border-orange-500/30 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`
            }
        >
            <button
                onClick={onClick}
                className="flex items-center justify-between w-full p-5 lg:p-6 text-left focus:outline-none group"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-orange-600 text-white shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-orange-500/10 group-hover:text-orange-500'}`}>
                        {isOpen ? <Sparkles size={14} /> : <span className="text-sm font-bold">{index + 1}</span>}
                    </div>
                    <span className={`text-base lg:text-lg font-bold tracking-wide transition-colors duration-300 ${isOpen ? 'text-orange-500' : 'text-gray-900 dark:text-gray-200 group-hover:text-orange-400'}`}>
                        {title}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                    className={`ml-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isOpen ? "text-white bg-orange-500 shadow-md" : "text-gray-400 dark:text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-800"}`}
                >
                    <ChevronDown size={18} />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="p-5 lg:p-6 pt-0 lg:pt-0 text-gray-600 dark:text-gray-300 border-t border-transparent leading-relaxed ml-12">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Accordion = ({ items, className }) => {
    const [openIndex, setOpenIndex] = useState(0);

    const handleClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={twMerge('w-full flex flex-col gap-3', className)}>
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    index={index}
                    title={item.title}
                    isOpen={openIndex === index}
                    onClick={() => handleClick(index)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
};

export default Accordion;
