import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative w-full py-16 md:py-24 lg:py-32 bg-[#0b0b0b] text-white overflow-hidden border-t border-[#1a1a1a]">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#111] rounded-full opacity-30 blur-3xl -z-10"></div>
      <div className="absolute top-10 left-10 w-16 h-16 md:w-24 md:h-24 border border-[#2a2a2a] rounded-full opacity-20 pointer-events-none"></div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col lg:flex-row gap-12 md:gap-16 lg:gap-24">
        
        {/* Left Side: Contact Info */}
        <motion.div 
          className="flex-1 w-full flex flex-col justify-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h4 className="text-[#c0a080] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4">Get In Touch</h4>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight mb-6 md:mb-8">
            Let's Craft Your <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Legacy</span>
          </h2>
          
          <p className="text-gray-400 text-[13px] md:text-sm leading-relaxed tracking-wide max-w-md mb-8 md:mb-12">
            Whether you have a specific vision in mind or need guidance on how to best capture your story, we are here to collaborate. Reach out to schedule a consultation or session.
          </p>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-8">
            <div>
              <h5 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-2">Studio Location</h5>
              <p className="text-gray-300 text-[13px] md:text-sm tracking-wide">Bhandup West - 400078</p>
            </div>
            <div>
              <h5 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-2">Contact Details</h5>
              <p className="text-gray-300 text-[13px] md:text-sm tracking-wide">tejasshigavan05@gmail.com<br />+91 8600008056</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Contact Form */}
        <motion.div 
          className="flex-1 w-full mt-8 lg:mt-0"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-[#111111] border border-[#1a1a1a] p-6 sm:p-8 md:p-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-transparent border-b border-[#2a2a2a] pb-2 text-white text-sm focus:outline-none focus:border-[#c0a080] transition-colors rounded-none"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-transparent border-b border-[#2a2a2a] pb-2 text-white text-sm focus:outline-none focus:border-[#c0a080] transition-colors rounded-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#2a2a2a] pb-2 text-white text-sm focus:outline-none focus:border-[#c0a080] transition-colors rounded-none"
                  placeholder="Portrait Session Inquiry"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Your Message</label>
                <textarea 
                  id="message" 
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-transparent border-b border-[#2a2a2a] pb-2 text-white text-sm focus:outline-none focus:border-[#c0a080] transition-colors resize-none rounded-none"
                  placeholder="Tell us about what you want to create..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`mt-4 px-8 py-4 border ${success ? 'bg-green-600 border-green-600 text-white' : 'bg-transparent border-[#c0a080] text-[#c0a080] hover:bg-[#c0a080] hover:text-black'} transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em] w-full md:w-fit`}
              >
                {loading ? 'Sending...' : success ? 'Message Sent!' : 'Send Message'}
              </button>
            </form>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ContactUs;
