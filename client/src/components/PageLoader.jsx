import React from 'react';
import { createPortal } from 'react-dom';

export default function PageLoader({ open = false }) {
  if (!open) return null;

  const loader = (
    <div className="page-loader-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-black" aria-hidden>
      <div className="loader-inner text-center">
        {/* 3D Rotating Cube Loader */}
        <div className="loader-3d mb-8" aria-hidden>
          <div className="cube-scene">
            <div className="cube">
              <div className="cube-face cube-front"></div>
              <div className="cube-face cube-back"></div>
              <div className="cube-face cube-right"></div>
              <div className="cube-face cube-left"></div>
              <div className="cube-face cube-top"></div>
              <div className="cube-face cube-bottom"></div>
            </div>
          </div>
          
          {/* Orbiting particles */}
          <div className="particles-orbit">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
          </div>
          
          {/* Glow effect */}
          <div className="glow-orb"></div>
        </div>

        <div className="loader-text text-white">
          <h1 className="text-3xl md:text-4xl font-serif mb-3 text-white font-bold">
            Philip Parnanzone
          </h1>
          <p className="text-sm md:text-base text-white/70 tracking-wide">
            Bringing you market insights — loading…
          </p>
          
          {/* Progress bar */}
          <div className="progress-bar-container mt-6 w-64 mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="progress-bar h-full bg-white rounded-full"></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* 3D Cube Loader */
        .loader-3d {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 0 auto;
          perspective: 1000px;
        }

        .cube-scene {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }

        .cube {
          width: 80px;
          height: 80px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform-style: preserve-3d;
          animation: rotateCube 3s infinite ease-in-out;
          margin: -40px 0 0 -40px;
        }

        .cube-face {
          position: absolute;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.25));
          border: 2px solid rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          box-shadow: 
            0 0 20px rgba(255, 255, 255, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
        }

        .cube-front  { transform: rotateY(0deg) translateZ(40px); }
        .cube-back   { transform: rotateY(180deg) translateZ(40px); }
        .cube-right  { transform: rotateY(90deg) translateZ(40px); }
        .cube-left   { transform: rotateY(-90deg) translateZ(40px); }
        .cube-top    { transform: rotateX(90deg) translateZ(40px); }
        .cube-bottom { transform: rotateX(-90deg) translateZ(40px); }

        @keyframes rotateCube {
          0% { 
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          50% { 
            transform: rotateX(180deg) rotateY(180deg) rotateZ(90deg);
          }
          100% { 
            transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg);
          }
        }

        /* Orbiting Particles */
        .particles-orbit {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          animation: orbitRotate 4s linear infinite;
        }

        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          top: 50%;
          left: 50%;
        }

        .particle-1 {
          animation: orbit1 2s ease-in-out infinite;
        }
        .particle-2 {
          animation: orbit2 2s ease-in-out infinite 0.66s;
        }
        .particle-3 {
          animation: orbit3 2s ease-in-out infinite 1.32s;
        }

        @keyframes orbit1 {
          0%, 100% { 
            transform: translate(-4px, -60px) scale(1);
            opacity: 1;
          }
          50% { 
            transform: translate(-4px, 60px) scale(0.7);
            opacity: 0.5;
          }
        }

        @keyframes orbit2 {
          0%, 100% { 
            transform: translate(52px, 30px) scale(1);
            opacity: 1;
          }
          50% { 
            transform: translate(-52px, -30px) scale(0.7);
            opacity: 0.5;
          }
        }

        @keyframes orbit3 {
          0%, 100% { 
            transform: translate(-52px, 30px) scale(1);
            opacity: 1;
          }
          50% { 
            transform: translate(52px, -30px) scale(0.7);
            opacity: 0.5;
          }
        }

        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Glow Orb */
        .glow-orb {
          position: absolute;
          width: 140px;
          height: 140px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
          animation: pulseGlow 2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes pulseGlow {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.5;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
        }

        /* Text animations */
        .loader-text h1 { 
          animation: fadeUp 800ms ease both;
        }
        .loader-text p { 
          animation: fadeUp 1000ms ease both;
        }

        @keyframes fadeUp { 
          from { 
            opacity: 0; 
            transform: translateY(12px); 
          } 
          to { 
            opacity: 1; 
            transform: translateY(0); 
          } 
        }

        /* Progress bar */
        .progress-bar-container {
          animation: fadeUp 1200ms ease both;
        }

        .progress-bar {
          width: 0%;
          animation: progressLoad 2s ease-in-out infinite;
        }

        @keyframes progressLoad {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }

        /* General styles */
        .loader-inner { 
          max-width: 420px; 
          width: 100%; 
          padding: 36px 24px; 
        }
      `}</style>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(loader, document.body);
}