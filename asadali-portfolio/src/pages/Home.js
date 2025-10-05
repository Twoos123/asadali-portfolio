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
    // Initialize seaweed animations
    createSeaweedAnimations();
  }, []);

  const createSeaweedAnimations = () => {
    // Home section seaweed
    createHomeSeaweed();
    // Side seaweed that responds to scroll
    createSideSeaweed();
  };

  const createHomeSeaweed = () => {
    const homeSeaweedContainer = document.getElementById('home-seaweed');
    if (!homeSeaweedContainer) return;

    // Clear existing seaweed
    homeSeaweedContainer.innerHTML = '';

    // Add seafloor/sand base
    const seafloor = document.createElement('div');
    seafloor.style.position = 'absolute';
    seafloor.style.bottom = '0';
    seafloor.style.left = '0';
    seafloor.style.right = '0';
    seafloor.style.height = '40px';
    seafloor.style.background = 'linear-gradient(to top, #a16207, #ca8a04, #eab308)';
    seafloor.style.borderRadius = '0';
    seafloor.style.zIndex = '2';
    homeSeaweedContainer.appendChild(seafloor);

    // Add some sand texture with small bumps
    for (let i = 0; i < 20; i++) {
      const sandBump = document.createElement('div');
      sandBump.style.position = 'absolute';
      sandBump.style.bottom = '20px';
      sandBump.style.left = `${Math.random() * 100}%`;
      sandBump.style.width = `${5 + Math.random() * 10}px`;
      sandBump.style.height = `${3 + Math.random() * 8}px`;
      sandBump.style.background = '#d4a574';
      sandBump.style.borderRadius = '50%';
      sandBump.style.opacity = '0.6';
      homeSeaweedContainer.appendChild(sandBump);
    }

    // Add coral decorations to the seafloor - use 5 coral types (removing the one near dive deeper)
    // Seaweed positions are at: 8%, 22%, 36%, 70%, 85%
    // Position corals to avoid seaweed conflicts and dive deeper area
    const coralPositions = [3, 15, 28, 42, 95]; // Removed 58% (near dive deeper), kept far right
    const coralTypes = [1, 2, 3, 4, 8]; // You can change these numbers (1-8) to choose which corals to display
    for (let i = 0; i < 5; i++) {
      const coralContainer = document.createElement('div');
      coralContainer.style.position = 'absolute';
      coralContainer.style.bottom = '35px'; // Slightly above seafloor
      coralContainer.style.left = `${coralPositions[i]}%`; // Use specific positions to avoid seaweed
      coralContainer.style.zIndex = '4'; // Higher than seaweed (3) to appear in front
      coralContainer.className = 'coral-decoration';
      
      // Use specific coral SVGs - change coralTypes array above to choose which ones
      const coralImg = document.createElement('img');
      coralImg.src = `/asadali-portfolio/assets/corals/coral-${coralTypes[i]}.svg`;
      coralImg.style.width = 'auto';
      coralImg.style.height = `${35 + Math.random() * 25}px`; // Bigger coral decorations (35-60px)
      coralImg.style.filter = 'hue-rotate(280deg) saturate(1.2) brightness(1.1)'; // Coral-like colors, brighter
      coralImg.style.opacity = '1.0'; // Fully opaque - no transparency
      
      coralImg.onerror = () => {
        // Fallback to colored circles if SVG not found
        coralContainer.innerHTML = '';
        coralContainer.style.width = `${15 + Math.random() * 10}px`;
        coralContainer.style.height = `${15 + Math.random() * 10}px`;
        coralContainer.style.background = '#ff6b6b';
        coralContainer.style.borderRadius = '50%';
        coralContainer.style.opacity = '0.7';
      };
      
      coralContainer.appendChild(coralImg);
      homeSeaweedContainer.appendChild(coralContainer);
    }

    // Add 5 seaweed stalks in the home section using your 4 SVGs
    for (let i = 0; i < 5; i++) {
      const seaweedContainer = document.createElement('div');
      seaweedContainer.style.position = 'absolute';
      
      // Adjust positioning to avoid center area (45-55% for dive animation) but balance sides
      let leftPosition;
      let bottomOffset = '40px'; // Position seaweed on top of 40px high seafloor
      if (i === 0) leftPosition = 8;  // Far left
      else if (i === 1) leftPosition = 22; // Left
      else if (i === 2) leftPosition = 36; // Left-center
      else if (i === 3) {
        leftPosition = 70; // Right - 2nd from right side (floating issue)
        bottomOffset = '15px'; // Force this one to bottom of container to fix floating
      }
      else leftPosition = 85; // Far right
      
      seaweedContainer.style.left = `${leftPosition}%`;
      seaweedContainer.style.bottom = bottomOffset;
      seaweedContainer.style.zIndex = '3';
      seaweedContainer.className = 'seaweed-container animate-seaweed-sway';
      seaweedContainer.style.transformOrigin = 'bottom center';
      seaweedContainer.style.animationDelay = `${Math.random() * 3}s`;
      seaweedContainer.style.animationDuration = `${3 + Math.random() * 2}s`;
      
      // Use your 4 seaweed SVGs (cycle through seaweed-1 to seaweed-4)
      const seaweedImg = document.createElement('img');
      seaweedImg.src = `/asadali-portfolio/assets/seaweed/seaweed-${(i % 4) + 1}.svg`;
      seaweedImg.style.width = 'auto';
      seaweedImg.style.height = `${120 + Math.random() * 80}px`;
      seaweedImg.style.filter = 'hue-rotate(10deg) saturate(1.1) brightness(0.9)';
      
      seaweedImg.onerror = () => {
        // Fallback to CSS seaweed if SVG not found
        seaweedContainer.innerHTML = '';
        seaweedContainer.style.width = '20px';
        seaweedContainer.style.height = `${120 + Math.random() * 80}px`;
        seaweedContainer.style.background = 'linear-gradient(to top, #065f46, #047857, #059669)';
        seaweedContainer.style.borderRadius = '10px 10px 0 0';
      };
      
      seaweedContainer.appendChild(seaweedImg);
      homeSeaweedContainer.appendChild(seaweedContainer);
    }
  };

  const createSideSeaweed = () => {
    const leftContainer = document.getElementById('left-seaweed');
    const rightContainer = document.getElementById('right-seaweed');
    
    if (!leftContainer || !rightContainer) return;

    // Clear existing
    leftContainer.innerHTML = '';
    rightContainer.innerHTML = '';



    // Create seaweed for left side
    for (let i = 0; i < 3; i++) {
      const seaweed = document.createElement('div');
      seaweed.className = 'side-seaweed animate-seaweed-sway';
      seaweed.style.position = 'absolute';
      seaweed.style.bottom = '0';
      seaweed.style.left = `${i * 30 + 5}%`; // 5%, 35%, 65% to fit all 3
      seaweed.style.width = '12px';
      seaweed.style.height = `${150 + Math.random() * 100}px`;
      seaweed.style.background = 'linear-gradient(to top, #064e3b, #065f46, #047857)';
      seaweed.style.borderRadius = '6px 6px 0 0';
      seaweed.style.transformOrigin = 'bottom center';
      seaweed.style.animationDelay = `${Math.random() * 4}s`;
      seaweed.style.animationDuration = `${4 + Math.random() * 2}s`;
      seaweed.style.opacity = '0.5';
      
      leftContainer.appendChild(seaweed);
    }

    // Create seaweed for right side (mirrored and spaced to avoid center)
    for (let i = 0; i < 3; i++) {
      const seaweed = document.createElement('div');
      seaweed.className = 'side-seaweed animate-seaweed-sway';
      seaweed.style.position = 'absolute';
      seaweed.style.bottom = '0';
      seaweed.style.right = `${i * 30 + 5}%`; // 5%, 35%, 65% to fit all 3
      seaweed.style.width = '12px';
      seaweed.style.height = `${150 + Math.random() * 100}px`;
      seaweed.style.background = 'linear-gradient(to top, #064e3b, #065f46, #047857)';
      seaweed.style.borderRadius = '6px 6px 0 0';
      seaweed.style.transformOrigin = 'bottom center';
      seaweed.style.animationDelay = `${Math.random() * 4}s`;
      seaweed.style.animationDuration = `${4 + Math.random() * 2}s`;
      seaweed.style.opacity = '0.5';
      
      rightContainer.appendChild(seaweed);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      
      // Update seaweed animation based on scroll
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = position / maxScroll;
      
      const sideSeaweed = document.querySelectorAll('.side-seaweed');
      sideSeaweed.forEach((seaweed, index) => {
        const sway = Math.sin(scrollPercent * 10 + index) * 3;
        seaweed.style.transform = `rotate(${sway}deg)`;
        
        // Fade based on scroll position
        const opacity = Math.max(0.3, 0.8 - scrollPercent * 0.4);
        seaweed.style.opacity = opacity;
      });
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
      background: `linear-gradient(to bottom, 
        ${backgroundColor} 0%, 
        ${backgroundColor} 20%, 
        rgb(30, 58, 138) 35%, 
        rgb(30, 64, 175) 50%, 
        rgb(30, 58, 138) 65%, 
        rgb(15, 23, 42) 100%)`,
      backgroundSize: '100% 500vh',
      backgroundPosition: 'center top',
      backgroundAttachment: 'fixed'
    }}>
      <div className="relative">

        {/* Side seaweed that appears as you scroll through all sections */}
        <div id="left-seaweed" className="fixed left-0 top-0 bottom-0 w-16 pointer-events-none overflow-hidden" style={{zIndex: 10}}></div>
        <div id="right-seaweed" className="fixed right-0 top-0 bottom-0 w-16 pointer-events-none overflow-hidden" style={{zIndex: 10}}></div>

        <div id="particles" className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex: 0, height: '100vh'}}></div>
        
        {/* Seaweed animations for Home section */}
        <div id="home-seaweed" className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex: 1, height: '100vh'}}></div>

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
                <span className="text-blue-100 text-sm mb-1">Dive Deeper</span>
                <motion.svg 
                  className="w-8 h-8 text-blue-100 cursor-pointer hover:text-cyan-300 transition-colors duration-300 mb-10" 
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
