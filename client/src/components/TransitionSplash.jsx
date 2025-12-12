import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function TransitionSplash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let t = null;
    const play = () => {
      // restart
      setShow(false);
      // small delay to allow re-render when retriggering quickly
      setTimeout(() => setShow(true), 20);
      // hide after animation duration
      clearTimeout(t);
      t = setTimeout(() => setShow(false), 900);
    };

    const onStart = () => play();
    window.addEventListener('startPageLoad', onStart);

    // also observe body class fallback
    const moCallback = () => {
      if (document.body.classList.contains('force-page-loading')) play();
    };
    const mo = new MutationObserver(moCallback);
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('startPageLoad', onStart);
      mo.disconnect();
      clearTimeout(t);
    };
  }, []);

  if (!show) return null;

  const splash = (
    <div className="transition-splash-overlay fixed inset-0 pointer-events-none z-[100000]">
      <div className="splash-center" aria-hidden />
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(splash, document.body);
}
