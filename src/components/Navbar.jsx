import React, { useState } from 'react';
import { Aperture, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollClick = (id) => {
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  const navLinks = [
    { name: 'About Us', id: 'about', type: 'scroll' },
    { name: 'Portfolio', id: 'portfolio', type: 'scroll' },
    { name: 'Videos', id: 'videos', type: 'scroll' },
    { name: 'Contact us', id: 'contact', type: 'scroll' },
  ];

  return (
    <nav className="w-full relative z-[100] flex items-center justify-between px-6 py-5 md:px-10 lg:px-20 max-w-[1600px] mx-auto text-sm">
      <Link to="/" className="flex items-center gap-3 cursor-pointer z-[110]">
        <span className="font-semibold text-gray-200 tracking-wide hover:text-white transition-colors duration-300">@legacyframe.co</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-10 text-gray-400 font-medium">
        {navLinks.map((link) => (
          link.type === 'scroll' ? (
            <button 
              key={link.id}
              onClick={() => handleScrollClick(link.id)} 
              className="hover:text-white transition-colors duration-300 cursor-pointer">
              {link.name}
            </button>
          ) : (
            <Link key={link.path} to={link.path} className="hover:text-white transition-colors duration-300">
              {link.name}
            </Link>
          )
        ))}
      </div>

      <div className="hidden md:block">
        <Link to="/book" className="font-medium text-gray-200 hover:text-white uppercase tracking-wider text-xs border border-gray-800 px-4 py-2 hover:border-[#c0a080] transition-all">
          Book Now
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-gray-200 z-[110]"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#0b0b0b] z-[105] flex flex-col items-center justify-center gap-8 transition-transform duration-500 ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        {navLinks.map((link) => (
          link.type === 'scroll' ? (
            <button 
              key={link.id}
              onClick={() => handleScrollClick(link.id)} 
              className="text-2xl text-gray-300 hover:text-white font-medium uppercase tracking-widest">
              {link.name}
            </button>
          ) : (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl text-gray-300 hover:text-white font-medium uppercase tracking-widest"
            >
              {link.name}
            </Link>
          )
        ))}
        <Link 
          to="/book" 
          onClick={() => setIsMenuOpen(false)}
          className="mt-4 font-medium text-[#c0a080] hover:text-white uppercase tracking-[0.2em] text-sm border border-[#c0a080] px-8 py-3"
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

