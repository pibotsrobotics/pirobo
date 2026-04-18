import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import SEO from '../components/ui/SEO';
import { Phone, Mail, MapPin, Instagram, Linkedin, Send } from 'lucide-react';
import { enquiryService } from '../services';

const Contact = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            // Add date and default status
            const payload = {
                ...data,
                date: new Date().toLocaleDateString(),
                status: 'Pending',
                source: 'Contact Form'
            };

            // Save to Firebase first (wrap in try/catch to not block email if Firebase rules fail)
            try {
                await enquiryService.create(payload);
            } catch (fbError) {
                console.error("Firebase save failed, proceeding with email", fbError);
            }

            // Send Email Notification via Web3Forms if Key is configured
            const web3FormsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
            if (web3FormsKey) {
                try {
                    await fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify({
                            access_key: web3FormsKey,
                            subject: "New Contact Form Enquiry - Pi Robo",
                            from_name: data.name,
                            email: data.email,
                            phone: data.phone,
                            message: data.message,
                            interest: data.interest
                        })
                    });
                } catch (emailError) {
                    console.error("Failed to send email notification", emailError);
                    // We don't block the UI if email fails, as Firebase save succeeded
                }
            }

            alert('Message Sent Successfully! We will contact you soon.');
            reset();
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to send message. Please try again.");
        }
    };

    const contactInfo = [
        { title: 'Phone', value: '+91 85472 44223', icon: Phone, color: 'text-orange-500 bg-orange-500/10' },
        { title: 'Email', value: 'pibotsacademy@gmail.com', icon: Mail, color: 'text-green-400 bg-green-500/10' },
        { title: 'Location', value: 'Pibots Makerhub, Mampad, Kerala 676542', icon: MapPin, color: 'text-red-400 bg-red-500/10' },
    ];

    return (
        <div className="bg-gray-50 dark:bg-black transition-colors duration-500 min-h-screen py-12 relative overflow-hidden">
            <SEO title="Contact Us" description="Get in touch with Pi Robo. We're here to answer any questions about our robotics courses, workshops, or partnerships." />
            {/* Ambient Background Glow */}
            <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16" data-aos="fade-down">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white transition-colors mb-4 tracking-tight">Get in <span className="text-orange-500">Touch</span></h1>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors text-lg max-w-2xl mx-auto">Have questions? We'd love to hear from you.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Contact Info & Map */}
                    <div className="flex-1 space-y-8">
                        {/* Contact Cards */}
                        <div className="grid grid-cols-1 gap-6" data-aos="fade-up">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="flex items-center p-6 bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl hover:border-orange-500/30 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300 transform hover:-translate-y-1 group">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-5 ${info.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                                        <info.icon size={26} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-1">{info.title}</h3>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white transition-colors group-hover:text-orange-400 transition-colors">{info.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Google Map Embed */}
                        <div className="overflow-hidden bg-white/80 dark:bg-gray-900/40 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl h-64 md:h-80 shadow-lg p-2" data-aos="fade-up" data-aos-delay="100">
                            <iframe
                                src="https://maps.google.com/maps?q=Pibots+Makerhub&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '12px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Pibots Makerhub Location"
                            ></iframe>
                        </div>

                        {/* Socials */}
                        <div className="p-8 text-center bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg" data-aos="fade-up" data-aos-delay="200">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors mb-6">Follow Us</h3>
                            <div className="flex justify-center gap-6">
                                <Button variant="outline" className="gap-2 border-pink-500/50 text-pink-400 hover:bg-pink-500/10 hover:border-pink-500 hover:text-pink-300 transition-all duration-300">
                                    <Instagram size={20} /> Instagram
                                </Button>
                                <Button variant="outline" className="gap-2 border-blue-600/50 text-blue-400 hover:bg-blue-600/10 hover:border-blue-500 hover:text-blue-300 transition-all duration-300">
                                    <Linkedin size={20} /> LinkedIn
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Application Form Side */}
                    <div className="flex-1" data-aos="fade-left">
                        <div className="p-8 shadow-2xl rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/40 backdrop-blur-2xl h-full border-t-4 border-t-orange-500">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors mb-8">Send us a Message</h3>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-2">Full Name</label>
                                    <Input
                                        placeholder="Your Name"
                                        className="bg-white dark:bg-black/50 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                        {...register('name', { required: 'Name is required' })}
                                    />
                                    {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-2">Phone Number</label>
                                        <Input
                                            placeholder="+91 85472 44223"
                                            type="tel"
                                            className="bg-white dark:bg-black/50 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                            {...register('phone', { required: 'Phone is required' })}
                                        />
                                        {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone.message}</span>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-2">Interested In</label>
                                    <select
                                        {...register('interest', { required: 'Please select an option' })}
                                        className="flex h-11 w-full rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 px-3 py-2 text-sm text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none"
                                    >
                                        <option value="" className="bg-gray-900">Select Option</option>
                                        <option value="Robotics Course" className="bg-gray-900">Robotics Course</option>
                                        <option value="AI Course" className="bg-gray-900">AI Course</option>
                                        <option value="Coding Course" className="bg-gray-900">Coding Course</option>
                                        <option value="Internship" className="bg-gray-900">Internship</option>
                                        <option value="General Enquiry" className="bg-gray-900">General Enquiry</option>
                                    </select>
                                    {errors.interest && <span className="text-xs text-red-500 mt-1 block">{errors.interest.message}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-2">Message</label>
                                    <textarea
                                        rows={4}
                                        className="w-full rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 px-4 py-3 text-sm text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        placeholder="How can we help you?"
                                        {...register('message', { required: 'Message is required' })}
                                    ></textarea>
                                    {errors.message && <span className="text-xs text-red-500 mt-1 block">{errors.message.message}</span>}
                                </div>

                                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all duration-300 py-3 rounded-lg text-lg font-semibold mt-4" disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : <><Send size={20} className="mr-2" /> Send Message</>}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
