import React, { useEffect, useRef } from 'react';
import ProjectItem from '../components/ProjectItem';
import { projectList } from "../helpers/ProjectList";
import { motion, useInView } from 'framer-motion';

function Projects() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { threshold: 0.3, once: true });
  useEffect(() => {
    const createDeepSeaCreatures = () => {
      const projectsSection = document.querySelector('.projects');
      let creaturesContainer = projectsSection.querySelector('.creatures-container');
      
      if (!creaturesContainer) {
        creaturesContainer = document.createElement('div');
        creaturesContainer.className = 'creatures-container absolute inset-0 pointer-events-none overflow-hidden';
        creaturesContainer.style.zIndex = '0'; // Behind content but visible
        projectsSection.appendChild(creaturesContainer);
      }
      
      creaturesContainer.innerHTML = '';
      
      // Fewer bubbles in deeper water
      for (let i = 0; i < 3; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-3d animate-bubble-stream';
        bubble.style.left = `${Math.random() * 100}%`;
        
        const size = Math.random() * 5 + 2;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        bubble.style.animationDelay = `${Math.random() * 15}s`;
        bubble.style.animationDuration = `${12 + Math.random() * 10}s`;
        
        creaturesContainer.appendChild(bubble);
      }
      
      // Add larger deep-sea fish
      const deepFish = document.createElement('div');
      deepFish.className = 'fish-silhouette animate-fish-deep';
      deepFish.innerHTML = `<img src="/asadali-portfolio/assets/fish/shark.svg" alt="shark" style="width: 80px; height: 45px; filter: invert(1);"/>`;
      deepFish.style.top = `${30 + Math.random() * 40}%`;
      deepFish.style.animationDuration = `${15 + Math.random() * 10}s`;
      
      creaturesContainer.appendChild(deepFish);
      
      // Add an octopus
      const octopus = document.createElement('div');
      octopus.className = 'deep-creature-silhouette animate-fish-deep';
      octopus.innerHTML = `<img src="/asadali-portfolio/assets/fish/octopus.svg" alt="octopus" style="width: 60px; height: 60px; filter: invert(1); animation: octopus-tentacle-wave 3s infinite ease-in-out;"/>`;
      octopus.style.top = `${60 + Math.random() * 20}%`;
      
      creaturesContainer.appendChild(octopus);
    };

    createDeepSeaCreatures();
  }, []);

  return (
    <div className="projects py-16 ocean-transition relative" style={{
      backgroundSize: '120vw 120vh',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    }}>
      <motion.h1 
        ref={titleRef}
        className="text-4xl font-bold text-center text-blue-100 mb-12 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Personal Projects
      </motion.h1>
      <div className="projectList grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto justify-items-center relative z-10">
        {projectList.map((project, index) => (
          <ProjectItem 
            key={project.id}
            id={project.id} 
            name={project.name} 
            description={project.description}
            image={project.image} 
            skills={project.skills} 
            repoUrl={project.repoUrl}
            animationDelay={index * 0.1}
          />
        ))}
      </div>
      
      {/* Gradient transition to Experience */}
    </div>
  );
}

export default Projects;
