import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LogOut, Plus, Trash2, Edit, Image as ImageIcon, LayoutGrid, Tag, Type, Upload, Calendar, User, Phone, Mail, MessageSquare, Briefcase, Play, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' or 'bookings'
  const [credentials, setCredentials] = useState({ admin_id: '', password: '' });
  const [portfolios, setPortfolios] = useState([]);
  const [videos, setVideos] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    category: '',
  });
  const [newVideo, setNewVideo] = useState({
    title: '',
    category: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  useEffect(() => {
    if (isLoggedIn) {
      fetchPortfolios();
      fetchBookings();
      fetchVideos();
    }
  }, [isLoggedIn]);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/videos`);
      setVideos(res.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

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
      toast.error('Invalid Credentials');
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
      category: item.category
    });
    setPreviewUrl(item.imageUrl);
    setImageFile(null); // Reset file so we don't re-upload unless changed
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewPortfolio({ title: '', category: '' });
    setImageFile(null);
    setPreviewUrl('');
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    
    // If not editing, image is required
    if (!editingId && !imageFile) {
      toast.error('Please select an image file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newPortfolio.title);
      formData.append('category', newPortfolio.category);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/portfolio/${editingId}`, formData);
        toast.success('Portfolio item updated successfully!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/portfolio`, formData);
        toast.success('Portfolio item added successfully!');
      }

      handleCancelEdit();
      fetchPortfolios();
    } catch (error) {
      console.error('Error processing portfolio:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error processing portfolio';
      toast.error('Error: ' + errorMsg);
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

  const handleAddVideo = async (e) => {
    e.preventDefault();

    if (!editingVideoId && !imageFile && !newVideo.videoUrl) {
      toast.error('Please select a video file or paste a video URL.');
      return;
    }

    // --- Client-side validation ---
    if (imageFile) {
      const allowedTypes = ['video/mp4', 'video/mov', 'video/quicktime', 'video/avi', 'video/mkv', 'video/webm'];
      if (!allowedTypes.includes(imageFile.type)) {
        toast.error('Wrong format. Accepted: MP4, MOV, AVI, MKV, WebM.');
        return;
      }
      const maxSizeMB = 500;
      const fileSizeMB = imageFile.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        toast.error(`File too large (${fileSizeMB.toFixed(0)}MB). Max allowed is ${maxSizeMB}MB.`);
        return;
      }
    }

    setLoading(true);
    try {
      if (!imageFile && !editingVideoId) {
        toast.error('Please select a video file to upload.');
        setLoading(false);
        return;
      }

      let finalVideoUrl = '';

      if (imageFile) {
        const cloudName = 'dcanhm5xv';
        const uploadPreset = 'ml_default';

        const cloudinaryData = new FormData();
        cloudinaryData.append('file', imageFile);
        cloudinaryData.append('upload_preset', uploadPreset);
        cloudinaryData.append('resource_type', 'video');

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
          cloudinaryData
        );
        finalVideoUrl = uploadRes.data.secure_url;
      }

      const videoData = {
        title: newVideo.title,
        category: newVideo.category,
        ...(finalVideoUrl && { videoUrl: finalVideoUrl })
      };

      if (editingVideoId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/videos/${editingVideoId}`, videoData);
        toast.success('Video updated successfully!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/videos`, videoData);
        toast.success('Video added successfully!');
      }

      setEditingVideoId(null);
      setNewVideo({ title: '', category: '' });
      setImageFile(null);
      setPreviewUrl('');
      fetchVideos();
    } catch (error) {
      console.error('Error processing video:', error);
      // --- Smart specific error messages ---
      const cloudinaryError = error.response?.data?.error?.message || '';
      const httpStatus = error.response?.status;

      if (cloudinaryError.toLowerCase().includes('file size')) {
        toast.error('Video is too large. Please compress it or use a URL.');
      } else if (cloudinaryError.toLowerCase().includes('format') || cloudinaryError.toLowerCase().includes('invalid')) {
        toast.error('Invalid format. Use MP4, MOV, AVI, MKV, or WebM.');
      } else if (cloudinaryError.toLowerCase().includes('preset')) {
        toast.error('Upload config error. Set Cloudinary preset to Unsigned.');
      } else if (httpStatus === 413) {
        toast.error('Video too large for server. Use a direct video URL.');
      } else if (!navigator.onLine || error.message === 'Network Error') {
        toast.error('No internet connection. Check your network and retry.');
      } else {
        toast.error(cloudinaryError || error.response?.data?.message || 'Upload failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditVideo = (video) => {
    setEditingVideoId(video._id);
    setNewVideo({
      title: video.title,
      category: video.category,
      videoUrl: video.videoUrl || ''
    });
    setPreviewUrl(video.videoUrl);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/videos/${id}`);
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4 font-sans">
        <motion.div 
          className="w-full max-w-md bg-[#111111] border border-[#1a1a1a] p-8 md:p-10 rounded-lg shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white font-sans">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-[#0d0d0d]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-10 py-3 md:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          
          {/* Top Row for Mobile (Title + Exit), Left Side for Desktop */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3 md:gap-8">
            <h2 className="text-sm md:text-xl font-bold tracking-tight whitespace-nowrap shrink-0">
              Admin <span className="text-[#c0a080]">Dashboard</span>
            </h2>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="flex sm:hidden items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-[10px] p-1 shrink-0"
            >
              <LogOut size={14} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-4 md:gap-6 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0 border-b border-white/5 sm:border-none">
            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-bold transition-colors whitespace-nowrap pb-2 sm:pb-0 ${activeTab === 'portfolio' ? 'text-[#c0a080] border-b border-[#c0a080] sm:border-none' : 'text-gray-500 hover:text-gray-300 border-b border-transparent sm:border-none'}`}
            >
              Portfolio
            </button>
            <button 
              onClick={() => setActiveTab('videos')}
              className={`text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-bold transition-colors whitespace-nowrap pb-2 sm:pb-0 ${activeTab === 'videos' ? 'text-[#c0a080] border-b border-[#c0a080] sm:border-none' : 'text-gray-500 hover:text-gray-300 border-b border-transparent sm:border-none'}`}
            >
              Videos
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-bold transition-colors whitespace-nowrap pb-2 sm:pb-0 ${activeTab === 'bookings' ? 'text-[#c0a080] border-b border-[#c0a080] sm:border-none' : 'text-gray-500 hover:text-gray-300 border-b border-transparent sm:border-none'}`}
            >
              Bookings
            </button>
          </nav>

          {/* Exit Button for Desktop */}
          <button
            onClick={() => setIsLoggedIn(false)}
            className="hidden sm:flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm shrink-0 ml-2"
          >
            <LogOut size={14} />
            <span>Exit</span>
          </button>

        </div>
      </header>

      <motion.main 
        className="max-w-[1600px] mx-auto px-3 md:px-10 py-5 md:py-10"
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        
        {activeTab === 'portfolio' ? (
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
            {/* Add New Form */}
            <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 lg:sticky lg:top-24">
              <div className="bg-[#111111] border border-[#1a1a1a] p-5 md:p-6 rounded-lg">
                <h3 className="text-sm md:text-base font-bold mb-5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {editingId ? <Edit size={16} className="text-[#c0a080]" /> : <Plus size={16} className="text-[#c0a080]" />}
                    {editingId ? 'Edit Portfolio' : 'Add Portfolio'}
                  </div>
                  {editingId && (
                    <button onClick={handleCancelEdit} className="text-[9px] text-gray-500 hover:text-white underline uppercase tracking-widest">Cancel</button>
                  )}
                </h3>
                <form onSubmit={handleAddPortfolio} className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                      <Type size={12} /> Title
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-white px-3 py-2 rounded focus:outline-none focus:border-[#c0a080] text-xs"
                      value={newPortfolio.title}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                      <Upload size={11} /> {editingId ? 'New Image (Optional)' : 'Upload Image'}
                    </label>
                    <div className="relative group">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`w-full h-24 border-2 border-dashed ${previewUrl ? 'border-[#c0a080]' : 'border-[#2a2a2a]'} rounded flex flex-col items-center justify-center bg-[#0b0b0b] group-hover:border-[#c0a080] transition-colors overflow-hidden`}>
                        {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /> : <><Upload size={20} className="text-gray-500 mb-1" /><span className="text-[9px] text-gray-500">Choose File</span></>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                      <Tag size={11} /> Category
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-white px-3 py-2 rounded focus:outline-none focus:border-[#c0a080] text-xs"
                      value={newPortfolio.category}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                    />
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-[#c0a080] text-black font-bold py-2.5 rounded uppercase tracking-widest text-[9px] hover:bg-[#d4b595] transition-colors mt-1">
                    {loading ? '...' : (editingId ? 'Update' : 'Add Item')}
                  </button>
                </form>
              </div>
            </div>

            {/* List View */}
            <div className="flex-1 w-full">
              <div className="bg-[#111111] border border-[#1a1a1a] p-6 md:p-8 rounded-lg mb-8">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
                  <h3 className="text-base md:text-lg font-bold">Manage Portfolio Items</h3>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
                    {/* Category Filter */}
                    <select 
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-[#0b0b0b] border border-[#2a2a2a] text-[10px] uppercase tracking-widest px-4 py-2.5 rounded focus:outline-none focus:border-[#c0a080] w-full sm:w-40"
                    >
                      <option value="all">All Categories</option>
                      {[...new Set(portfolios.map(p => p.category))].filter(Boolean).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                      <input 
                        type="text"
                        placeholder="Search title/category..."
                        className="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-[10px] px-4 py-2.5 rounded focus:outline-none focus:border-[#c0a080]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                  {portfolios
                    .filter(item => {
                      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
                      
                      const searchLower = searchQuery.toLowerCase();
                      const matchesSearch = (item.title || '').toLowerCase().includes(searchLower) || 
                                          (item.category || '').toLowerCase().includes(searchLower);
                      
                      return matchesCategory && matchesSearch;
                    })
                    .map((item) => (
                    <div key={item._id} className="group relative aspect-video bg-[#0b0b0b] border border-[#1a1a1a] rounded overflow-hidden">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                      <div className="absolute inset-0 bg-black/60 opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
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
        ) : activeTab === 'videos' ? (
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
            {/* Add Video Form */}
            <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 lg:sticky lg:top-24">
              <div className="bg-[#111111] border border-[#1a1a1a] p-5 md:p-6 rounded-lg">
                <h3 className="text-sm md:text-base font-bold mb-5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {editingVideoId ? <Edit size={16} className="text-[#c0a080]" /> : <Plus size={16} className="text-[#c0a080]" />}
                    {editingVideoId ? 'Edit Video' : 'Add Video'}
                  </div>
                  {editingVideoId && (
                    <button onClick={() => { setEditingVideoId(null); setNewVideo({ title: '', category: '', videoUrl: '' }); setPreviewUrl(''); }} className="text-[9px] text-gray-500 hover:text-white underline uppercase tracking-widest">Cancel</button>
                  )}
                </h3>
                <form onSubmit={handleAddVideo} className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                      <Type size={12} /> Title
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-white px-3 py-2 rounded focus:outline-none focus:border-[#c0a080] text-xs"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                      <Upload size={11} /> {editingVideoId ? 'New Video File (Optional)' : 'Upload Video File'}
                    </label>
                    <div className="relative group">
                      <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`w-full h-24 border-2 border-dashed ${imageFile ? 'border-[#c0a080]' : 'border-[#2a2a2a]'} rounded flex flex-col items-center justify-center bg-[#0b0b0b] group-hover:border-[#c0a080] transition-colors overflow-hidden`}>
                        {imageFile ? <span className="text-[9px] text-[#c0a080]">{imageFile.name}</span> : <><Upload size={20} className="text-gray-500 mb-1" /><span className="text-[9px] text-gray-500">Choose Video</span></>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                      <Tag size={11} /> Category
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-white px-3 py-2 rounded focus:outline-none focus:border-[#c0a080] text-xs"
                      value={newVideo.category}
                      onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#c0a080] text-black font-bold py-2.5 rounded uppercase tracking-widest text-[9px] hover:bg-[#d4b595] transition-colors mt-1">
                    {loading ? 'Uploading...' : (editingVideoId ? 'Update Video' : 'Add Video')}
                  </button>
                </form>
              </div>
            </div>

            {/* Video List */}
            <div className="flex-1 w-full">
              <div className="bg-[#111111] border border-[#1a1a1a] p-6 md:p-8 rounded-lg mb-8">
                <h3 className="text-base md:text-lg font-bold mb-8">Manage Videos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div 
                      key={video._id} 
                      className="group relative aspect-video bg-[#0b0b0b] border border-[#1a1a1a] rounded overflow-hidden cursor-pointer"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <video src={video.videoUrl} className="w-full h-full object-cover" />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                          <Play size={18} className="text-[#c0a080] fill-[#c0a080]" />
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-black/60 opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <h4 className="font-bold text-sm">{video.title}</h4>
                            <p className="text-[10px] text-[#c0a080] uppercase tracking-widest">{video.category}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEditVideo(video); }} 
                              className="bg-[#c0a080]/20 hover:bg-[#c0a080] text-[#c0a080] hover:text-black p-2 rounded transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteVideo(video._id); }} 
                              className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded transition-all"
                            >
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
            <div className="bg-[#111111] border border-[#1a1a1a] p-5 md:p-8 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h3 className="text-base md:text-xl font-bold flex items-center gap-3">
                  <Calendar size={20} className="text-[#c0a080]" />
                  Booking Requests
                </h3>
                <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-gray-500 bg-[#0b0b0b] px-3 py-1.5 border border-[#1a1a1a] rounded-full">
                  Total: {bookings.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-[#0b0b0b] border border-[#1a1a1a] p-5 rounded-lg hover:border-[#c0a080]/30 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-[#111] border border-[#1a1a1a] rounded-full flex items-center justify-center text-[#c0a080] text-sm font-bold group-hover:bg-[#c0a080] group-hover:text-black transition-colors">
                        {booking.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[8px] uppercase tracking-widest text-gray-600 bg-[#111] px-2 py-1 rounded">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User size={12} className="text-gray-600" />
                        <span className="text-xs font-bold">{booking.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-gray-600" />
                        <span className="text-[10px] text-gray-400 break-all">{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-gray-600" />
                        <span className="text-[10px] text-gray-400">{booking.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Briefcase size={12} className="text-[#c0a080]" />
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-[#c0a080]">{booking.service}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-[#c0a080]" />
                        <span className="text-[9px] text-white bg-[#111] px-2 py-0.5 rounded">
                          {new Date(booking.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      {booking.message && (
                        <div className="pt-3 mt-3 border-t border-[#1a1a1a] flex gap-2">
                          <MessageSquare size={12} className="text-gray-600 mt-0.5 flex-shrink-0" />
                          <p className="text-[10px] text-gray-500 leading-relaxed italic">"{booking.message}"</p>
                        </div>
                      )}
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
      </motion.main>
      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 md:px-10 py-10">
          <div 
            className="absolute inset-0 bg-[#0b0b0b]/95 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          ></div>
          
          <div className="relative w-full max-w-3xl aspect-video bg-black shadow-2xl rounded-xl overflow-hidden animate-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={24} />
            </button>

            <video 
              src={selectedVideo.videoUrl} 
              className="w-full h-full"
              autoPlay
              controls
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
