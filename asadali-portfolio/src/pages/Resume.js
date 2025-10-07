import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaExpand, FaCompress, FaExternalLinkAlt, FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import { oceanLife } from '../helpers/oceanLife';

function Resume() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isResumeLoaded, setIsResumeLoaded] = useState(false);
  const [shouldLoadResume, setShouldLoadResume] = useState(false);
  const [resumeError, setResumeError] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const titleRef = useRef(null);
  const resumeRef = useRef(null);
  const titleInView = useInView(titleRef, { threshold: 0.3, once: true });
  const resumeInView = useInView(resumeRef, { threshold: 0.1, once: true });

  // Multiple URL formats for better compatibility
  const resumeUrls = [
    "https://drive.google.com/file/d/17k-FbUlKWx263njOeZHt0rcvE-LiNiSi/preview",
    "https://docs.google.com/document/d/17k-FbUlKWx263njOeZHt0rcvE-LiNiSi/preview", 
    "https://drive.google.com/uc?id=17k-FbUlKWx263njOeZHt0rcvE-LiNiSi&export=view"
  ];
  const downloadUrl = "https://drive.google.com/file/d/17k-FbUlKWx263njOeZHt0rcvE-LiNiSi/view?usp=sharing";
  const directViewUrl = "https://drive.google.com/file/d/17k-FbUlKWx263njOeZHt0rcvE-LiNiSi/view";

  // Performance optimization: Add cache buster for fresh content when needed
  const getCachedResumeUrl = () => {
    const cacheTime = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // Cache for 24 hours
    const url = resumeUrls[currentUrlIndex];
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${cacheTime}`;
  };

  const handleResumeError = () => {
    console.log(`Resume load failed for URL ${currentUrlIndex}: ${resumeUrls[currentUrlIndex]}`);
    console.log('Attempting next URL format...');
    setResumeError(true);
    
    // Try next URL format if available
    if (currentUrlIndex < resumeUrls.length - 1) {
      setTimeout(() => {
        console.log(`Trying URL ${currentUrlIndex + 1}: ${resumeUrls[currentUrlIndex + 1]}`);
        setCurrentUrlIndex(prev => prev + 1);
        setResumeError(false);
        setIsResumeLoaded(false);
      }, 1000);
    } else {
      console.log('All resume URL formats failed. Showing fallback options.');
    }
  };

  const retryResumeLoad = () => {
    setCurrentUrlIndex(0);
    setResumeError(false);
    setIsResumeLoaded(false);
  };

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

  // Lazy load resume when section comes into view
  useEffect(() => {
    if (resumeInView && !shouldLoadResume) {
      setShouldLoadResume(true);
      
      // Preload Google Drive resources for better caching
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.href = getCachedResumeUrl();
      preloadLink.as = 'fetch';
      preloadLink.crossOrigin = 'anonymous';
      document.head.appendChild(preloadLink);
      
      // Add DNS prefetch for Google Drive
      const dnsLink = document.createElement('link');
      dnsLink.rel = 'dns-prefetch';
      dnsLink.href = 'https://drive.google.com';
      document.head.appendChild(dnsLink);
      
      return () => {
        document.head.removeChild(preloadLink);
        document.head.removeChild(dnsLink);
      };
    }
  }, [resumeInView, shouldLoadResume]);

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
        // Skip fish, kraken and jellyfish on mobile to prevent viewport issues and horizontal overflow
        if (isMobile && (creature.type === 'kraken' || creature.type === 'jellyfish' || creature.type === 'small-fish' || creature.type === 'tropical-fish')) {
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
      <div className="container mx-auto px-4 relative z-10" ref={resumeRef}>
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
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <motion.a
            href={directViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaExternalLinkAlt className="h-4 w-4" />
            Open in New Tab
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

          {resumeError && (
            <motion.button
              onClick={retryResumeLoad}
              className="flex items-center gap-2 px-6 py-3 rounded-xl backdrop-blur-md bg-red-500/20 border border-red-400/20 text-red-100 hover:bg-red-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRedo className="h-4 w-4" />
              Retry
            </motion.button>
          )}
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
          
          {shouldLoadResume ? (
            <>
              {resumeError ? (
                <div 
                  className="w-full flex flex-col items-center justify-center bg-white/5 rounded-xl border-2 border-red-400/20"
                  style={{ height: isFullscreen ? 'calc(100vh - 6rem)' : '80vh' }}
                >
                  <div className="text-center text-red-100 max-w-md px-6">
                    <FaExclamationTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
                    <h3 className="text-xl font-semibold mb-2">Resume Loading Issue</h3>
                    <p className="text-red-200 mb-6">
                      {currentUrlIndex >= resumeUrls.length - 1 
                        ? "Unable to load resume preview after trying all formats. Please use the direct links below."
                        : "There was an issue loading the resume preview. This sometimes happens with Google Drive embedding."
                      }
                    </p>
                    <div className="flex flex-col gap-3">
                      {currentUrlIndex < resumeUrls.length - 1 && (
                        <motion.button
                          onClick={retryResumeLoad}
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl backdrop-blur-md bg-blue-500/20 border border-blue-400/20 text-blue-100 hover:bg-blue-500/30 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaRedo className="h-4 w-4" />
                          Try Again
                        </motion.button>
                      )}
                      <motion.a
                        href={directViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl backdrop-blur-md bg-green-500/20 border border-green-400/20 text-green-100 hover:bg-green-500/30 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaExternalLinkAlt className="h-4 w-4" />
                        View in Google Drive
                      </motion.a>
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  key={`resume-${currentUrlIndex}`} // Force re-render when URL changes
                  src={getCachedResumeUrl()}
                  className="w-full"
                  style={{ height: isFullscreen ? 'calc(100vh - 6rem)' : '80vh' }}
                  title="Resume"
                  frameBorder="0"
                  loading="lazy"
                  allow="fullscreen"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  onLoad={() => {
                    console.log('Resume loaded successfully');
                    setIsResumeLoaded(true);
                  }}
                  onError={handleResumeError}
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
            </>
          ) : (
            <div 
              className="w-full flex items-center justify-center bg-white/5 rounded-xl"
              style={{ height: '80vh' }}
            >
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading Resume...</p>
              </div>
            </div>
          )}
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
