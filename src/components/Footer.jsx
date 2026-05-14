import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#0b0b0b] border-t border-[#1a1a1a] py-6 text-center">
      <div className="max-w-[1600px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4">
        <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-semibold">
          &copy; {currentYear} <span className="text-[#c0a080]">Legacy Frame</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
