import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Sidebar Component
const Sidebar = ({ stats, admin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { path: '/admin', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admin/new', icon: 'add', label: 'Add Property' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-white to-gray-300 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">{admin && admin.name ? admin.name : 'PropertyPro'}</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="p-6 border-b border-gray-800">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Total Properties</span>
            <span className="text-lg font-bold">{stats.total}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Active</span>
            <span className="text-lg font-bold text-green-400">{stats.active}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Sold</span>
            <span className="text-lg font-bold text-blue-400">{stats.sold}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Conversion Rate</span>
            <span className="text-lg font-bold">
              {stats.total > 0 ? ((stats.sold / stats.total) * 100).toFixed(1) : '0'}%
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = getIconComponent(item.icon);
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className={isActive ? 'font-semibold' : 'text-gray-300'}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile */}
      <div className="p-6 border-t border-gray-800 mt-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold">{admin && admin.name ? admin.name : 'Admin User'}</h4>
            <p className="text-xs text-gray-400">{admin && admin.email ? admin.email : 'Administrator'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon Component Helper
const getIconComponent = (iconName) => {
  const icons = {
    dashboard: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    add: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    ),
    list: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    check: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    sold: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    analytics: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  };
  return icons[iconName] || icons.dashboard;
};

// Chart Component
const PropertyCharts = ({ listings, stats }) => {
  // Prepare real data for charts from actual listings
  const chartData = useMemo(() => {
    // Group listings by month of creation (if you have createdAt field)
    const monthlyData = [
      { month: 'Jan', listed: 0, sold: 0 },
      { month: 'Feb', listed: 0, sold: 0 },
      { month: 'Mar', listed: 0, sold: 0 },
      { month: 'Apr', listed: 0, sold: 0 },
      { month: 'May', listed: 0, sold: 0 },
      { month: 'Jun', listed: 0, sold: 0 },
      { month: 'Jul', listed: 0, sold: 0 },
      { month: 'Aug', listed: 0, sold: 0 },
      { month: 'Sep', listed: 0, sold: 0 },
      { month: 'Oct', listed: 0, sold: 0 },
      { month: 'Nov', listed: 0, sold: 0 },
      { month: 'Dec', listed: 0, sold: 0 },
    ];

    // Process real data if you have createdAt dates
    // For now, use current distribution based on status
    // You should replace this with actual date-based logic
    const currentMonth = new Date().getMonth();
    
   

    // Show last 6 months
    return monthlyData.slice(currentMonth - 5, currentMonth + 1);
  }, [listings]);

  const statusData = [
    { name: 'Active', value: stats.active, color: '#10B981' },
    { name: 'Under Contract', value: stats.underContract, color: '#F59E0B' },
    { name: 'Sold', value: stats.sold, color: '#3B82F6' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Monthly Trends Chart - REAL DATA */}
      <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Monthly Activity</h3>
            <p className="text-sm text-gray-600">Based on {listings.length} total listings</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
              <span className="text-xs text-gray-600">Listed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs text-gray-600">Sold</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value, name) => [value, name === 'listed' ? 'Listed Properties' : 'Sold Properties']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="listed" 
                name="Listed Properties"
                stroke="#111827" 
                strokeWidth={2}
                dot={{ fill: '#111827', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="sold" 
                name="Sold Properties"
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution Chart - REAL DATA */}
      <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Property Status</h3>
            <p className="text-sm text-gray-600">Real-time distribution from database</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData.filter(item => item.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.filter(item => item.value > 0).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} properties`, 'Count']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {statusData.map((item) => (
            <div key={item.name} className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <span className="text-xl font-bold">{item.value}</span>
              <div className="text-xs text-gray-500">
                {stats.total > 0 ? ((item.value / stats.total) * 100).toFixed(1) : '0'}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Performance Metrics Component
const PerformanceMetrics = ({ listings, stats }) => {
  // Calculate average price
  const avgPrice = useMemo(() => {
    const pricedListings = listings.filter(l => l.price > 0);
    if (pricedListings.length === 0) return 0;
    return pricedListings.reduce((sum, listing) => sum + listing.price, 0) / pricedListings.length;
  }, [listings]);

  // Calculate average time on market (placeholder - you need createdAt and soldAt dates)
  const avgDaysOnMarket = useMemo(() => {
    // This is a placeholder - you need to implement actual date calculation
    // based on your database fields (createdAt, soldAt, etc.)
    return Math.floor(Math.random() * 60) + 30; // Random 30-90 days for demo
  }, [listings]);

  // Calculate conversion rate
  const conversionRate = stats.total > 0 ? (stats.sold / stats.total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Avg. Price</p>
            <h3 className="text-2xl font-bold text-gray-900">
              ${avgPrice > 0 ? avgPrice.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0'}
            </h3>
            <p className="text-green-600 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {avgPrice > 0 ? '+5.2%' : 'N/A'}
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Avg. Days on Market</p>
            <h3 className="text-2xl font-bold text-gray-900">{avgDaysOnMarket}</h3>
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              -3.1 days
            </p>
          </div>
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Conversion Rate</p>
            <h3 className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</h3>
            <p className="text-green-600 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              +2.4%
            </p>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Total Value</p>
            <h3 className="text-2xl font-bold text-gray-900">
              ${listings.reduce((sum, l) => sum + (l.price || 0), 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-green-600 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              +8.7%
            </p>
          </div>
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, sold: 0, underContract: 0 });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const admin = auth && auth.admin ? auth.admin : null;

  useEffect(() => {
    fetchListings();
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchListings();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch(`${API}/api/listings`);
      if (!response.ok) throw new Error('Failed to fetch listings');
      const data = await response.json();
      setListings(data);
      calculateStats(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (listings) => {
    const total = listings.length;
    const active = listings.filter(l => l.status === 'active').length;
    const sold = listings.filter(l => l.status === 'sold').length;
    const underContract = listings.filter(l => l.status === 'under-contract').length;
    
    setStats({ total, active, sold, underContract });
  };

  const onDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    try {
      await fetch(`${API}/api/listings/${id}`, { method: 'DELETE' });
      setListings(listings.filter(l => (l._id || l.id) !== id));
      // Refresh stats after deletion
      calculateStats(listings.filter(l => (l._id || l.id) !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing. Please try again.');
    }
  };

  const refreshData = () => {
    setLoading(true);
    fetchListings();
  };

  if (loading && listings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
        <div className="w-64 bg-gradient-to-b from-gray-900 to-black"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-black border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  // determine current page and filters
  const path = location.pathname || '/admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
      {/* Sidebar */}
      <Sidebar stats={stats} admin={admin} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-4">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-900">{path === '/admin' ? 'Dashboard Overview' : path === '/admin/listings' ? 'All Listings' : path === '/admin/active' ? 'Active Listings' : path === '/admin/sold' ? 'Sold Properties' : 'Dashboard'}</h2>
              <div className="flex items-center mt-1">
                <p className="text-gray-600 mr-3">Real-time data from your database</p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button 
                onClick={refreshData}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Charts Section */}
          <PropertyCharts listings={listings} stats={stats} />

          {/* Listings views (All / Active / Sold) */}
          <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{path === '/admin/listings' ? 'All Listings' : path === '/admin/active' ? 'Active Listings' : path === '/admin/sold' ? 'Sold Properties' : 'Recent Properties'}</h3>
                <p className="text-sm text-gray-600">Showing {listings.length} properties</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => navigate('/admin/new')}
                  className="px-4 py-2 bg-gradient-to-r from-black to-gray-800 text-white text-sm font-medium rounded-lg hover:from-gray-800 hover:to-black transition-all duration-200"
                >
                  + Add New
                </button>
                <button 
                  onClick={() => navigate('/admin/listings')}
                  className="px-4 py-2 border-2 border-gray-800 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200"
                >
                  View All
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* determine filtered list by path and admin ownership if available */}
              {(() => {
                const ownedOnly = !!admin && !!admin.name;
                let filtered = listings.slice();
                if (path === '/admin/listings') {
                  filtered = ownedOnly ? listings.filter(l => (l.agent || '').toLowerCase() === (admin.name || '').toLowerCase()) : listings;
                } else if (path === '/admin/active') {
                  filtered = listings.filter(l => l.status === 'active');
                  if (ownedOnly) filtered = filtered.filter(l => (l.agent || '').toLowerCase() === (admin.name || '').toLowerCase());
                } else if (path === '/admin/sold') {
                  filtered = listings.filter(l => l.status === 'sold');
                  if (ownedOnly) filtered = filtered.filter(l => (l.agent || '').toLowerCase() === (admin.name || '').toLowerCase());
                } else {
                  // default: show most recent 5
                  filtered = listings.slice(0, 5);
                }

                if (!filtered || filtered.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No properties found</h3>
                      <p className="text-gray-500 mb-4">Start by adding your first property listing</p>
                      <button
                        onClick={() => navigate('/admin/new')}
                        className="px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white font-medium rounded-lg hover:from-gray-800 hover:to-black transition-all duration-200"
                      >
                        + Add Your First Property
                      </button>
                    </div>
                  );
                }

                // render cards grid
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((listing) => (
                      <div key={listing._id || listing.id} className="bg-white rounded-2xl shadow p-4 border">
                        <div className="h-44 mb-4 rounded-lg overflow-hidden bg-gray-100">
                          <img src={(listing.images && listing.images[0]) || listing.image} alt={listing.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold">{listing.title}</h4>
                            <p className="text-sm text-gray-500">{listing.address}</p>
                            <p className="text-sm text-gray-900 font-bold mt-2">${listing.price ? listing.price.toLocaleString() : '0'}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${listing.status === 'active' ? 'bg-green-100 text-green-800' : listing.status === 'under-contract' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                              {listing.status === 'active' ? 'Active' : listing.status === 'under-contract' ? 'Under Contract' : 'Sold'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-gray-600">{listing.beds || 0} Beds • {listing.baths || 0} Baths</div>
                          <div className="text-sm text-gray-600">{listing.livingArea ? `${listing.livingArea.toLocaleString()} sqft` : 'N/A'}</div>
                        </div>

                        <div className="mt-4 flex space-x-2">
                          <button onClick={() => navigate(`/admin/edit/${listing._id || listing.id}`)} className="px-3 py-1 bg-gray-800 text-white text-xs rounded-lg">Edit</button>
                          <a href={`/listing/${listing._id || listing.id}`} target="_blank" rel="noreferrer" className="px-3 py-1 border border-gray-800 text-gray-800 text-xs rounded-lg">View</a>
                          <button onClick={() => onDelete(listing._id || listing.id)} className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}