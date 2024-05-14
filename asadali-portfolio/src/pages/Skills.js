import React from 'react';
import "../styles/Skills.css";

const iconStyle = { width: '50px', height: '50px' };

const getSVG = (name, isDarkMode) => {
  const fill = isDarkMode ? '#ffffff' : '#000000'; 
  const svgs = {
    LaTeX: `
      <svg role="img" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" fill="${fill}">
        <path d="M29.2 63H28c-.5 5.1-1.2 11.3-10 11.3h-4c-2.3 0-2.4-.3-2.4-2V45.8c0-1.7 0-2.4 4.7-2.4h1.6v-1.5c-1.9.1-6.3.1-8.4.1-1.9 0-5.8 0-7.5-.1v1.5h1.1c3.8 0 3.9.5 3.9 2.3v26.1c0 1.8-.1 2.3-3.9 2.3H2v1.5h25.8L29.2 63z"></path><path d="M28.3 41.8c-.2-.6-.3-.8-.9-.8s-.8.2-1 .8l-8 20.3c-.3.8-.9 2.4-4 2.4v1.2h7.7v-1.2c-1.5 0-2.5-.7-2.5-1.7 0-.2 0-.3.1-.7l1.7-4.3h9.9l2 5.1c.1.2.2.4.2.6 0 1-1.9 1-2.8 1v1.2h9.8v-1.2h-.7c-2.3 0-2.6-.3-2.9-1.3l-8.6-21.4zm-1.9 3.6l4.4 11.3h-8.9l4.5-11.3z"></path><path d="M68.2 42.2H37.9L37 53.3h1.2c.7-8 1.4-9.7 9-9.7.9 0 2.2 0 2.7.1 1 .2 1 .7 1 1.9v26.1c0 1.7 0 2.4-5.2 2.4h-2v1.5c2-.1 7.1-.1 9.4-.1s7.4 0 9.5.1v-1.5h-2c-5.2 0-5.2-.7-5.2-2.4v-26c0-1 0-1.7.9-1.9.5-.1 1.9-.1 2.8-.1 7.5 0 8.2 1.6 8.9 9.7h1.2l-1-11.2z"></path><path d="M94.9 74.2h-1.2c-1.2 7.6-2.4 11.3-10.9 11.3h-6.6c-2.3 0-2.4-.3-2.4-2V70.2h4.4c4.8 0 5.4 1.6 5.4 5.8h1.2V62.9h-1.2c0 4.2-.5 5.8-5.4 5.8h-4.4v-12c0-1.6.1-2 2.4-2h6.4c7.6 0 8.9 2.7 9.7 9.7h1.2l-1.4-11.2H64.2v1.5h1.1c3.8 0 3.9.5 3.9 2.3v26c0 1.8-.1 2.3-3.9 2.3h-1.1V87h28.6l2.1-12.8z"></path><path d="M109.9 56.6l6.8-10c1-1.6 2.7-3.2 7.2-3.2v-1.5H112v1.5c2 0 3.1 1.1 3.1 2.3 0 .5-.1.6-.4 1.1l-5.7 8.4-6.4-9.6c-.1-.1-.3-.5-.3-.7 0-.6 1.1-1.4 3.2-1.5v-1.5c-1.7.1-5.3.1-7.2.1-1.5 0-4.6 0-6.5-.1v1.5h.9c2.7 0 3.7.3 4.6 1.7l9.1 13.8-8.1 12c-.7 1-2.2 3.3-7.2 3.3v1.5H103v-1.5c-2.3 0-3.1-1.4-3.1-2.3 0-.4.1-.6.5-1.2l7-10.4 7.9 11.9c.1.2.2.4.2.5 0 .6-1.1 1.4-3.2 1.5v1.5c1.7-.1 5.4-.1 7.2-.1 2.1 0 4.4 0 6.5.1v-1.5h-.9c-2.6 0-3.6-.2-4.7-1.8l-10.5-15.8z"></path>
      </svg>
    `,
    GitHub: `
      <svg role="img" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" fill="${fill}">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"></path>
      </svg>
    `,
    Bash: `
      <svg role="img" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" fill="${fill}">
        <path fill="none" d="M4.24 4.24h119.53v119.53H4.24z"></path><path fill="#293138" d="M109.01 28.64L71.28 6.24c-2.25-1.33-4.77-2-7.28-2s-5.03.67-7.28 2.01l-37.74 22.4c-4.5 2.67-7.28 7.61-7.28 12.96v44.8c0 5.35 2.77 10.29 7.28 12.96l37.73 22.4c2.25 1.34 4.76 2 7.28 2 2.51 0 5.03-.67 7.28-2l37.74-22.4c4.5-2.67 7.28-7.62 7.28-12.96V41.6c0-5.34-2.77-10.29-7.28-12.96zM79.79 98.59l.06 3.22c0 .39-.25.83-.55.99l-1.91 1.1c-.3.15-.56-.03-.56-.42l-.03-3.17c-1.63.68-3.29.84-4.34.42-.2-.08-.29-.37-.21-.71l.69-2.91c.06-.23.18-.46.34-.6.06-.06.12-.1.18-.13.11-.06.22-.07.31-.03 1.14.38 2.59.2 3.99-.5 1.78-.9 2.97-2.72 2.95-4.52-.02-1.64-.9-2.31-3.05-2.33-2.74.01-5.3-.53-5.34-4.57-.03-3.32 1.69-6.78 4.43-8.96l-.03-3.25c0-.4.24-.84.55-1l1.85-1.18c.3-.15.56.04.56.43l.03 3.25c1.36-.54 2.54-.69 3.61-.44.23.06.34.38.24.75l-.72 2.88c-.06.22-.18.44-.33.58a.77.77 0 01-.19.14c-.1.05-.19.06-.28.05-.49-.11-1.65-.36-3.48.56-1.92.97-2.59 2.64-2.58 3.88.02 1.48.77 1.93 3.39 1.97 3.49.06 4.99 1.58 5.03 5.09.05 3.44-1.79 7.15-4.61 9.41zm26.34-60.5l-35.7 22.05c-4.45 2.6-7.73 5.52-7.74 10.89v43.99c0 3.21 1.3 5.29 3.29 5.9-.65.11-1.32.19-1.98.19-2.09 0-4.15-.57-5.96-1.64l-37.73-22.4c-3.69-2.19-5.98-6.28-5.98-10.67V41.6c0-4.39 2.29-8.48 5.98-10.67l37.74-22.4c1.81-1.07 3.87-1.64 5.96-1.64s4.15.57 5.96 1.64l37.74 22.4c3.11 1.85 5.21 5.04 5.8 8.63-1.27-2.67-4.09-3.39-7.38-1.47z"></path><path fill="#4FA847" d="M99.12 90.73l-9.4 5.62c-.25.15-.43.31-.43.61v2.46c0 .3.2.43.45.28l9.54-5.8c.25-.15.29-.42.29-.72v-2.17c0-.3-.2-.42-.45-.28z"></path>
      </svg>
    `,
  };
  return svgs[name];
};


function Skills({ isDarkMode }) {

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
        <div style={iconStyle} dangerouslySetInnerHTML={{ __html: getSVG('LaTeX', isDarkMode) }} />
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
        <div style={iconStyle} dangerouslySetInnerHTML={{ __html: getSVG('GitHub', isDarkMode) }} />
      </a>
    ),
    Git: (
      <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" style={iconStyle} />
      </a>
    ),
    Bash: (
      <a href="https://www.gnu.org/software/bash/" target="_blank" rel="noopener noreferrer">
        <div style={iconStyle}  dangerouslySetInnerHTML={{ __html: getSVG('Bash', isDarkMode) }} />
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
