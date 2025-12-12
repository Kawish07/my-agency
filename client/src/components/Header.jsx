import React, { useEffect, useState, useRef } from 'react';
import { Menu, X, Instagram, Facebook } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getLenis } from '../lib/lenis';
import ContactModal from './ContactModal';

export default function Header({ onBack, light = false }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const [atTop, setAtTop] = useState(true);

    // conditional classes for left/right sides: left is on black background, right is on white
    // make header link text slightly larger and bolder
    const leftLinkClass = 'text-white font-semibold text-base md:text-lg hover:opacity-80 transition-opacity';
    const rightLinkClass = 'text-black font-semibold text-base md:text-lg hover:opacity-70 transition-opacity';
    const leftIconClass = 'w-5 h-5 text-white';
    const rightIconClass = 'w-5 h-5 text-black';

    const navigate = useNavigate();
    const location = useLocation();
    const timeoutRef = useRef(null);
    const [contactOpen, setContactOpen] = useState(false);

    useEffect(() => {
        // Inject small animation CSS used across the site
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes pulse { 0%,100%{ transform: scale(1); opacity:1 } 50%{ transform: scale(1.05); opacity:0.8 } }
            @keyframes ripple { 0%{ transform: scale(1); opacity:0.6 } 100%{ transform: scale(1.5); opacity:0 } }
            .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
            .animate-slideInRight { animation: slideInRight 0.6s ease-out forwards; }
            .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
            .animate-scaleIn { animation: scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
            .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
            .animate-ripple { animation: ripple 1.5s ease-out infinite; }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    useEffect(() => {
        lastScrollY.current = typeof window !== 'undefined' ? window.scrollY : 0;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            // track whether we're at the top of the page (used to hide split background)
            setAtTop(currentScrollY <= 10);
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const delta = currentScrollY - lastScrollY.current;
                    if (delta > 10) setShowHeader(false);
                    else if (delta < -10) setShowHeader(true);
                    lastScrollY.current = currentScrollY;
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // listen for global open contact modal events
        const onOpenContact = () => setContactOpen(true);
        window.addEventListener('openContactModal', onOpenContact);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('openContactModal', onOpenContact);
        };
    }, []);

    // helper: smooth-scroll to an anchor hash using Lenis when available
    const scrollToHash = (hash) => {
        try {
            const el = document.querySelector(hash);
            if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY;
                const lenis = getLenis();
                if (lenis && typeof lenis.scrollTo === 'function') {
                    lenis.scrollTo(top, { immediate: false });
                } else {
                    window.scrollTo({ top, behavior: 'smooth' });
                }
                // clear any temporary hash in history
                window.history.replaceState({}, '', hash);
            } else {
                // element not found yet; still set hash
                window.history.replaceState({}, '', hash);
            }
        } catch (e) {
            // noop
        }
    };

    const handleNav = (item) => {
        setMenuOpen(false);
        if (!item || !item.href) return;

        if (item.href.startsWith('#')) {
            // special-case contact anchor -> open modal
            if (item.href === '#contact') {
                setMenuOpen(false);
                setContactOpen(true);
                return;
            }

            // anchor on homepage
            if (location.pathname === '/' || location.pathname === '') {
                // already on home — scroll after a tiny delay so menu close anim completes
                timeoutRef.current = setTimeout(() => scrollToHash(item.href), 120);
            } else {
                // navigate to home and pass scroll target in state — App will handle the scroll
                try { window.dispatchEvent(new CustomEvent('startPageLoad')); } catch (e) { }
                try {
                    document.body.classList.add('force-page-loading');
                    setTimeout(() => document.body.classList.remove('force-page-loading'), 2200);
                } catch (e) { }
                navigate('/', { state: { scrollTo: item.href } });
            }
            return;
        }

        // normal route
        // dispatch an event so App can show the page loader immediately
        try { window.dispatchEvent(new CustomEvent('startPageLoad')); } catch (e) { }
        // also add a body class as a fallback to ensure the loader shows (removed shortly after)
        try {
            document.body.classList.add('force-page-loading');
            setTimeout(() => document.body.classList.remove('force-page-loading'), 2200);
        } catch (e) { }
        navigate(item.href);
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 shadow-sm transform transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
                {/* split background: left black, right white — always present but fades in/out smoothly */}
                <div className={`absolute inset-0 pointer-events-none flex transition-opacity duration-500 ease-out ${atTop ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="w-1/2 bg-black" />
                    <div className="w-1/2 bg-white" />
                </div>
                <div className="relative flex items-center justify-between px-8 py-6">
                    <div className="flex items-center">
                        <Link to="/">
                            <img
                                src="https://cdn-cws.datafloat.com/AGY/images/company/AGY/agency-logo.svg?mw=160&mh=160"
                                alt="Compass logo"
                                className="h-24 md:h-28 max-w-[220px] md:max-w-[260px] w-auto object-contain"
                            />
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {onBack ? (
                            <button
                                onClick={onBack}
                                className={`tracking-wide ${rightLinkClass} mr-8`}
                            >
                                Back to Home
                            </button>
                        ) : null}

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className={`flex items-center space-x-2 tracking-wide ${rightLinkClass}`}
                        >
                            <Menu className={rightIconClass} />
                            <span className='font-semibold'>Menu</span>
                        </button>
                        <div className="flex items-center space-x-8" style={{ marginLeft: '400px' }}>
                            <button onClick={() => handleNav({ href: '/All-listings' })} className={`tracking-wide ${rightLinkClass}`}>Portfolio</button>
                            <button onClick={() => setContactOpen(true)} className={`tracking-wide ${rightLinkClass}`}>Contact</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Slide Menu */}
            <div className={`fixed top-0 right-0 h-full w-96 z-50 transform transition-all duration-500 ease-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`} aria-hidden={!menuOpen}>
                {/* Gradient Background with Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black pointer-events-auto">
                    {/* Animated Grid Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                            backgroundSize: '50px 50px'
                        }} />
                    </div>

                    {/* Glowing Orb Effects */}
                    <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/3 rounded-full blur-3xl" />
                </div>

                <div className="relative h-full p-8 flex flex-col">
                    {/* Close Button */}
                    <button
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300 group"
                    >
                        <X className="w-5 h-5 text-white/70 group-hover:text-white transition-colors group-hover:rotate-90 duration-300" />
                    </button>

                    {/* Decorative Line */}
                    <div className="mt-8 mb-12">
                        <div className="h-px w-16 bg-gradient-to-r from-white/40 to-transparent" />
                    </div>

                    <nav className="flex-1">
                        {[
                            { href: '#hero', label: 'Home', icon: '01' },
                            { href: '#contact', label: 'Contact', icon: '02' },
                            { href: '/all-listings', label: 'Portfolio', icon: '03' },
                            { href: '/testimonials', label: 'Testimonials', icon: '04' },
                            { href: '/staging', label: 'Staging Before & After', icon: '05' }
                        ].map((item, idx) => (
                            <button
                                key={item.href + idx}
                                onClick={() => handleNav(item)}
                                className={`group block w-full text-left transform transition-all duration-500 ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                                style={{ transitionDelay: `${idx * 80 + 100}ms` }}
                            >
                                <div className="relative overflow-hidden mb-6">
                                    {/* Hover Background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative px-4 py-4 flex items-center justify-between">
                                        {/* Number Badge and Label */}
                                        <div className="flex items-center space-x-4">
                                            <span className="text-xs font-mono text-white/30 group-hover:text-white/50 transition-colors duration-300">
                                                {item.icon}
                                            </span>
                                            <span className="text-lg font-light tracking-wide text-white/90 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                                                {item.label}
                                            </span>
                                        </div>

                                        {/* Arrow Icon */}
                                        <span className="text-white/0 group-hover:text-white/70 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300">→</span>
                                    </div>

                                    {/* Bottom Border */}
                                    <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </div>
                            </button>
                        ))}
                    </nav>

                    {/* Social Section */}
                    <div className="mt-auto pt-8 border-t border-white/10">
                        <div className={`transform transition-all duration-500 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '500ms' }}>
                            <p className="text-xs font-mono text-white/40 mb-4 tracking-wider uppercase">Connect</p>
                            <div className="flex items-center space-x-3">
                                <a href="https://www.instagram.com/theagency.ottawa/?hl=en" target="_blank" rel="noopener noreferrer" className="group relative w-12 h-12 border border-white/20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-white/40 hover:scale-110">
                                    <div className="absolute inset-0 bg-white transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full" />
                                    <Instagram className="w-5 h-5 text-white relative z-10 group-hover:text-black transition-colors duration-300" />
                                </a>
                                <a href="https://www.facebook.com/parnanzonerealty/" target="_blank" rel="noopener noreferrer" className="group relative w-12 h-12 border border-white/20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-white/40 hover:scale-110">
                                    <div className="absolute inset-0 bg-white transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full" />
                                    <Facebook className="w-5 h-5 text-white relative z-10 group-hover:text-black transition-colors duration-300" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Overlay */}
            <div className={`fixed inset-0 z-40 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuOpen(false)}>
                <div className="w-full h-full bg-black/60 backdrop-blur-sm" />
            </div>
            <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
        </>
    );
}