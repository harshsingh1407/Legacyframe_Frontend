import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PortfolioSection = () => {
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

  if (loading) {
    return (
      <section id="portfolio" className="relative w-full py-16 bg-[#0b0b0b] text-white flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c0a080]"></div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="relative w-full py-16 md:py-24 lg:py-32 bg-[#0b0b0b] text-white">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-20">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div>
            <h4 className="text-[#c0a080] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4">Selected Works</h4>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Portfolio</span>
            </h2>
          </div>

          <Link
            to="/portfolio"
            className="px-6 py-2.5 border border-[#2a2a2a] text-gray-300 hover:bg-[#c0a080] hover:text-black hover:border-[#c0a080] transition-all duration-300 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            Explore More Works
          </Link>
        </div>

        {/* Grid Structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[220px] lg:auto-rows-[250px] gap-4 md:gap-5 lg:gap-6">
          {portfolios.length > 0 ? (
            portfolios.map((item, index) => (
              <div
                key={item._id || index}
                className={`relative overflow-hidden group border border-[#1a1a1a] transition-all duration-500 hover:border-[#c0a080]/50 ${item.spanClass || ''}`}
              >
                {/* Image */}
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
              <p>No portfolio items found. Please add some to the database.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default PortfolioSection;
