import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { getDummyListings } from './data/dummyListings';
import { useEffect, useRef } from 'react';
import { resolveImage, ensureProtocol, placeholderDataUrl } from './lib/image';
import { formatPrice } from './lib/format';

const API = import.meta.env.VITE_API_URL;
export default function AllListings({ onBack }) {
    const [filterStatus, setFilterStatus] = useState('all');
    

    const [listings, setListings] = useState([]);
    const mountedRef = useRef(true);

    // dummy listings are provided by shared module (stable ids)

    useEffect(() => {
        mountedRef.current = true;
        fetch(`${API}/api/listings`)
            .then((r) => {
                if (!r.ok) throw new Error(`API returned ${r.status}`);
                return r.json();
            })
            .then((data) => {
                if (!mountedRef.current) return;
                setListings(data);
            })
                .catch((err) => {
                    console.error('Failed to load listings:', err);
                    // fallback to dummy sample listings when backend is down
                    setListings(getDummyListings());
                });
        return () => { mountedRef.current = false; };
    }, []);

    const filteredListings = filterStatus === 'all' 
        ? listings 
        : listings.filter(listing => listing.status === filterStatus);

    const getStatusBadge = (status) => {
        switch(status) {
            case 'under-contract':
                return { text: 'UNDER CONTRACT', color: 'bg-black' };
            case 'sold':
                return { text: 'SOLD', color: 'bg-gray-800' };
            case 'active':
                return { text: 'ACTIVE', color: 'bg-green-600' };
            default:
                return { text: 'ACTIVE', color: 'bg-green-600' };
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header onBack={onBack} light={true} />

            {/* Hero Section with Background Image */}
            <section className="relative h-[80vh]">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                        backgroundImage: "url('https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg')"
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
                    <div className="max-w-4xl">
                        <p className="text-sm tracking-[0.3em] mb-4 uppercase font-light">Exclusive Properties</p>
                        <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
                            Our Premium
                            <br />
                            <span className="relative inline-block mt-2">
                                Listings
                                <span className="absolute bottom-2 left-0 w-full h-4 bg-yellow-400 opacity-40 -z-10"></span>
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed opacity-90">
                            Browse our curated collection of luxury properties or contact us to schedule a private showing
                        </p>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="bg-gray-50 py-8 px-6 border-b border-gray-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-serif text-gray-900">All Properties</h2>
                        <p className="text-sm text-gray-600 mt-1">{filteredListings.length} {filteredListings.length === 1 ? 'Property' : 'Properties'} Available</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-6 py-2 text-sm tracking-wide transition-all ${
                                filterStatus === 'all' 
                                    ? 'bg-black text-white' 
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-black'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus('active')}
                            className={`px-6 py-2 text-sm tracking-wide transition-all ${
                                filterStatus === 'active' 
                                    ? 'bg-black text-white' 
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-black'
                            }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilterStatus('under-contract')}
                            className={`px-6 py-2 text-sm tracking-wide transition-all ${
                                filterStatus === 'under-contract' 
                                    ? 'bg-black text-white' 
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-black'
                            }`}
                        >
                            Under Contract
                        </button>
                        <button
                            onClick={() => setFilterStatus('sold')}
                            className={`px-6 py-2 text-sm tracking-wide transition-all ${
                                filterStatus === 'sold' 
                                    ? 'bg-black text-white' 
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-black'
                            }`}
                        >
                            Sold
                        </button>
                    </div>
                </div>
            </section>

            {/* Listings Grid */}
            <main className="max-w-7xl mx-auto py-16 px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredListings.map((listing, idx) => {
                        const statusBadge = getStatusBadge(listing.status);
                        const idValue = listing._id || listing.id || idx;
                        if (!listing.image && (!listing.images || listing.images.length === 0)) {
                            console.warn('Listing missing image, using placeholder:', idValue);
                        }
                        return (
                            <article key={idValue} className="bg-white group overflow-hidden" style={{ transform: 'translateZ(0)' }}>
                                <Link to={idValue ? `/listing/${idValue}` : '#'} className="block">
                                    <div className="relative overflow-hidden h-80" style={{ transform: 'translateZ(0)' }}>
                                        <img
                                            src={ensureProtocol(resolveImage(listing.image || (listing.images && listing.images[0]) || placeholderDataUrl()))}
                                            alt={listing.title}
                                            loading="lazy"
                                            decoding="async"
                                            draggable={false}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderDataUrl(); }}
                                        />
                                        <span className={`absolute top-4 right-4 ${statusBadge.color} text-white text-xs font-medium px-4 py-2 tracking-[0.2em]`}>
                                            {statusBadge.text}
                                        </span>
                                    </div>
                                </Link>

                                <div className="py-6">
                                    <h3 className="text-2xl font-serif text-gray-900 mb-3">
                                        {listing.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 mb-4">
                                        {listing.address}
                                    </p>

                                    <p className="text-sm text-gray-600 mb-6">
                                        {listing.beds} Beds | {listing.baths} Baths | {listing.sqft} Sq.Ft.
                                    </p>

                                    <p className="text-3xl font-serif text-gray-900 mb-6">{formatPrice(listing.price)}</p>

                                    <Link to={idValue ? `/listing/${idValue}` : '#'} className="text-sm underline text-gray-900 hover:text-gray-600 transition-colors">
                                        More Details
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {filteredListings.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No properties found in this category.</p>
                    </div>
                )}
            </main>

            {/* Work With Me Section */}
            <section className="relative h-screen">
                <div className="absolute inset-0">
                    <img
                        src={'/images/workwithme.png'}
                        alt="Philip profile"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 25%' }}
                        draggable={false}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40" />
                </div>
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
                    <div className="max-w-3xl">
                        <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">
                            Work With Me
                        </h2>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10">
                            I love real estate. I strive to share this passion with my clients and will use my wealth of experience to help you realize your own dreams for your home, family and asset growth.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
                            className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                        >
                            Contact Me
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}