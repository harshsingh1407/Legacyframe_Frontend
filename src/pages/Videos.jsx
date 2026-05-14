import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Play, Calendar, Tag, Search, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/videos`);
        setVideos(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(video => {
    const matchesCategory = categoryFilter === 'all' || video.category === categoryFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (video.title || '').toLowerCase().includes(searchLower) || 
                        (video.category || '').toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#0b0b0b] text-white flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-20">
        
        {/* Page Header */}
        <motion.div 
          className="mb-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-block px-4 py-1 border border-[#c0a080]/30 rounded-full mb-6">
            <span className="text-[#c0a080] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em]">Cinematic Gallery</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8">
            Moving <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 italic">Masterpieces</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed tracking-wide opacity-70">
            A collection of cinematic stories captured with precision and emotion. Every film is a journey told through motion and light.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
            <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c0a080]" />
                <input 
                    type="text"
                    placeholder="Search films..."
                    className="w-full bg-[#111] border border-white/10 text-white pl-11 pr-6 py-3 rounded-none text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#c0a080]/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="relative w-full sm:w-48">
                <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c0a080]" />
                <select 
                    className="w-full bg-[#111] border border-white/10 text-white pl-11 pr-6 py-3 rounded-none text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#c0a080]/50 appearance-none"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="all">All Genres</option>
                    {[...new Set(videos.map(v => v.category))].filter(Boolean).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </motion.div>

        {/* Full Video Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-16 h-[1px] bg-[#c0a080] animate-pulse"></div>
            <div className="mx-4 text-[10px] uppercase tracking-[0.3em] text-[#c0a080]">Opening Archives</div>
            <div className="w-16 h-[1px] bg-[#c0a080] animate-pulse"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredVideos.map((video, index) => (
              <motion.div 
                key={video._id} 
                className="group flex flex-col gap-6 cursor-pointer"
                onClick={() => setSelectedVideo(video)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative aspect-video overflow-hidden rounded-lg bg-[#111] border border-white/5">
                  <video 
                    src={video.videoUrl} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    muted
                    onMouseOver={e => e.target.play()}
                    onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                        <Play size={20} className="text-[#c0a080] fill-[#c0a080]" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-[#c0a080] font-bold">
                        <span className="flex items-center gap-1.5"><Tag size={12} /> {video.category}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(video.createdAt).getFullYear()}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold group-hover:text-[#c0a080] transition-colors">{video.title}</h3>
                </div>
              </motion.div>
            ))}
            {filteredVideos.length === 0 && (
                <div className="col-span-full text-center py-32 border border-dashed border-white/10 rounded-lg">
                    <p className="text-sm text-gray-500 uppercase tracking-widest">No films match your search.</p>
                </div>
            )}
          </motion.div>
        )}
      </div>

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

export default Videos;
