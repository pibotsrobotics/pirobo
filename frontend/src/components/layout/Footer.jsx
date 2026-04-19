import React from 'react';
import { Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-gray-400 py-16 border-t border-white/10 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start">

                    {/* Left Side: Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">Pi <span className="text-orange-500">Robo</span></h3>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                Empowering the next generation of innovators with futuristic skills in Robotics, Artificial Intelligence, and Coding.
                            </p>
                            <ul className="space-y-4 text-sm mt-8">
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                        <Phone size={16} />
                                    </div>
                                    <span className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer">+91 85472 44223</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                        <Mail size={16} />
                                    </div>
                                    <span className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer">pibotsacademy@gmail.com</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20 mt-1">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="text-gray-300">Pibots Makerhub, Mampad, Kerala 676542</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Middle: Socials & Newsletter */}
                    <div className="space-y-10">
                        {/* Social Media */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Connect With Us</h3>
                            <div className="flex gap-4">
                                <a href="https://www.instagram.com/pirobo.learning" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                                    <Instagram size={18} />
                                </a>
                                <a href="https://www.linkedin.com/company/pirobo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                                    <Linkedin size={18} />
                                </a>
                                <a href="https://www.youtube.com/@pirobo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                                    <Youtube size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Newsletter Subscription */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Newsletter</h3>
                            <p className="text-sm text-gray-400 mb-4">Get the latest updates on courses and events.</p>
                            <form className="flex bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 focus-within:border-orange-500 focus-within:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all duration-300" onSubmit={(e) => e.preventDefault()}>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="w-full bg-transparent px-4 py-2 text-sm text-white outline-none placeholder-gray-500" 
                                    required
                                />
                                <button type="submit" className="bg-orange-600 text-white px-4 py-2 text-sm font-bold hover:bg-orange-500 transition-colors">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Map */}
                    <div className="h-full min-h-[250px] w-full bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 relative group">
                        <iframe
                            src="https://maps.google.com/maps?q=Pibots+Makerhub&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '250px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 grayscale contrast-125 opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            title="Pi Robo Location"
                        ></iframe>
                        {/* Overlay to encourage interaction */}
                        <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 text-xs text-white rounded backdrop-blur-sm pointer-events-none">
                            Run by Pi Robo
                        </div>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
                    <div>&copy; {new Date().getFullYear()} Pi Robo. All rights reserved.</div>
                    <div className="mt-4 md:mt-0 flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
