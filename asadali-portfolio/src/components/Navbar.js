import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../assets/AsadLogo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [navBackground, setNavBackground] = useState('transparent');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollPercent = scrollY / (windowHeight * 4); // 4 sections total

      if (scrollPercent < 0.25) {
        // Home section
        setNavBackground('rgba(59, 130, 246, 0.3)'); // blue-500 with transparency
      } else if (scrollPercent < 0.5) {
        // Skills section
        setNavBackground('rgba(30, 58, 138, 0.8)'); // blue-800 with transparency
      } else if (scrollPercent < 0.75) {
        // Projects section
        setNavBackground('rgba(30, 64, 175, 0.8)'); // blue-700 with transparency
      } else {
        // Experience section
        setNavBackground('rgba(15, 23, 42, 0.9)'); // slate-900 with transparency
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (sectionId) => {
    setIsOpen(false);
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="backdrop-blur-sm shadow-lg fixed w-full z-50 border-b border-blue-700 border-opacity-30"
      style={{ backgroundColor: navBackground }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center h-14 ${isMobile ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex items-center ${isMobile ? 'absolute left-4' : ''}`}>
            <motion.button 
              onClick={handleLogoClick} 
              className="flex-shrink-0 z-20"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <img className="h-8 w-8" src={logo} alt="Logo" />
            </motion.button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" onClick={() => handleScrollToSection('#home')} className="text-blue-100 hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-xl font-medium transition-all duration-300">Home</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" onClick={() => handleScrollToSection('#skills')} className="text-blue-100 hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-xl font-medium transition-all duration-300">Skills</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" onClick={() => handleScrollToSection('#projects')} className="text-blue-100 hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-xl font-medium transition-all duration-300">Projects</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" onClick={() => handleScrollToSection('#experience')} className="text-blue-100 hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-xl font-medium transition-all duration-300">Experience</Link>
              </motion.div>
            </div>
          </div>
          <div className={`flex items-center ${isMobile ? 'absolute right-4' : ''}`}>
            <div className="flex md:hidden z-50">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-blue-800 inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                aria-controls="mobile-menu"
                aria-expanded={isOpen ? "true" : "false"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="sr-only">Open main menu</span>
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-0 bg-blue-900 bg-opacity-95 backdrop-blur-sm z-30"
            id="mobile-menu"
          >
            <motion.div 
              className="px-2 pt-16 pb-3 space-y-1 sm:px-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" onClick={() => handleScrollToSection('#home')} className="text-blue-100 hover:bg-blue-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-300">Home</Link>
              </motion.div>
              <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" onClick={() => handleScrollToSection('#skills')} className="text-blue-100 hover:bg-blue-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-300">Skills</Link>
              </motion.div>
              <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" onClick={() => handleScrollToSection('#projects')} className="text-blue-100 hover:bg-blue-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-300">Projects</Link>
              </motion.div>
              <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" onClick={() => handleScrollToSection('#experience')} className="text-blue-100 hover:bg-blue-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-300">Experience</Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
