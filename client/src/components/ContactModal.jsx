import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Instagram } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ContactModal({ open = false, onClose = () => { } }) {
    const [closing, setClosing] = useState(false);
    const timeoutRef = useRef(null);
    const submitTimeoutRef = useRef(null);

    const [form, setForm] = useState({ name: '', email: '', phone: '', bestTime: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) setClosing(false);
    }, [open]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') handleClose();
        };
        if (open) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleClose = () => {
        setClosing(true);
        timeoutRef.current = setTimeout(() => {
            setClosing(false);
            onClose();
        }, 400);
    };

    useEffect(() => {
        return () => {
            if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
        };
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!form.name || !form.email || !form.bestTime) {
            setError('Please provide your name, email and a preferred date/time.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/letsconnect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Server error');
            }
            setSuccess(true);
            setForm({ name: '', email: '', phone: '', message: '' });
            // auto-close after a short delay
            submitTimeoutRef.current = setTimeout(() => {
                handleClose();
            }, 1800);
        } catch (err) {
            console.error('Contact submit failed', err);
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!open && !closing) return null;

    const modal = (
        <div className={`fixed inset-0 z-[9999] flex items-start md:items-center justify-center`}>
            {/* hide native scrollbar for the modal panel while keeping scroll functionality
                    and make the datetime-local picker icon appear white */}
            <style>{`
                .no-scrollbar::-webkit-scrollbar{display:none;} 
                .no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }
                /* Chrome / WebKit: make the calendar/time picker icon white */
                input[type="datetime-local"]::-webkit-calendar-picker-indicator {
                    filter: invert(1) grayscale(1) contrast(1.2) !important;
                    opacity: 1;
                }
                /* Ensure the input text is white */
                input[type="datetime-local"] { color: #ffffff; }
            `}</style>
            {/* Backdrop */}
            <div className={`absolute inset-0 bg-black/70 transition-opacity ${closing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose} />

            {/* Panel */}
            <div className={`relative w-[95vw] max-w-[1600px] mx-4 md:mx-8 my-4 md:my-0 max-h-[90vh] overflow-y-auto no-scrollbar bg-transparent transform transition-all duration-400 ${closing ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
                <div className="relative bg-black/60 backdrop-blur-lg rounded-lg overflow-hidden shadow-2xl">
                    {/* Background image for entire modal */}
                    <div className="absolute inset-0 bg-contain bg-center" style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1716968595578-d192a02f0425?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b3R0YXdhJTIwbmlnaHR8ZW58MHx8MHx8fDA%3D')" }} />
                    <div className="absolute inset-0 bg-black/70" />

                    {/* close button */}
                    <button onClick={handleClose} aria-label="Close contact" className="absolute top-4 right-4 z-20 text-white hover:opacity-80 transition">
                        <X className="w-8 h-8" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[95vh]">
                        {/* Left details */}
                        <div className="relative py-8 md:py-16">
                            <div className="p-8 md:p-16 relative z-10 flex items-start">
                                <div className="max-w-md">
                                    <h2 className="text-white text-3xl md:text-4xl font-light mb-6">CONTACT DETAILS</h2>
                                    <p className="text-white/80 mb-6">Reach out to us for inquiries, showings, and partnerships.</p>

                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-white text-sm">PHONE</p>
                                            <p className="text-white">(613) 795-7804</p>
                                        </div>
                                        <div>
                                            <p className="text-white text-sm">EMAIL</p>
                                            <p className="text-white">phil.parnanzone@gmail.com</p>
                                        </div>
                                        <div>
                                            <p className="text-white text-sm">ADDRESS</p>
                                            <p className="text-white">371 Richmond Road, Ottawa, ON</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-4">
                                        <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition">
                                            <Instagram className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right form */}
                        <div className="p-6 md:p-16 py-8 md:py-16 flex items-center relative z-10">
                            <div className="max-w-md mx-auto w-full">
                                {success ? (
                                    <div className="text-center py-12">
                                        <h3 className="text-2xl text-white mb-4">Message Sent</h3>
                                        <p className="text-white/80">Thanks — we received your message. We'll respond shortly.</p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-white text-3xl md:text-4xl font-light mb-4">SUBMIT A MESSAGE</h2>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label className="text-white/80 text-xs">Name</label>
                                                <input name="name" value={form.name} onChange={handleChange} className="w-full bg-transparent border-b border-white/30 text-white py-2 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-white/80 text-xs">Email</label>
                                                <input name="email" value={form.email} onChange={handleChange} className="w-full bg-transparent border-b border-white/30 text-white py-2 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-white/80 text-xs">Phone</label>
                                                <input name="phone" value={form.phone} onChange={handleChange} className="w-full bg-transparent border-b border-white/30 text-white py-2 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-white/80 text-xs">Best time to get in touch (Eastern Time Zone)</label>
                                                <input name="bestTime" type="datetime-local" value={form.bestTime} onChange={handleChange} className="w-full bg-transparent border border-white/30 text-white py-2 px-3 focus:outline-none h-12" />
                                            </div>

                                            {error && <p className="text-red-400 text-sm">{error}</p>}

                                            <div>
                                                <button type="submit" disabled={loading} className="w-full bg-white text-black py-3 disabled:opacity-50">{loading ? 'SENDING...' : 'Send Message'}</button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(modal, document.body);
}