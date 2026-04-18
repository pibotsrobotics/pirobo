import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Accordion from '../components/ui/Accordion';
import { Bot, Code, Cpu, ArrowRight, Users, Award, Calendar, ExternalLink, MapPin, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventService, registrationService } from '../services';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';
import { useForm } from 'react-hook-form';
import homeBg from '../assets/home-bg.png';

const CircuitryBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60 dark:opacity-40 transition-opacity duration-300">
            {/* Ambient Blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>
            
            {/* Dynamic Graph Line */}
            <svg 
                className="absolute top-1/2 left-0 w-full h-[600px] -translate-y-1/2 text-orange-500 opacity-80" 
                preserveAspectRatio="xMidYMid slice"
                viewBox="0 0 1200 400" 
                fill="none" 
            >
                <motion.path
                    d="M -50 250 L 150 250 L 250 120 L 400 120 L 450 200 L 600 200 L 700 80 L 850 80 L 950 280 L 1100 280 L 1250 200"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
                    className="drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]"
                />
                
                {/* Glowing Nodes */}
                <motion.circle cx="250" cy="120" r="5" fill="#FFF" stroke="#F97316" strokeWidth="3" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, duration: 1, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1 }} className="drop-shadow-[0_0_8px_rgba(249,115,22,1)]" />
                <motion.circle cx="700" cy="80" r="5" fill="#FFF" stroke="#F97316" strokeWidth="3" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1 }} className="drop-shadow-[0_0_8px_rgba(249,115,22,1)]" />
                <motion.circle cx="950" cy="280" r="5" fill="#FFF" stroke="#F97316" strokeWidth="3" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.8, duration: 1, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1 }} className="drop-shadow-[0_0_8px_rgba(249,115,22,1)]" />
            </svg>
        </div>
    );
};

