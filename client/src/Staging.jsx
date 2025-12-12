import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
// BeforeAfterSlider Component
const BeforeAfterSlider = ({ before, after, title }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMove = (clientX) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e) => {
        if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX);
        }
    };

    return (
        <div className="mb-20">
            <h2 className="text-3xl font-light text-center mb-8">{title}</h2>

            <div
                ref={containerRef}
                className="relative w-full h-[500px] md:h-[600px] overflow-hidden cursor-ew-resize select-none rounded-lg shadow-xl"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
            >
                {/* Before Image (Empty Room) - Base Layer */}
                <div className="absolute inset-0">
                    <img
                        src={before}
                        alt="Before staging"
                        className="w-full h-full object-cover"
                        draggable="false"
                    />
                </div>

                {/* After Image (Staged Room with Furniture) - Reveals as you drag right */}
                <div
                    className="absolute inset-0 top-0 left-0 overflow-hidden"
                    style={{
                        width: `${sliderPosition}%`
                    }}
                >
                    <img
                        src={after}
                        alt="After staging"
                        className="h-full object-cover"
                        style={{
                            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw',
                            maxWidth: 'none'
                        }}
                        draggable="false"
                    />
                </div>

                {/* Slider Line */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-black shadow-lg cursor-ew-resize z-10"
                    style={{ left: `${sliderPosition}%` }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                >
                    {/* Slider Handle */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-black rounded-full shadow-2xl flex items-center justify-center border-4 border-white">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Properties Data
const properties = [
    {
        title: 'Elegant Living Room Transformation',
        before: 'images/Living Room.jpeg', // Empty bedroom
        after: 'images/living room after.jpeg'
    }
];

// Main Staging Component
export default function Staging() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative">
                <div className="grid md:grid-cols-2 h-[100vh] md:h-[100vh]">
                    <div className="h-full">
                        <div
                            className="h-full bg-cover bg-center"
                            style={{ backgroundImage: `url('images/Philip_ottawa.png')` }}
                        />
                    </div>
                    <div className="flex items-center justify-center bg-white p-12">
                        <div className="max-w-2xl">
                            <p className="text-sm tracking-[0.3em] mb-6 text-gray-700 font-light">BEFORE & AFTER</p>
                            <h1 className="text-4xl md:text-5xl font-serif mb-6">Staging Before & After</h1>
                            <p className="text-base text-gray-700 leading-relaxed">
                                Our Concierge enables us to transform properties in preparation for listing - the magic behind achieving the highest prices for our sellers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Sliders Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    {properties.map((property, index) => (
                        <BeforeAfterSlider
                            key={index}
                            before={property.before}
                            after={property.after}
                            title={property.title}
                        />
                    ))}
                </div>
            </section>
            {/* CTA Section */}
            <section className="bg-black py-20 text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-light mb-6">Ready to Transform Your Space?</h2>
                    <p className="text-gray-300 mb-8 text-lg">
                        Let us help you showcase your property's full potential with professional staging services.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
                        className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        Get Started Today
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}