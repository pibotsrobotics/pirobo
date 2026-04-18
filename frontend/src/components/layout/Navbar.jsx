import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredPath, setHoveredPath] = useState(null);
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
        { name: 'Internship', path: '/internship' },
        { name: 'Workshops', path: '/workshops' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-orange-500 tracking-tight">
                        Pi Robo
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/5 mr-2 shadow-sm">
                            {links.map((link, idx) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={`${link.path}-${idx}`}
                                        to={link.path}
                                        onMouseEnter={() => setHoveredPath(link.path)}
                                        onMouseLeave={() => setHoveredPath(null)}
                                        className={`relative px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded-full
                                            ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-orange-500'}
                                        `}
                                    >
                                        {/* Magic Pill / Background Chip */}
                                        <AnimatePresence>
                                            {(hoveredPath === link.path || isActive) && (
                                                <motion.div
                                                    layoutId="nav-pill"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ 
                                                        opacity: 1,
                                                        backgroundColor: isActive ? '#f97316' : 'rgba(249, 115, 22, 0.1)'
                                                    }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ 
                                                        type: "spring", 
                                                        stiffness: 80,
                                                        damping: 20,
                                                        mass: 1.4
                                                    }}
                                                    className="absolute inset-0 rounded-full z-0"
                                                />
                                            )}
                                        </AnimatePresence>
                                        <span className="relative z-10">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                        
                        {/* Theme Toggle */}
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 transition-colors mr-2"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </motion.button>

                        <Link to="/contact">
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] text-white font-bold transition-all duration-300 rounded-full">
                                Join Now
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Hamburger & Theme Toggle */}
                    <div className="flex items-center gap-4 lg:hidden">
                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white" onClick={toggleMenu}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-b border-gray-200 dark:border-white/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            {links.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`relative px-4 py-3 rounded-xl text-base font-medium transition-all
                                            ${isActive ? 'bg-orange-500/10 text-orange-500' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}
                                        `}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <Link to="/contact" onClick={() => setIsOpen(false)}>
                                <Button className="w-full">Enquiry / Join Now</Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
