import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import ProjectItem from '../components/ProjectItem';
import { projectList } from "../helpers/ProjectList";
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaJava, FaPython, FaHtml5, FaCss3, FaJs, FaReact, FaNodeJs, FaFlask } from 'react-icons/fa';
import { SiSpringboot, SiDocker, SiGnubash, SiGit, SiAndroidstudio, SiFirebase, SiPostman, SiKubernetes, SiJira, SiJenkins, SiOpenai, SiCplusplus, SiChakraui, SiElixir, SiMongodb, SiRedis, SiStripe, SiCloudinary, SiGraphql, SiPygame, SiKotlin, SiSqlite, SiVite, SiTypescript, SiTailwindcss, SiExpress } from 'react-icons/si';
import { DiMysql } from 'react-icons/di';
import { TbBrandOauth } from "react-icons/tb";
import { FaSearch, FaFilter } from 'react-icons/fa';

// Move skill mappings OUTSIDE to prevent recreation
const skillIconMap = {
  'Vite': SiVite,
  'TypeScript': SiTypescript,
  'React': FaReact,
  'Tailwind CSS': SiTailwindcss,
  'Groq API': SiOpenai,
  'Node.js': FaNodeJs,
  'Express': SiExpress,
  'Stripe': SiStripe,
  'MongoDB': SiMongodb,
  'Redis': SiRedis,
  'JWT': TbBrandOauth,
  'Cloudinary': SiCloudinary,
  'Chakra UI': SiChakraui,
  'OpenAI': SiOpenai,
  'Gadget': SiGit,
  'GraphQL': SiGraphql,
  'Python': FaPython,
  'JavaScript': FaJs,
  'Open Trivia API': FaJs,
  'Kotlin': SiKotlin,
  'Java': FaJava,
  'Firebase': SiFirebase,
  'SQLite': SiSqlite,
  'Android Studio': SiAndroidstudio,
  'Flask': FaFlask,
  'Co:Here NLP': SiOpenai,
  'HTML/CSS': FaHtml5,
};

const skillColorMap = {
  'Vite': '#646CFF',
  'React': '#61DAFB',
  'Tailwind CSS': '#06B6D4',
  'Groq API': '#FF6B35',
  'Node.js': '#339933',
  'Express': '#000000',
  'Stripe': '#635BFF',
  'MongoDB': '#47A248',
  'Redis': '#DC382D',
  'JWT': '#000000',
  'Cloudinary': '#3448C5',
  'Chakra UI': '#319795',
  'OpenAI': '#412991',
  'Gadget': '#F05032',
  'GraphQL': '#E10098',
  'Python': '#3776AB',
  'Pygame': '#3776AB',
  'JavaScript': '#F7DF1E',
  'Open Trivia API': '#F7DF1E',
  'Kotlin': '#7F52FF',
  'Java': '#ED8B00',
  'Firebase': '#FFCA28',
  'SQLite': '#003B57',
  'Android Studio': '#3DDC84',
  'Flask': '#000000',
  'Co:Here NLP': '#412991',
  'HTML/CSS': '#E34F26',
};

// Move SkillIcon OUTSIDE the Projects component
const SkillIcon = React.memo(({ skill }) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = skillIconMap[skill];
  const color = skillColorMap[skill] || '#6B7280';
  
  if (!IconComponent) {
    return (
      <span className="px-2 py-1 rounded text-xs bg-white/10 text-white">
        {skill}
      </span>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconComponent 
        size={20} 
        style={{ 
          color,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s ease-in-out'
        }} 
      />
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap z-30 pointer-events-none">
          {skill}
        </div>
      )}
    </div>
  );
});

