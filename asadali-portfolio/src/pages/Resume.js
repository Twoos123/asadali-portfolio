import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaDownload, FaExpand, FaCompress } from 'react-icons/fa';
import { oceanLife } from '../helpers/oceanLife';

function Resume() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { threshold: 0.3, once: true });

  // Replace with your actual Google Drive resume link
  const resumeUrl = "https://drive.google.com/file/d/17k-FbUlKWx263njOeZHt0rcvE-LiNiSi/preview";
  const downloadUrl = "https://drive.google.com/file/d/17k-FbUlKWx263njOeZHt0rcvE-LiNiSi/view?usp=sharing";

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Add escape key listener for fullscreen mode
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isFullscreen]);

  // Mobile detection effect
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

  // Ocean life effects
  useEffect(() => {
    const createOceanEffects = () => {
      const resumeSection = document.querySelector('.resume-section');
      if (!resumeSection) return;

      let creaturesContainer = resumeSection.querySelector('.creatures-container');
      if (!creaturesContainer) {
        creaturesContainer = document.createElement('div');
        creaturesContainer.className = 'creatures-container';
        creaturesContainer.style.position = 'absolute';
        creaturesContainer.style.top = '0';
        creaturesContainer.style.left = '0';
        creaturesContainer.style.width = '100%';
        creaturesContainer.style.height = '100%';
        creaturesContainer.style.pointerEvents = 'none';
        creaturesContainer.style.zIndex = '1';
        resumeSection.appendChild(creaturesContainer);
      }
      creaturesContainer.innerHTML = '';

      const sectionLife = oceanLife.resume;

      // Bubbles
      for (let i = 0; i < sectionLife.bubbles; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-3d animate-bubble-stream';
        bubble.style.position = 'absolute';
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.bottom = '0px';
        const size = Math.random() * 6 + 3;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.animationDuration = `${10 + Math.random() * 8}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        creaturesContainer.appendChild(bubble);
      }

      // Creatures - filter out kraken and jellyfish on mobile
      sectionLife.creatures.forEach((creature, creatureIndex) => {
        // Skip kraken and jellyfish on mobile to prevent viewport issues
        if (isMobile && (creature.type === 'kraken' || creature.type === 'jellyfish')) {
          return; // Skip this creature on mobile
        }
        for (let i = 0; i < creature.count; i++) {
          const el = document.createElement('div');
          el.style.position = 'absolute';
          el.style.pointerEvents = 'none';
          el.style.zIndex = creature.zIndex;

          let innerHTML = `<img src="/asadali-portfolio/assets/fish/${creature.type}.svg" alt="${creature.type}" style="`;
          
          for (const [key, value] of Object.entries(creature.styles)) {
            const finalValue = typeof value === 'function' ? value(i) : value;
            innerHTML += `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${finalValue}; `;
          }
          innerHTML += `"/>`;
          el.innerHTML = innerHTML;

          // Set position
          for (const [key, value] of Object.entries(creature.position)) {
            const finalValue = typeof value === 'function' ? value(i) : value;
            el.style[key] = finalValue;
          }

          // Set animation
          if (creature.animation.className) {
            el.classList.add(creature.animation.className);
            if (creature.animation.duration) {
              const duration = typeof creature.animation.duration === 'function' ? 
                creature.animation.duration(i) : creature.animation.duration;
              el.style.animationDuration = `${duration}s`;
            }
            if (creature.animation.delay) {
              const delay = typeof creature.animation.delay === 'function' ? 
                creature.animation.delay(i) : creature.animation.delay;
              el.style.animationDelay = `${delay}s`;
            }
          }
          
          creaturesContainer.appendChild(el);
        }
      });
    };

    createOceanEffects();
  }, [isMobile]); // Recreate ocean effects when mobile state changes

  return (
    <div className="resume-section py-16 relative bg-transparent" style={{
      minHeight: '100vh'
    }}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.h1 
          ref={titleRef}
          className="text-4xl font-bold text-center text-blue-100 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Resume
        </motion.h1>

        {/* Resume Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload className="h-4 w-4" />
            Download PDF
          </motion.a>
          
          <motion.button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-6 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFullscreen ? <FaCompress className="h-4 w-4" /> : <FaExpand className="h-4 w-4" />}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </motion.button>
        </div>

        {/* Resume Iframe */}
        <motion.div
          className={`mx-auto rounded-2xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/20 shadow-2xl ${
            isFullscreen ? 'fixed top-20 left-4 right-4 bottom-4 z-50' : 'max-w-4xl'
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Fullscreen Close Button */}
          {isFullscreen && (
            <div className="absolute top-4 left-4 z-60">
              <motion.button
                onClick={toggleFullscreen}
                className="flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md bg-black/20 border border-white/20 text-white hover:bg-black/40 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Exit Fullscreen"
              >
                <FaCompress className="h-4 w-4" />
              </motion.button>
            </div>
          )}
          
          <iframe
            src={resumeUrl}
            className="w-full"
            style={{ height: isFullscreen ? 'calc(100vh - 6rem)' : '80vh' }}
            title="Resume"
            frameBorder="0"
          />
        </motion.div>

        {/* Fullscreen Overlay */}
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleFullscreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>
    </div>
  );
}

export default Resume;
