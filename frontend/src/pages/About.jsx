import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import SEO from '../components/ui/SEO';
import { Target, Lightbulb, Users, Award, Zap, User } from 'lucide-react';
import { teamService } from '../services';

// Social icon components
const InstagramIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);

const LinkedInIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

// Ensures links always open externally (adds https:// if missing)
const safeUrl = (url) => {
    if (!url) return '#';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

// ─── Arrow Connector ─────────────────────────────────────────────────────────
// Draws animated curved arrows from the left anchor to each team-member card.
// Uses real pixel heights so arrows always land at the correct card centers.
const CARD_H = 160;        
const CARD_GAP = 32;       // gap-8 = 32px for more professional spacing
const CARD_PADDING_V = 0;  // extra padding inside card before centre

const ArrowConnector = ({ count }) => {
    const svgRef = useRef(null);
    const [height, setHeight] = useState(500);

    // Recompute height whenever the column changes
    useEffect(() => {
        const recalc = () => {
            const h = count * CARD_H + Math.max(0, count - 1) * CARD_GAP;
            setHeight(Math.max(h, 80));
        };
        recalc();
    }, [count]);

    if (count === 0) return null;

    const W = 120; // Reduced width Brings arrows closer to Founder
    const H = height;

    const startX = 0; // Starts exactly at the edge
    const endX = W - 12;
    const originY = H / 2; // Exact vertical center of the Founder & CEO card

    return (
        <div className="hidden lg:block w-[120px] shrink-0 self-stretch relative z-0 ml-4">
            <svg
                ref={svgRef}
                width={W}
                height={H}
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-full overflow-visible"
            >
                <defs>
                    <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#fb923c" stopOpacity="1" />
                    </linearGradient>

                    <marker
                        id="ah"
                        markerWidth="8" markerHeight="8"
                        refX="7" refY="4"
                        orient="auto"
                        markerUnits="userSpaceOnUse"
                    >
                        <polygon points="0 1, 8 4, 0 7" fill="#fb923c" />
                    </marker>

                    <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {Array.from({ length: count }).map((_, i) => {
                    const rawCenterY = i * (CARD_H + CARD_GAP) + CARD_H / 2;
                    // Tiny 0.5px jitter prevents a perfectly-flat bezier (which some browsers
                    // compute as pathLength=0, making the stroke invisible — aka the Ajayraj bug)
                    const cardCenterY = Math.abs(rawCenterY - originY) < 1 ? rawCenterY + 0.5 : rawCenterY;
                    const cx1 = startX + (endX - startX) * 0.4;
                    const cx2 = startX + (endX - startX) * 0.6;
                    const d = `M ${startX},${originY} C ${cx1},${originY} ${cx2},${cardCenterY} ${endX},${cardCenterY}`;

                    return (
                        <g key={i}>
                            {/* Primary connecting path (Orange) */}
                            <path
                                d={d}
                                stroke="url(#arrowGrad)"
                                strokeWidth="2"
                                fill="none"
                                markerEnd="url(#ah)"
                                className="draw-path"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />

                            {/* Energy Beam / Light Flow effect (White Pulse) */}
                            <path
                                d={d}
                                stroke="rgba(255,255,255,0.9)"
                                strokeWidth="2.5"
                                fill="none"
                                strokeLinecap="round"
                                style={{
                                    strokeDasharray: '15 300',
                                    strokeDashoffset: '300',
                                    animation: `pulseFlow 2.5s ease-in-out infinite`,
                                    animationDelay: `${i * 0.25 + 1}s`,
                                }}
                            />
                        </g>
                    );
                })}

                {/* Unified Root Hub - glow filter only on this small element */}
                <g filter="url(#glow2)">
                    <circle cx={startX} cy={originY} r="8" fill="#f97316" />
                    <circle cx={startX} cy={originY} r="12" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.5">
                        <animate attributeName="r" from="8" to="20" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                </g>

                <style>{`
                    @keyframes drawPath {
                        from { stroke-dashoffset: 5000; opacity: 0; }
                        to   { stroke-dashoffset: 0;    opacity: 1; }
                    }
                    .draw-path {
                        stroke-dasharray: 5000;
                        stroke-dashoffset: 5000;
                        opacity: 0;
                        animation: drawPath 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                        will-change: stroke-dashoffset, opacity;
                    }
                    @keyframes pulseFlow {
                        0%   { stroke-dashoffset: 300; opacity: 0; }
                        10%  { opacity: 1; }
                        85%  { opacity: 1; }
                        100% { stroke-dashoffset: -20; opacity: 0; }
                    }
                `}</style>
            </svg>
        </div>
    );
};
// ─────────────────────────────────────────────────────────────────────────────

const About = () => {
    const [team, setTeam] = useState([]);
    const [isLoadingTeam, setIsLoadingTeam] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const data = await teamService.getAll();
                setTeam(data);
            } catch (error) {
                console.error("Failed to fetch team", error);
            }
            setIsLoadingTeam(false);
        };
        fetchTeam();
    }, []);

    const values = [
        { title: 'Mission', icon: Target, desc: 'To democratize tech education and make robotics and AI accessible to every student, fostering a generation of innovators.' },
        { title: 'Vision', icon: Lightbulb, desc: 'To become the global leader in skill-based practical tech education, bridging the gap between academia and industry.' },
        { title: 'Approach', icon: Zap, desc: 'Hands-on learning first. We believe in building, breaking, and fixing things to truly understand technology.' },
    ];


    const timeline = [
        { year: '2017', title: 'The Beginning', desc: 'Pi Bots was born — starting with a small passionate workshop to bring robotics and AI education to students.' },
        { year: '2019', title: 'Growing Momentum', desc: 'Expanded our workshops to reach more students across Kerala, running hands-on sessions in robotics, coding, and electronics.' },
        { year: '2021', title: 'Online & Offline', desc: 'Launched both online and offline learning formats, making quality tech education accessible to students everywhere — no boundaries.' },
        { year: '2023', title: 'School Partnerships', desc: 'Collaborated with schools and colleges to integrate practical robotics and AI modules into their curriculum.' },
        { year: '2025', title: 'Scaling Up', desc: 'Grew our community significantly with more courses, workshops, and a dedicated team passionate about shaping the next generation of innovators.' },
        { year: '2026', title: 'Follow Our Journey', desc: 'The story continues! Follow us on Instagram @pirobo.learning to stay updated on our latest workshops, events, and student achievements.', instagram: 'https://www.instagram.com/pirobo.learning' },
    ];

    return (
        <div className="bg-gray-50 dark:bg-black transition-colors duration-500 min-h-screen relative overflow-hidden">
            <SEO title="About Us" description="Learn about the passionate team behind Pi Bots and our mission to democratize robotics education." />
            {/* Ambient Glows - cheap opacity-only compositing */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/8 rounded-full blur-[80px] pointer-events-none" style={{willChange:'auto'}}></div>
            <div className="absolute top-[40%] left-0 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[80px] pointer-events-none" style={{willChange:'auto'}}></div>

            {/* Hero */}
            <section className="relative overflow-hidden pt-32 pb-40 border-b border-gray-200 dark:border-white/10 z-10">
                <div className="container mx-auto px-4 md:px-6 text-center" data-aos="zoom-in">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white transition-colors mb-6 tracking-tight"
                    >
                        We are <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">Pi Bots</span>
                    </motion.h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors max-w-3xl mx-auto leading-relaxed">
                        A team of passionate engineers, educators, and innovators dedicated to democratizing tech education and making <span className="text-gray-900 dark:text-white transition-colors font-medium">Robotics, AI, and Coding</span> accessible to every student.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-gray-50 dark:bg-black transition-colors duration-500">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="p-8 text-center h-full hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-all duration-300 transform hover:-translate-y-2 border-t-2 border-t-orange-500 bg-white dark:bg-gray-900 border-x-white/5 border-b-white/5" style={{willChange:'transform'}}>
                                    <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                                        <value.icon size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors mb-4 group-hover:text-orange-400">{value.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 transition-colors leading-relaxed text-sm">{value.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 bg-gray-900">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-4">Our Journey</h2>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors">From humble beginnings to a tech education revolution.</p>
                    </div>

                    <div className="relative max-w-3xl mx-auto">
                        {/* Vertical Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-700"></div>

                        <div className="space-y-12">
                            {timeline.map((item, index) => (
                                <div key={index} className={`flex items-center justify-between w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-5/12"></div>
                                    <div className="z-10 bg-orange-600 text-gray-900 dark:text-white transition-colors w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-black shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                                        {index + 1}
                                    </div>
                                    <motion.div
                                        className="w-5/12 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 hover:border-orange-500/30 transition-colors duration-300"
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        style={{ willChange: 'transform, opacity' }}
                                    >
                                        <span className="text-orange-500 font-bold block mb-2">{item.year}</span>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors leading-relaxed">{item.desc}</p>
                                        {item.instagram && (
                                            <a href={item.instagram} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-bold hover:opacity-90 transition-all hover:scale-105"
                                            >
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                                Follow @pirobo.learning
                                            </a>
                                        )}
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Pyramid Model */}
            <section className="py-24 bg-gray-50 dark:bg-black transition-colors duration-500 relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white transition-colors mb-4 tracking-tight">Meet the Team</h2>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors max-w-2xl mx-auto text-lg">The visionary minds and dedicated professionals behind the mission.</p>
                    </div>

                    {team && team.length > 0 && (() => {
                        const founderIndex = team.findIndex(m => m.role.toLowerCase().includes('founder') || m.role.toLowerCase().includes('ceo'));
                        const founder = team[founderIndex !== -1 ? founderIndex : 0];
                        const others = team.filter((_, idx) => idx !== (founderIndex !== -1 ? founderIndex : 0));

                        return (
                            <div className="flex flex-col lg:flex-row justify-center items-stretch max-w-[1200px] mx-auto w-full relative gap-0">
                                
                                {/* First Column: Founder & CEO */}
                                <div className="w-full lg:w-[40%] flex justify-center lg:justify-end items-center z-10 relative">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                        className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl p-10 rounded-3xl border border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.25)] text-center w-full max-w-[360px] transform hover:-translate-y-2 transition-transform duration-300 relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent rounded-3xl pointer-events-none"></div>
                                        <div className="w-48 h-48 rounded-full mx-auto mb-8 bg-gray-50 dark:bg-black transition-colors duration-500 border-4 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.4)] flex items-center justify-center overflow-hidden relative z-10 group/photo">
                                            {founder.image ? (
                                        <img src={founder.image} alt={founder.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-110" loading="lazy" />
                                            ) : (
                                                <div className="text-7xl font-bold text-gray-900 dark:text-white transition-colors opacity-20">{founder.name.charAt(0)}</div>
                                            )}

                                        </div>
                                        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors mb-2 uppercase tracking-tight relative z-10">{founder.name}</h3>
                                        <p className="text-orange-500 font-bold text-lg tracking-wide relative z-10">{founder.role}</p>
                                        {/* Always-visible social icons */}
                                        <div className="flex items-center gap-3 mt-3 relative z-10">
                                            {founder.instagram && (
                                                <a href={safeUrl(founder.instagram)} target="_blank" rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-pink-400 hover:bg-pink-500 hover:text-white transition-all duration-200 hover:scale-110"
                                                    title="Instagram"
                                                >
                                                    <InstagramIcon size={15} />
                                                </a>
                                            )}
                                            {founder.linkedin && (
                                                <a href={safeUrl(founder.linkedin)} target="_blank" rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-110"
                                                    title="LinkedIn"
                                                >
                                                    <LinkedInIcon size={15} />
                                                </a>
                                            )}
                                            {founder.website && (
                                                <a href={safeUrl(founder.website)} target="_blank" rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-200 hover:scale-110"
                                                    title="Website"
                                                >
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Desktop Anchor Point removed - now inside the Unified SVG */}
                                </div>

                                {/* Curved Arrows Connector (Desktop only) */}
                                <ArrowConnector count={others.length} />

                                {/* Second Column: Other Team Members */}
                                <div className="w-full lg:w-[45%] flex flex-col gap-8 z-10 lg:pl-4 py-0 mt-8 lg:mt-0">
                                    {others.map((member, index) => (
                                        <React.Fragment key={index}>
                                            {/* Mobile Vertical Connector */}
                                            <div className="lg:hidden flex flex-col items-center justify-center -my-4 z-0 w-full opacity-80">
                                                <div className="w-0.5 h-8 bg-gradient-to-b from-orange-500 to-orange-400 opacity-60"></div>
                                                <svg width="14" height="8" viewBox="0 0 12 6" fill="none">
                                                    <path d="M1 1L6 5L11 1" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>

                                            <motion.div
                                                initial={{ opacity: 0, x: -30 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + index * 0.15, type: 'spring', stiffness: 180, damping: 18 }}
                                                viewport={{ once: true }}
                                                className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md p-5 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-orange-500/40 shadow-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] flex items-center gap-6 group transition-all duration-300 w-full min-h-[160px] max-h-[160px]"
                                                style={{ willChange: 'transform, opacity' }}
                                            >
                                                <div className="w-24 h-24 rounded-full flex-shrink-0 bg-gray-50 dark:bg-black transition-colors duration-500 border-2 border-gray-200 dark:border-white/10 group-hover:border-orange-500/50 overflow-hidden flex items-center justify-center relative shadow-inner group/photo">
                                                    {member.image ? (
                                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-500" loading="lazy" />
                                                    ) : (
                                                        <div className="text-3xl font-bold text-gray-900 dark:text-white transition-colors opacity-20">{member.name.charAt(0)}</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-orange-500 transition-colors uppercase tracking-tight truncate">{member.name}</h3>
                                                    <p className="text-orange-600 dark:text-orange-500/90 text-sm font-semibold tracking-wide mt-1 truncate">{member.role}</p>
                                                    {/* Social icons */}
                                                    {(member.instagram || member.linkedin || member.website) && (
                                                        <div className="flex items-center gap-2 mt-3">
                                                            {member.instagram && (
                                                                <a href={safeUrl(member.instagram)} target="_blank" rel="noopener noreferrer"
                                                                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-pink-500 dark:text-pink-400 hover:bg-pink-500 hover:text-white transition-all duration-200 hover:scale-110"
                                                                    title="Instagram" onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <InstagramIcon size={14} />
                                                                </a>
                                                            )}
                                                            {member.linkedin && (
                                                                <a href={safeUrl(member.linkedin)} target="_blank" rel="noopener noreferrer"
                                                                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-110"
                                                                    title="LinkedIn" onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <LinkedInIcon size={14} />
                                                                </a>
                                                            )}
                                                            {member.website && (
                                                                <a href={safeUrl(member.website)} target="_blank" rel="noopener noreferrer"
                                                                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-orange-500 dark:text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-200 hover:scale-110"
                                                                    title="Website" onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </React.Fragment>
                                    ))}
                                    
                                    {others.length === 0 && (
                                        <div className="text-gray-500 text-center py-10 italic">More team members joining soon...</div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </section>
        </div>
    );
};

export default About;

