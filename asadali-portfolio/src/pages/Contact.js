import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaEnvelope, FaCopy, FaCheck, FaPaperPlane } from 'react-icons/fa';

function Contact() {
  const [emailCopied, setEmailCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { threshold: 0.3, once: true });

    const myEmail = "masadbali190@gmail.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(myEmail);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://asadali-portfolio.onrender.com/api/contact'
        : 'http://localhost:5000/api/contact';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormData({ name: '', email: '', subject: '', message: '' });
        alert('Message sent successfully! You should receive a confirmation email shortly.');
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.message || 'Failed to send message. Please try again or contact me directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-section py-16 relative bg-transparent" style={{
      minHeight: '100vh'
    }}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.h1 
          ref={titleRef}
          className="text-4xl font-bold text-center text-gray-100 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Let's Connect
        </motion.h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                I'm always open to discussing new opportunities, interesting projects, 
                or just having a chat about technology. Feel free to reach out!
              </p>

              {/* Email with Copy Functionality */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-gray-300 h-5 w-5" />
                    <span className="text-white">{myEmail}</span>
                  </div>
                  <motion.button
                    onClick={copyEmail}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {emailCopied ? <FaCheck className="h-3 w-3" /> : <FaCopy className="h-3 w-3" />}
                    {emailCopied ? 'Copied!' : 'Copy'}
                  </motion.button>
                </div>

                <div className="text-center mt-4">
                  <p className="text-gray-300 text-sm">
                    💡 You can also find my LinkedIn and GitHub links in the footer below
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
                
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
                
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
                />
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-medium transition-colors duration-300"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <FaPaperPlane className="h-4 w-4" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
