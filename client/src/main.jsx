import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App'
import AllListings from './AllListings'
import ListingDetail from './ListingDetail'
import Staging from './Staging'
import Testimonials from './Testimonials'
import AdminDashboard from './admin/AdminDashboard'
import EditProperty from './admin/EditProperty'
import AdminLogin from './admin/AdminLogin'
import AdminSignup from './admin/AdminSignup'
import { AuthProvider } from './admin/AuthProvider'
import PrivateRoute from './admin/PrivateRoute'
import './index.css'
import { initLenis, getLenis } from './lib/lenis'
import PageLoader from './components/PageLoader'
import CustomCursor from './components/CustomCursor'

function PageWrapper({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition min-h-screen">
      {children}
    </div>
  );
}

function LenisProvider({ children }) {
  const location = useLocation()

  useEffect(() => {
    initLenis()
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate: false })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location])

  return children
}

// Global loader component that watches all route changes
function GlobalLoaderProvider({ children }) {
  const location = useLocation();
  const [globalLoading, setGlobalLoading] = useState(true);
  const isInitialMount = React.useRef(true);

  // Initial page load
  useEffect(() => {
    const onLoad = () => {
      setTimeout(() => setGlobalLoading(false), 1000);
    };
    
    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  // Route changes (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Show loader on route change
    setGlobalLoading(true);
    const timer = setTimeout(() => setGlobalLoading(false), 1100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Link clicks
  useEffect(() => {
    const onDocClick = (e) => {
      try {
        const el = e.target?.closest?.('a');
        if (!el) return;
        const href = el.getAttribute('href');
        if (!href) return;
        if (href.startsWith('#')) return;
        if (el.target === '_blank' || el.hasAttribute('download')) return;
        if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;
        
        setGlobalLoading(true);
      } catch (err) {
        // noop
      }
    };

    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, []);

  // Browser back/forward
  useEffect(() => {
    const onPop = () => setGlobalLoading(true);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Custom events from Header
  useEffect(() => {
    const onStart = () => setGlobalLoading(true);
    window.addEventListener('startPageLoad', onStart);
    return () => window.removeEventListener('startPageLoad', onStart);
  }, []);

  return (
    <>
      <PageLoader open={globalLoading} />
      <CustomCursor />
      {children}
    </>
  );
}

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalLoaderProvider>
        <LenisProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<PageWrapper><App /></PageWrapper>} />
              <Route path="/all-listings" element={<PageWrapper><AllListings /></PageWrapper>} />
              <Route path="/listing/:id" element={<PageWrapper><ListingDetail /></PageWrapper>} />
              <Route path="/staging" element={<PageWrapper><Staging /></PageWrapper>} />
              <Route path="/testimonials" element={<PageWrapper><Testimonials /></PageWrapper>} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />

              <Route path="/admin" element={<PrivateRoute><PageWrapper><AdminDashboard /></PageWrapper></PrivateRoute>} />
              <Route path="/admin/new" element={<PrivateRoute><PageWrapper><EditProperty /></PageWrapper></PrivateRoute>} />
              <Route path="/admin/edit/:id" element={<PrivateRoute><PageWrapper><EditProperty /></PageWrapper></PrivateRoute>} />
              <Route path="/admin/listings" element={<PrivateRoute><PageWrapper><AdminDashboard /></PageWrapper></PrivateRoute>} />
              <Route path="/admin/active" element={<PrivateRoute><PageWrapper><AdminDashboard /></PageWrapper></PrivateRoute>} />
              <Route path="/admin/sold" element={<PrivateRoute><PageWrapper><AdminDashboard /></PageWrapper></PrivateRoute>} />
            </Routes>
          </AuthProvider>
        </LenisProvider>
      </GlobalLoaderProvider>
    </BrowserRouter>
  </React.StrictMode>
)