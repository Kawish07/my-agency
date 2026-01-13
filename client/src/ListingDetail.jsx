import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import { Instagram, Facebook } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDummyListing } from './data/dummyListings';
import { resolveImage, ensureProtocol, placeholderDataUrl } from './lib/image';
import { formatPrice } from './lib/format';

const API = import.meta.env.VITE_API_URL;

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const openPreview = (index = 0) => {
    setPreviewIndex(index || 0);
    setPreviewOpen(true);
  };

  const closePreview = () => setPreviewOpen(false);

  const showNext = (e) => {
    e && e.stopPropagation();
    const imgs = ((listing.images && listing.images.length) ? listing.images : (listing.image ? [listing.image] : []));
    setPreviewIndex((i) => (i + 1) % imgs.length);
  };

  const showPrev = (e) => {
    e && e.stopPropagation();
    const imgs = ((listing.images && listing.images.length) ? listing.images : (listing.image ? [listing.image] : []));
    setPreviewIndex((i) => (i - 1 + imgs.length) % imgs.length);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/listings/${id}`)
      .then((r) => {
        if (!r.ok) {
          throw new Error(`Server returned ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load listing:', err);
        const dummy = getDummyListing(id);
        if (dummy) {
          setListing(dummy);
        } else {
          setListing(null);
        }
        setLoading(false);
      });
  }, [id]);

  // handle Escape to close preview
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closePreview();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    if (previewOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [previewOpen, listing]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!listing) return <div className="min-h-screen flex items-center justify-center">Listing not found.</div>;
  return (
    <div className="min-h-screen bg-white">
      <Header light={true} />

      {/* Hero image */}
      <section className="relative h-[80vh]">
        <img
          src={ensureProtocol(resolveImage(listing.image || (listing.images && listing.images[0]) || placeholderDataUrl()))}
          alt={listing.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderDataUrl(); }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative z-10 h-full flex items-end pb-12 px-6">
          <div className="max-w-6xl mx-auto text-white">
            <p className="text-sm tracking-[0.3em] mb-2 uppercase font-light">Featured Listing</p>
            <h1 className="text-4xl md:text-5xl font-serif mb-2">{listing.title}</h1>
            <p className="text-lg">{formatPrice(listing.price)} | {listing.address}</p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 gap-12">
            <div>
              <img
                src={ensureProtocol(resolveImage((listing.images && listing.images[0]) || listing.image || placeholderDataUrl()))}
                alt={listing.title}
                className="w-full h-[500px] object-cover rounded-sm cursor-pointer"
                onClick={() => openPreview(0)}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderDataUrl(); }}
              />

              {/* gallery - show all provided images (up to 12) */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {((listing.images && listing.images.length) ? listing.images : (listing.image ? [listing.image] : [])).slice(0,12).map((src, i) => (
                  <img
                    key={i}
                    src={ensureProtocol(resolveImage(src || placeholderDataUrl(400,225)))}
                    alt={`gallery-${i}`}
                    className="w-full h-24 object-cover rounded cursor-pointer"
                    onClick={() => openPreview(i)}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderDataUrl(400,225); }}
                  />
                ))}
              </div>
            </div>

          <div>
            <div className="flex items-center gap-4 mb-4">
              {listing.agentPhoto ? (
                <img src={listing.agentPhoto} alt={listing.agent} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">A</div>
              )}
              <div>
                <p className="text-base font-medium">{listing.agent}</p>
                <p className="text-xs text-gray-400">MLS: {listing.mls}</p>
              </div>
            </div>

            <h2 className="text-3xl font-serif mb-2">{listing.title}</h2>
            <p className="text-2xl font-serif text-gray-900 mb-4">{formatPrice(listing.price)}</p>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{listing.description}</p>
            {listing.requestInfo !== false && (
              <button onClick={() => setContactOpen(true)} className="bg-black text-white px-8 py-3 mb-6 hover:bg-gray-800 transition-colors">
                Request Info
              </button>
            )}

            {/* Share section */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-medium">Share:</span>
              <a href="https://www.instagram.com/theagency.ottawa/?hl=en" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/parnanzonerealty/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                <Facebook className="w-4 h-4" />
              </a>
            </div>

            {/* LET'S CONNECT */}
            <div className="mb-8">
              <button onClick={() => setContactOpen(true)} className="flex items-center gap-2 text-sm tracking-wider uppercase font-medium">
                <span>LET'S CONNECT</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="border-t-2 border-gray-200 pt-6">
                <p className="text-3xl font-serif mb-1">{listing.status}</p>
                <p className="text-xs text-gray-500">Status</p>
              </div>
              <div className="border-t-2 border-gray-200 pt-6">
                <p className="text-3xl font-serif mb-1">{listing.totalBedrooms || listing.beds}</p>
                <p className="text-xs text-gray-500">Bedrooms</p>
              </div>
              <div className="border-t-2 border-gray-200 pt-6">
                <p className="text-3xl font-serif mb-1">{listing.totalBathrooms || listing.baths}</p>
                <p className="text-xs text-gray-500">Bathrooms</p>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6 mb-8">
              <p className="text-3xl font-serif mb-1">{listing.livingArea || listing.sqft}</p>
              <p className="text-xs text-gray-500">Living Area</p>
            </div>
          </div>
        </div>

        {/* Features & Amenities */}
        <div className="mt-16">
          <h2 className="text-3xl font-serif mb-12">Features & Amenities</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-serif mb-6">Area & Lot</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="text-sm text-gray-700">{listing.status}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm font-medium">Living Space:</span>
                  <span className="text-sm text-gray-700">{listing.livingArea || listing.sqft}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm font-medium">Lot Size:</span>
                  <span className="text-sm text-gray-700">{listing.lotSize}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm font-medium">MLS® ID:</span>
                  <span className="text-sm text-gray-700">{listing.mls}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif mb-6">Interior</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm font-medium">Total Bedrooms:</span>
                  <span className="text-sm text-gray-700">{listing.totalBedrooms || listing.beds}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm font-medium">Total Bathrooms:</span>
                  <span className="text-sm text-gray-700">{listing.totalBathrooms || listing.baths}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm font-medium">Full Bathrooms:</span>
                  <span className="text-sm text-gray-700">{listing.fullBathrooms || 0}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm font-medium">Three Quarter Bathrooms:</span>
                  <span className="text-sm text-gray-700">{listing.threeQuarterBathrooms || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border rounded p-6">
            <h3 className="font-medium mb-2">Financial</h3>
            <p className="text-sm text-gray-600">Sales Price: {formatPrice(listing.price)}</p>
            {listing.features && (
              <div className="mt-4">
                <h4 className="font-medium">Features</h4>
                <p className="text-sm text-gray-700">{listing.features}</p>
              </div>
            )}
            {listing.amenities && (
              <div className="mt-4">
                <h4 className="font-medium">Amenities</h4>
                <p className="text-sm text-gray-700">{listing.amenities}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Link to="/all-listings" className="text-sm underline">← Back to listings</Link>
        </div>
      </main>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {/* Image preview modal/slider */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closePreview}>
          <div className="relative max-w-[90vw] max-h-[90vh] w-full">
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-20"
              onClick={(e) => { e.stopPropagation(); closePreview(); }}
              aria-label="Close preview"
            >
              ✕
            </button>

            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-3 z-20"
              onClick={(e) => { e.stopPropagation(); showPrev(e); }}
              aria-label="Previous"
            >
              ‹
            </button>

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-3 z-20"
              onClick={(e) => { e.stopPropagation(); showNext(e); }}
              aria-label="Next"
            >
              ›
            </button>

            <div className="w-full h-full flex items-center justify-center">
              <img
                src={((listing.images && listing.images.length) ? listing.images : (listing.image ? [listing.image] : []))[previewIndex]}
                alt={`preview-${previewIndex}`}
                className="max-w-full max-h-[80vh] object-contain mx-auto"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* thumbnails */}
            <div className="mt-4 flex gap-2 overflow-x-auto px-2">
              {((listing.images && listing.images.length) ? listing.images : (listing.image ? [listing.image] : [])).map((src, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setPreviewIndex(i); }} className={`rounded overflow-hidden border ${i === previewIndex ? 'ring-2 ring-white' : 'ring-0'}`}>
                  <img src={src} alt={`thumb-${i}`} className="w-24 h-16 object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}