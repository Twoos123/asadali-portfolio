import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FadeInSection, StaggerContainer } from '../components/animations';
import { oceanLife } from '../helpers/oceanLife';
import { SiSupabase, SiStripe } from 'react-icons/si';

// Universal SVG icon component
const SvgIcon = ({ name, size = 50, style, className = "" }) => {
  // Map display names to actual SVG filenames
  const svgFileMap = {
    'Groq': 'Groq.svg',
    'Co:Here': 'Cohere.svg',
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
    'PHP': 'PHP.svg',
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
    'Drupal': 'Drupal.svg',
    'Apache': 'Apache.svg',
    'Linux': 'Linux.svg',
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

  // Allow small visual size overrides for specific brands (Chakra UI should be a bit larger)
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

const SkillIcon = ({ name, link }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Special handling for react-icons with their brand colors
  const reactIconMap = {
    'Supabase': { component: SiSupabase, color: '#3ECF8E' },
    'Stripe': { component: SiStripe, color: '#635BFF' }
  };
  
  const reactIcon = reactIconMap[name];
  
  if (reactIcon) {
    const IconComponent = reactIcon.component;
    return (
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center cursor-pointer group"
        whileHover={{ 
          scale: 1.15,
          y: -8,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          whileHover={{ 
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 }
          }}
        >
          <IconComponent
            size={50}
            className="transition-colors duration-300 drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              color: reactIcon.color
            }}
          />
        </motion.div>
        <span className="mt-3 text-sm text-blue-100 text-center font-medium group-hover:text-white transition-colors duration-300">
          {name}
        </span>
      </motion.a>
    );
  }
  
  // Use SVG for all other skills
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center cursor-pointer group"
      whileHover={{ 
        scale: 1.15,
        y: -8,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ 
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5 }
        }}
      >
        <SvgIcon
          name={name}
          size={50}
          className="transition-colors duration-300 drop-shadow-lg"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }}
        />
      </motion.div>
      <span className="mt-3 text-sm text-blue-100 text-center font-medium group-hover:text-white transition-colors duration-300">
        {name}
      </span>
    </motion.a>
  );
};

