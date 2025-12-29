import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { X, Instagram, Facebook } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getLenis, subscribeToScroll } from "./lib/lenis";
import PageLoader from "./components/PageLoader";
import TransitionSplash from "./components/TransitionSplash";
import FloatingCTA from "./components/FloatingCTA";

export default function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupSubmitted, setPopupSubmitted] = useState(false);
  const [showLeftPopup, setShowLeftPopup] = useState(false);
  const [leftSubmitted, setLeftSubmitted] = useState(false);
  const [leftAnimating, setLeftAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "",
    message: "",
    bestTime: "",
  });
  const [leftLoading, setLeftLoading] = useState(false);
  const [leftError, setLeftError] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const hasShownPopup = useRef(false);
  const [showHeader, setShowHeader] = useState(true);
  const isInitialMount = useRef(true); // Track if this is the first mount

  const location = useLocation();

  // Scroll handling for popup and header
  useEffect(() => {
    lastScrollY.current = typeof window !== "undefined" ? window.scrollY : 0;

    const handleScroll = (currentScrollY) => {
      // Show popup after scrolling past hero section
      if (!hasShownPopup.current && currentScrollY > 600) {
        setShowPopup(true);
        hasShownPopup.current = true;
      }

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const delta = currentScrollY - lastScrollY.current;
          if (delta > 10) {
            setShowHeader(false);
          } else if (delta < -10) {
            setShowHeader(true);
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    const unsubscribe = subscribeToScroll(handleScroll);
    return () => {
      try { unsubscribe && unsubscribe(); } catch (e) { /* noop */ }
    };
  }, []);

  // Handle scroll to anchor from navigation state
  useEffect(() => {
    try {
      const target = location && location.state && location.state.scrollTo;
      if (target && typeof target === "string" && target.startsWith("#")) {
        const lenis = getLenis();
        const doScroll = () => {
          const el = document.querySelector(target);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            if (lenis && typeof lenis.scrollTo === "function") {
              lenis.scrollTo(top, { immediate: false });
            } else {
              window.scrollTo({ top, behavior: "smooth" });
            }
          }
          window.history.replaceState({}, "", target);
        };
        setTimeout(doScroll, 120);
      }
    } catch (e) {
      // noop
    }
  }, [location]);

  // INITIAL PAGE LOAD - Only runs once when app first mounts
  useEffect(() => {
    const onLoad = () => {
      setTimeout(() => setGlobalLoading(false), 1000);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // ROUTE CHANGES - Only runs on subsequent route changes, NOT initial mount
  useEffect(() => {
    // Skip the effect on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Show loader for route changes
    setGlobalLoading(true);
    const t = setTimeout(() => setGlobalLoading(false), 1100);
    return () => clearTimeout(t);
  }, [location.pathname]);

  // LINK CLICKS - Show loader immediately when clicking internal links
  useEffect(() => {
    const onDocClick = (e) => {
      try {
        const el = e.target && e.target.closest && e.target.closest("a");
        if (!el) return;
        const href = el.getAttribute("href");
        if (!href) return;
        // resolve relative URLs and ignore clicks that point to the current page
        try {
          const targetUrl = new URL(href, window.location.href);
          const currentUrl = new URL(window.location.href);
          const samePath =
            targetUrl.pathname === currentUrl.pathname &&
            targetUrl.search === currentUrl.search;
          if (samePath) return; // clicking a link to the same page (e.g., logo) — don't show loader
        } catch (e) {
          // ignore URL parse errors and continue
        }
        if (href.startsWith("#")) return;
        if (el.target === "_blank" || el.hasAttribute("download")) return;
        if (href.startsWith("http") && !href.startsWith(window.location.origin))
          return;

        // Internal navigation — show loader immediately
        setGlobalLoading(true);
      } catch (err) {
        // noop
      }
    };

    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, []);

  // BROWSER BACK/FORWARD - Show loader on popstate
  useEffect(() => {
    const onPop = () => {
      setGlobalLoading(true);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Listen for explicit startPageLoad events (from Header)
  useEffect(() => {
    const onStart = () => setGlobalLoading(true);
    window.addEventListener("startPageLoad", onStart);
    return () => window.removeEventListener("startPageLoad", onStart);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // basic validation
    if (!formData.name || !formData.email)
      return alert("Please provide name and email");
    try {
      const FORMSPREE_POPUP = 'https://formspree.io/f/xgoerdvr';

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        consent: !!formData.consent,
        message: formData.message || "",
        source: "homepage-popup",
      };

      const fsReq = fetch(FORMSPREE_POPUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const backendReq = fetch(`${API}/api/popup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const results = await Promise.allSettled([fsReq, backendReq]);
      const fsResult = results[0];
      const backendResult = results[1];

      const fsOk = fsResult.status === 'fulfilled' && fsResult.value && fsResult.value.ok;
      const backendOk = backendResult.status === 'fulfilled' && backendResult.value && backendResult.value.ok;

      if (!fsOk && !backendOk) {
        let msg = 'Failed to submit. Please try again later.';
        if (fsResult.status === 'fulfilled' && fsResult.value && !fsResult.value.ok) {
          try { msg = await fsResult.value.text(); } catch (e) { /* ignore */ }
        }
        throw new Error(msg);
      }

      setPopupSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        interest: "",
        message: "",
        bestTime: "",
        consent: false,
      });
    } catch (err) {
      console.error("Popup submit failed", err);
      alert("Failed to submit. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [featuredListing, setFeaturedListing] = useState(null);
  const FORMSPREE_LETS = 'https://formspree.io/f/xykylogp';

  // Fetch latest listing for featured section
  useEffect(() => {
    let mounted = true;
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API}/api/listings`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        // server returns sorted by createdAt desc, so first is latest
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedListing(data[0]);
        }
      } catch (e) {
        // noop
      }
    };
    fetchFeatured();
    return () => {
      mounted = false;
    };
  }, [API]);
  const handleLeftSubmit = async (e) => {
    e.preventDefault();
    setLeftError(null);
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.interest ||
      !formData.bestTime
    ) {
      setLeftError(
        "Please complete all required fields and select a preferred date/time."
      );
      return;
    }
    setLeftLoading(true);
    try {
      // Prepare payload
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bestTime: formData.bestTime,
        timezone: "ET",
        interest: formData.interest,
      };

      // Submit to Formspree (email) and backend (persist) in parallel
      const fsReq = fetch(FORMSPREE_LETS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const backendReq = fetch(`${API}/api/letsconnect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const results = await Promise.allSettled([fsReq, backendReq]);
      const fsResult = results[0];
      const backendResult = results[1];

      const fsOk = fsResult.status === 'fulfilled' && fsResult.value && fsResult.value.ok;
      const backendOk = backendResult.status === 'fulfilled' && backendResult.value && backendResult.value.ok;

      if (!fsOk && !backendOk) {
        let msg = 'Failed to submit. Please try again.';
        if (fsResult.status === 'fulfilled' && fsResult.value && !fsResult.value.ok) {
          try { msg = await fsResult.value.text(); } catch (e) { /* ignore */ }
        }
        throw new Error(msg);
      }

      setLeftSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        interest: "",
        bestTime: "",
      });
    } catch (err) {
      console.error("LetsConnect submit failed", err);
      setLeftError("Failed to submit. Please try again.");
    } finally {
      setLeftLoading(false);
    }
  };

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
        setVideoPlaying(false);
      } else {
        videoRef.current.play();
        setVideoPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PageLoader open={globalLoading} />
      <TransitionSplash />
      <Header />

      {/* Hero Section */}
      <section id="hero" className="relative">
        <div className="grid md:grid-cols-2 h-[90vh]">
          <div className="relative h-full overflow-hidden">
            <img
              src="images/newhomepagehero.jpg"
              alt="Philip Parnanzone"
              className="hero-image w-full h-full object-cover transform -translate-y-6 md:-translate-y-10 scale-105"
            />
            <div className="absolute bottom-8 left-8 flex space-x-3">
              <a
                href="https://www.instagram.com/theagency.ottawa/?hl=en"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
              >
                <Instagram className="w-5 h-5 text-black" />
              </a>
              <a
                href="https://www.facebook.com/parnanzonerealty/"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
              >
                <Facebook className="w-5 h-5 text-black" />
              </a>
            </div>
          </div>
          <div className="hero-right flex flex-col justify-start mt-20 md:mt-28 pt-16 md:pt-20 pb-6 px-12 md:px-20 bg-white h-full relative overflow-hidden">
            <div className="absolute right-8 md:right-20 bottom-6 text-gray-100 text-8xl md:text-9xl font-serif font-bold opacity-10 pointer-events-none z-0">
              Philip
            </div>

            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl font-serif mb-3 text-black">
                <span className="relative inline-block">
                  Philip
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-200 opacity-60 -z-10"></span>
                </span>
                Parnanzone
              </h1>
              <div className="mb-8 relative">
                <h2 className="text-2xl md:text-3xl font-light text-gray-700 tracking-[0.3em] uppercase">
                  Broker
                </h2>
                <div className="w-24 h-1 bg-yellow-400 mt-3"></div>
              </div>
              <p className="text-base leading-relaxed mb-5 text-gray-800 max-w-lg">
                Philip Parnanzone brings unparalleled dedication and savvy
                negotiation to every real estate goal, turning first-time buyers
                and seasoned investors alike into confident homeowners across
                Ottawa and beyond, all with a keen local insight and a personal
                touch.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("openContactModal"))
                  }
                  className="px-8 py-3 bg-black text-white hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-all duration-300 font-medium inline-flex items-center justify-center"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Black Bar */}
        <div className="bg-black text-white py-6 md:py-8 px-8 -mt-4 md:-mt-6 z-10 relative">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <div className="flex items-center space-x-2 text-xs md:text-sm">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-center font-bold">
                We are committed to upholding the principles of all applicable
              </span>
              <a
                href="https://www.nar.realtor/fair-housing/what-everyone-should-know-about-equal-opportunity-housing"
                className="underline hover:opacity-80 transition-opacity font-medium whitespace-nowrap"
              >
                fair housing laws
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Philip Scheinfeld Team Section */}
      <section
        id="team"
        className="relative py-20 px-6 bg-gradient-to-br from-gray-200 to-gray-100 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"></div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] mb-6 text-gray-800 font-light">
            UNPARALLELED MARKETING. WHITE GLOVE SERVICE.
          </p>
          <div className="w-16 h-px bg-gray-800 mx-auto mb-6"></div>
          <h2 className="text-5xl md:text-6xl font-light mb-3 tracking-[0.4em] text-black">
            Philip Parnanzone
          </h2>
          <div className="mb-8 relative">
            <h2 className="text-2xl md:text-3xl font-light text-gray-700 tracking-[0.3em] uppercase">
              Broker
            </h2>
          </div>
          <p className="text-base leading-relaxed mb-16 max-w-5xl mx-auto text-gray-800">
            Driven by a commitment to excellence, Philip Parnanzone serves a
            steadily growing network of buyers, sellers, investors, and
            relocating families across Ottawa and the surrounding markets.
            Philip is known for delivering clear, data-backed real estate
            insight paired with an unwavering dedication to client success. His
            approach blends strategic marketing, sharp market intelligence, and
            a concierge level service experience, making it easy to see why
            clients consistently choose Philip to lead their most important real
            estate decisions.
          </p>
          <div className="grid md:grid-cols-3 gap-12 mt-16">
            <div>
              <h3 className="text-3xl font-light mb-4 tracking-wider">
                Top-Tier Local Expertise
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Recognized for deep market knowledge and exceptional negotiation
                skills.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-light mb-4 tracking-wider">
                Hundreds of Successful Client Relationships
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Built on trust, transparency, and a client-first philosophy.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-light mb-4 tracking-wider">
                Record-Level Client Satisfaction
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                A reputation defined by results, professionalism, and consistent
                performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listing Section (shows latest listing dynamically) */}
      <section id="listings" className="py-20 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-0">
          <div className="relative">
            <img
              src={
                featuredListing &&
                featuredListing.images &&
                featuredListing.images.length
                  ? featuredListing.images[0]
                  : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=800&fit=crop"
              }
              alt={
                featuredListing
                  ? featuredListing.title ||
                    featuredListing.address ||
                    "Featured Property"
                  : "Featured Property"
              }
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-12 py-16">
            <p className="text-sm tracking-widest mb-4">Featured Listing</p>
            <h2 className="text-4xl font-serif mb-6">
              {featuredListing
                ? featuredListing.address || featuredListing.title
                : "2440 64th Ave SE, Mercer Island 98040"}
            </h2>
            <p className="text-3xl mb-6">
              {featuredListing
                ? `$${Number(featuredListing.price || 0).toLocaleString()}`
                : "$1,650,000"}
            </p>
            <div className="flex space-x-6 text-sm mb-8">
              <span>
                {featuredListing
                  ? `${featuredListing.beds || 0} Beds`
                  : "3 Beds"}
              </span>
              <span>|</span>
              <span>
                {featuredListing
                  ? `${featuredListing.baths || 0} Baths`
                  : "2 Baths"}
              </span>
              <span>|</span>
              <span>
                {featuredListing
                  ? `${
                      featuredListing.livingArea ||
                      featuredListing.sqft ||
                      "N/A"
                    } Sq.Ft.`
                  : "1,770 Sq.Ft."}
              </span>
            </div>
            <div className="flex space-x-4">
              {featuredListing ? (
                <Link
                  to={`/listing/${featuredListing._id}`}
                  className="px-8 py-3 bg-white text-black hover:bg-gray-100 transition-colors"
                >
                  View Listing
                </Link>
              ) : (
                <button className="px-8 py-3 bg-white text-black hover:bg-gray-100 transition-colors">
                  View Listing
                </button>
              )}
              <Link
                to="/all-listings"
                className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-colors inline-flex items-center justify-center"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      <section id="video" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-8">About Me</h2>
            <p className="text-base leading-relaxed mb-8 text-gray-700">
              As a trusted Ottawa real estate professional, Philip Parnanzone
              has built a strong track record guiding clients through a wide
              range of transactions, from single-family homes and urban condos
              to investment properties and relocations. Follow Philip for market
              insights, expert advice, and the latest real estate updates across
              Ottawa and its surrounding communities!e Seattle & Eastside area!
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/theagency.ottawa/?hl=en"
                className="w-10 h-10 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/parnanzonerealty/"
                className="w-10 h-10 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="relative" style={{ paddingBottom: "110%" }}>
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
              poster="/images/philipnewimage2.jpg"
              onClick={handleVideoPlay}
            >
              <source src="/videos/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {!videoPlaying && (
              <button
                onClick={handleVideoPlay}
                className="absolute inset-0 flex items-center justify-center group cursor-pointer bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
              >
                <div className="relative">
                  {/* Ripple effect ring */}
                  <div className="absolute inset-0 w-20 h-20 -left-2 -top-2 bg-white rounded-full opacity-30 animate-ripple"></div>

                  {/* Play button */}
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 shadow-lg relative z-10">
                    <svg
                      className="w-6 h-6 ml-1 text-black"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </button>
            )}

            {videoPlaying && (
              <button
                onClick={handleVideoPlay}
                className="absolute top-4 right-4 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center transition-all duration-300 z-10"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating Bottom CTA (portal-mounted) */}
      <FloatingCTA
        onClick={() => {
          setShowLeftPopup(true);
          setTimeout(() => setLeftAnimating(true), 10);
        }}
      />

      {/* Left anchored modal triggered by CTA (portal-mounted to avoid stacking context issues) */}
      {showLeftPopup &&
        createPortal(
          <div className="fixed inset-0 z-[110002]">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => {
                setLeftAnimating(false);
                setTimeout(() => {
                  setShowLeftPopup(false);
                  setLeftSubmitted(false);
                }, 300);
              }}
            />

            <div
              className={`fixed left-8 bottom-24 w-[320px] md:w-[420px] bg-[#0b0b0b] text-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 z-[110003] ${
                leftAnimating
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              <div className="flex items-start justify-between px-6 pt-6">
                <h3 className="text-2xl font-serif">Leave a Message</h3>
                <button
                  onClick={() => {
                    setLeftAnimating(false);
                    setTimeout(() => {
                      setShowLeftPopup(false);
                      setLeftSubmitted(false);
                    }, 300);
                  }}
                  className="bg-white bg-opacity-5 p-1 rounded hover:bg-opacity-10 transition"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="px-6 py-4">
                {!leftSubmitted ? (
                  <form onSubmit={handleLeftSubmit} className="space-y-4">
                    <div>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Full Name"
                        className="w-full px-3 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/10 transition-colors duration-200 hover:border-white"
                      />
                    </div>
                    <div>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Email"
                        className="w-full px-3 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/10 transition-colors duration-200 hover:border-white"
                      />
                    </div>
                    <div>
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Phone"
                        className="w-full px-3 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/10 transition-colors duration-200 hover:border-white"
                      />
                    </div>
                    <div className="relative">
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleInputChange}
                        required
                        className="appearance-none w-full px-3 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/10 transition-colors duration-200 hover:border-white"
                      >
                        <option value="" disabled>
                          Interested in...
                        </option>
                        <option value="buying">Buying</option>
                        <option value="selling">Selling</option>
                        <option value="renting">Renting</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-white mb-2">
                        Best time to get in touch (Eastern Time Zone)
                      </label>
                      <input
                        name="bestTime"
                        type="datetime-local"
                        value={formData.bestTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/10 transition-colors duration-200 hover:border-white"
                      />
                    </div>

                    {leftError && (
                      <p className="text-red-400 text-sm">{leftError}</p>
                    )}

                    <div className="flex items-start space-x-3">
                      <input
                        id="left-consent"
                        required
                        type="checkbox"
                        className="w-4 h-4 mt-1 accent-white bg-transparent"
                      />
                      <label
                        htmlFor="left-consent"
                        className="text-xs text-white leading-relaxed"
                      >
                        By providing your contact information, you agree to our{" "}
                        <a href="#" className="underline">
                          Privacy Policy
                        </a>{" "}
                        and consent to receiving marketing communications.
                      </label>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={leftLoading}
                        className="w-full bg-white text-black py-3 rounded font-semibold hover:bg-gray-100 hover:shadow-xl transform transition-all duration-200 disabled:opacity-50"
                      >
                        {leftLoading ? "SENDING..." : "Submit"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="mb-4">Thanks — we'll be in touch shortly.</p>
                    <button
                      onClick={() => {
                        setLeftAnimating(false);
                        setTimeout(() => {
                          setShowLeftPopup(false);
                          setLeftSubmitted(false);
                        }, 300);
                      }}
                      className="px-6 py-2 border rounded hover:bg-white hover:text-black transition"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Popup Modal */}
      {showPopup && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            showPopup ? "animate-fadeIn" : ""
          }`}
        >
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-500 ${
              showPopup ? "bg-opacity-60" : "bg-opacity-0"
            }`}
            onClick={() => setShowPopup(false)}
          />
          <div
            className={`relative max-w-6xl w-full shadow-2xl rounded-lg overflow-hidden transform transition-all duration-700 ease-out ${
              showPopup
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-90 opacity-0 translate-y-8"
            } ${popupSubmitted ? "bg-white" : ""}`}
            style={{
              backgroundColor: popupSubmitted ? "#ffffff" : "#141414",
              maxHeight: "600px",
            }}
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 hover:rotate-90"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            <div className="grid md:grid-cols-5" style={{ height: "600px" }}>
              {/* Left Side - Image */}
              <div className="relative h-64 md:h-auto overflow-hidden md:col-span-2">
                <img
                  src={
                    popupSubmitted
                      ? "https://images.pexels.com/photos/2387624/pexels-photo-2387624.jpeg"
                      : "https://images.pexels.com/photos/2387624/pexels-photo-2387624.jpeg"
                  }
                  alt="Luxury Property"
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    popupSubmitted ? "scale-110" : "scale-100"
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-700 ${
                    popupSubmitted ? "opacity-30" : "opacity-60"
                  }`}
                />
              </div>

              {/* Right Side - Scrollable Content */}
              <div
                className={`p-8 md:p-10 flex flex-col transition-all duration-700 md:col-span-3 overflow-y-auto bg-white`}
                style={{ maxHeight: "600px" }}
              >
                {!popupSubmitted ? (
                  <div className="animate-slideInRight">
                    <h2 className="text-3xl md:text-4xl font-light mb-3 text-black tracking-wide">
                      NOT READY TO START YOUR SEARCH YET?
                    </h2>
                    <p className="text-gray-700 mb-8 text-base leading-relaxed">
                      No worries! We can keep you up to date on the market and
                      add you to a curated Compass Collection.
                    </p>

                    <form
                      onSubmit={handleFormSubmit}
                      className="space-y-5 mb-6"
                    >
                      <div>
                        <label className="block text-xs text-black mb-2 tracking-wide font-medium">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all"
                          placeholder=""
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-black mb-2 tracking-wide font-medium">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all"
                          placeholder=""
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-black mb-2 tracking-wide font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all"
                          placeholder=""
                        />
                      </div>

                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="consent"
                          required
                          className="mt-1 w-4 h-4 border-gray-300"
                        />
                        <label
                          htmlFor="consent"
                          className="text-xs text-gray-700 leading-relaxed"
                        >
                          By providing The Philip Parnanzone your contact
                          information, you acknowledge and agree to our{" "}
                          <a href="#" className="underline hover:text-black">
                            Privacy Policy
                          </a>{" "}
                          and consent to receiving marketing communications,
                          including through automated calls, texts, and emails,
                          some of which may use artificial or prerecorded
                          voices. This consent isn't necessary for purchasing
                          any products or services and you may opt out at any
                          time. To opt out from texts, you can reply, 'stop' at
                          any time. To opt out from emails, you can click on the
                          unsubscribe link in the emails. Message and data rates
                          may apply.
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-black text-white font-semibold tracking-widest hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                      >
                        SUBSCRIBE NOW
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="text-center animate-fadeInUp flex flex-col justify-center h-full">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-scaleIn">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-serif mb-4 text-black">
                      Thank You!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      We've received your information and will be in touch
                      shortly with exclusive property updates.
                    </p>
                    <button
                      onClick={() => setShowPopup(false)}
                      className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-medium mx-auto"
                    >
                      Continue Exploring
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
