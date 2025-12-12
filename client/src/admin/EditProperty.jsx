import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    address: '',
    price: 0,
    beds: 0,
    baths: 0,
    livingArea: 0,
    sqft: '',
    status: 'active',
    image: '',
    description: '',
    lotSize: '',
    mls: '',
    agent: '',
    agentPhoto: '',
    requestInfo: true,
    features: '',
    amenities: '',
    totalBedrooms: 0,
    totalBathrooms: 0,
    fullBathrooms: 0,
    threeQuarterBathrooms: 0
  });
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [agentPhotoFile, setAgentPhotoFile] = useState(null);

  const isNew = !id || id === 'new';

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      fetch(`${API}/api/listings/${id}`)
        .then(r => r.json())
        .then(data => {
          setForm(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') return setForm({ ...form, [name]: checked });
    if (type === 'file') {
      if (name === 'imageFiles') return setImageFiles(files && files.length ? Array.from(files) : []);
      if (name === 'agentPhotoFile') return setAgentPhotoFile(files && files[0] ? files[0] : null);
      return null;
    }
    return setForm({ ...form, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      // ensure numeric fields are numbers
      payload.beds = Number(payload.beds || 0);
      payload.baths = Number(payload.baths || 0);
      payload.price = Number(payload.price || 0);
      payload.livingArea = Number(payload.livingArea || 0);
      payload.totalBedrooms = Number(payload.totalBedrooms || 0);
      payload.totalBathrooms = Number(payload.totalBathrooms || 0);
      payload.fullBathrooms = Number(payload.fullBathrooms || 0);
      payload.threeQuarterBathrooms = Number(payload.threeQuarterBathrooms || 0);

      const url = isNew ? `${API}/api/listings` : `${API}/api/listings/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      let res;
      if ((imageFiles && imageFiles.length) || agentPhotoFile) {
        const formData = new FormData();
        Object.keys(payload).forEach((k) => {
          if (payload[k] !== undefined && payload[k] !== null) formData.append(k, payload[k]);
        });
        if (imageFiles && imageFiles.length) {
          imageFiles.forEach((f) => formData.append('imageFiles[]', f));
        }
        if (agentPhotoFile) formData.append('agentPhotoFile', agentPhotoFile);
        res = await fetch(url, { method, body: formData });
      } else {
        res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      if (!res.ok) {
        const text = await res.text();
        console.error('API error:', res.status, text);
        alert('Failed to save listing — check the server logs and console for details.');
        return;
      }
      // parse response (for POST it should return created item)
      const data = await res.json().catch(() => null);
      // After saving, navigate to listings so the new item is visible
      navigate('/admin');
    } catch (err) {
      console.error('Save failed', err);
      alert('An unexpected error occurred while saving. See console for details.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-black border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black shadow-2xl">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                {isNew ? 'Create New Property' : 'Edit Property'}
              </h1>
              <p className="text-gray-300">
                {isNew ? 'Add a new listing to your portfolio' : 'Update property information'}
              </p>
            </div>
            <button 
              onClick={() => navigate('/admin')} 
              className="px-6 py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 font-medium rounded-xl"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 -mt-8">
        <form onSubmit={onSubmit} className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Basic Information Section */}
          <div className="bg-gradient-to-r from-gray-900 to-black text-white px-8 py-6">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Basic Information</h2>
                <p className="text-gray-300 text-sm">Core details about the property</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Property Title *</label>
                <input 
                  name="title" 
                  value={form.title} 
                  onChange={onChange} 
                  placeholder="e.g., Modern Family Home with Pool" 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Address *</label>
                <input 
                  name="address" 
                  value={form.address} 
                  onChange={onChange} 
                  placeholder="Full street address" 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={onChange} 
                  placeholder="Describe the property features, neighborhood, and unique selling points..." 
                  rows="4"
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Details */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-y border-gray-100 px-8 py-6">
            <div className="flex items-center">
              <div className="bg-black/5 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pricing & Key Details</h2>
                <p className="text-gray-600 text-sm">Financial and property specifications</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Price ($) *</label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-gray-500 font-medium">$</span>
                  <input 
                    name="price" 
                    type="number" 
                    value={form.price} 
                    onChange={onChange} 
                    placeholder="0" 
                    className="w-full pl-12 px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">MLS ID</label>
                <input 
                  name="mls" 
                  value={form.mls} 
                  onChange={onChange} 
                  placeholder="MLS listing number" 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Beds</label>
                <input 
                  name="beds" 
                  type="number" 
                  value={form.beds} 
                  onChange={onChange} 
                  placeholder="0" 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Baths</label>
                <input 
                  name="baths" 
                  type="number" 
                  value={form.baths} 
                  onChange={onChange} 
                  placeholder="0" 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Living Area (sqft)</label>
                <input 
                  name="livingArea" 
                  type="number" 
                  value={form.livingArea} 
                  onChange={onChange} 
                  placeholder="0" 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Lot Size</label>
                <input 
                  name="lotSize" 
                  value={form.lotSize} 
                  onChange={onChange} 
                  placeholder="e.g., 5,000 Sq.Ft." 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Square Footage Display</label>
                <input 
                  name="sqft" 
                  value={form.sqft} 
                  onChange={onChange} 
                  placeholder="e.g., 1,770 Sq.Ft." 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                <select 
                  name="status" 
                  value={form.status} 
                  onChange={onChange} 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                >
                  <option value="active">Active</option>
                  <option value="under-contract">Under Contract</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>
          </div>

          {/* Detailed Room Information */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-y border-gray-100 px-8 py-6">
            <div className="flex items-center">
              <div className="bg-black/5 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Detailed Room Information</h2>
                <p className="text-gray-600 text-sm">Room breakdown and specifications</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Total Bedrooms</label>
                <input 
                  name="totalBedrooms" 
                  type="number" 
                  value={form.totalBedrooms} 
                  onChange={onChange} 
                  placeholder="0" 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Total Bathrooms</label>
                <input 
                  name="totalBathrooms" 
                  type="number" 
                  value={form.totalBathrooms} 
                  onChange={onChange} 
                  placeholder="0" 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Full Bathrooms</label>
                <input 
                  name="fullBathrooms" 
                  type="number" 
                  value={form.fullBathrooms} 
                  onChange={onChange} 
                  placeholder="0" 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">3/4 Bathrooms</label>
                <input 
                  name="threeQuarterBathrooms" 
                  type="number" 
                  value={form.threeQuarterBathrooms} 
                  onChange={onChange} 
                  placeholder="0" 
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* Features & Amenities */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-y border-gray-100 px-8 py-6">
            <div className="flex items-center">
              <div className="bg-black/5 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Features & Amenities</h2>
                <p className="text-gray-600 text-sm">Property highlights and amenities</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Features (comma separated)</label>
              <textarea 
                name="features" 
                value={form.features} 
                onChange={onChange} 
                placeholder="e.g., Hardwood Floors, Granite Countertops, Walk-in Closet, Stainless Steel Appliances" 
                rows="3"
                className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
              <textarea 
                name="amenities" 
                value={form.amenities} 
                onChange={onChange} 
                placeholder="e.g., Swimming Pool, Gym, Parking, Security System, Garden" 
                rows="3"
                className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm resize-none"
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-y border-gray-100 px-8 py-6">
            <div className="flex items-center">
              <div className="bg-black/5 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Media & Images</h2>
                <p className="text-gray-600 text-sm">Upload property photos and agent image</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-black transition-colors duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-4">Property Images</label>
              <input 
                type="file" 
                name="imageFiles" 
                accept="image/*" 
                multiple 
                onChange={onChange} 
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-4 file:px-8 file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-black file:to-gray-800 file:text-white hover:file:from-gray-800 hover:file:to-black file:cursor-pointer cursor-pointer file:transition-all file:rounded-xl"
              />
              {imageFiles && imageFiles.length > 0 && (
                <div className="mt-4 flex items-center text-sm text-green-700 bg-green-50/50 backdrop-blur-sm px-5 py-3 rounded-xl border border-green-200">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} selected
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-black transition-colors duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-4">Agent Photo</label>
              <input 
                type="file" 
                name="agentPhotoFile" 
                accept="image/*" 
                onChange={onChange} 
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-4 file:px-8 file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-black file:to-gray-800 file:text-white hover:file:from-gray-800 hover:file:to-black file:cursor-pointer cursor-pointer file:transition-all file:rounded-xl"
              />
              {agentPhotoFile && (
                <div className="mt-4 flex items-center text-sm text-green-700 bg-green-50/50 backdrop-blur-sm px-5 py-3 rounded-xl border border-green-200">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {agentPhotoFile.name}
                </div>
              )}
            </div>
          </div>

          {/* Agent Information */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-y border-gray-100 px-8 py-6">
            <div className="flex items-center">
              <div className="bg-black/5 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Agent Information</h2>
                <p className="text-gray-600 text-sm">Contact details and preferences</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Agent Name</label>
              <input 
                name="agent" 
                value={form.agent} 
                onChange={onChange} 
                placeholder="Agent's full name" 
                className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:ring-4 focus:ring-black focus:ring-opacity-10 outline-none transition-all rounded-xl bg-white/50 backdrop-blur-sm"
              />
            </div>

            <div className="flex items-center p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    name="requestInfo" 
                    checked={!!form.requestInfo} 
                    onChange={onChange}
                    className="sr-only"
                  />
                  <div className={`w-14 h-7 rounded-full transition-colors duration-300 ${form.requestInfo ? 'bg-gradient-to-r from-black to-gray-800' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${form.requestInfo ? 'transform translate-x-7' : ''}`}></div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                  Show "Request Info" Button on Listing
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 px-8 py-8">
            <div className="flex gap-6 justify-end">
              <button 
                type="button" 
                onClick={() => navigate('/admin')} 
                className="px-8 py-4 border-2 border-gray-800 text-gray-800 font-bold hover:bg-gray-800 hover:text-white transition-all duration-200 rounded-xl"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-10 py-4 bg-gradient-to-r from-black to-gray-800 text-white font-bold hover:from-gray-800 hover:to-black hover:shadow-2xl transition-all duration-300 shadow-xl rounded-xl transform hover:-translate-y-0.5"
              >
                {isNew ? 'Create Listing' : 'Update Property'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}