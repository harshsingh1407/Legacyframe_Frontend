import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Calendar, Tag, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const VideoSection = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/videos`);
        // Limit to 3 for the home page section
        setVideos(res.data.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return null;

  return (
    <section id='videos' className="py-20 bg-[#0b0b0b] border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-20">
        
        {/* Section Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative">
            <span className="absolute -left-4 top-0 w-1 h-full bg-[#c0a080]"></span>
            <h4 className="text-[#c0a080] text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-4 pl-4">Cinematography</h4>
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold leading-[1] tracking-tight pl-4">
              Cinematic <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/40 italic">Stories</span>
            </h2>
          </div>
          <Link
            to="/videos"
            className="group relative px-8 py-4 overflow-hidden border border-white/10"
          >
            <span className="absolute inset-0 bg-[#c0a080] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
            <span className="relative text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] group-hover:text-black transition-colors duration-300">
              View All Films
            </span>
          </Link>
        </motion.div>

        {/* Video Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {videos.length === 0 ? (
            <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-lg">
              <p className="text-sm text-gray-500 uppercase tracking-[0.3em]">No films yet — check back soon.</p>
            </div>
          ) : videos.map((video, index) => (
            <motion.div 
              key={video._id} 
              className="group relative cursor-pointer"
              onClick={() => setSelectedVideo(video)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-video overflow-hidden rounded-lg bg-[#111] border border-white/5">
                {/* Custom Video Preview/Player */}
                <video 
                  src={video.videoUrl} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                  muted
                  onMouseOver={e => e.target.play()}
                  onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                />
                
                {/* Overlay UI */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-[#c0a080] fill-[#c0a080]" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
                    <div className="flex items-center gap-3 md:gap-4 text-[8px] md:text-[9px] uppercase tracking-widest text-[#c0a080] font-bold mb-1.5 md:mb-2">
                        <span className="flex items-center gap-1 md:gap-1.5"><Tag size={10} className="w-2.5 h-2.5 md:w-auto md:h-auto" /> {video.category}</span>
                        <span className="flex items-center gap-1 md:gap-1.5"><Calendar size={10} className="w-2.5 h-2.5 md:w-auto md:h-auto" /> {new Date(video.createdAt).getFullYear()}</span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-white group-hover:text-[#c0a080] transition-colors line-clamp-1">{video.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
    </section>
  );
};

export default VideoSection;
