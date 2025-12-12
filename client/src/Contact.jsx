import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Instagram } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const [closing, setClosing] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Server error');
      }
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Contact submit failed', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setClosing(true);
    // match the transition duration below (500ms)
    timeoutRef.current = setTimeout(() => {
      navigate('/');
    }, 500);
  };

  return (
    <div className={`fixed inset-0 bg-black flex transition-transform duration-500 ease-in-out transform ${closing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('src/Public/images/ottawa.png')" }}>
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content Container */}
      <div className="relative w-full flex">
        {/* Left Side - Contact Details */}
        <div className="w-1/2 flex items-center justify-center p-16">
          <div className="max-w-md">
            <h1 className="text-white text-5xl font-light tracking-widest mb-16">CONTACT DETAILS</h1>
            
            <div className="space-y-12">
              <div>
                <h2 className="text-white text-sm font-light tracking-widest mb-6">PHILIP Parnanzone</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-white mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-white text-sm font-light tracking-wider mb-1">PHONE</p>
                      <p className="text-white text-base font-light tracking-wide">(613) 795-7804</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-white mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-white text-sm font-light tracking-wider mb-1">EMAIL</p>
                      <p className="text-white text-base font-light tracking-wide">phil.parnanzone@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-white mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-white text-sm font-light tracking-wider mb-1">ADDRESS</p>
                      <p className="text-white text-base font-light tracking-wide">371 richmond road,</p>
                      <p className="text-white text-base font-light tracking-wide">Ottawa, ON K2A 0B7</p>
                    </div>
                  </div>
                </div>

                <p className="text-white text-sm font-light tracking-wider mt-8">LICENSED IN Ottawa AND Canada</p>
              </div>

              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition">
                  <Instagram className="w-5 h-5 text-white" />
                </button>
                <button className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-white/20"></div>

        {/* Right Side - Submit Form */}
        <div className="w-1/2 flex items-center justify-center p-16 relative">
          <button onClick={handleClose} aria-label="Close contact" className="absolute top-8 right-8 text-white hover:opacity-70 transition">
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-md w-full">
            <h1 className="text-white text-5xl font-light tracking-widest mb-3">SUBMIT A<br />MESSAGE</h1>

            {success ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-light text-white mb-2">Thanks — we received your message.</h2>
                <p className="text-white/70">We'll respond as soon as possible.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <label className="block text-white text-xs font-light tracking-widest mb-4">NAME</label>
                  <input 
                    name="name" 
                    value={form.name} 
                    onChange={onChange} 
                    required 
                    className="w-full bg-transparent border-b border-white/30 text-white px-0 py-3 focus:outline-none focus:border-white transition placeholder-white/40"
                  />
                </div>

                <div>
                  <label className="block text-white text-xs font-light tracking-widest mb-4">EMAIL</label>
                  <input 
                    name="email" 
                    type="email" 
                    value={form.email} 
                    onChange={onChange} 
                    required 
                    className="w-full bg-transparent border-b border-white/30 text-white px-0 py-3 focus:outline-none focus:border-white transition placeholder-white/40"
                  />
                </div>

                <div>
                  <label className="block text-white text-xs font-light tracking-widest mb-4">PHONE</label>
                  <input 
                    name="phone" 
                    value={form.phone} 
                    onChange={onChange} 
                    className="w-full bg-transparent border-b border-white/30 text-white px-0 py-3 focus:outline-none focus:border-white transition placeholder-white/40"
                  />
                </div>

                <div>
                  <label className="block text-white text-xs font-light tracking-widest mb-4">MESSAGE</label>
                  <textarea 
                    name="message" 
                    value={form.message} 
                    onChange={onChange} 
                    required 
                    rows={4}
                    className="w-full bg-transparent border border-white/30 text-white px-4 py-3 focus:outline-none focus:border-white transition placeholder-white/40 resize-none"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="privacy" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 bg-transparent border border-white/30"
                  />
                  <label htmlFor="privacy" className="text-white text-xs font-light leading-relaxed">
                    By providing The Philip Scheinfeld Team your contact information, you acknowledge and agree to our <span className="underline">Privacy Policy</span> and consent to receiving marketing communications, including through automated calls, texts, and emails, some of which may use artificial or prerecorded voices. This consent isn't necessary for purchase.
                  </label>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button 
                  onClick={onSubmit}
                  disabled={loading || !agreed}
                  className="w-full bg-white text-black py-4 tracking-widest font-light hover:bg-white/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}