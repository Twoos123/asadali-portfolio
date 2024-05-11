import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import BadgeIcon from '@mui/icons-material/Badge';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import { Parallax } from 'react-parallax';
import Background from '../assets/Background.svg';
import "../styles/Home.css";

function Home() {
  return (
    <div id="home" className="home">
      <Parallax bgImage={Background} strength={100}>
        <div style={{ height: 865 }}>
          <div className="about">
            <h2>Asad Ali</h2>
            <div className="prompt"> 
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
        </div>
      </Parallax>
      <div id='skills'>
        <Skills />
      </div>
      <div id="projects">
        <Projects />
      </div>
      <div id="experience">
        <Experience />
      </div>
    </div>
  );
}

export default Home;
