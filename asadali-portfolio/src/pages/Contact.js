import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaCopy, FaCheck, FaPaperPlane } from 'react-icons/fa';
import SuccessAnimation from '../components/animations/SuccessAnimation';
import OceanLife from '../components/ocean/OceanLife';
import Editable from '../editor/Editable';
import { useContent } from '../editor/store';
import { API_BASE } from '../config';

function Contact() {
  const content = useContent('contact');
  const [emailCopied, setEmailCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { threshold: 0.3, once: true });
  const warmedRef = useRef(false);

  useEffect(() => {
    if (!titleInView || warmedRef.current) return;
    warmedRef.current = true;
    fetch(`${API_BASE}/api/health`, { method: 'GET', mode: 'cors' }).catch(() => {});
  }, [titleInView]);

  const myEmail = content.info.email;

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
    setSubmissionStatus(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFeedbackMessage(data.message || content.form.successFallback);
        setSubmissionStatus('success');
        // Cue the ocean layer's celebration (a golden school and a burst of bubbles).
        window.dispatchEvent(new Event('ocean:celebrate'));
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setFeedbackMessage(error.message || 'Failed to send message. Please try again or contact me directly via email.');
      setSubmissionStatus('error');
      // We can show an error component here if needed
      alert(error.message || 'Failed to send message. Please try again or contact me directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmissionStatus(null);
    setFeedbackMessage('');
  };

  return (
    <div className="contact-section py-16 relative bg-transparent">
      <OceanLife section="contact" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={titleRef}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Editable path="contact.eyebrow" className="eyebrow" />
          <Editable
            path="contact.heading"
            as="h1"
            className="font-display text-4xl md:text-5xl font-bold text-white mt-3 tracking-tight"
          />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {submissionStatus === 'success' ? (
              <SuccessAnimation message={feedbackMessage} onReset={resetForm} />
            ) : (
              <motion.div
                key="form"
                className="rounded-3xl border border-white/15 bg-ocean-950/40 shadow-glass p-8 md:p-10"
                style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Contact Info Section */}
                  <div className="space-y-6">
                    <Editable path="contact.info.heading" as="h2" className="font-display text-2xl font-semibold text-white mb-4 tracking-tight" />
                    <Editable path="contact.info.intro" as="p" className="text-ocean-100/80 leading-relaxed" />

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10"
                      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <FaEnvelope className="text-ocean-300 h-5 w-5 flex-shrink-0" />
                        <Editable path="contact.info.email" className="text-white truncate" />
                      </div>
                      <motion.button
                        onClick={copyEmail}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocean-500/20 hover:bg-ocean-500/30 border border-ocean-300/30 text-ocean-50 text-xs font-medium transition-colors duration-300"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {emailCopied ? <FaCheck className="h-3 w-3" /> : <FaCopy className="h-3 w-3" />}
                        <Editable path={emailCopied ? 'contact.info.copied' : 'contact.info.copy'} />
                      </motion.button>
                    </div>

                    <Editable path="contact.info.note" as="p" className="text-ocean-200/70 text-sm" />
                  </div>

                  {/* Contact Form Section */}
                  <div>
                    <Editable path="contact.form.heading" as="h2" className="font-display text-2xl font-semibold text-white mb-6 tracking-tight" />

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-ocean-200/50 focus:outline-none focus:border-ocean-300/60 focus:ring-2 focus:ring-ocean-300/20 focus:bg-white/10 transition"
                        />

                        <input
                          type="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-ocean-200/50 focus:outline-none focus:border-ocean-300/60 focus:ring-2 focus:ring-ocean-300/20 focus:bg-white/10 transition"
                        />
                      </div>

                      <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-ocean-200/50 focus:outline-none focus:border-ocean-300/60 focus:ring-2 focus:ring-ocean-300/20 focus:bg-white/10 transition"
                      />

                      <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-ocean-200/50 focus:outline-none focus:border-ocean-300/60 focus:ring-2 focus:ring-ocean-300/20 focus:bg-white/10 transition resize-none"
                      />

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-ocean-500 to-ocean-400 hover:from-ocean-400 hover:to-ocean-300 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold shadow-glow hover:shadow-glow-strong transition-all duration-300 overflow-hidden"
                        whileHover={{ scale: isSubmitting ? 1 : 1.015 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white relative z-10" />
                        ) : (
                          <FaPaperPlane className="h-4 w-4 relative z-10" />
                        )}
                        <Editable path={isSubmitting ? 'contact.form.sending' : 'contact.form.submit'} className="relative z-10" />
                      </motion.button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Contact;
