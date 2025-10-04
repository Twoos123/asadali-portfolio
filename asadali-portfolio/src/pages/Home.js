import React, { useEffect, useState, useRef } from 'react';
import { FaLinkedin, FaGithub, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import { FadeInSection, StaggerContainer, FloatingElement } from '../components/animations';

function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('rgb(0, 255, 255)'); // Initial color
  const skillsRef = useRef(null);

  // Ensure page starts at top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const create3DOceanEffects = () => {
      const particlesContainer = document.getElementById('particles');
      particlesContainer.innerHTML = ''; // Clear existing particles
      
      // Create 3D Bubble Stream
      for (let i = 0; i < 8; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-3d animate-bubble-stream';
        bubble.style.left = `${Math.random() * 100}%`;
        
        const size = Math.random() * 8 + 4;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        bubble.style.animationDelay = `${Math.random() * 12}s`;
        bubble.style.animationDuration = `${8 + Math.random() * 8}s`;
        
        particlesContainer.appendChild(bubble);
      }
      
      // Create Surface Fish (Small schooling fish)
      for (let i = 0; i < 2; i++) {
        const fish = document.createElement('div');
        fish.className = 'fish-silhouette animate-fish-surface';
        fish.innerHTML = `<img src="/asadali-portfolio/assets/fish/small-fish.svg" alt="small fish" style="width: 45px; height: 30px; filter: invert(1); animation: fish-fin-wave 2s infinite ease-in-out;"/>`;
        fish.style.top = `${20 + Math.random() * 30}%`;
        fish.style.left = '-100px'; // Start off-screen
        fish.style.animationDelay = `${Math.random() * 15}s`;
        fish.style.animationDuration = `${12 + Math.random() * 8}s`;
        
        particlesContainer.appendChild(fish);
      }
      
      // Create Multiple Jellyfish (Mid-depth) - Randomly distributed
      for (let i = 0; i < 5; i++) {
        const jellyfish = document.createElement('div');
        jellyfish.className = 'jellyfish-silhouette animate-jellyfish-float';
        jellyfish.innerHTML = `<img src="/asadali-portfolio/assets/fish/jellyfish.svg" alt="jellyfish" style="width: ${50 + Math.random() * 15}px; height: ${60 + Math.random() * 15}px; filter: invert(1); animation: jellyfish-pulse 3s infinite ease-in-out;"/>`;
        jellyfish.style.top = `${20 + Math.random() * 60}%`; // Random vertical position across more of the screen
        jellyfish.style.left = `${Math.random() * 90}%`; // Random horizontal position across the screen
        jellyfish.style.animationDelay = `${Math.random() * 15}s`;
        jellyfish.style.animationDuration = `${6 + Math.random() * 4}s`; // 6-10 second gentle floating
        
        particlesContainer.appendChild(jellyfish);
      }
    };

    create3DOceanEffects();
  }, []);

  useEffect(() => {
    // Ocean depth effect: darker blue at surface, deeper as you scroll
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollPosition / maxScroll;
    
    // Create ocean depth progression - start darker for better text visibility
    const surfaceHue = 200; // Darker blue
    const deepHue = 220; // Deep blue
    const currentHue = surfaceHue + (scrollPercentage * (deepHue - surfaceHue));
    
    const surfaceSaturation = 80;
    const deepSaturation = 95;
    const currentSaturation = surfaceSaturation + (scrollPercentage * (deepSaturation - surfaceSaturation));
    
    const surfaceLightness = 40; // Much darker at surface for text visibility
    const deepLightness = 10; // Very dark in depths
    const currentLightness = surfaceLightness - (scrollPercentage * (surfaceLightness - deepLightness));
    
    setBackgroundColor(`hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`);
  }, [scrollPosition]);

  // Smooth scroll function
  const scrollToSkills = () => {
    if (skillsRef.current) {
      skillsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="min-h-screen ocean-transition relative" style={{ 
      background: backgroundColor,
      backgroundSize: '120vw 120vh',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="relative">

        <div id="particles" className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex: 0}}></div>

        {/* Hero Section - Ocean Surface */}
        <div className="h-screen flex flex-col items-center justify-center px-4 relative pb-16">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-8 drop-shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Asad Ali
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-blue-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              4th Year Software Engineering Student | Full-Stack Developer
            </motion.p>
            <StaggerContainer 
              className="flex justify-center space-x-6" 
              staggerDelay={0.1}
              direction="up"
              distance={20}
            >
              <SocialLink href="https://www.linkedin.com/in/asadbinali/" icon={FaLinkedin} label="LinkedIn" hoverColor="hover:text-blue-300" />
              <SocialLink href="https://github.com/Twoos123" icon={FaGithub} label="GitHub" hoverColor="hover:text-gray-300" />
              <SocialLink href="mailto:masadbali190@gmail.com" icon={FaEnvelope} label="Email" hoverColor="hover:text-blue-200" />
              <SocialLink href="https://drive.google.com/file/d/17k-FbUlKWx263njOeZHt0rcvE-LiNiSi/view?usp=sharing" icon={FaFileAlt} label="Resume" hoverColor="hover:text-cyan-300" />
            </StaggerContainer>
          </motion.div>

          {/* Scroll indicator - Diving deeper */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer" 
            onClick={scrollToSkills}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          > 
            <FloatingElement intensity={1.5} duration={2}>
              <div className="flex flex-col items-center">
                <span className="text-blue-100 text-sm mb-2">Dive Deeper</span>
                <motion.svg 
                  className="w-8 h-8 text-blue-100 cursor-pointer hover:text-cyan-300 transition-colors duration-300" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </motion.svg>
              </div>
            </FloatingElement>
          </motion.div>
        </div>

        {/* Gradient transition to Skills */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-700 z-0"></div>
        
        <div id='skills' ref={skillsRef}>
          <Skills />
        </div>

        <div id="projects">
          <Projects />
        </div>

        <div id="experience">
          <Experience />
        </div>
      </div>
    </div>
  );
}

function SocialLink({ href, icon: Icon, label, hoverColor }) {
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="group relative"
      whileHover={{ 
        scale: 1.2, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon className={`text-4xl md:text-5xl text-white ${hoverColor} transition-all duration-300 drop-shadow-lg`} />
      <span className="sr-only">{label}</span>
      <motion.span 
        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-sm bg-blue-900 bg-opacity-80 text-white px-3 py-1 rounded-lg whitespace-nowrap pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
    </motion.a>
  );
}

export default Home;
