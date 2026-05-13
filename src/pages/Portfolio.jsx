import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

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

      <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-20">

        {/* Page Header */}
        <div className="mb-12 md:mb-20 text-center max-w-2xl mx-auto">
          <h4 className="text-[#c0a080] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4">Complete Archive</h4>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 md:mb-8">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Masterpieces</span>
          </h1>
          <p className="text-gray-400 text-[13px] md:text-sm leading-relaxed tracking-wide">
            Explore our complete collection of studio works. Each frame represents our dedication to the craft of monochrome photography, capturing timeless moments across the globe.
          </p>
        </div>

        {/* Extensive Grid Structure */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c0a080]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[250px] gap-4 md:gap-6">
            {portfolios.length > 0 ? (
              portfolios.map((item, index) => (
                <div
                  key={item._id || index}
                  className={`relative overflow-hidden group border border-[#1a1a1a] transition-all duration-500 hover:border-[#c0a080]/50 ${item.spanClass || ''}`}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <span className="text-[#c0a080] text-[10px] uppercase tracking-widest mb-1">{item.category}</span>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                <p>No masterpieces found in our collection yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Portfolio;
