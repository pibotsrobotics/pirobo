import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import Input from '../components/ui/Input';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { eventService, registrationService } from '../services';

const initialEvents = [
    {
        id: "init1",
        title: "Robotics Workshop 2024",
        date: "2024-02-15",
        time: "10:00 AM",
        location: "Pi Robo Center",
        type: "Workshop",
        image: "bg-blue-600/20",
        description: "A hands-on workshop to build your first robot. Kits will be provided.",
        fee: "Free"
    },
    {
        id: "init2",
        title: "AI Hackathon",
        date: "2024-03-01",
        time: "09:00 AM",
        location: "Online",
        type: "Competition",
        image: "bg-purple-600/20",
        description: "24-hour hackathon to solve real-world problems using AI.",
        fee: "₹500"
    },
    {
        id: "init3",
        title: "IoT Seminar",
        date: "2024-03-10",
        time: "2:00 PM",
        location: "City Hall",
        type: "Seminar",
        image: "bg-green-600/20",
        description: "Experts discuss the future of IoT and Smart Cities.",
        fee: "Free"
    },
];

const Workshops = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            let data = await eventService.getAll();
            if (data.length === 0) {
                if (!localStorage.getItem('events')) {
                    for (const e of initialEvents) await eventService.create(e);
                    data = await eventService.getAll();
                }
            }
            setEvents(data);
        } catch (error) {
            console.error("Failed loading events", error);
        }
        setLoading(false);
    };

    // Effect to check for 'register' query param after events are loaded
    useEffect(() => {
        const registerId = searchParams.get('register');
        if (registerId && events.length > 0) {
            const eventToRegister = events.find(e => e.id === registerId);
            if (eventToRegister) {
                openModal(eventToRegister);
            }
        }
    }, [events, searchParams]);

    const openModal = (event) => {
        setSelectedEvent(event);
        reset();
    }

    const closeModal = () => {
        setSelectedEvent(null);
    }

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
            // alert("Registration failed. Please try again.");
            // Ideally use a Toast for error too, but sticking to success requirement first
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-black transition-colors duration-500 min-h-screen py-12 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16" data-aos="fade-down">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white transition-colors mb-4 tracking-tight">Workshops & <span className="text-orange-500">Events</span></h1>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors text-lg max-w-2xl mx-auto">Join our upcoming events to learn, compete, and network.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full text-center text-gray-600 dark:text-gray-400 transition-colors">Loading events...</div>
                    ) : (
                        events.map((event, index) => (
                            <div key={event.id} data-aos="fade-up" data-aos-delay={index * 100} className="h-full">
                                <div className="flex flex-col h-full bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
                                    <div className={`h-48 relative overflow-hidden flex items-center justify-center text-gray-900 dark:text-white transition-colors bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${event.image ? '' : 'bg-gradient-to-br from-gray-900 to-black'}`}
                                        style={event.image ? { backgroundImage: `url(${event.image})` } : {}}
                                    >
                                        {!event.image && (
                                            <div className="text-4xl font-bold opacity-10 tracking-wider">EVENT</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
                                        <div className="absolute top-4 right-4 bg-orange-500/10 backdrop-blur-md border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full text-xs font-bold shadow-sm z-10">
                                            {event.fee || 'Free'}
                                        </div>
                                        <div className="absolute bottom-4 left-4 bg-orange-600 px-3 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-white transition-colors shadow-lg shadow-orange-500/20 z-10">
                                            {event.type}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors mb-4 group-hover:text-orange-500 transition-colors">{event.title}</h3>
                                        
                                        <div className="space-y-3 mb-6 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={18} className="text-orange-500" /> {event.date}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock size={18} className="text-orange-500" /> {event.time}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin size={18} className="text-orange-500" /> {event.location}
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-600 dark:text-gray-400 transition-colors text-sm mb-8 flex-grow leading-relaxed">{event.description || 'Join us for this amazing event!'}</p>
                                        
                                        <div className="mt-auto pt-4 border-t border-white/5">
                                            <Button onClick={() => openModal(event)} className="w-full bg-orange-600 hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all duration-300 rounded-lg">
                                                Register Now
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Modal
                isOpen={!!selectedEvent}
                onClose={closeModal}
                title={`Register for ${selectedEvent?.title}`}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-1">Full Name</label>
                        <Input
                            placeholder="John Doe"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-1">Email Address</label>
                        <Input
                            type="email"
                            placeholder="john@example.com"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mb-1">Phone Number</label>
                        <Input
                            type="tel"
                            placeholder="+91 85472 44223"
                            {...register('phone', { required: 'Phone is required' })}
                        />
                        {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Registering...' : 'Confirm Registration'}
                        </Button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            By registering, you agree to our terms and conditions.
                        </p>
                    </div>
                </form>
            </Modal>

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default Workshops;
