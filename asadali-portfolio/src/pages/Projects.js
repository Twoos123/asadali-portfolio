import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { projectList } from "../helpers/ProjectList";
import { motion, useInView } from 'framer-motion';
import { createOceanEffects } from '../helpers/animationHelper';
import { FaSearch, FaFilter, FaGithub } from 'react-icons/fa';
import { SiSupabase, SiStripe } from 'react-icons/si';

// Universal SVG icon component for project skills
const SvgIcon = ({ name, size = 20, style, className = "" }) => {
  // Map display names to actual SVG filenames
  const svgFileMap = {
    'Groq API': 'Groq.svg',
    'Co:Here NLP': 'Cohere.svg',
    'Flask': 'Flask.svg',
    'React': 'React.svg',
    'Python': 'Python.svg',
    'Java': 'Java.svg',
    'JavaScript': 'JavaScript.svg',
    'TypeScript': 'TypeScript.svg',
    'Kotlin': 'Kotlin.svg',
    'C++': 'C++ (CPlusPlus).svg',
    'HTML5': 'HTML5.svg',
    'CSS3': 'CSS3.svg',
    'Next.js': 'Next.js.svg',
    'Spring Boot': 'Spring.svg',
    'Node.js': 'Node.js.svg',
    'Express': 'Express.svg',
    'Tailwind CSS': 'Tailwind CSS.svg',
    'Chakra UI': 'Chakra UI.svg',
    'Vite': 'Vite.js.svg',
    'GraphQL': 'GraphQL.svg',
    'Streamlit': 'Streamlit.svg',
    'GitHub': 'GitHub.svg',
    'Git': 'Git.svg',
    'Docker': 'Docker.svg',
    'Kubernetes': 'Kubernetes.svg',
    'Android Studio': 'Android Studio.svg',
    'Vercel': 'Vercel.svg',
    'Firebase': 'Firebase.svg',
    'Supabase': 'Supabase.svg',
    'MongoDB': 'MongoDB.svg',
    'PostgreSQL': 'PostgresSQL.svg',
    'MySQL': 'MySQL.svg',
    'Redis': 'Redis.svg',
    'SQLite': 'SQLite.svg',
    'Postman': 'Postman.svg',
    'JIRA': 'Jira.svg',
    'Jenkins': 'Jenkins.svg',
    'Stripe': 'Stripe.svg',
    'Cloudinary': 'Cloudinary.svg',
    'OpenAI': 'Openai.svg',
    'OAuth 2.0': 'Oauth.svg',
    'Bash': 'Bash.svg'
  };

  const filename = svgFileMap[name] || `${name}.svg`;

  const sizeMultiplier = {
    'Chakra UI': 1.4
  };

  const computedSize = Math.round(size * (sizeMultiplier[name] || 1));

  return (
    <img 
      src={`${process.env.PUBLIC_URL}/assets/skills/${filename}`} 
      alt={name} 
      width={computedSize} 
      height={computedSize}
      style={style}
      className={`transition-colors duration-300 drop-shadow-lg ${className}`}
    />
  );
};

// Move SkillIcon OUTSIDE the Projects component
const SkillIcon = React.memo(({ skill }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Special handling for react-icons with their brand colors
  const reactIconMap = {
    'Supabase': { component: SiSupabase, color: '#3ECF8E' },
    'Stripe': { component: SiStripe, color: '#635BFF' }
  };
  
  const reactIcon = reactIconMap[skill];
  
  if (reactIcon) {
    const IconComponent = reactIcon.component;
    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <IconComponent 
          size={20} 
          style={{ 
            color: reactIcon.color,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.2s ease-in-out',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
          }} 
        />
        {isHovered && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap z-30 pointer-events-none shadow-lg">
            {skill}
          </div>
        )}
      </div>
    );
  }
  
  // Use SVG for all other skills
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SvgIcon 
        name={skill} 
        size={20} 
        style={{ 
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s ease-in-out',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
        }} 
      />
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap z-30 pointer-events-none shadow-lg">
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
    if (project.demo) {
      window.open(project.demo, '_blank');
    } else {
      window.open(project.github || project.repoUrl, '_blank');
    }
  }, [project.demo, project.github, project.repoUrl]);

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
        
        {/* Demo indicator for projects with live demos */}
        {project.demo && (
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
    const container = document.getElementById('projects-creatures-container');
    // Only run if the container is empty
    if (container && container.innerHTML === '') {
      createOceanEffects('projects-creatures-container', 'projects');
    }
    
    // Return a cleanup function to clear the effects when the component unmounts
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="projects py-16 ocean-transition relative" style={{
      backgroundSize: '120vw 120vh',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    }}>
      <div id="projects-creatures-container" className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex: 0}}></div>
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
