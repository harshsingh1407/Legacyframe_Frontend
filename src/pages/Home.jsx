import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import PortfolioSection from '../components/PortfolioSection';
import VideoSection from '../components/VideoSection';
import ContactUs from '../components/ContactUs';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      // Small timeout to allow the DOM to render the section properly
      setTimeout(() => {
        document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      // Clear the state so it doesn't keep scrolling on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="w-full bg-[#0b0b0b] text-white flex flex-col relative font-sans overflow-x-hidden">
      {/* Container for Hero and Navbar */}
      <div className="w-full flex flex-col relative">
        <Navbar />
        <div className="w-full flex items-center justify-center overflow-visible">
          <Hero />
        </div>
      </div>

      {/* Other Sections below */}
      <AboutUs />
      <PortfolioSection />
      <VideoSection />
      <ContactUs />
    </div>
  );
};

export default Home;
