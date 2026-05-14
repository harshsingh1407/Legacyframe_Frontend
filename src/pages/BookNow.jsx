import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const BookNow = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    date: '',
    service: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  // Get admin WhatsApp number from environment variables
  const ADMIN_WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Store in MongoDB
      await axios.post(`${import.meta.env.VITE_API_URL}/api/booking`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        date: formData.date,
        message: `Location: ${formData.location} | Details: ${formData.message}`
      });

      // 2. Format WhatsApp Message
      const waMessage = `*New Booking Request*%0A%0A` +
        `*Name:* ${formData.name}%0A` +
        `*Phone:* ${formData.phone}%0A` +
        `*Service:* ${formData.service}%0A` +
        `*Date:* ${new Date(formData.date).toLocaleString()}%0A` +
        `*Location:* ${formData.location}%0A` +
        `*Message:* ${formData.message}`;

      // 3. Redirect to WhatsApp
      const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${waMessage}`;
      window.open(waUrl, '_blank');

      toast.success('Booking request sent! Redirecting to WhatsApp...');
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        date: '',
        service: '',
        message: ''
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to process booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0b0b] text-white flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      
      <div className="flex-1 w-full max-w-[1000px] mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-20 flex flex-col items-center">
        
        {/* Page Header */}
        <motion.div 
          className="mb-10 md:mb-16 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="text-[#c0a080] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4">Reservations</h4>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
            Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Session</span>
          </h1>
          <p className="text-gray-400 text-[13px] md:text-sm leading-relaxed tracking-wide">
            Fill out the form below to secure your date. After submitting, you will be redirected to WhatsApp to finalize the details with our team.
          </p>
        </motion.div>

        {/* Booking Form */}
        <motion.div 
          className="w-full bg-[#111111] border border-[#1a1a1a] p-6 sm:p-10 md:p-16 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-[#141414] rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              
              <div className="flex flex-col gap-3">
                <label htmlFor="name" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#2a2a2a] pb-2 text-white text-sm focus:outline-none focus:border-[#c0a080] transition-colors rounded-none"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="email" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#2a2a2a] pb-2 text-white text-sm focus:outline-none focus:border-[#c0a080] transition-colors rounded-none"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="phone" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Mobile Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#2a2a2a] pb-2 text-white text-sm focus:outline-none focus:border-[#c0a080] transition-colors rounded-none"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="location" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Location / Venue</label>
                <input 
                  type="text" 
                  id="location" 
                  value={formData.location}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#2a2a2a] pb-2 text-white text-sm focus:outline-none focus:border-[#c0a080] transition-colors rounded-none"
                  placeholder="Studio or Specific Address"
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="date" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Date & Time</label>
                <input 
                  type="datetime-local" 
                  id="date" 
                  value={formData.date}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#2a2a2a] pb-2 text-white text-sm focus:outline-none focus:border-[#c0a080] transition-colors rounded-none appearance-none"
                  style={{ colorScheme: 'dark' }}
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="service" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Session Type / Subject</label>
                <input 
                  type="text" 
                  id="service" 
                  value={formData.service}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#2a2a2a] pb-2 text-white text-sm focus:outline-none focus:border-[#c0a080] transition-colors rounded-none"
                  placeholder="e.g. Portrait, Editorial, Wedding"
                  required
                />
              </div>

            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="message" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Project Description & Details</label>
              <textarea 
                id="message" 
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="bg-transparent border-b border-[#2a2a2a] pb-2 text-white text-sm focus:outline-none focus:border-[#c0a080] transition-colors resize-none rounded-none leading-relaxed"
                placeholder="Tell us more about your vision, specific requirements, or any questions you might have..."
                required
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="mt-6 px-10 py-4 bg-[#c0a080] text-black hover:bg-white transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em] w-full md:max-w-[250px] md:mx-auto"
            >
              {loading ? 'Processing...' : 'Confirm Request'}
            </button>
            
          </form>
        </motion.div>
        
      </div>
    </div>
  );
};

export default BookNow;
