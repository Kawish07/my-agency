import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rafRef = useRef(null);
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const target = useRef({ x: pos.current.x, y: pos.current.y });
  const [enabled, setEnabled] = useState(true);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // disable on touch devices
    const onTouch = () => setEnabled(false);
    window.addEventListener('touchstart', onTouch, { passive: true });

    const onMove = (e) => {
      const ev = e.touches ? e.touches[0] : e;
      target.current.x = ev.clientX;
      target.current.y = ev.clientY;
      // position dot immediately for pointer events
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${ev.clientX}px, ${ev.clientY}px, 0)`;
    };

    const onEnterInteractive = () => setHovering(true);
    const onLeaveInteractive = () => setHovering(false);

    window.addEventListener('mousemove', onMove);
    // enlarge cursor on hover for interactive elements
    document.querySelectorAll('a, button, input, textarea, select, [role="button"]').forEach((el) => {
      el.addEventListener('mouseenter', onEnterInteractive);
      el.addEventListener('mouseleave', onLeaveInteractive);
    });

    const loop = () => {
      // smooth follow
      pos.current.x += (target.current.x - pos.current.x) * 0.16;
      pos.current.y += (target.current.y - pos.current.y) * 0.16;
      const x = pos.current.x;
      const y = pos.current.y;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x - 18}px, ${y - 18}px, 0) scale(${hovering ? 1.45 : 1})`;
        ringRef.current.style.opacity = hovering ? '0.95' : '0.7';
      }
      // Keep the small dot sharp
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('mousemove', onMove);
      document.querySelectorAll('a, button, input, textarea, select, [role="button"]').forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
      });
      cancelAnimationFrame(rafRef.current);
    };
  }, [hovering]);

  if (!enabled) return null;

  const cursor = (
    <div aria-hidden className="pointer-events-none">
      <div ref={ringRef} className={`custom-cursor-ring`} />
      <div ref={dotRef} className={`custom-cursor-dot`} />
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(cursor, document.body);
}