function Skills() {
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const createOceanEffects = () => {
      const skillsSection = document.getElementById('skills');
      if (!skillsSection) return;

      skillsSection.style.position = 'relative';
      skillsSection.style.overflow = 'hidden';

      let creaturesContainer = skillsSection.querySelector('.skills-creatures-container');
      if (!creaturesContainer) {
        creaturesContainer = document.createElement('div');
        creaturesContainer.className = 'skills-creatures-container';
        creaturesContainer.style.position = 'absolute';
        creaturesContainer.style.top = '0';
        creaturesContainer.style.left = '0';
        creaturesContainer.style.right = '0';
        creaturesContainer.style.bottom = '0';
        creaturesContainer.style.pointerEvents = 'none';
        creaturesContainer.style.overflow = 'hidden';
        creaturesContainer.style.zIndex = '1';
        skillsSection.appendChild(creaturesContainer);
      }
      creaturesContainer.innerHTML = '';

      const sectionLife = oceanLife.skills;

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
        creaturesContainer.appendChild(bubble);
      }

      // Creatures - filter out fish on mobile to prevent horizontal overflow
      sectionLife.creatures.forEach(creature => {
        // Skip fish animations on mobile to prevent viewport issues
        if (isMobile && (creature.type === 'tropical-fish' || creature.type === 'small-fish')) {
          return; // Skip fish on mobile
        }
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.pointerEvents = 'none';
        el.style.zIndex = creature.zIndex;

        let innerHTML = `<img src="${process.env.PUBLIC_URL}/assets/fish/${creature.type}.svg" alt="${creature.type}" style="`;
        for (const [key, value] of Object.entries(creature.styles)) {
          innerHTML += `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}; `;
        }
        innerHTML += `"/>`;
        el.innerHTML = innerHTML;

        for (const [key, value] of Object.entries(creature.position)) {
          el.style[key] = value;
        }

        if (creature.animation.type === 'transition') {
          el.style.transition = `transform ${creature.animation.duration}s linear`;
          el.style.transform = 'translateX(0px)';
          setTimeout(() => {
            const direction = el.style.left.includes('-') ? 1 : -1;
            el.style.transform = `translateX(${direction * (skillsSection.offsetWidth + 160)}px)`;
          }, creature.animation.delay * 1000);
        }
        
        creaturesContainer.appendChild(el);
      });
    };

    createOceanEffects();
  }, [isMobile]); // Recreate ocean effects when mobile state changes

  const programmingLanguages = [
    { name: "Java", link: "https://www.java.com" },
    { name: "Python", link: "https://www.python.org" },
    { name: "JavaScript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "PHP", link: "https://www.php.net" },
    { name: "TypeScript", link: "https://www.typescriptlang.org" },
    { name: "Kotlin", link: "https://kotlinlang.org" },
    { name: "HTML5", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { name: "CSS3", link: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { name: "C++", link: "https://www.cplusplus.com" }
  ];

  const frameworks = [
    { name: "React", link: "https://reactjs.org" },
    { name: "Next.js", link: "https://nextjs.org" },
    { name: "Spring Boot", link: "https://spring.io/projects/spring-boot" },
    { name: "FastAPI", link: "https://fastapi.tiangolo.com" },
    { name: "Node.js", link: "https://nodejs.org" },
    { name: "Express", link: "https://expressjs.com" },
    { name: "Flask", link: "https://flask.palletsprojects.com" },
    { name: "Tailwind CSS", link: "https://tailwindcss.com" },
    { name: "Chakra UI", link: "https://chakra-ui.com" },
    { name: "Vite", link: "https://vitejs.dev" },
    { name: "GraphQL", link: "https://graphql.org" },
    { name: "Streamlit", link: "https://streamlit.io" }
  ];

  const developerTools = [
    { name: "GitHub", link: "https://github.com" },
    { name: "Git", link: "https://git-scm.com" },
    { name: "Docker", link: "https://www.docker.com" },
    { name: "Drupal", link: "https://www.drupal.org" },
    { name: "Apache", link: "https://httpd.apache.org" },
    { name: "Linux", link: "https://www.kernel.org" },
    { name: "Kubernetes", link: "https://kubernetes.io" },
    { name: "Android Studio", link: "https://developer.android.com/studio" },
    { name: "Vercel", link: "https://vercel.com" },
    { name: "Firebase", link: "https://firebase.google.com" },
    { name: "Supabase", link: "https://supabase.com" },
    { name: "MongoDB", link: "https://www.mongodb.com" },
    { name: "PostgreSQL", link: "https://www.postgresql.org" },
    { name: "MySQL", link: "https://www.mysql.com" },
    { name: "Redis", link: "https://redis.io" },
    { name: "SQLite", link: "https://www.sqlite.org" },
    { name: "Postman", link: "https://www.postman.com" },
    { name: "JIRA", link: "https://www.atlassian.com/software/jira" },
    { name: "Jenkins", link: "https://www.jenkins.io" },
    { name: "Stripe", link: "https://stripe.com" },
    { name: "Cloudinary", link: "https://cloudinary.com" },
    { name: "Groq", link: "https://groq.com" },
    { name: "Co:Here", link: "https://cohere.ai" },
    { name: "OpenAI", link: "https://openai.com" },
    { name: "OAuth 2.0", link: "https://oauth.net/2/" },
    { name: "Bash", link: "https://www.gnu.org/software/bash/" }
  ];

  return (
    <div id="skills" className="min-h-screen py-20 relative" style={{
      backgroundSize: '120vw 120vh',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container mx-auto px-4 relative z-10">
        <FadeInSection direction="up" delay={0.2} threshold={0.3}>
          <h1 className="text-4xl font-bold text-center text-blue-100 mb-12">Skills</h1>
        </FadeInSection>
        
        <div className="flex flex-col md:flex-row gap-16">
          <div className="flex flex-col items-center md:items-center md:w-1/3">
            <FadeInSection direction="left" delay={0.3} threshold={0.3}>
              <motion.h2 
                className="text-2xl font-semibold text-blue-200 mb-6 text-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Languages
              </motion.h2>
              <StaggerContainer 
                className="flex flex-wrap justify-center gap-8"
                staggerDelay={0.1}
                direction="up"
                distance={30}
              >
                {programmingLanguages.map((skill, index) => (
                  <SkillIcon 
                    key={index} 
                    name={skill.name} 
                    link={skill.link} 
                  />
                ))}
              </StaggerContainer>
            </FadeInSection>
          </div>
          
          <div className="flex flex-col items-center md:items-center md:w-1/3">
            <FadeInSection direction="up" delay={0.4} threshold={0.3}>
              <motion.h2 
                className="text-2xl font-semibold text-blue-200 mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Frameworks
              </motion.h2>
              <StaggerContainer 
                className="flex flex-wrap justify-center gap-8"
                staggerDelay={0.1}
                direction="up"
                distance={30}
              >
                {frameworks.map((skill, index) => (
                  <SkillIcon 
                    key={index} 
                    name={skill.name} 
                    link={skill.link} 
                  />
                ))}
              </StaggerContainer>
            </FadeInSection>
          </div>
          
          <div className="flex flex-col items-center md:items-center md:w-1/3">
            <FadeInSection direction="right" delay={0.5} threshold={0.3}>
              <motion.h2 
                className="text-2xl font-semibold text-blue-200 mb-6 text-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Developer Tools
              </motion.h2>
              <StaggerContainer 
                className="flex flex-wrap justify-center gap-8"
                staggerDelay={0.1}
                direction="up"
                distance={30}
              >
                {developerTools.map((skill, index) => (
                  <SkillIcon 
                    key={index} 
                    name={skill.name} 
                    link={skill.link} 
                  />
                ))}
              </StaggerContainer>
            </FadeInSection>
          </div>
        </div>
      </div>
      
      {/* Gradient transition to Projects */}
    </div>
  );
}

export default Skills;