// Move ProjectCard OUTSIDE the Projects component
const ProjectCard = React.memo(({ project, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { threshold: 0.1, once: true });

  const handleCardClick = useCallback(() => {
    if (project.id === 0 && project.demo) {
      window.open(project.demo, '_blank');
    } else {
      window.open(project.github || project.repoUrl, '_blank');
    }
  }, [project.id, project.demo, project.github, project.repoUrl]);

  const handleGitHubClick = useCallback((e) => {
    e.stopPropagation();
    window.open(project.github || project.repoUrl, '_blank');
  }, [project.github, project.repoUrl]);

  const skillsArray = useMemo(() => {
    if (Array.isArray(project.skills)) {
      return project.skills;
    }
    if (typeof project.skills === 'string') {
      return project.skills.split(', ').map(skill => skill.trim());
    }
    return [];
  }, [project.skills]);

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer"
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* GitHub Icon */}
          <motion.button
            onClick={handleGitHubClick}
            className="absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm bg-white/20 border border-white/30 hover:bg-white/30 transition-all duration-300 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaGithub size={20} className="text-white" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">{project.name}</h3>
          <p className="text-blue-100 text-sm leading-relaxed">{project.description}</p>
          
          {/* Tech Stack Icons */}
          <div className="flex flex-wrap gap-3 items-center">
            {skillsArray.map((skill, skillIndex) => (
              <SkillIcon key={`${project.id}-${skillIndex}`} skill={skill} />
            ))}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        {/* Demo indicator for PawnVersation */}
        {project.id === 0 && (
          <div className="absolute top-4 left-4 px-2 py-1 bg-green-500/80 text-white text-xs rounded backdrop-blur-sm">
            Live Demo
          </div>
        )}
      </div>
    </motion.div>
  );
});

// Memoize the project list outside to prevent recreation
const memoizedProjectList = projectList;

function Projects() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { threshold: 0.3, once: true });
  
  // State for projects functionality
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique tags from all projects
  const allTags = useMemo(() => {
    const tags = new Set(['All']);
    memoizedProjectList.forEach(project => {
      if (Array.isArray(project.skills)) {
        project.skills.forEach(skill => tags.add(skill));
      }
    });
    return Array.from(tags);
  }, []);

  // Filter projects based on search and tags
  const filteredProjects = useMemo(() => {
    return memoizedProjectList.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag === 'All' || 
                        (Array.isArray(project.skills) && project.skills.includes(selectedTag));
      
      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag]);

  const showSeeMore = filteredProjects.length > visibleProjects;
  const displayedProjects = filteredProjects.slice(0, visibleProjects);

  const handleSeeMore = () => {
    setVisibleProjects(prev => prev + 6);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setVisibleProjects(6); // Reset to initial count when searching
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setVisibleProjects(6); // Reset to initial count when filtering
  };

  useEffect(() => {
    const createDeepSeaCreatures = () => {
      const projectsSection = document.querySelector('.projects');
      if (!projectsSection) return;
      
      // Check if creatures already exist to prevent recreation
      if (projectsSection.querySelector('.creatures-container')) return;
      
      let creaturesContainer = document.createElement('div');
      creaturesContainer.className = 'creatures-container absolute inset-0 pointer-events-none overflow-hidden';
      creaturesContainer.style.zIndex = '0';
      projectsSection.appendChild(creaturesContainer);
      
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
  }, []); // Keep empty dependency array - only run once on mount

  return (
    <div className="projects py-16 ocean-transition relative" style={{
      backgroundSize: '120vw 120vh',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    }}>
      <motion.h1 
        ref={titleRef}
        className="text-4xl font-bold text-center text-blue-100 mb-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Personal Projects
      </motion.h1>

      {/* Search and Filter Section */}
      <div className="max-w-4xl mx-auto px-4 mb-8 relative z-10">
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-blue-300" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center mb-4">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFilter className="h-4 w-4" />
            Filter by Technology
          </motion.button>
        </div>

        {/* Filter Tags */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: showFilters ? 'auto' : 0, 
            opacity: showFilters ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {allTags.map(tag => (
              <motion.button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-blue-500 text-white'
                    : 'backdrop-blur-sm bg-white/10 border border-white/20 text-blue-200 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="text-center text-blue-200 text-sm mb-6">
          Showing {displayedProjects.length} of {filteredProjects.length} projects
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projectList grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto justify-items-center relative z-10">
        {displayedProjects.map((project, index) => (
          <ProjectCard 
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>

      {/* See More Button */}
      {showSeeMore && (
        <div className="flex justify-center mt-12 relative z-10">
          <motion.button
            onClick={handleSeeMore}
            className="px-8 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 hover:bg-white/20 transition-all duration-300 font-medium"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            See More Projects ({filteredProjects.length - visibleProjects} remaining)
          </motion.button>
        </div>
      )}

      {/* No Results Message */}
      {filteredProjects.length === 0 && (
        <div className="text-center text-blue-200 mt-12 relative z-10">
          <p className="text-lg">No projects found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedTag('All');
              setVisibleProjects(6);
            }}
            className="mt-4 px-6 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 hover:bg-white/20 transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Projects;
