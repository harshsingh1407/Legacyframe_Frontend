import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, Plus, Trash2, Edit, Image as ImageIcon, LayoutGrid, Tag, Type, Upload, Calendar, User, Phone, Mail, MessageSquare, Briefcase } from 'lucide-react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' or 'bookings'
  const [credentials, setCredentials] = useState({ admin_id: '', password: '' });
  const [portfolios, setPortfolios] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    category: '',
    spanClass: 'col-span-1'
  });
  const [editingId, setEditingId] = useState(null);

  const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  useEffect(() => {
    if (isLoggedIn) {
      fetchPortfolios();
      fetchBookings();
    }
  }, [isLoggedIn]);

  const fetchPortfolios = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/portfolio`);
      setPortfolios(res.data);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/booking`);
      setBookings(res.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.admin_id === ADMIN_ID && credentials.password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert('Invalid Credentials');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setNewPortfolio({
      title: item.title,
      category: item.category,
      spanClass: item.spanClass || 'col-span-1'
    });
    setPreviewUrl(item.imageUrl);
    setImageFile(null); // Reset file so we don't re-upload unless changed
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewPortfolio({ title: '', category: '', spanClass: 'col-span-1' });
    setImageFile(null);
    setPreviewUrl('');
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    
    // If not editing, image is required
    if (!editingId && !imageFile) {
      alert('Please select an image file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newPortfolio.title);
      formData.append('category', newPortfolio.category);
      formData.append('spanClass', newPortfolio.spanClass);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/portfolio/${editingId}`, formData);
        alert('Portfolio item updated successfully!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/portfolio`, formData);
        alert('Portfolio item added successfully!');
      }

      handleCancelEdit();
      fetchPortfolios();
    } catch (error) {
      console.error('Error processing portfolio:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error processing portfolio';
      alert('Error: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/portfolio/${id}`);
        fetchPortfolios();
      } catch (error) {
        console.error('Error deleting portfolio:', error);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4 font-sans">
        <div className="w-full max-w-md bg-[#111111] border border-[#1a1a1a] p-8 md:p-10 rounded-lg shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Admin <span className="text-[#c0a080]">Login</span></h1>
            <p className="text-gray-500 text-sm">Please enter your credentials to access the dashboard.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#c0a080] font-bold mb-2">Admin ID</label>
              <input
                type="text"
                required
                className="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:outline-none focus:border-[#c0a080] transition-colors"
                value={credentials.admin_id}
                onChange={(e) => setCredentials({ ...credentials, admin_id: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#c0a080] font-bold mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:outline-none focus:border-[#c0a080] transition-colors"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#c0a080] text-black font-bold py-3 rounded uppercase tracking-widest text-xs hover:bg-[#d4b595] transition-colors mt-4"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white font-sans">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-[#0d0d0d] sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold tracking-tight">Admin <span className="text-[#c0a080]">Dashboard</span></h2>
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={() => setActiveTab('portfolio')}
                className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${activeTab === 'portfolio' ? 'text-[#c0a080]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Portfolio
              </button>
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${activeTab === 'bookings' ? 'text-[#c0a080]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Bookings
              </button>
            </nav>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
        
        {activeTab === 'portfolio' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Add New Form */}
            <div className="lg:col-span-1">
              <div className="bg-[#111111] border border-[#1a1a1a] p-8 rounded-lg sticky top-24">
                <h3 className="text-lg font-bold mb-6 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {editingId ? <Edit size={20} className="text-[#c0a080]" /> : <Plus size={20} className="text-[#c0a080]" />}
                    {editingId ? 'Edit Portfolio' : 'Add New Portfolio'}
                  </div>
                  {editingId && (
                    <button onClick={handleCancelEdit} className="text-[10px] text-gray-500 hover:text-white underline">Cancel</button>
                  )}
                </h3>
                <form onSubmit={handleAddPortfolio} className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                      <Type size={12} /> Title
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-white px-4 py-2.5 rounded focus:outline-none focus:border-[#c0a080]"
                      value={newPortfolio.title}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                      <Upload size={12} /> {editingId ? 'Change Image (Optional)' : 'Upload Image'}
                    </label>
                    <div className="relative group">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`w-full h-32 border-2 border-dashed ${previewUrl ? 'border-[#c0a080]' : 'border-[#2a2a2a]'} rounded flex flex-col items-center justify-center bg-[#0b0b0b] group-hover:border-[#c0a080] transition-colors overflow-hidden`}>
                        {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /> : <><Upload size={24} className="text-gray-500 mb-2" /><span className="text-xs text-gray-500">Click to upload</span></>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                      <Tag size={12} /> Category
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-white px-4 py-2.5 rounded focus:outline-none focus:border-[#c0a080]"
                      value={newPortfolio.category}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                      <LayoutGrid size={12} /> Grid Span
                    </label>
                    <select
                      className="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-white px-4 py-2.5 rounded focus:outline-none focus:border-[#c0a080]"
                      value={newPortfolio.spanClass}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, spanClass: e.target.value })}
                    >
                      <option value="col-span-1">Standard (1x1)</option>
                      <option value="col-span-2">Wide (2x1)</option>
                      <option value="row-span-2">Tall (1x2)</option>
                      <option value="col-span-2 row-span-2">Large (2x2)</option>
                    </select>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#c0a080] text-black font-bold py-3 rounded uppercase tracking-widest text-[10px] hover:bg-[#d4b595] transition-colors mt-2">
                    {loading ? 'Processing...' : (editingId ? 'Update Item' : 'Add Item')}
                  </button>
                </form>
              </div>
            </div>

            {/* List View */}
            <div className="lg:col-span-2">
              <div className="bg-[#111111] border border-[#1a1a1a] p-8 rounded-lg">
                <h3 className="text-lg font-bold mb-6">Manage Portfolio Items</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolios.map((item) => (
                    <div key={item._id} className="group relative aspect-video bg-[#0b0b0b] border border-[#1a1a1a] rounded overflow-hidden">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <h4 className="font-bold text-sm">{item.title}</h4>
                            <p className="text-[10px] text-[#c0a080] uppercase tracking-widest">{item.category}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditClick(item)} className="bg-[#c0a080]/20 hover:bg-[#c0a080] text-[#c0a080] hover:text-black p-2 rounded transition-all">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeletePortfolio(item._id)} className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Bookings Tab */
          <div className="w-full">
            <div className="bg-[#111111] border border-[#1a1a1a] p-8 rounded-lg">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Calendar className="text-[#c0a080]" />
                  Recent Booking Requests
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 bg-[#0b0b0b] px-4 py-2 border border-[#1a1a1a] rounded-full">
                  Total Bookings: {bookings.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-[#0b0b0b] border border-[#1a1a1a] p-6 rounded-lg hover:border-[#c0a080]/30 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-[#111] border border-[#1a1a1a] rounded-full flex items-center justify-center text-[#c0a080] font-bold group-hover:bg-[#c0a080] group-hover:text-black transition-colors">
                        {booking.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-gray-600">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User size={14} className="text-gray-600" />
                        <span className="text-sm font-bold">{booking.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail size={14} className="text-gray-600" />
                        <span className="text-xs text-gray-400">{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={14} className="text-gray-600" />
                        <span className="text-xs text-gray-400">{booking.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Briefcase size={14} className="text-[#c0a080]" />
                        <span className="text-xs font-semibold uppercase tracking-widest">{booking.service}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar size={14} className="text-[#c0a080]" />
                        <span className="text-xs text-white bg-[#111] px-3 py-1 rounded">
                          {new Date(booking.date).toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-4 border-t border-[#1a1a1a] flex gap-3">
                        <MessageSquare size={14} className="text-gray-600 mt-1 flex-shrink-0" />
                        <p className="text-[11px] text-gray-400 leading-relaxed italic">"{booking.message || 'No additional details provided.'}"</p>
                      </div>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <div className="col-span-full text-center py-20 text-gray-600 border border-dashed border-[#1a1a1a] rounded-lg">
                    No booking requests found yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
