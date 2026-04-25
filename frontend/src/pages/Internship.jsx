import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { Code, Bot, Cpu, Wifi, CheckCircle, Upload, Send } from 'lucide-react';
import { enquiryService, uploadService } from '../services';
import Toast from '../components/ui/Toast';

const Internship = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const onSubmit = async (data) => {
        try {


            // Flatten the structure for the enquiry service
            const payload = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                interest: `Internship - ${data.domain}`,
                message: data.message,
                college: data.college, // Dedicated field
                date: new Date().toLocaleDateString(),
                status: 'Pending',
                source: 'Internship Application'
            };

            await enquiryService.create(payload);
            setToastMessage('Application Submitted Successfully!');
            setShowToast(true);
            reset();
        } catch (error) {
            console.error("Application failed", error);
            alert("Failed to submit application. Please try again.");
        }
    };

    const tracks = [
        { title: 'Web Development', icon: Code, desc: 'React, Node.js, and Modern UI/UX' },
        { title: 'AI & Machine Learning', icon: Cpu, desc: 'Python, TensorFlow, and Neural Networks' },
        { title: 'Robotics Engineering', icon: Bot, desc: 'Arduino, ROS, and Circuit Design' },
        { title: 'Internet of Things', icon: Wifi, desc: ' Sensors, Cloud, and Automation' },
    ];

    const benefits = [
        'Real-world Project Experience',
        'Mentorship from Industry Experts',
        'Letter of Recommendation',
        'Flexible Work Hours',
        'Pre-placement Offer Potential',
        'Certificate of Completion'
    ];

    return (
        <div className="bg-gray-50 dark:bg-black transition-colors duration-500 min-h-screen relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Hero / Header */}
            <section className="relative overflow-hidden pt-32 pb-24 border-b border-gray-200 dark:border-white/10 z-10">
                <div className="container mx-auto px-4 md:px-6 relative text-center" data-aos="zoom-in">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white transition-colors"
                    >
                        Launch Your Career with <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">Pi BOTS</span>
                    </motion.h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors max-w-2xl mx-auto leading-relaxed">
                        Join our elite internship program. Work on cutting-edge technologies and build a portfolio that stands out.
                    </p>
                </div>
            </section>

            {/* Tracks */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-4">Internship Tracks</h2>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors">Choose your domain of expertise.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tracks.map((track, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="h-full p-6 text-center group bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl border-t-2 border-t-orange-500 hover:border-orange-500/30 hover:shadow-[0_0_25px_rgba(249,115,22,0.2)] transition-all duration-300 transform hover:-translate-y-2">
                                    <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 group-hover:bg-orange-600 group-hover:text-gray-900 dark:text-white transition-colors group-hover:shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all duration-300 transform group-hover:scale-110">
                                        <track.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors mb-2 group-hover:text-orange-400 transition-colors">{track.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 transition-colors text-sm leading-relaxed">{track.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 py-20 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Benefits Side */}
                    <div className="flex-1" data-aos="fade-right">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-8">Why interning with us?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-3 group">
                                    <div className="bg-green-500/10 p-1.5 rounded-full border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                                        <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors group-hover:text-gray-900 dark:text-white transition-colors transition-colors">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-orange-500/10 dark:bg-orange-900/10 backdrop-blur-md rounded-2xl border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.05)]">
                            <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                Note for Applicants
                            </h4>
                            <p className="text-orange-800 dark:text-orange-300/80 text-sm leading-relaxed">
                                This is a competitive program. We review applications on a rolling basis.
                                Make sure your statement of interest highlights your projects and skills relevant to the track you are applying for.
                            </p>
                        </div>
                    </div>

                    {/* Application Form Side */}
                    <div className="flex-1" data-aos="fade-left">
                        <div className="p-8 shadow-2xl rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/40 backdrop-blur-2xl border-t-4 border-t-orange-500">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors mb-8">Apply Now</h3>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-2">Full Name</label>
                                        <Input
                                            placeholder="John Doe"
                                            className={`bg-white dark:bg-black/50 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors ${errors.name ? 'border-red-500' : ''}`}
                                            {...register('name', { required: 'Name is required' })}
                                        />
                                        {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-2">Phone Number</label>
                                        <Input
                                            placeholder="+91 91884 11223"
                                            type="tel"
                                            className="bg-white dark:bg-black/50 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                            {...register('phone', { required: 'Phone is required' })}
                                        />
                                        {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone.message}</span>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-2">Email Address</label>
                                    <Input
                                        placeholder="john@example.com"
                                        type="email"
                                        className="bg-white dark:bg-black/50 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                        {...register('email', { required: 'Email is required' })}
                                    />
                                    {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-2">College / University</label>
                                    <Input
                                        placeholder="Enter your college name"
                                        className="bg-white dark:bg-black/50 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                        {...register('college', { required: 'College is required' })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-2">Interested Domain</label>
                                    <select
                                        {...register('domain', { required: 'Please select a domain' })}
                                        className="flex h-11 w-full rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 px-3 py-2 text-sm text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none"
                                    >
                                        <option value="" className="bg-white dark:bg-gray-900">Select a Domain</option>
                                        <option value="Web Development" className="bg-white dark:bg-gray-900">Web Development</option>
                                        <option value="AI & ML" className="bg-white dark:bg-gray-900">AI & ML</option>
                                        <option value="Robotics" className="bg-white dark:bg-gray-900">Robotics</option>
                                        <option value="IoT" className="bg-white dark:bg-gray-900">IoT</option>
                                    </select>
                                    {errors.domain && <span className="text-xs text-red-500 mt-1 block">{errors.domain.message}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-2">Why do you want to join?</label>
                                    <textarea
                                        rows={4}
                                        className="w-full rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 px-4 py-3 text-sm text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-gray-600"
                                        placeholder="Tell us about yourself and your motivation..."
                                        {...register('message')}
                                    ></textarea>
                                </div>

                                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all duration-300 py-3 rounded-lg text-lg font-semibold mt-6" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : <><Send size={20} className="mr-2" /> Submit Application</>}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div >
    );
};

export default Internship;
