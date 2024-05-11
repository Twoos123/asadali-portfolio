import React from 'react';
import "../styles/Skills.css";

const iconStyle = { width: '50px', height: '50px' };

const programmingLanguagesIcons = {
  Java: (
    <a href="https://www.java.com" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" style={iconStyle} />
    </a>
  ),
  Python: (
    <a href="https://www.python.org" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" style={iconStyle} />
    </a>
  ),
  HTML: (
    <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" style={iconStyle} />
    </a>
  ),
  CSS: (
    <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" style={iconStyle} />
    </a>
  ),
  JavaScript: (
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" style={iconStyle} />
    </a>
  ),
  LaTeX: (
    <a href="https://www.latex-project.org/" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/latex/latex-original.svg" alt="LaTeX" style={iconStyle} />
    </a>
  ),
};

const frameworksIcons = {
  React: (
    <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" style={iconStyle} />
    </a>
  ),
  Node: (
    <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" style={iconStyle} />
    </a>
  ),
  SpringBoot: (
    <a href="https://spring.io/projects/spring-boot" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" alt="Spring Boot" style={iconStyle} />
    </a>
  ),
  Maven: (
    <a href="https://maven.apache.org/" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg" alt="Maven" style={iconStyle} />
    </a>
  ),
};

const developerToolsIcons = {
  Docker: (
    <a href="https://www.docker.com/" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" style={iconStyle} />
    </a>
  ),
  GitHub: (
    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" style={iconStyle} />
    </a>
  ),
  Git: (
    <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" style={iconStyle} />
    </a>
  ),
  Bash: (
    <a href="https://www.gnu.org/software/bash/" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" alt="Bash" style={iconStyle} />
    </a>
  ),
  AndroidStudio: (
    <a href="https://developer.android.com/studio" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg" alt="Android Studio" style={iconStyle} />
    </a>
  ),
  Firebase: (
    <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg" alt="Firebase" style={iconStyle} />
    </a>
  ),
  Postman: (
    <a href="https://www.postman.com/" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" alt="Postman" style={iconStyle} />
    </a>
  ),
  Kubernetes: (
    <a href="https://kubernetes.io/" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg" alt="Kubernetes" style={iconStyle} />
    </a>
  ),
  JIRA: (
    <a href="https://www.atlassian.com/software/jira" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" alt="JIRA" style={iconStyle} />
    </a>
  ),
  Jenkins: (
    <a href="https://www.jenkins.io/" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" alt="Jenkins" style={iconStyle} />
    </a>
  ),
  OAuth: (
    <a href="https://oauth.net/" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oauth/oauth-original.svg" alt="OAuth" style={iconStyle} />
    </a>
  ),
};

function Skills() {
  return (
    <div id="skills" className="skills section">
      <h1>Skills</h1>
      <div className="skills-grid">
        {/* Languages */}
        <div className="skill-category">
          <h2>Languages</h2>
          <div className="skill-set">
            {Object.entries(programmingLanguagesIcons).map(([language, icon]) => (
              <div className="skill" key={language}>
                {icon}
                <span>{language}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Frameworks */}
        <div className="skill-category">
          <h2>Frameworks</h2>
          <div className="skill-set">
            {Object.entries(frameworksIcons).map(([framework, icon]) => (
              <div className="skill" key={framework}>
                {icon}
                <span>{framework}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Developer Tools */}
        <div className="skill-category">
          <h2>Developer Tools</h2>
          <div className="skill-set">
            {Object.entries(developerToolsIcons).map(([tool, icon]) => (
              <div className="skill-container" key={tool}>
                <div className="skill">
                  {icon}
                  <span>{tool}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skills;
