import React from 'react';
import { FaJava, FaPython, FaHtml5, FaCss3, FaJs, FaReact, FaNodeJs, FaFlask, FaGithub } from 'react-icons/fa';
import { SiSpringboot, SiDocker, SiGnubash, SiGit, SiAndroidstudio, SiFirebase, SiPostman, SiKubernetes, SiJira, SiJenkins, SiOauth, SiOpenai, SiCplusplus, SiChakraui, SiElixir } from 'react-icons/si';
import { DiMysql } from 'react-icons/di';
import { TbBrandOauth } from "react-icons/tb";


const SkillIcon = ({ Icon, name, link }) => (
  <a 
    href={link} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="flex flex-col items-center transition-transform duration-300 transform hover:scale-110 cursor-pointer"
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
    { Icon: DiMysql, name: "SQL", link: "https://www.mysql.com" },
    { Icon: SiCplusplus, name: "C/C++", link: "https://www.cplusplus.com" },
    { Icon: SiElixir, name: "Elixir", link: "https://elixir-lang.org" },
  ];

  const frameworks = [
    { Icon: FaReact, name: "React", link: "https://reactjs.org" },
    { Icon: SiSpringboot, name: "Spring Boot", link: "https://spring.io/projects/spring-boot" },
    { Icon: FaNodeJs, name: "Node.js", link: "https://nodejs.org" },
    { Icon: FaFlask, name: "Flask", link: "https://flask.palletsprojects.com" },
    { Icon: SiChakraui, name: "Chakra UI", link: "https://chakra-ui.com" },
  ];

  const developerTools = [
    { Icon: FaGithub, name: "GitHub", link: "https://github.com" },
    { Icon: SiGit, name: "Git", link: "https://git-scm.com" },
    { Icon: SiAndroidstudio, name: "Android Studio", link: "https://developer.android.com/studio" },
    { Icon: SiFirebase, name: "Firebase", link: "https://firebase.google.com" },
    { Icon: SiPostman, name: "Postman", link: "https://www.postman.com" },
    { Icon: SiKubernetes, name: "Kubernetes", link: "https://kubernetes.io" },
    { Icon: SiJira, name: "JIRA", link: "https://www.atlassian.com/software/jira" },
    { Icon: SiJenkins, name: "Jenkins", link: "https://www.jenkins.io" },
    { Icon: TbBrandOauth, name: "OAuth 2.0", link: "https://oauth.net/2/" },
    { Icon: SiOpenai, name: "OpenAI", link: "https://www.openai.com" },
    { Icon: SiDocker, name: "Docker", link: "https://www.docker.com" },
    { Icon: SiGnubash, name: "Bash", link: "https://www.gnu.org/software/bash/" },
  ];

  return (
    <div id="skills" className="py-16 bg-opacity-70 bg-blue-800">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-12">Skills</h1>
        <div className="flex flex-col md:flex-row gap-16">
          <div className="flex flex-col items-center md:items-center md:w-1/3">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">Programming Languages</h2>
            <div className="flex flex-wrap justify-center gap-8">
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
          <div className="flex flex-col items-center md:items-center md:w-1/3">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">Frameworks</h2>
            <div className="flex flex-wrap justify-center gap-8">
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
          <div className="flex flex-col items-center md:items-center md:w-1/3">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">Developer Tools</h2>
            <div className="flex flex-wrap justify-center gap-8">
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
