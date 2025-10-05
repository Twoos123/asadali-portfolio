import React, { useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import "react-vertical-timeline-component/style.min.css";
import { FaBriefcase, FaHandsHelping } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FadeInSection } from '../components/animations';
import uOttaHack from "../assets/uOttaHack.JPG";
import eightbyeight from "../assets/8x8.svg";
import SESA from "../assets/SESA.jpg";
import uOttawa from "../assets/uottawa.svg";  
import HealthCanada from "../assets/health-canada.png";

function Experience() {
  useEffect(() => {
    const createAbyssalCreatures = () => {
      const experienceSection = document.querySelector('.experience-section');
      let creaturesContainer = experienceSection.querySelector('.creatures-container');
      
      if (!creaturesContainer) {
        creaturesContainer = document.createElement('div');
        creaturesContainer.className = 'creatures-container absolute inset-0 pointer-events-none overflow-hidden';
        creaturesContainer.style.zIndex = '0'; // Behind content but visible
        experienceSection.appendChild(creaturesContainer);
      }
      
      creaturesContainer.innerHTML = '';
      
      // Very few bubbles in abyssal depths
      for (let i = 0; i < 2; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-3d animate-bubble-stream';
        bubble.style.left = `${Math.random() * 100}%`;
        
        const size = Math.random() * 4 + 1;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        bubble.style.animationDelay = `${Math.random() * 20}s`;
        bubble.style.animationDuration = `${15 + Math.random() * 15}s`;
        
        creaturesContainer.appendChild(bubble);
      }
      
      // Add bioluminescent deep-sea creatures
      const anglerfish = document.createElement('div');
      anglerfish.className = 'deep-creature-silhouette animate-deep-creature';
      anglerfish.innerHTML = `<img src="/asadali-portfolio/assets/fish/anglerfish.svg" alt="anglerfish" style="width: 55px; height: 40px; filter: invert(1); animation: anglerfish-lure 2s infinite ease-in-out;"/>`;
      anglerfish.style.top = `${40 + Math.random() * 30}%`;
      anglerfish.style.animationDelay = `${Math.random() * 5}s`; // Shorter delay for testing
      
      creaturesContainer.appendChild(anglerfish);
      
      // Add a mysterious deep creature
      const deepCreature = document.createElement('div');
      deepCreature.className = 'deep-creature-silhouette animate-deep-creature';
      deepCreature.innerHTML = `<img src="/asadali-portfolio/assets/fish/giant-squid.svg" alt="giant squid" style="width: 75px; height: 60px; filter: invert(1); animation: squid-undulate 2.5s infinite ease-in-out;"/>`;
      deepCreature.style.top = `${60 + Math.random() * 20}%`;
      deepCreature.style.animationDelay = `${Math.random() * 8}s`; // Shorter delay for testing
      deepCreature.style.animationDuration = '22s';
      
      creaturesContainer.appendChild(deepCreature);
    };

    createAbyssalCreatures();
  }, []);

  return (
    <div className="experience-section relative min-h-screen" style={{
      backgroundSize: '120vw 120vh',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    }}>
      <FadeInSection direction="up" delay={0.2} threshold={0.3}>
        <div className='py-16 text-center relative z-10'>
          <h1 className="text-4xl font-bold text-blue-100">Experience</h1>
        </div>
      </FadeInSection>
      
      <div className="relative z-10">
        <FadeInSection direction="up" delay={0.3} threshold={0.2}>
          <VerticalTimeline lineColor="#ffffff">
          <VerticalTimelineElement 
            className="vertical-timeline-element--work"
            date={<span className="text-blue-200 font-semibold">2025 October - Present</span>}
            iconStyle={{ background: '#059669', color: '#fff', transform: 'scale(1.2)' }}
            icon={<FaBriefcase />}
            contentStyle={{ background: 'rgba(0, 0, 128, 0.7)', color: '#fff', transform: 'scale(1.02)' }}
            contentArrowStyle={{ borderRight: '7px solid rgba(0, 0, 128, 0.7)' }}
          >
            <div className="mb-3">
              <motion.div 
                className="flex items-center justify-center bg-white bg-opacity-10 rounded-lg p-3 mb-4 transition-all duration-500"
                whileHover={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <h3 className="text-xl font-bold text-blue-100">University of Ottawa - Faculty of Law</h3>
                <motion.img 
                  src={uOttawa} 
                  alt="uOttawa" 
                  className="w-15 h-14 ml-3 rounded-full object-cover bg-white p-1 shadow-lg" 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <h4 className="text-lg text-blue-200 mb-2 text-center font-semibold">Web Developer and Content Support</h4>
              <p className="text-blue-100 text-center leading-relaxed">Supporting web development initiatives and content management for the Faculty of Law, enhancing digital presence and user experience for academic resources.</p>
            </div>
          </VerticalTimelineElement>

          <VerticalTimelineElement 
            className="vertical-timeline-element--work"
            date={<span className="text-blue-200 font-semibold">2025 May - 2025 August</span>}
            iconStyle={{ background: '#059669', color: '#fff', transform: 'scale(1.2)' }}
            icon={<FaBriefcase />}
            contentStyle={{ background: 'rgba(0, 0, 128, 0.7)', color: '#fff', transform: 'scale(1.02)' }}
            contentArrowStyle={{ borderRight: '7px solid rgba(0, 0, 128, 0.7)' }}
          >
            <div className="mb-3">
              <motion.div 
                className="flex items-center justify-center bg-white bg-opacity-10 rounded-lg p-3 mb-4 transition-all duration-500"
                whileHover={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <h3 className="text-xl font-bold text-blue-100">Health Canada</h3>
                <motion.img 
                  src={HealthCanada} 
                  alt="Health Canada" 
                  className="w-12 h-12 ml-3 rounded object-contain bg-white p-1 shadow-lg" 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <h4 className="text-lg text-blue-200 mb-2 text-center font-semibold">Software Engineer Intern</h4>
              <p className="text-blue-100 text-center leading-relaxed">Developing dynamic fullstack applications using Python and Streamlit to streamline data analysis and enhance decision-making processes for health policy initiatives.</p>
            </div>
          </VerticalTimelineElement>

          <VerticalTimelineElement 
            className="vertical-timeline-element--volunteer"
            date={<span className="text-purple-200 font-semibold">2024 September - Present</span>}
            iconStyle={{ background: '#7c3aed', color: '#fff', transform: 'scale(1.2)' }}
            icon={<FaHandsHelping />}
            contentStyle={{ background: 'rgba(0, 0, 128, 0.7)', color: '#fff', transform: 'scale(1.02)' }}
            contentArrowStyle={{ borderRight: '7px solid rgba(0, 0, 128, 0.7)' }}
          >
            <div className="mb-3 animate-fade-in-up animation-delay-600">
              <div className="flex items-center justify-center bg-white bg-opacity-10 rounded-lg p-3 mb-4 hover:bg-opacity-20 transition-all duration-500">
                <h3 className="text-xl font-bold text-purple-100">uOttawa Software Engineering Student Association (SESA)</h3>
                <img src={SESA} alt="uOttawa SESA" className="w-12 h-12 ml-3 rounded-full object-cover shadow-lg hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-lg text-purple-200 mb-2 text-center font-semibold">Co-Director</h4>
              <p className="text-purple-100 text-center leading-relaxed">Co-directing the uOttawa SESA team, collaborating on strategic initiatives, and ensuring the smooth operation of all association activities.</p>
            </div>
          </VerticalTimelineElement>

          <VerticalTimelineElement 
            className="vertical-timeline-element--volunteer"
            date={<span className="text-purple-200 font-semibold">2024 April - 2024 September</span>}
            iconStyle={{ background: '#7c3aed', color: '#fff', transform: 'scale(1.2)' }}
            icon={<FaHandsHelping />}
            contentStyle={{ background: 'rgba(0, 0, 128, 0.7)', color: '#fff', transform: 'scale(1.02)' }}
            contentArrowStyle={{ borderRight: '7px solid rgba(0, 0, 128, 0.7)' }}
          >
            <div className="mb-3 animate-fade-in-up animation-delay-900">
              <div className="flex items-center justify-center bg-white bg-opacity-10 rounded-lg p-3 mb-4 hover:bg-opacity-20 transition-all duration-500">
                <h3 className="text-xl font-bold text-purple-100">uOttawa Software Engineering Student Association (SESA)</h3>
                <img src={SESA} alt="uOttawa SESA" className="w-12 h-12 ml-3 rounded-full object-cover shadow-lg hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-lg text-purple-200 mb-2 text-center font-semibold">Development Lead</h4>
              <p className="text-purple-100 text-center leading-relaxed">Overseeing the Development team at uOttawa SESA, driving innovation and managing project execution to support the association's goals.</p>
            </div>
          </VerticalTimelineElement>

          <VerticalTimelineElement 
            className="vertical-timeline-element--work"
            date={<span className="text-blue-200 font-semibold">2024 January - 2024 May</span>}
            iconStyle={{ background: '#059669', color: '#fff', transform: 'scale(1.2)' }}
            icon={<FaBriefcase />}
            contentStyle={{ background: 'rgba(0, 0, 128, 0.7)', color: '#fff', transform: 'scale(1.02)' }}
            contentArrowStyle={{ borderRight: '7px solid rgba(0, 0, 128, 0.7)' }}
          >
            <div className="mb-3 animate-fade-in-up animation-delay-1200">
              <div className="flex items-center justify-center bg-white bg-opacity-10 rounded-lg p-3 mb-4 hover:bg-opacity-20 transition-all duration-500">
                <h3 className="text-xl font-bold text-blue-100">Fuze: an 8x8 Company</h3>
                <img src={eightbyeight} alt="Fuze: an 8x8 Company" className="w-12 h-12 ml-3 rounded object-contain bg-white p-1 shadow-lg hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-lg text-blue-200 mb-2 text-center font-semibold">Software Engineer Intern</h4>
              <p className="text-blue-100 text-center leading-relaxed">Completed a CO-OP term at 8x8 as a Software Engineer Intern, focusing on designing and implementing robust APIs to support scalable solutions.</p>
            </div>
          </VerticalTimelineElement>

          <VerticalTimelineElement 
            className="vertical-timeline-element--volunteer"
            date={<span className="text-purple-200 font-semibold">2023 June - 2024 March</span>}
            iconStyle={{ background: '#7c3aed', color: '#fff', transform: 'scale(1.2)' }}
            icon={<FaHandsHelping />}
            contentStyle={{ background: 'rgba(0, 0, 128, 0.7)', color: '#fff', transform: 'scale(1.02)' }}
            contentArrowStyle={{ borderRight: '7px solid rgba(0, 0, 128, 0.7)' }}
          >
            <div className="mb-3 animate-fade-in-up">
              <div className="flex items-center justify-center bg-white bg-opacity-10 rounded-lg p-3 mb-4 hover:bg-opacity-20 transition-all duration-500">
                <h3 className="text-xl font-bold text-purple-100">uOttaHack: Ottawa's Largest Hackathon</h3>
                <img src={uOttaHack} alt="uOttaHack 6" className="w-12 h-12 ml-3 rounded object-cover shadow-lg hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-lg text-purple-200 mb-2 text-center font-semibold">Logistics Organizer</h4>
              <p className="text-purple-100 text-center leading-relaxed">Coordinated logistics for uOttaHack 6, including food arrangements, networking activities, and challenge organization during the 36-hour event.</p>
            </div>
          </VerticalTimelineElement>

          <VerticalTimelineElement 
            iconStyle={{ background: 'transparent', border: 'none' }}
          />
          </VerticalTimeline>
        </FadeInSection>
      </div>
      
      {/* Gradient transition to Footer */}
    </div>
  );
}

export default Experience;