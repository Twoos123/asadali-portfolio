import React from 'react';
import { FaJava, FaPython, FaHtml5, FaCss3, FaJs, FaReact, FaNodeJs, FaFlask, FaGithub } from 'react-icons/fa';
import { SiSpringboot, SiDocker, SiGnubash, SiGit, SiAndroidstudio, SiFirebase, SiPostman, SiKubernetes, SiJira, SiJenkins, SiOpenai, SiCplusplus, SiChakraui, SiElixir } from 'react-icons/si';
import { DiMysql } from 'react-icons/di';
import { TbBrandOauth } from "react-icons/tb";

const SkillIcon = ({ Icon, name, link, hoverColor }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center transition-transform duration-300 transform hover:scale-110 cursor-pointer group"
  >
    <Icon
      size={50}
      className={`text-gray-100 transition-colors duration-300 group-hover:text-[${hoverColor}]`}
    />
    <span className="mt-2 text-sm text-gray-100">{name}</span>
  </a>
);

function Skills() {
  const programmingLanguages = [
    { Icon: FaJava, name: "Java", link: "https://www.java.com", hoverColor: "#007396" }, // Java logo color
    { Icon: FaPython, name: "Python", link: "https://www.python.org", hoverColor: "#3776AB" }, // Python logo color
    { Icon: FaHtml5, name: "HTML", link: "https://developer.mozilla.org/en-US/docs/Web/HTML", hoverColor: "#E34F26" }, // HTML logo color
    { Icon: FaCss3, name: "CSS", link: "https://developer.mozilla.org/en-US/docs/Web/CSS", hoverColor: "#1572B6" }, // CSS logo color
    { Icon: FaJs, name: "JavaScript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", hoverColor: "#F7DF1E" }, // JavaScript logo color
    { Icon: DiMysql, name: "SQL", link: "https://www.mysql.com", hoverColor: "#4479A1" }, // MySQL logo color
    { Icon: SiCplusplus, name: "C/C++", link: "https://www.cplusplus.com", hoverColor: "#00599C" }, // C++ logo color
    { Icon: SiElixir, name: "Elixir", link: "https://elixir-lang.org", hoverColor: "#4B275F" }, // Elixir logo color
  ];

  const frameworks = [
    { Icon: FaReact, name: "React", link: "https://reactjs.org", hoverColor: "#61DAFB" }, // React logo color
    { Icon: SiSpringboot, name: "Spring Boot", link: "https://spring.io/projects/spring-boot", hoverColor: "#6DB33F" }, // Spring Boot logo color
    { Icon: FaNodeJs, name: "Node.js", link: "https://nodejs.org", hoverColor: "#339933" }, // Node.js logo color
    { Icon: FaFlask, name: "Flask", link: "https://flask.palletsprojects.com", hoverColor: "#000000" }, // Flask logo color
    { Icon: SiChakraui, name: "Chakra UI", link: "https://chakra-ui.com", hoverColor: "#319795" }, // Chakra UI logo color
  ];

  const developerTools = [
    { Icon: FaGithub, name: "GitHub", link: "https://github.com", hoverColor: "#181717" }, // GitHub logo color
    { Icon: SiGit, name: "Git", link: "https://git-scm.com", hoverColor: "#F05032" }, // Git logo color
    { Icon: SiAndroidstudio, name: "Android Studio", link: "https://developer.android.com/studio", hoverColor: "#3DDC84" }, // Android Studio logo color
    { Icon: SiFirebase, name: "Firebase", link: "https://firebase.google.com", hoverColor: "#FFCA28" }, // Firebase logo color
    { Icon: SiPostman, name: "Postman", link: "https://www.postman.com", hoverColor: "#FF6C37" }, // Postman logo color
    { Icon: SiKubernetes, name: "Kubernetes", link: "https://kubernetes.io", hoverColor: "#326CE5" }, // Kubernetes logo color
    { Icon: SiJira, name: "JIRA", link: "https://www.atlassian.com/software/jira", hoverColor: "#0052CC" }, // JIRA logo color
    { Icon: SiJenkins, name: "Jenkins", link: "https://www.jenkins.io", hoverColor: "#D24939" }, // Jenkins logo color
    { Icon: TbBrandOauth, name: "OAuth 2.0", link: "https://oauth.net/2/", hoverColor: "#00ADEE" }, // OAuth 2.0 logo color
    { Icon: SiOpenai, name: "OpenAI", link: "https://www.openai.com", hoverColor: "#412991" }, // OpenAI logo color
    { Icon: SiDocker, name: "Docker", link: "https://www.docker.com", hoverColor: "#2496ED" }, // Docker logo color
    { Icon: SiGnubash, name: "Bash", link: "https://www.gnu.org/software/bash/", hoverColor: "#4EAA25" }, // Bash logo color
  ];

  return (
    <div id="skills" className="py-16 bg-opacity-70 bg-blue-800">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-12">Skills</h1>
        <div className="flex flex-col md:flex-row gap-16">
          <div className="flex flex-col items-center md:items-center md:w-1/3">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">Languages</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {programmingLanguages.map((skill, index) => (
                <SkillIcon 
                  key={index} 
                  Icon={skill.Icon} 
                  name={skill.name} 
                  link={skill.link} 
                  hoverColor={skill.hoverColor}
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
                  hoverColor={skill.hoverColor}
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
                  hoverColor={skill.hoverColor}
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
