import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Search, Filter, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/portfolio`);
        setPortfolios(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);



  return (
    <div className="w-full min-h-screen bg-[#0b0b0b] text-white flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-10 lg:px-20 py-8 md:py-12 lg:py-16">

        {/* Page Header */}
        <motion.div 
          className="mb-12 md:mb-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-block px-4 py-1 border border-[#c0a080]/30 rounded-full mb-6">
            <span className="text-[#c0a080] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em]">The Complete Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-[1] tracking-tight mb-8">
            The <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 italic">Masterpieces</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed tracking-wide max-w-2xl mx-auto opacity-70">
            A curated journey through our lens. Each frame captures a singular moment, distilled into its purest form through monochrome excellence.
          </p>
        </motion.div>

        {/* Filter Section */}
        <motion.div 
          className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex items-center gap-3">
            <LayoutGrid size={18} className="text-[#c0a080]" />
            <h2 className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-white/80">Explore Gallery</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Category Dropdown */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c0a080]">
                <Filter size={14} />
              </div>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-44 bg-[#111] border border-white/10 text-white pl-11 pr-6 py-3 rounded-none text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#c0a080]/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Genres</option>
                {[...new Set(portfolios.map(p => p.category))].filter(Boolean).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c0a080]">
                <Search size={14} />
              </div>
              <input 
                type="text"
                placeholder="SEARCH MASTERPIECE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-[#111] border border-white/10 text-white pl-11 pr-6 py-3 rounded-none text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#c0a080]/50 transition-colors placeholder:text-white/20"
              />
            </div>
          </div>
        </motion.div>

        {/* Premium Portfolio Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-16 h-[1px] bg-[#c0a080] animate-pulse"></div>
            <div className="mx-4 text-[10px] uppercase tracking-[0.3em] text-[#c0a080]">Loading Collection</div>
            <div className="w-16 h-[1px] bg-[#c0a080] animate-pulse"></div>
          </div>
        ) : (
          <div className="w-full">
            {portfolios.filter(item => {
              const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
              const searchLower = searchQuery.toLowerCase();
              const matchesSearch = (item.title || '').toLowerCase().includes(searchLower) || 
                                  (item.category || '').toLowerCase().includes(searchLower);
              return matchesCategory && matchesSearch;
            }).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {portfolios
                  .filter(item => {
                    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
                    const searchLower = searchQuery.toLowerCase();
                    const matchesSearch = (item.title || '').toLowerCase().includes(searchLower) || 
                                        (item.category || '').toLowerCase().includes(searchLower);
                    return matchesCategory && matchesSearch;
                  })
                  .map((item, index) => (
                  <motion.div
                    key={item._id || index}
                    className="group relative overflow-hidden bg-[#111] aspect-[4/5] border border-white/5"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* Image Container */}
                    <div className="w-full h-full">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        loading="lazy"
                        className="w-full h-full object-fill transition-transform duration-1000 ease-out group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Premium Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                      <div className="overflow-hidden mb-1">
                        <span className="block text-[#c0a080] text-[10px] uppercase tracking-[0.3em] font-bold transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100">
                          {item.category}
                        </span>
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-xl font-bold text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-200">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[1px] border-r-[1px] border-[#c0a080]/0 group-hover:w-8 group-hover:h-8 group-hover:border-[#c0a080]/40 transition-all duration-500"></div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 text-gray-600 border border-white/5 bg-white/5 backdrop-blur-sm rounded-lg">
                <p className="text-sm uppercase tracking-widest">No masterpieces found in our collection yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Portfolio;