const Hero = () => {
    const heroRef = useRef();
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section ref={heroRef} className="relative overflow-hidden min-h-[100dvh] bg-gray-50 dark:bg-black transition-colors duration-500">
            {/* Main Background Image */}
            <div 
                className="absolute inset-0 z-0 opacity-40 dark:opacity-45 pointer-events-none transition-opacity"
                style={{ 
                    backgroundImage: `url(${homeBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            <CircuitryBackground />
            
            {/* Gradient Overlay for Text Clarity */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/30 via-transparent to-white dark:from-black/40 dark:via-transparent dark:to-black pointer-events-none transition-colors duration-500"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 h-full flex flex-col justify-center pointer-events-none">
                <motion.div 
                    style={{ y }}
                    className="flex flex-col items-center text-center pointer-events-auto mt-16"
                >
                    {/* Live Status Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex items-center gap-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 px-5 py-2 text-sm font-bold text-gray-800 dark:text-gray-200 mb-8 backdrop-blur-md shadow-sm dark:shadow-none transition-colors"
                    >
                        <span className="flex items-center justify-center relative w-3 h-3">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Accepting New Students
                    </motion.div>

                    {/* Mixed-Color Typography Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight transition-colors leading-tight sm:leading-tight md:leading-tight"
                    >
                        Master <br className="hidden md:block"/> 
                        <span className="text-gray-900 dark:text-white transition-colors">Robotics</span> & <span className="text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]">AI</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-300/90 mb-10 font-medium transition-colors px-4"
                    >
                        Empowering School & College Students with future-ready skills in Robotics, AI, Coding, and IoT. Join the revolution today.
                    </motion.p>

                    {/* Pill-Shaped Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link to="/courses">
                            <Button size="lg" className="rounded-full px-10 w-full sm:w-auto shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] active:scale-95 transition-all">
                                Explore Courses <ArrowRight size={20} className="ml-2" />
                            </Button>
                        </Link>
                        <Link to="/contact">
                            <Button variant="outline" size="lg" className="rounded-full px-10 w-full sm:w-auto bg-white/50 dark:bg-black/20 backdrop-blur-md border-gray-300 dark:border-white/20 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black transition-all">
                                Enquiry Now
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

const Stats = () => {
    const stats = [
        { label: 'Students Trained', value: '5000+', icon: Users },
        { label: 'Workshops Conducted', value: '800+', icon: Calendar },
        { label: 'Projects Completed', value: '200+', icon: Briefcase },
    ];

    return (
        <section className="py-12 bg-white dark:bg-black border-y border-gray-100 dark:border-gray-900 relative z-10 transition-colors duration-500">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.3 }}
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.15
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { y: 50, opacity: 0 },
                                show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
                            }}
                            className="flex items-center p-6 bg-white dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="p-3 bg-orange-500/10 rounded-xl mr-4 text-orange-500">
                                <stat.icon size={32} />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const Programs = () => {
    const programs = [
        { title: 'Robotics', icon: Bot, desc: 'Build and program robots from scratch. Learn mechanics, electronics, and coding.', color: 'text-orange-500 bg-orange-500/10', glow: 'shadow-orange-500/20' },
        { title: 'Artificial Intelligence', icon: Cpu, desc: 'Dive into AI & ML. Train models, understand neural networks, and build smart apps.', color: 'text-purple-400 bg-purple-500/10', glow: 'shadow-purple-500/20' },
        { title: 'Coding & Dev', icon: Code, desc: 'Master Web Dev, Python, and Software Engineering principles.', color: 'text-green-400 bg-green-500/10', glow: 'shadow-green-500/20' },
    ];

    return (
        <section className="py-24 bg-gray-50 dark:bg-black relative z-10 transition-colors duration-500">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, ease: "power3.out" }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight transition-colors">Our Core Programs</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Designed for both beginners and advanced learners. Choose your path to mastery.</p>
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {programs.map((program, index) => (
                        <motion.div 
                            key={index} 
                            variants={{
                                hidden: { y: 100, opacity: 0 },
                                show: { y: 0, opacity: 1, transition: { duration: 1, ease: "power4.out" } }
                            }}
                            className="h-full"
                        >
                            <Card hover className="h-full bg-white dark:bg-gray-900/60 backdrop-blur-xl border-gray-200 dark:border-white/5 overflow-hidden hover:border-orange-500/30 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] transition-all duration-500 group shadow-sm">
                                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="p-8 flex flex-col h-full relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${program.color} shadow-lg ${program.glow} transform group-hover:scale-110 transition-transform duration-300`}>
                                        <program.icon size={28} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:dark:from-white group-hover:to-gray-500 transition-all">{program.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow leading-relaxed">{program.desc}</p>
                                    <Link to="/courses" className="text-orange-500 font-bold flex items-center hover:gap-3 transition-all tracking-wide text-sm uppercase">
                                        View Courses <ArrowRight size={16} className="ml-2" />
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const InternshipBanner = () => {
    return (
        <section className="py-20 bg-gray-100 dark:bg-gray-900 relative overflow-hidden z-10 border-t border-gray-200 dark:border-white/5 transition-colors duration-500">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex-1 space-y-6"
                    >
                        <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-sm font-semibold border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                            Career Kickstart
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">Join Our Internship Program</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl leading-relaxed transition-colors">
                            Gain real-world experience working on live projects. Get mentorship from industry experts in AI, Web Development, and Robotics.
                        </p>
                        <ul className="space-y-4 text-gray-700 dark:text-gray-300 font-medium pt-2 transition-colors">
                            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" /> Hands-on Project Experience</li>
                            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" /> Industry Certification</li>
                            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" /> Pre-placement Offers for Top Performers</li>
                        </ul>
                        <div className="pt-6">
                            <Link to="/internship">
                                <Button size="lg" className="shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all uppercase tracking-wide font-bold">Apply for Internship</Button>
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="flex-1 flex justify-center"
                    >
                        {/* Abstract visual */}
                        <div className="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-gray-900 to-black rounded-3xl border border-gray-700/50 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <Code size={80} className="text-orange-500/30 group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-3xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400 drop-shadow-lg">Code Your Future</h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const UpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await eventService.getAll();
            setEvents(data.reverse().slice(0, 3));
            setLoading(false);
        } catch (error) {
            console.error("Failed to load upcoming events", error);
            setLoading(false);
        }
    };

    const openModal = (event) => {
        setSelectedEvent(event);
        reset();
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    const onSubmit = async (data) => {
        try {
            const registrationData = {
                ...data,
                itemTitle: selectedEvent.title,
                itemId: selectedEvent.id,
                type: 'Event',
                eventDate: selectedEvent.date,
                eventLocation: selectedEvent.location,
                date: new Date().toLocaleDateString(),
                status: 'Registered'
            };

            await registrationService.create(registrationData);
            setToastMessage(`Registration successful for ${selectedEvent?.title}!`);
            closeModal();
            setShowToast(true);
        } catch (error) {
            console.error("Registration failed", error);
        }
    };

    return (
        <section className="py-24 bg-white dark:bg-black relative z-10 border-t border-gray-100 dark:border-white/5 transition-colors duration-500">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight transition-colors">Upcoming Events</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Don't miss out on our latest workshops and hackathons.</p>
                    </div>
                    <Link to="/workshops" className="hidden md:flex items-center text-orange-500 font-bold hover:underline hover:gap-2 transition-all">
                        View All Events <ArrowRight size={16} className="ml-1" />
                    </Link>
                </motion.div>

                {loading ? (
                    <div className="text-center text-gray-500 py-12">Loading upcoming events...</div>
                ) : events.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">No upcoming events scheduled at the moment. Stay tuned!</div>
                ) : (
                    <motion.div 
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.2 }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.15
                                }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {events.map((event, i) => (
                            <motion.div 
                                key={i} 
                                variants={{
                                    hidden: { y: 50, opacity: 0 },
                                    show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "backOut" } }
                                }}
                                className="h-full"
                            >
                                <Card hover className="group cursor-pointer bg-gray-50 dark:bg-gray-900/60 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.2)] transition-all duration-500 h-full flex flex-col overflow-hidden shadow-sm">
                                    <div className="h-56 bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                                        <Link to="/workshops" className="block w-full h-full">
                                            {/* Fix: Check for both http URLs and Data URLs (base64) */}
                                            <div
                                                className={`absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 ${event.image ? '' : 'bg-gradient-to-t from-black/80 to-gray-800'}`}
                                                style={event.image ? { backgroundImage: `url(${event.image})` } : {}}
                                            >
                                                {/* Fallback gradient overlay if no image or image load fails visually */}
                                                {!event.image && (<div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/90"></div>)}
                                            </div>

                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                                            <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    <span className="inline-block px-3 py-1 bg-orange-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded w-max shadow-lg">
                                                        {event.type}
                                                    </span>
                                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded w-max border border-white/20 shadow-lg">
                                                        {event.fee || 'Free'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="p-8 flex-grow flex flex-col relative">
                                        <div className="absolute top-0 right-8 -translate-y-1/2 w-12 h-12 bg-white dark:bg-black rounded-full border border-orange-500/30 flex items-center justify-center shadow-lg text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 z-20">
                                             <Calendar size={20} />
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 font-medium">
                                            <span className="text-orange-400">{event.date}</span>
                                            <span className="mx-1 opacity-30">•</span>
                                            <MapPin size={14} className="text-gray-500"/> <span className="truncate">{event.location}</span>
                                        </div>
                                        <Link to="/workshops">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:dark:from-white group-hover:to-orange-400 transition-all line-clamp-2 leading-tight">{event.title}</h3>
                                        </Link>
                                        <Link
                                            to={`/workshops?register=${event.id}`}
                                            className="inline-flex items-center text-sm font-bold text-orange-500 mt-auto pt-6 hover:text-orange-400 transition-colors uppercase tracking-wide"
                                        >
                                            Register Now <ExternalLink size={14} className="ml-2" />
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
                <div className="mt-8 text-center md:hidden">
                    <Link to="/workshops" className="inline-flex items-center text-orange-500 font-bold hover:underline">
                        View All Events <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

const FAQ = () => {
    const faqData = [
        { title: "What exactly does Pi Robo offer?", content: "We offer comprehensive hands-on tech education in Robotics, Artificial Intelligence, Coding, and IoT. Our programs range from beginner-friendly workshops to advanced industry-level internships for school and college students." },
        { title: "Do I need any prior coding or robotics experience?", content: "Not at all! Our curriculum is designed to accommodate everyone. We start with the absolute basics and guide you step-by-step through complex concepts using a 100% practical, hands-on approach." },
        { title: "Are the classes online or offline?", content: "We offer a flexible hybrid learning model. You can join our interactive sessions online from anywhere, or attend our offline practical workshops at our highly equipped PiBots Makerhub in Mampad, Kerala." },
        { title: "Will I get a certificate after completing a course?", content: "Absolutely. Upon successful completion of any course, workshop, or internship, you will receive a verifiable, industry-recognized certificate from Pi Robo to boost your resume." },
        { title: "How does the Internship Program work?", content: "Our internship program gives you real-world experience working on live industry projects alongside expert mentors. Top performers are eligible for performance-based stipends and pre-placement offers." },
        { title: "Can my school or college partner with Pi Robo?", content: "Yes! We actively collaborate with educational institutions across Kerala to integrate specialized robotics and AI modules directly into their curriculum. You can reach out to us via the Contact page for partnerships." },
    ];

    return (
        <section className="py-24 bg-gray-50 dark:bg-black relative overflow-hidden z-10 border-t border-gray-200 dark:border-white/5 transition-colors duration-500">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
                <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-500 dark:text-orange-400 rounded-full text-sm font-semibold border border-orange-500/20 mb-4 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                        Everything You Need to Know
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight transition-colors">Frequently Asked Questions</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">Got questions? We've got answers. If you can't find what you're looking for, feel free to contact us.</p>
                </motion.div>
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <Accordion items={faqData} className="border-none bg-transparent dark:bg-transparent shadow-none" />
                </motion.div>
            </div>
        </section>
    );
};

const CTA = () => {
    return (
        <section className="py-20 bg-orange-600 relative overflow-hidden z-10">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1, ease: "backOut" }}
                className="container mx-auto px-4 md:px-6 text-center relative z-10"
            >
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to Start Your Tech Journey?</h2>
                <p className="text-orange-100 text-xl max-w-2xl mx-auto mb-10 font-medium">
                    Join thousands of students who have transformed their careers with Pi Robo.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link to="/courses">
                        <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 hover:scale-105 active:scale-95 border-white hover:text-orange-700 rounded-full w-full sm:w-auto shadow-xl transition-all font-bold tracking-wide">
                            Get Started
                        </Button>
                    </Link>
                    <Link to="/contact">
                        <Button size="lg" variant="outline" className="text-white border-white/50 hover:border-white hover:bg-white/10 hover:text-white rounded-full w-full sm:w-auto backdrop-blur-sm transition-all font-bold tracking-wide">
                            Contact Us
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
};

const Home = () => {
    return (
        <>
            <Hero />
            <Stats />
            <Programs />
            <InternshipBanner />
            <UpcomingEvents />
            <FAQ />
            <CTA />
        </>
    );
};

export default Home;
