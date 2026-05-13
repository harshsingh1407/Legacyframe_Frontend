import React from 'react';

const AboutUs = () => {
  return (
    <section id="about" className="relative w-full py-16 md:py-24 lg:py-32 bg-[#0b0b0b] text-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#111] opacity-50 z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] border border-[#2a2a2a] rounded-full z-0 opacity-40 pointer-events-none"></div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-24">
        
        {/* Left Side: Image */}
        <div className="flex-1 w-full relative order-2 md:order-1">
          <div className="relative aspect-[4/5] max-w-[400px] lg:max-w-[500px] mx-auto overflow-hidden group">
            <img 
              src="/assets/about_studio.png" 
              alt="Photography Studio" 
              className="w-full h-full object-cover filter drop-shadow-[0_0_30px_rgba(0,0,0,1)] mix-blend-lighten transition-transform duration-1000 ease-in-out scale-100 group-hover:scale-105"
            />
            {/* Elegant Border Frame */}
            <div className="absolute inset-0 border border-[#c0a080] opacity-30 m-4 pointer-events-none transition-all duration-700 group-hover:m-6 group-hover:opacity-50"></div>
          </div>
          {/* Subtle Decorative Elements */}
          <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 lg:-right-16 w-32 h-32 md:w-48 md:h-48 bg-[#141414] rounded-full -z-10"></div>
          <div className="absolute -top-4 -left-4 w-12 h-12 md:w-16 md:h-16 border border-[#2a2a2a] rounded-full -z-10"></div>
        </div>

        {/* Right Side: Text Content */}
        <div className="flex-1 w-full order-1 md:order-2">
          <h4 className="text-[#c0a080] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4">Discover Our Studio</h4>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight mb-6 md:mb-8">
            Capturing the <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Unseen Essence</span>
          </h2>
          
          <div className="space-y-4 md:space-y-6 text-gray-400 text-[11px] sm:text-sm lg:text-base leading-relaxed tracking-wide max-w-lg">
            <p>
              For over a decade, we have dedicated ourselves to the art of monochrome photography. We believe that stripping away color reveals the raw, unfiltered truth of a moment, highlighting the textures, contrasts, and emotions that often go unnoticed.
            </p>
            <p>
              Our studio is equipped with state-of-the-art lighting and an environment designed to make you feel at ease, allowing your genuine self to shine through the lens.
            </p>
          </div>
          
          <div className="mt-8 md:mt-12 flex items-center gap-6 md:gap-8">
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-bold text-white tracking-widest">15+</span>
              <span className="text-[8px] md:text-[9px] text-[#c0a080] uppercase tracking-[0.2em] mt-2 font-bold">Years Experience</span>
            </div>
            <div className="h-10 w-[1px] bg-[#2a2a2a]"></div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-bold text-white tracking-widest">5k</span>
              <span className="text-[8px] md:text-[9px] text-[#c0a080] uppercase tracking-[0.2em] mt-2 font-bold">Portraits Taken</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
