import React, { useEffect, useState, useRef } from 'react';
import { FaLinkedin, FaGithub, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Wave from 'react-wavify';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Resume from './Resume';
import Contact from './Contact';
import { StaggerContainer, FloatingElement } from '../components/animations';

function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('hsl(195, 70%, 55%)');
  const [isMobile, setIsMobile] = useState(false);
  const [clouds, setClouds] = useState([]);
  const skillsRef = useRef(null);

  // Ensure page starts at top on load and apply initial body background
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.backgroundColor = 'hsl(195, 70%, 55%)';
    
    // Generate fixed cloud positions once
    const cloudData = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      width: 60 + Math.random() * 40,
      height: 30 + Math.random() * 20,
      top: 10 + Math.random() * 15,
      left: Math.random() * 100
    }));
    setClouds(cloudData);
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Cleanup function to reset body background when component unmounts
    return () => {
      document.body.style.backgroundColor = '';
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Home section seaweed
    createHomeSeaweed();
    // Side seaweed that responds to scroll
    createSideSeaweed();
  }, [isMobile]); // Add isMobile dependency to recreate seaweed when mobile state changes

  const createHomeSeaweed = () => {
    const homeSeaweedContainer = document.getElementById('home-seaweed');
    if (!homeSeaweedContainer) return;

    // Clear existing seaweed
    homeSeaweedContainer.innerHTML = '';

    // Add seafloor/sand base - positioned at bottom of underwater container
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

    // Add some sand texture with small bumps - fixed positions and sizes for consistency
    const sandBumpPositions = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95]; // Fixed positions
    for (let i = 0; i < 10; i++) {
      const sandBump = document.createElement('div');
      sandBump.style.position = 'absolute';
      sandBump.style.bottom = '20px';
      sandBump.style.left = `${sandBumpPositions[i]}%`; // Use fixed positions
      sandBump.style.width = `${6 + (i % 3) * 2}px`; // Sizes: 6px, 8px, 10px pattern
      sandBump.style.height = `${4 + (i % 2) * 3}px`; // Heights: 4px, 7px pattern
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
    const coralCount = isMobile ? 2 : 5; // Reduce corals on mobile for performance
    for (let i = 0; i < coralCount; i++) {
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
      // Fixed coral heights for consistency - no more random sizing
      const coralHeight = isMobile ? 25 : 45; // Mobile: 25px, Desktop: 45px
      coralImg.style.height = `${coralHeight}px`;
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

    // Add seaweed stalks in the home section using your 4 SVGs (reduced to 2 on mobile)
    const seaweedCount = isMobile ? 2 : 5; // Reduce seaweed on mobile for cleaner look
    for (let i = 0; i < seaweedCount; i++) {
      const seaweedContainer = document.createElement('div');
      seaweedContainer.style.position = 'absolute';
      
      // Adjust positioning to avoid center area (45-55% for dive animation) but balance sides
      let leftPosition;
      let bottomOffset = '40px'; // Default fixed position on top of 40px high seafloor
      
      if (isMobile) {
        // Mobile: only 2 seaweed - one left, one right
        if (i === 0) leftPosition = 20;      // Left side
        else leftPosition = 60;              // Right side
      } else {
        // Desktop: 5 seaweed positioned to avoid center and spread out more evenly
        if (i === 0) leftPosition = 8;   // Far left
        else if (i === 1) leftPosition = 22; // Left
        else if (i === 2) leftPosition = 36; // Left-center
        else if (i === 3) {
          leftPosition = 70; // Right (moved back from 75%)
          bottomOffset = '20px'; // Move this seaweed down a bit
        }
        else leftPosition = 85; // Far right (moved back from 90%)
      }
      
      seaweedContainer.style.left = `${leftPosition}%`;
      seaweedContainer.style.bottom = bottomOffset;
      seaweedContainer.style.zIndex = '3';
      seaweedContainer.className = 'seaweed-container animate-seaweed-sway';
      seaweedContainer.style.transformOrigin = 'bottom center';
      seaweedContainer.style.animationDuration = `${3 + (i * 0.5)}s`; // Fixed animation durations: 3s, 3.5s, 4s, etc.
      
      // Use your 4 seaweed SVGs (cycle through seaweed-1 to seaweed-4)
      const seaweedImg = document.createElement('img');
      seaweedImg.src = `/asadali-portfolio/assets/seaweed/seaweed-${(i % 4) + 1}.svg`;
      seaweedImg.style.width = 'auto';
      // Fixed seaweed heights for consistency - no more random sizing
      const seaweedHeight = isMobile ? 140 : 160; // Mobile: 140px, Desktop: 160px
      seaweedImg.style.height = `${seaweedHeight}px`;
      seaweedImg.style.filter = 'hue-rotate(10deg) saturate(1.1) brightness(0.9)';
      
      seaweedImg.onerror = () => {
        // Fallback to CSS seaweed if SVG not found
        seaweedContainer.innerHTML = '';
        seaweedContainer.style.width = '20px';
        seaweedContainer.style.height = `${seaweedHeight}px`;
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
      if (!particlesContainer) return;
      particlesContainer.innerHTML = ''; // Clear existing particles
      
      // Create 3D Bubble Stream
      for (let i = 0; i < 8; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-3d animate-bubble-stream';
        bubble.style.left = `${Math.random() * 100}%`;
        
        const size = Math.random() * 8 + 4;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        bubble.style.animationDuration = `${8 + Math.random() * 8}s`;
        
        particlesContainer.appendChild(bubble);
      }
      
      // Create Surface Fish (Small schooling fish) - Position in hero section underwater area
      for (let i = 0; i < 3; i++) {
        const fish = document.createElement('div');
        fish.className = 'fish-silhouette animate-fish-surface';
        fish.innerHTML = `<img src="/asadali-portfolio/assets/fish/small-fish.svg" alt="small fish" style="width: 45px; height: 30px; filter: invert(1); animation: fish-fin-wave 2s infinite ease-in-out;"/>`;
        fish.style.top = `${75 + Math.random() * 20}%`; // Position higher in underwater section (45-65% of hero)
        fish.style.left = '-100px'; // Start off-screen
        fish.style.animationDuration = `${12 + Math.random() * 8}s`;
        fish.style.position = 'absolute';
        fish.style.zIndex = '1'; // Behind everything (seaweed z-index 3, seafloor z-index 2)
        
        particlesContainer.appendChild(fish);
      }
      
      // Create Multiple Jellyfish - Grid-based positioning to prevent overlapping (Hidden on mobile)
      if (!isMobile) {
        const jellyfishGrid = [
          { x: 15, y: 25, width: 55, height: 65, delay: 2, duration: 8 }, // Top-left area
          { x: 50, y: 36, width: 60, height: 70, delay: 7, duration: 9 }, // Top-center area  
          { x: 80, y: 25, width: 52, height: 62, delay: 12, duration: 7 }, // Top-right area
          { x: 25, y: 30, width: 58, height: 68, delay: 5, duration: 10 }, // Bottom-left area
          { x: 65, y: 35, width: 53, height: 63, delay: 10, duration: 6 }, // Bottom-center area
          { x: 85, y: 27, width: 57, height: 67, delay: 15, duration: 8 }  // Bottom-right area
        ];
        
        for (let i = 0; i < 6; i++) {
          const jellyfish = document.createElement('div');
          jellyfish.className = 'jellyfish-silhouette animate-jellyfish-float';
          jellyfish.innerHTML = `<img src="/asadali-portfolio/assets/fish/jellyfish.svg" alt="jellyfish" style="width: ${jellyfishGrid[i].width}px; height: ${jellyfishGrid[i].height}px; filter: invert(1); animation: jellyfish-pulse 3s infinite ease-in-out;"/>`;
          
          // Use grid positions to prevent overlapping
          jellyfish.style.top = `${jellyfishGrid[i].y}%`;
          jellyfish.style.left = `${jellyfishGrid[i].x}%`;
          jellyfish.style.animationDuration = `${jellyfishGrid[i].duration}s`;
          jellyfish.style.position = 'absolute';
          jellyfish.style.zIndex = '100'; // Above wave but below content
          jellyfish.style.pointerEvents = 'none';
          jellyfish.style.opacity = '0.6'; // Slightly transparent for natural look
          
          particlesContainer.appendChild(jellyfish);
        }
      }
    };

    create3DOceanEffects();
  }, [isMobile]); // Add isMobile dependency to recreate effects when mobile state changes

  useEffect(() => {
    // Ocean depth effect: darker blue at surface, deeper as you scroll
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.min(scrollPosition / maxScroll, 1);
    
    // Extended ocean depth colors to cover entire page flow
    const colorStops = [
      { position: 0.0, color: 'hsl(195, 70%, 55%)' },    // Surface - light ocean blue (Home)
      { position: 0.15, color: 'hsl(200, 75%, 45%)' },   // Shallow (Skills)
      { position: 0.35, color: 'hsl(205, 80%, 35%)' },   // Medium (Projects)
      { position: 0.55, color: 'hsl(210, 85%, 25%)' },   // Deep (Experience)
      { position: 0.70, color: 'hsl(215, 88%, 20%)' },   // Deeper (Resume)
      { position: 0.85, color: 'hsl(220, 90%, 15%)' },   // Very deep (Contact)
      { position: 1.0, color: 'hsl(230, 95%, 8%)' }      // Abyssal - near black (Footer)
    ];
    
    // Find the two closest color stops
    let startStop, endStop;
    for (let i = 0; i < colorStops.length - 1; i++) {
      if (scrollPercentage >= colorStops[i].position && scrollPercentage <= colorStops[i + 1].position) {
        startStop = colorStops[i];
        endStop = colorStops[i + 1];
        break;
      }
    }
    
    if (!startStop || !endStop) {
      // Fallback if something goes wrong
      setBackgroundColor(colorStops[colorStops.length - 1].color);
      return;
    }
    
    // Calculate interpolation between the two stops
    const localProgress = (scrollPercentage - startStop.position) / 
                         (endStop.position - startStop.position);
    
    // Parse HSL values
    const startMatch = startStop.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    const endMatch = endStop.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    
    if (startMatch && endMatch) {
      const startH = parseInt(startMatch[1]);
      const startS = parseInt(startMatch[2]);
      const startL = parseInt(startMatch[3]);
      
      const endH = parseInt(endMatch[1]);
      const endS = parseInt(endMatch[2]);
      const endL = parseInt(endMatch[3]);
      
      const currentH = startH + (endH - startH) * localProgress;
      const currentS = startS + (endS - startS) * localProgress;
      const currentL = startL + (endL - startL) * localProgress;
      
      setBackgroundColor(`hsl(${currentH}, ${currentS}%, ${currentL}%)`);
    }
    
    // Apply the background color to the body element for seamless full-page coverage
    document.body.style.backgroundColor = backgroundColor;
  }, [scrollPosition, backgroundColor]);

  // Smooth scroll function
  const scrollToSkills = () => {
    if (skillsRef.current) {
      skillsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="ocean-transition relative" style={{ 
      background: `linear-gradient(to bottom, 
        ${backgroundColor} 0%, 
        hsl(200, 75%, 45%) 15%, 
        hsl(205, 80%, 35%) 35%, 
        hsl(210, 85%, 25%) 55%, 
        hsl(215, 88%, 20%) 70%, 
        hsl(220, 90%, 15%) 85%, 
        hsl(230, 95%, 8%) 100%)`,
      backgroundSize: '100% 100%',
      backgroundPosition: 'center top',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
      <div className="relative">

        {/* Side seaweed that appears as you scroll through all sections - hidden on mobile */}
        <div id="left-seaweed" className="fixed left-0 top-0 bottom-0 w-16 pointer-events-none overflow-hidden hidden md:block" style={{zIndex: 10}}></div>
        <div id="right-seaweed" className="fixed right-0 top-0 bottom-0 w-16 pointer-events-none overflow-hidden hidden md:block" style={{zIndex: 10}}></div>

        <div id="particles" className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex: 5, height: '200vh'}}></div>
        
        {/* Seaweed animations for Home section */}
        <div id="home-seaweed" className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex: 1, height: '100vh'}}></div>

        {/* Hero Section - Sky to Ocean */}
        <div className="h-screen relative">
          {/* Sky Section - Top 25% on mobile (ocean goes higher), 50% on desktop */}
          <div className="absolute top-0 left-0 w-full h-1/4 md:h-1/2" style={{
            background: 'linear-gradient(to bottom, #87CEEB 0%, #98D8E8 30%, #B0E0E6 70%, #E0F6FF 100%)',
            zIndex: 1
          }}>
            {/* Sun */}
            <motion.div 
              className="absolute top-8 right-16 w-20 h-20 rounded-full"
              style={{ background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)' }}
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Clouds - Slow animations, not scroll-based */}
            {clouds.map((cloud) => (
              <motion.div
                key={cloud.id}
                className="absolute rounded-full opacity-80 hidden md:block"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F8FF 100%)',
                  width: `${cloud.width}px`,
                  height: `${cloud.height}px`,
                  top: `${cloud.top}%`,
                  left: `${cloud.left}%`,
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
                animate={{
                  x: [0, 3, 0], // Very gentle horizontal movement
                  y: [0, -1, 0] // Very gentle vertical movement
                }}
                transition={{
                  duration: 8 + cloud.id * 2, // Faster speeds: 8s, 10s, 12s, 14s, 16s, 18s
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Wave Section - Hidden on mobile */}
          {!isMobile && (
            <div className="absolute bottom-0 left-0 w-full" style={{ zIndex: 3, height: '60%', top: '40%', background: 'transparent' }}>
              {/* Wave layers for ocean surface - consistent surface color */}
            
              <Wave
                fill="hsl(199, 75%, 50%)"
                paused={false}
                options={{
                  height: 35, // Increased from 20 to 35 for taller waves
                  amplitude: 40, // Increased amplitude for more dramatic waves
                  speed: 0.25,
                  points: 5
                }}
                style={{ position: 'absolute', top: '-50px', width: '100%' }}
              />
            </div>
          )}

          {/* Boats floating above waves - Hidden on mobile */}
          {!isMobile && (
            <div className="absolute bottom-0 left-0 w-full" style={{ zIndex: 4, height: '60%', top: '40%', background: 'transparent', pointerEvents: 'none' }}>
              {/* Boat 1 - Left side */}
              <div 
                className="absolute animate-boat-bob"
                style={{ 
                  left: '20%', 
                  top: '-5.1%',
                  animationDelay: '0s',
                  animationDuration: '4s'
                }}
              >
                <img 
                  src="/asadali-portfolio/assets/boats/boat-1.svg" 
                  alt="Boat 1" 
                  className="w-16 h-auto"
                />
              </div>
              
              {/* Boat 2 - Right side */}
              <div 
                className="absolute animate-boat-bob"
                style={{ 
                  left: '90%', 
                  top: '-7%',
                  animationDelay: '0s',
                  animationDuration: '3s'
                }}
              >
                <img 
                  src="/asadali-portfolio/assets/boats/boat-2.svg" 
                  alt="Boat 2" 
                  className="w-20 h-auto"
                />
              </div>
            </div>
          )}

          {/* Content - Centered */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
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
               
              </StaggerContainer>
            </motion.div>

            {/* Scroll indicator - Diving deeper - Hidden on mobile */}
            {!isMobile && (
              <motion.div 
                className={`absolute left-1/2 transform -translate-x-1/2 z-20 cursor-pointer ${isMobile ? 'bottom-4' : 'bottom-8'}`}
                style={{
                  left: '50%', // Explicit center positioning
                  transform: 'translateX(-50%)', // Perfect horizontal centering
                }}
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
            )}
          </div>
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

        {/* Add Resume Section */}
        <Resume />
        
        {/* Add Contact Section */}
        <Contact />
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
