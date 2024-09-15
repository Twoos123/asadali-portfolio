import React, { useEffect, useState, useRef } from 'react';
import { FaLinkedin, FaGithub, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';

function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('rgb(0, 255, 255)'); // Initial color
  const skillsRef = useRef(null);

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
    const createParticles = () => {
      const particlesContainer = document.getElementById('particles');
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute bg-white rounded-full opacity-20 animate-float';
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();
  }, []);

  useEffect(() => {
    // Update the background color based on scroll position
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollPosition / maxScroll;
    const blue = Math.max(0, 255 - Math.floor(scrollPercentage * 255));
    setBackgroundColor(`rgb(0, ${blue}, ${Math.floor(blue * 1.5)})`);
  }, [scrollPosition]);

  // Smooth scroll function
  const scrollToSkills = () => {
    if (skillsRef.current) {
      skillsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="min-h-screen transition-colors duration-300" style={{ backgroundColor }}>
      <div className="relative">

        <div id="particles" className="fixed inset-0 pointer-events-none overflow-hidden"></div>

        {/* Hero Section */}
        <div className="h-screen flex flex-col items-center justify-center px-4 relative pb-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-black mb-8 animate-fade-in-up">
              Asad Ali
            </h1>
            <p className="text-xl md:text-2xl text-black mb-8 animate-fade-in-up animation-delay-300">
              Full-Stack Developer | Problem Solver | Tech Enthusiast
            </p>
            <div className="flex justify-center space-x-6 animate-fade-in-up animation-delay-600">
              <SocialLink href="https://www.linkedin.com/in/asadbinali/" icon={FaLinkedin} label="LinkedIn" hoverColor="hover:text-blue-500" />
              <SocialLink href="https://github.com/Twoos123" icon={FaGithub} label="GitHub" hoverColor="hover:text-gray-500" />
              <SocialLink href="mailto:masadbali190@gmail.com" icon={FaEnvelope} label="Email" hoverColor="hover:text-red-500" />
              <SocialLink href="https://drive.google.com/file/d/1ryk_3gcH17wOEyteb3HakdiKBiGf8MaE/view?usp=sharing" icon={FaFileAlt} label="Resume" hoverColor="hover:text-green-500" />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20" onClick={scrollToSkills}> 
            <svg className="w-8 h-8 text-black animate-bounce cursor-pointer" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
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
      </div>
    </div>
  );
}

function SocialLink({ href, icon: Icon, label, hoverColor }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group">
      <Icon className={`text-4xl md:text-5xl text-black ${hoverColor} transition-colors duration-300`} />
      <span className="sr-only">{label}</span>
      <span className="hidden group-hover:block absolute mt-2 text-sm bg-gray-800 text-white px-2 py-1 rounded">
        {label}
      </span>
    </a>
  );
}

export default Home;
