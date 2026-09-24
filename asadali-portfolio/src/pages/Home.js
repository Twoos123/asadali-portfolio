import React, { useCallback, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Resume from './Resume';
import Contact from './Contact';
import About from '../components/About';
import { StaggerContainer } from '../components/animations';
import OceanLife from '../components/ocean/OceanLife';
import Seafloor from '../components/ocean/Seafloor';
import Kelp from '../components/ocean/Kelp';
import WaterSurface from '../components/ocean/WaterSurface';
import DeepLight from '../components/ocean/DeepLight';
import MarineSnow from '../components/ocean/MarineSnow';
import AbyssFloor from '../components/ocean/AbyssFloor';
import { SURFACE_COLOR, setWaterColor } from '../components/ocean/waterColor';
import Editable from '../editor/Editable';
import { useContent, useEditing } from '../editor/store';
import { AddItem, ItemControls } from '../editor/controls';
import { safeUrl } from '../editor/markup';
import { NEW_SOCIAL_LINK, SocialLinkFields, linkTargetProps, socialIcon } from '../components/socialLinks';

// Slim kelp fronds framing the page edges (desktop only).
const SIDE_KELP = {
  left: [
    { seed: 3, height: 230, offset: -14 },
    { seed: 5, height: 300, offset: 8 },
  ],
  right: [
    { seed: 9, height: 280, offset: -10 },
    { seed: 4, height: 210, offset: 12 },
  ],
};

function SideKelp({ side }) {
  return SIDE_KELP[side].map((frond, i) => (
    <div key={frond.seed} className="side-seaweed" style={{ [side]: frond.offset, opacity: 0.5 }}>
      <Kelp
        seed={frond.seed}
        height={frond.height}
        blades={0.6}
        className="seafloor-sway"
        style={{ '--sway': '3deg', '--sway-duration': `${7 + i * 1.3}s`, '--sway-delay': `${-i * 2.1}s` }}
      />
    </div>
  ));
}

function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [clouds, setClouds] = useState([]);
  const skillsRef = useRef(null);

  // Apply initial body background on mount (scroll handled by ScrollToTop globally)
  useEffect(() => {
    setWaterColor(SURFACE_COLOR);
    
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
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Ocean depth colour for the current scroll position.
  const paintDepth = useCallback(() => {
    // Ocean depth effect: darker blue at surface, deeper as you scroll
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    // With no scroll range yet (e.g. the page loads in a hidden tab or webview, so both
    // heights read 0) the division is 0/0 = NaN, which matches no colour stop and used to
    // paint the abyssal fallback at the very top of the page. Treat that as the surface.
    const scrollPercentage = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
    
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
      setWaterColor(colorStops[colorStops.length - 1].color);
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
      
      const newColor = `hsl(${currentH}, ${currentS}%, ${currentL}%)`;
      setWaterColor(newColor);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      paintDepth();
      
      // Update seaweed animation based on scroll
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = position / maxScroll;
      
      // Update god rays opacity based on scroll - fade out as we scroll down. Set on the rays
      // themselves: a custom property on <html> restyles the entire page on every scroll.
      const godRaysOpacity = Math.max(0, 1 - scrollPercent * 1.25).toFixed(3); // Disappears around 80% scroll
      const godRays = document.querySelector('.god-rays');
      if (godRays && godRays.style.getPropertyValue('--god-rays-opacity') !== godRaysOpacity) {
        godRays.style.setProperty('--god-rays-opacity', godRaysOpacity);
      }
      
      const sideSeaweed = document.querySelectorAll('.side-seaweed');
      sideSeaweed.forEach((seaweed, index) => {
        const sway = Math.sin(scrollPercent * 10 + index) * 3;
        seaweed.style.transform = `rotate(${sway}deg)`;
        
        // Fade based on scroll position
        const opacity = Math.max(0.3, 0.8 - scrollPercent * 0.4);
        seaweed.style.opacity = opacity;
      });

    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [paintDepth]);


  // Smooth scroll function
  const scrollToSkills = () => {
    if (skillsRef.current) {
      skillsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="ocean-transition relative" style={{ 
      minHeight: '100vh'
    }}>
      <div className="relative">
        {/* Darkens the water as the page gets deeper, with a pool of light at the cursor, and
            plankton drifting over it. Both sit behind every section's sea life and content. */}
        <DeepLight />
        <MarineSnow />

        {/* Side seaweed that appears as you scroll through all sections - hidden on mobile */}
        <div id="left-seaweed" className="fixed left-0 top-0 bottom-0 w-16 pointer-events-none overflow-hidden hidden md:block" style={{zIndex: 10}}>
          <SideKelp side="left" />
        </div>
        <div id="right-seaweed" className="fixed right-0 top-0 bottom-0 w-16 pointer-events-none overflow-hidden hidden md:block" style={{zIndex: 10}}>
          <SideKelp side="right" />
        </div>

        {/* Hero Section - Sky to Ocean */}
        <div className="h-screen relative flex flex-col">
          {/* God Rays - Volumetric lighting effect - Hidden on mobile */}
          {!isMobile && <div className="god-rays"></div>}
          
          {/* Background Layer (Sky + Ocean) */}
          <div className="absolute inset-0 flex flex-col z-0">
            {/* Sky Section */}
            <div className="h-1/4 md:h-1/2" style={{
              background: 'linear-gradient(to bottom, #87CEEB 0%, #98D8E8 30%, #B0E0E6 70%, #E0F6FF 100%)',
              position: 'relative' // Needed for z-index and positioning context for sun/clouds
            }}>
              {/* Sun */}
              {/* CSS animations (index.css), so the footer's pause button freezes them. */}
              <div
                className="sky-sun absolute top-8 right-16 w-20 h-20 rounded-full"
                style={{ background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)' }}
              />
              
              {/* Clouds */}
              {clouds.map((cloud) => (
                <div
                  key={cloud.id}
                  className="sky-cloud absolute rounded-full opacity-80 hidden md:block"
                  style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F8FF 100%)',
                    width: `${cloud.width}px`,
                    height: `${cloud.height}px`,
                    top: `${cloud.top}%`,
                    left: `${cloud.left}%`,
                    pointerEvents: 'none',
                    animationDuration: `${8 + cloud.id * 2}s`
                  }}
                />
              ))}
            </div>

            {/* Ocean Section - This will grow to fill the remaining space */}
            {/* Transparent: the water layer behind the page is already this colour, and the
                plankton should show through. No overlap with the sky, or its pale bottom edge
                would show as a line under the waves. */}
            <div className="flex-grow relative">
                {/* Waves, boats riding them, and ripples from clicks at the waterline */}
                <WaterSurface />
            </div>
          </div>

          {/* Underwater scene from the waterline down: seabed and reef, with sea life
              swimming between the back row and the main reef */}
          <div className="absolute inset-x-0 bottom-0 top-[calc(25%_-_10px)] md:top-[calc(50%_-_10px)] pointer-events-none" style={{ zIndex: 1 }}>
            <Seafloor>
              <OceanLife section="home" />
            </Seafloor>
          </div>

          {/* Foreground Content Layer */}
          <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-8 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] god-rays-target"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Editable path="hero.name" />
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-blue-100 mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Editable path="hero.subtitle" />
              </motion.p>
              <HeroSocial />
            </motion.div>

          </div>
        </div>
        
        <About />

        <div id='skills' ref={skillsRef}>
          <Skills />
        </div>

        <div id="projects">
          <Projects />
        </div>

        <div id="experience">
          <Experience />
        </div>

        <div id="resume">
          <Resume />
        </div>

        <Contact />

        {/* The bottom of the dive: the abyssal seabed the footer rests on */}
        <AbyssFloor />
      </div>
    </div>
  );
}

// The hero's social links: hero.social in src/content/hero.json ({ icon, label, url }).
function HeroSocial() {
  const { social } = useContent('hero');
  const editing = useEditing();
  // StaggerContainer wraps each child in its own animated item, so pass a flat list.
  const links = social.map((link, i) => (
    <SocialLink key={i} link={link} index={i} count={social.length} editing={editing} />
  ));
  return (
    <>
      <StaggerContainer
        className="flex justify-center space-x-6"
        staggerDelay={0.1}
        direction="up"
        distance={20}
      >
        {links}
      </StaggerContainer>
      {editing && (
        <div className="mt-6">
          <AddItem listPath="hero.social" template={NEW_SOCIAL_LINK} label="social link" />
        </div>
      )}
    </>
  );
}

function SocialLink({ link, index, count, editing }) {
  const path = `hero.social.${index}`;
  const { Icon, hover } = socialIcon(link.icon);
  const href = safeUrl(link.url);
  const anchor = (
    <motion.a
      href={href}
      {...linkTargetProps(href)}
      className="group relative"
      whileHover={{
        scale: 1.2,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon className={`text-4xl md:text-5xl text-white ${hover} transition-all duration-300 drop-shadow-lg`} />
      <span className="sr-only">{link.label}</span>
      {!editing && (
        <motion.span
          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-sm bg-blue-900 bg-opacity-80 text-white px-3 py-1 rounded-lg whitespace-nowrap pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Editable path={`${path}.label`} />
        </motion.span>
      )}
    </motion.a>
  );
  if (!editing) return anchor;

  // Editing: the label (normally a hover tooltip), URL and icon are shown under the icon.
  return (
    <div className="relative flex flex-col items-center gap-1.5 pt-8">
      <ItemControls listPath="hero.social" index={index} count={count} label="social link" />
      {anchor}
      <SocialLinkFields path={path} labelClassName="text-sm text-white" />
    </div>
  );
}

export default Home;
