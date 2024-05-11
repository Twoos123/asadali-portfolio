import React from 'react'
import { FaJava, FaPython, FaHtml5, FaCss3, FaDocker, FaReact, FaNode, FaGithub, FaGitAlt, FaJira, FaJenkins } from 'react-icons/fa';
import { IoLogoJavascript, IoLogoFirebase } from 'react-icons/io5';
import { SiLatex, SiSpringboot, SiApachemaven, SiAndroidstudio, SiPostman, SiKubernetes } from 'react-icons/si';
import { VscTerminalBash } from 'react-icons/vsc';
import { TbBrandOauth } from 'react-icons/tb';
import "../styles/Skills.css";

const programmingLanguagesIcons = {
    Java: <a href="https://www.java.com" target="_blank" rel="noopener noreferrer"><FaJava /></a>,
    Python: <a href="https://www.python.org" target="_blank" rel="noopener noreferrer"><FaPython /></a>,
    HTML: <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener noreferrer"><FaHtml5 /></a>,
    CSS: <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank" rel="noopener noreferrer"><FaCss3 /></a>,
    JavaScript: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer"><IoLogoJavascript /></a>,
    LaTeX: <a href="https://www.latex-project.org/" target="_blank" rel="noopener noreferrer"><SiLatex /></a>,
  };
  
  const frameworksIcons = {
    React: <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer"><FaReact /></a>,
    Node: <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer"><FaNode /></a>,
    SpringBoot: <a href="https://spring.io/projects/spring-boot" target="_blank" rel="noopener noreferrer"><SiSpringboot /></a>,
    Maven: <a href="https://maven.apache.org/" target="_blank" rel="noopener noreferrer"><SiApachemaven /></a>,
  };
  
  const developerToolsIcons = {
    Docker: <a href="https://www.docker.com/" target="_blank" rel="noopener noreferrer"><FaDocker /></a>,
    GitHub: <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>,
    Git: <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer"><FaGitAlt /></a>,
    Bash: <a href="https://www.gnu.org/software/bash/" target="_blank" rel="noopener noreferrer"><VscTerminalBash /></a>,
    AndroidStudio: <a href="https://developer.android.com/studio" target="_blank" rel="noopener noreferrer"><SiAndroidstudio /></a>,
    Firebase: <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer"><IoLogoFirebase /></a>,
    Postman: <a href="https://www.postman.com/" target="_blank" rel="noopener noreferrer"><SiPostman /></a>,
    Kubernetes: <a href="https://kubernetes.io/" target="_blank" rel="noopener noreferrer"><SiKubernetes /></a>,
    JIRA: <a href="https://www.atlassian.com/software/jira" target="_blank" rel="noopener noreferrer"><FaJira /></a>,
    Jenkins: <a href="https://www.jenkins.io/" target="_blank" rel="noopener noreferrer"><FaJenkins /></a>,
    OAuth: <a href="https://oauth.net/" target="_blank" rel="noopener noreferrer"><TbBrandOauth /></a>,
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