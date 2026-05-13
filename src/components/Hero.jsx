import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const images = [
  "/assets/model_portrait.png",
  "/assets/model_portrait_2.png",
  "/assets/model_portrait_3.png"
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipePower = Math.abs(offset.x) * velocity.x;

    if (swipePower < -5000 || offset.x < -50) {
      // Swipe left (next image)
      setDirection(1);
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (swipePower > 5000 || offset.x > 50) {
      // Swipe right (prev image)
      setDirection(-1);
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full flex items-center overflow-hidden py-10 md:py-16 lg:py-6">
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6 h-full">

        {/* Left Content */}
        <div className="w-full md:flex-1 text-center md:text-left z-20 mt-2 md:mt-0">
          <h1 className="text-[2.2rem] sm:text-5xl lg:text-[3.0rem] xl:text-[4.0rem] font-bold leading-[1.1] tracking-tight mb-4 lg:mb-6 uppercase">
            <span className="block">Photography</span>
            <span className="block">Studio</span>
          </h1>

          <h2 className="text-[10px] sm:text-sm lg:text-lg font-bold mb-3 tracking-[0.3em] text-[#c0a080] uppercase">
            Who we are?
          </h2>

          <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm max-w-[280px] sm:max-w-sm lg:max-w-md mb-6 lg:mb-8 leading-relaxed tracking-wide mx-auto md:mx-0">
            Lorem ipsum dolor sit amet consectetur. Morbi diam urna amet faucibus tortor amet proin. Eget bibendum elit nisi ridiculus massa ridiculus. Posuere semper posuere nam.
          </p>

          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-5 py-2.5 lg:px-8 lg:py-3.5 border border-[#c0a080] text-[#c0a080] hover:bg-[#c0a080] hover:text-black transition-all duration-300 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-12">
            Read More About Us
          </button>

          <div className="flex items-center justify-center md:justify-start gap-8 text-gray-500 font-semibold text-[15px] tracking-wider mb-6 md:mb-0">
            <a href="#" className="hover:text-white transition-colors duration-300"><FaFacebook /></a>
            <a href="#" className="hover:text-white transition-colors duration-300"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition-colors duration-300"><FaTwitter /></a>
          </div>
        </div>

        {/* Right Content - Carousel */}
        <div className="w-full md:flex-1 relative flex justify-center items-center py-6 md:py-0 overflow-visible z-10">

          {/* Square container that scales circle and image together */}
          <div className="relative w-[85vw] sm:w-[400px] md:w-[90%] lg:w-[80%] max-w-[650px] aspect-square flex justify-center items-end">

            {/* The Circles */}
            <div className="absolute inset-0 m-auto w-[100%] h-[100%] bg-[#141414] rounded-full z-0 opacity-40 blur-3xl md:blur-sm pointer-events-none"></div>
            <div className="absolute inset-0 m-auto w-[90%] h-[90%] border border-[#2a2a2a] rounded-full z-0 pointer-events-none opacity-50 md:opacity-100"></div>

            {/* The Image Container */}
            <div className="relative z-10 w-full h-[115%] flex justify-center items-end cursor-grab active:cursor-grabbing">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={handleDragEnd}
                  alt="Model Portrait"
                  className="absolute bottom-0 h-full w-auto max-w-none object-contain filter drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] mix-blend-lighten select-none pointer-events-none md:pointer-events-auto"
                />
              </AnimatePresence>
            </div>

            {/* Dark gradient overlay at bottom to blend into the main background seamlessly */}
            <div className="absolute -bottom-[5%] left-1/2 -translate-x-1/2 w-[120%] h-[20%] bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/90 to-transparent pointer-events-none z-20"></div>

            {/* Slide Indicator */}
            <div className="hidden md:block absolute -right-2 sm:-right-6 md:-right-2 lg:-right-8 top-1/2 -translate-y-1/2 flex flex-col items-center z-30">
              <div className="text-white font-medium text-base lg:text-2xl tracking-widest relative">
                {String(currentIndex + 1).padStart(2, '0')}
                <span className="text-gray-600 text-[9px] absolute -bottom-1 -right-4 md:-right-6">/ 03</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
