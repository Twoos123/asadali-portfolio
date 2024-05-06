import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import BadgeIcon from '@mui/icons-material/Badge';
import { TypeAnimation } from 'react-type-animation'; 
import Projects from './Projects';
import Experience from './Experience';
import { FaJava, FaPython, FaHtml5, FaCss3, FaDocker, FaReact, FaNode, FaGithub, FaGitAlt, FaJira, FaJenkins } from 'react-icons/fa';
import { IoLogoJavascript, IoLogoFirebase } from 'react-icons/io5';
import { SiLatex, SiSpringboot, SiApachemaven, SiAndroidstudio, SiPostman, SiKubernetes } from 'react-icons/si';
import { VscTerminalBash } from 'react-icons/vsc';
import { TbBrandOauth } from 'react-icons/tb';
import "../styles/Home.css";

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

function Home() {
  return (
    <div id="home" className="home">
      <div className="about">
        <TypeAnimation
          sequence={[
            'Asad Ali',
            1500,   
            'Welcome to my website',     
            1500,
            ''
          ]}
          wrapper="h2"
          cursor={true}
          repeat={Infinity}
        />
        <div className="prompt"> 
          <h1> I am a 2nd year Software Engineering student at uOttawa with a passion for learning and developing innovative solutions. </h1>
          <a href="https://www.linkedin.com/in/asadbinali/" target="_blank" className="icon-link" rel="noopener noreferrer">
            <LinkedInIcon />
            <span className="icon-title">LinkedIn</span>
          </a>
          <a href="https://github.com/Twoos123" target="_blank" className="icon-link" rel="noopener noreferrer">
            <GitHubIcon />
            <span className="icon-title">GitHub</span>
          </a>
          <a href="mailto:masadbali190@gmail.com" className="icon-link">
            <EmailIcon />
            <span className="icon-title">Email</span>
          </a>
          <a href="https://drive.google.com/file/d/1Oigv0BlI8TvYZmbipaANGG3XQjtL4wiu/view?usp=drive_link" className="icon-link" target="_blank" rel="noopener noreferrer">
            <BadgeIcon />
            <span className="icon-title">Resume</span>
          </a>    
        </div>
      </div>
      <div id="skills" className="skills section"> 
        <h1> Skills</h1>
        <div className="skills-grid">
          <div className="skill-category">
            <h2> Languages</h2>
            <div className="skill-set"> 
              {Object.entries(programmingLanguagesIcons).map(([language, Icon]) => (
                <div className="skill" key={language}>
                  {Icon}
                  <span>{language}</span>
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
      <div id="projects" className="projects section">
        <Projects />
      </div>
      <div id="experience" className="experience section">
        <Experience />
      </div>
    </div>
  );
}

export default Home;
