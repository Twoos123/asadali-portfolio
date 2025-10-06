import React, { useEffect } from 'react';
import { FaJava, FaPython, FaHtml5, FaCss3, FaJs, FaReact, FaNodeJs, FaFlask, FaGithub } from 'react-icons/fa';
import { SiSpringboot, SiDocker, SiGnubash, SiGit, SiAndroidstudio, SiFirebase, SiPostman, SiKubernetes, SiJira, SiJenkins, SiOpenai, SiCplusplus, SiChakraui, SiElixir } from 'react-icons/si';
import { DiMysql } from 'react-icons/di';
import { TbBrandOauth } from "react-icons/tb";
import { motion } from 'framer-motion';
import { FadeInSection, StaggerContainer } from '../components/animations';
import { oceanLife } from '../helpers/oceanLife';

const SkillIcon = ({ Icon, name, link, hoverColor }) => (
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
  >
    <motion.div
      whileHover={{ 
        rotate: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      }}
    >
      <Icon
        size={50}
        className="text-blue-100 group-hover:text-cyan-300 transition-colors duration-300 drop-shadow-lg"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }}
      />
    </motion.div>
    <motion.span 
      className="mt-2 text-sm text-blue-200 group-hover:text-white transition-colors duration-300 font-medium"
      whileHover={{ scale: 1.05 }}
    >
      {name}
    </motion.span>
  </motion.a>
);

function Skills() {
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

      // Creatures
      sectionLife.creatures.forEach(creature => {
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.pointerEvents = 'none';
        el.style.zIndex = creature.zIndex;

        let innerHTML = `<img src="/asadali-portfolio/assets/fish/${creature.type}.svg" alt="${creature.type}" style="`;
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
  }, []);

  const programmingLanguages = [
    { Icon: FaJava, name: "Java", link: "https://www.java.com", hoverColor: "#007396" },
    { Icon: FaPython, name: "Python", link: "https://www.python.org", hoverColor: "#3776AB" },
    { Icon: FaHtml5, name: "HTML", link: "https://developer.mozilla.org/en-US/docs/Web/HTML", hoverColor: "#E34F26" },
    { Icon: FaCss3, name: "CSS", link: "https://developer.mozilla.org/en-US/docs/Web/CSS", hoverColor: "#1572B6" },
    { Icon: FaJs, name: "JavaScript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", hoverColor: "#F7DF1E" },
    { Icon: DiMysql, name: "SQL", link: "https://www.mysql.com", hoverColor: "#4479A1" },
    { Icon: SiCplusplus, name: "C/C++", link: "https://www.cplusplus.com", hoverColor: "#00599C" },
    { Icon: SiElixir, name: "Elixir", link: "https://elixir-lang.org", hoverColor: "#4B275F" },
  ];

  const frameworks = [
    { Icon: FaReact, name: "React", link: "https://reactjs.org", hoverColor: "#61DAFB" },
    { Icon: SiSpringboot, name: "Spring Boot", link: "https://spring.io/projects/spring-boot", hoverColor: "#6DB33F" },
    { Icon: FaNodeJs, name: "Node.js", link: "https://nodejs.org", hoverColor: "#339933" },
    { Icon: FaFlask, name: "Flask", link: "https://flask.palletsprojects.com", hoverColor: "#000000" },
    { Icon: SiChakraui, name: "Chakra UI", link: "https://chakra-ui.com", hoverColor: "#319795" },
  ];

  const developerTools = [
    { Icon: FaGithub, name: "GitHub", link: "https://github.com", hoverColor: "#181717" },
    { Icon: SiGit, name: "Git", link: "https://git-scm.com", hoverColor: "#F05032" },
    { Icon: SiAndroidstudio, name: "Android Studio", link: "https://developer.android.com/studio", hoverColor: "#3DDC84" },
    { Icon: SiFirebase, name: "Firebase", link: "https://firebase.google.com", hoverColor: "#FFCA28" },
    { Icon: SiPostman, name: "Postman", link: "https://www.postman.com", hoverColor: "#FF6C37" },
    { Icon: SiKubernetes, name: "Kubernetes", link: "https://kubernetes.io", hoverColor: "#326CE5" },
    { Icon: SiJira, name: "JIRA", link: "https://www.atlassian.com/software/jira", hoverColor: "#0052CC" },
    { Icon: SiJenkins, name: "Jenkins", link: "https://www.jenkins.io", hoverColor: "#D24939" },
    { Icon: TbBrandOauth, name: "OAuth 2.0", link: "https://oauth.net/2/", hoverColor: "#00ADEE" },
    { Icon: SiOpenai, name: "OpenAI", link: "https://www.openai.com", hoverColor: "#412991" },
    { Icon: SiDocker, name: "Docker", link: "https://www.docker.com", hoverColor: "#2496ED" },
    { Icon: SiGnubash, name: "Bash", link: "https://www.gnu.org/software/bash/", hoverColor: "#4EAA25" },
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
                    Icon={skill.Icon} 
                    name={skill.name} 
                    link={skill.link} 
                    hoverColor={skill.hoverColor}
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
                    Icon={skill.Icon} 
                    name={skill.name} 
                    link={skill.link} 
                    hoverColor={skill.hoverColor}
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
                    Icon={skill.Icon} 
                    name={skill.name} 
                    link={skill.link} 
                    hoverColor={skill.hoverColor}
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