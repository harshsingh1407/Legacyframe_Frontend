import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const PortfolioSection = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/portfolio`);
        // Limit to first 12 for the homepage section
        setPortfolios(res.data.slice(0, 12));
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
    <section id="portfolio" className="relative w-full py-8 md:py-12 lg:py-16 bg-[#0b0b0b] text-white overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[#c0a080]/5 to-transparent pointer-events-none -z-10"></div>
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-20">

        {/* Section Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative">
            <span className="absolute -left-4 top-0 w-1 h-full bg-[#c0a080]"></span>
            <h4 className="text-[#c0a080] text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-4 pl-4">Selected Works</h4>
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold leading-[1] tracking-tight pl-4">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/40 italic">Moments</span>
            </h2>
          </div>

          <Link
            to="/portfolio"
            className="group relative px-8 py-4 overflow-hidden border border-white/10"
          >
            <span className="absolute inset-0 bg-[#c0a080] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
            <span className="relative text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] group-hover:text-black transition-colors duration-300">
              View All Archive
            </span>
          </Link>
        </motion.div>

        {/* Uniform Premium Grid */}
        {portfolios.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {portfolios.map((item, index) => (
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
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
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
          </motion.div>
        ) : (
          <div className="text-center py-32 text-gray-600 border border-white/5 bg-white/5 backdrop-blur-sm rounded-lg">
            <p className="text-sm uppercase tracking-widest">No masterpieces captured yet.</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default PortfolioSection;
