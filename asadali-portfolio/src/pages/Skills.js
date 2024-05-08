import React from 'react'
import { FaJava, FaPython, FaHtml5, FaCss3, FaDocker, FaReact, FaNode, FaGithub, FaGitAlt, FaJira, FaJenkins } from 'react-icons/fa';
import { IoLogoJavascript, IoLogoFirebase } from 'react-icons/io5';
import { SiLatex, SiSpringboot, SiApachemaven, SiAndroidstudio, SiPostman, SiKubernetes } from 'react-icons/si';
import { VscTerminalBash } from 'react-icons/vsc';
import { TbBrandOauth } from 'react-icons/tb';
import "../styles/Skills.css";

const programmingLanguagesIcons = {
    Java: <FaJava />,
    Python: <FaPython />,
    HTML: <FaHtml5 />,
    CSS: <FaCss3 />,
    JavaScript: <IoLogoJavascript />,
    LaTeX: <SiLatex />,
  };
  
  const frameworksIcons = {
    React: <FaReact />,
    Node: <FaNode />,
    SpringBoot: <SiSpringboot />,
    Maven: <SiApachemaven />,
  };
  
  const developerToolsIcons = {
    Docker: <FaDocker />,
    GitHub: <FaGithub />,
    Git: <FaGitAlt />,
    Bash: <VscTerminalBash />,
    AndroidStudio: <SiAndroidstudio />,
    Firebase: <IoLogoFirebase />,
    Postman: <SiPostman />,
    Kubernetes: <SiKubernetes />,
    JIRA: <FaJira />,
    Jenkins: <FaJenkins />,
    OAuth: <TbBrandOauth />,
  };

  
function Skills() {
  return (
    <div id="skills" className="skills section"> 
        <h1> Skills</h1>
        <div className="skills-grid">
          <div className="skill-category">
            <h2> Languages</h2>
            <div className="skill-set"> 
              {Object.entries(programmingLanguagesIcons).map(([language, Icon]) => (
                <div className="skill" key={language}>
                  {Icon}
                  {language}
                </div>
              ))}
            </div>
          </div>
          <div className="skill-category">
            <h2> Frameworks</h2>
            <div className="skill-set">  
              {Object.entries(frameworksIcons).map(([framework, Icon]) => (
                <div className="skill" key={framework}>
                  {Icon}
                  <span>{framework}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="skill-category developer-tools">
            <h2> Developer Tools</h2>
            <div className="skill-set">
              {Object.entries(developerToolsIcons).map(([tool, Icon]) => (
                <div className="skill-container" key={tool}>
                  <div className="skill">
                  {Icon}
                  <span>{tool}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}

export default Skills