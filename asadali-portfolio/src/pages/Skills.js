import React from 'react';
import { FaJava, FaPython, FaHtml5, FaCss3, FaJs, FaReact, FaNodeJs } from 'react-icons/fa';
import { SiSpringboot, SiDocker, SiGit, SiAndroidstudio, SiFirebase, SiPostman, SiKubernetes, SiJira, SiJenkins, SiLatex } from 'react-icons/si';

const SkillIcon = ({ Icon, name, link }) => (
  <a 
    href={link} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="flex flex-col items-center m-4 transition-transform duration-300 transform hover:scale-110 cursor-pointer"
  >
    <Icon size={50} className="text-gray-100" /> {/* Adjusted icon color */}
    <span className="mt-2 text-sm text-gray-100">{name}</span> {/* Adjusted text color */}
  </a>
);

function Skills() {
  const programmingLanguages = [
    { Icon: FaJava, name: "Java", link: "https://www.java.com" },
    { Icon: FaPython, name: "Python", link: "https://www.python.org" },
    { Icon: FaHtml5, name: "HTML", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { Icon: FaCss3, name: "CSS", link: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { Icon: FaJs, name: "JavaScript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { Icon: SiLatex, name: "LaTeX", link: "https://www.latex-project.org" },
  ];

  const frameworks = [
    { Icon: FaReact, name: "React", link: "https://reactjs.org" },
    { Icon: FaNodeJs, name: "Node.js", link: "https://nodejs.org" },
    { Icon: SiSpringboot, name: "Spring Boot", link: "https://spring.io/projects/spring-boot" },
  ];

  const developerTools = [
    { Icon: SiDocker, name: "Docker", link: "https://www.docker.com" },
    { Icon: SiGit, name: "Git", link: "https://git-scm.com" },
    { Icon: SiAndroidstudio, name: "Android Studio", link: "https://developer.android.com/studio" },
    { Icon: SiFirebase, name: "Firebase", link: "https://firebase.google.com" },
    { Icon: SiPostman, name: "Postman", link: "https://www.postman.com" },
    { Icon: SiKubernetes, name: "Kubernetes", link: "https://kubernetes.io" },
    { Icon: SiJira, name: "JIRA", link: "https://www.atlassian.com/software/jira" },
    { Icon: SiJenkins, name: "Jenkins", link: "https://www.jenkins.io" },
  ];

  return (
    <div id="skills" className="py-16 bg-opacity-70 bg-blue-800">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-12">Skills</h1> 
        <div className="skills-grid space-y-12">
          <div className="skill-category">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">Languages</h2> 
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {programmingLanguages.map((skill, index) => (
                <SkillIcon 
                  key={index} 
                  Icon={skill.Icon} 
                  name={skill.name} 
                  link={skill.link} 
                />
              ))}
            </div>
          </div>
          <div className="skill-category">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">Frameworks</h2> 
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {frameworks.map((skill, index) => (
                <SkillIcon 
                  key={index} 
                  Icon={skill.Icon} 
                  name={skill.name} 
                  link={skill.link} 
                />
              ))}
            </div>
          </div>
          <div className="skill-category">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">Developer Tools</h2> 
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {developerTools.map((skill, index) => (
                <SkillIcon 
                  key={index} 
                  Icon={skill.Icon} 
                  name={skill.name} 
                  link={skill.link} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skills;
