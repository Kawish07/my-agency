import React from 'react';
import { createPortal } from 'react-dom';

export default function FloatingCTA({ onClick }) {
    if (typeof document === 'undefined') return null;

    const handleClick = (e) => {
        // ensure clicks aren't swallowed by capture listeners or overlays
        e.stopPropagation();
        e.preventDefault && e.preventDefault();
        if (typeof onClick === 'function') onClick(e);
    };

    return createPortal(
        <div className="fixed bottom-6 left-6 md:left-8 z-[110000] pointer-events-auto">
            <button
                onClick={handleClick}
                aria-label="Lets connect"
                className="bg-white px-6 py-3 rounded-full shadow-lg text-sm tracking-wide hover:shadow-xl transition-shadow flex items-center space-x-2 border border-gray-200"
            >
                <span>LET'S CONNECT</span>
                <span className="text-xs">↑</span>
            </button>
        </div>,
        document.body
    );
}
