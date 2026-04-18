import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import { Target, Lightbulb, Users, Award, Zap, User } from 'lucide-react';
import { teamService } from '../services';

const About = () => {
    const [team, setTeam] = useState([]);
    const [isLoadingTeam, setIsLoadingTeam] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const data = await teamService.getAll();
                // Fallback to defaults if empty and no data has ever been saved
                if (data.length === 0) {
                    setTeam([
                        { name: 'Dr. Arun Kumar', role: 'Founder & CEO', image: null },
                        { name: 'Sarah Lee', role: 'Head of Robotics', image: null },
                        { name: 'Rahul Singh', role: 'AI Curriculum Lead', image: null },
                        { name: 'Priya Patel', role: 'Operations Manager', image: null },
                    ]);
                } else {
                    setTeam(data);
                }
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
        { year: '2020', title: 'Founding', desc: 'Pi Robo started as a small workshop in a garage with 5 students.' },
        { year: '2021', title: 'First Center', desc: 'Opened our first dedicated learning center. Reached 100+ students.' },
        { year: '2022', title: 'Going Online', desc: 'Launched online courses during the pandemic, reaching students globally.' },
        { year: '2023', title: 'Partnerships', desc: 'Partnered with 50+ schools and colleges for integrated curriculum.' },
        { year: '2024', title: 'Expansion', desc: 'Targeting 10,000+ students and new advanced AI modules.' },
    ];

    return (
        <div className="bg-gray-50 dark:bg-black transition-colors duration-500 min-h-screen relative overflow-hidden">
            {/* Ambient Multi-color Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-[40%] left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Hero */}
            <section className="relative overflow-hidden pt-32 pb-40 border-b border-gray-200 dark:border-white/10 z-10">
                <div className="container mx-auto px-4 md:px-6 text-center" data-aos="zoom-in">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white transition-colors mb-6 tracking-tight"
                    >
                        We are <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">Pi Robo</span>
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
                                <Card className="p-8 text-center h-full hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-all duration-300 transform hover:-translate-y-2 border-t-2 border-t-orange-500 bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl border-x-white/5 border-b-white/5">
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
                                        className="w-5/12 bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 hover:border-orange-500/30 transition-colors duration-300"
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                    >
                                        <span className="text-orange-500 font-bold block mb-2">{item.year}</span>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors leading-relaxed">{item.desc}</p>
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
                    <div className="text-center mb-20" data-aos="fade-up">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white transition-colors mb-4 tracking-tight">Meet the Team</h2>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors max-w-2xl mx-auto text-lg">The visionary minds and dedicated professionals behind the mission.</p>
                    </div>

                    {team && team.length > 0 && (() => {
                        const founderIndex = team.findIndex(m => m.role.toLowerCase().includes('founder') || m.role.toLowerCase().includes('ceo'));
                        const founder = team[founderIndex !== -1 ? founderIndex : 0];
                        const others = team.filter((_, idx) => idx !== (founderIndex !== -1 ? founderIndex : 0));

                        return (
                            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0 max-w-7xl mx-auto w-full relative">
                                
                                {/* First Column: Founder & CEO */}
                                <div className="w-full lg:w-[35%] flex justify-center z-10 relative">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl p-10 rounded-3xl border border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.25)] text-center w-full max-w-[360px] transform hover:-translate-y-2 transition-transform duration-300 relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent rounded-3xl pointer-events-none"></div>
                                        <div className="w-48 h-48 rounded-full mx-auto mb-8 bg-gray-50 dark:bg-black transition-colors duration-500 border-4 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.4)] flex items-center justify-center overflow-hidden relative z-10">
                                            {founder.image ? (
                                                <img src={founder.image} alt={founder.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                                            ) : (
                                                <div className="text-7xl font-bold text-gray-900 dark:text-white transition-colors opacity-20">{founder.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors mb-2 uppercase tracking-tight relative z-10">{founder.name}</h3>
                                        <p className="text-orange-500 font-bold text-lg tracking-wide relative z-10">{founder.role}</p>
                                    </motion.div>

                                    {/* Desktop Anchor Point */}
                                    <div className="hidden lg:block absolute right-[0px] lg:right-[-16px] top-1/2 -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-full ring-4 ring-black shadow-[0_0_20px_#f97316] z-20"></div>
                                </div>

                                {/* Curved Arrows Connector (Desktop only) */}
                                <div className="hidden lg:block flex-1 min-w-[120px] max-w-[200px] h-[500px] relative z-0 opacity-80">
                                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0 text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.7)]">
                                        <defs>
                                            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                                                <polygon points="0 0, 6 3, 0 6" fill="#f97316" />
                                            </marker>
                                            <filter id="glow">
                                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur"/>
                                                    <feMergeNode in="SourceGraphic"/>
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        {others.map((_, i) => {
                                            const total = others.length;
                                            // Distribute end points (Y coordinate) from 15 to 85 depending on how many items
                                            let yPos = 50; 
                                            if (total > 1) {
                                                const spacing = 70 / (total - 1);
                                                yPos = 15 + (spacing * i);
                                            }
                                            return (
                                                <path 
                                                    key={i}
                                                    d={`M0,50 C 45,50 55,${yPos} 92,${yPos}`} 
                                                    stroke="currentColor" 
                                                    strokeWidth="2" 
                                                    vectorEffect="non-scaling-stroke" 
                                                    fill="none" 
                                                    markerEnd="url(#arrowhead)" 
                                                    filter="url(#glow)"
                                                    style={{ animation: `pulse ${2 + i*0.5}s infinite alternate` }}
                                                />
                                            );
                                        })}
                                    </svg>
                                </div>

                                {/* Second Column: Other Team Members */}
                                <div className="w-full lg:w-[45%] flex flex-col gap-6 z-10">
                                    {others.map((member, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
                                            viewport={{ once: true }}
                                            className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-orange-500/40 hover:bg-gray-100 dark:bg-gray-800/80 shadow-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] flex items-center gap-6 group transition-all duration-300 w-full"
                                        >
                                            {/* Mobile Anchor Point (only visible if we need it, but we skip for mobile simplicity) */}
                                            
                                            <div className="w-24 h-24 rounded-full flex-shrink-0 bg-gray-50 dark:bg-black transition-colors duration-500 border-2 border-gray-200 dark:border-white/10 group-hover:border-orange-500/50 overflow-hidden flex items-center justify-center relative shadow-inner">
                                                {member.image ? (
                                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="text-3xl font-bold text-gray-900 dark:text-white transition-colors opacity-20">{member.name.charAt(0)}</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-orange-400 transition-colors uppercase tracking-tight">{member.name}</h3>
                                                <p className="text-orange-500/90 text-sm font-semibold tracking-wide mt-1">{member.role}</p>
                                            </div>
                                        </motion.div>
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
