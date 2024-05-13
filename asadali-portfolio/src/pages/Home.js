import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContactPageIcon from '@mui/icons-material/ContactPage';
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
              <a href="https://www.linkedin.com/in/asadbinali/" target="_blank" className="icon-link linkedin" rel="noopener noreferrer">
              <LinkedInIcon style={{ margin: 'auto' }} />
                <span className="icon-title">LinkedIn</span>
              </a>
              <a href="https://github.com/Twoos123" target="_blank" className="icon-link github" rel="noopener noreferrer">
                <GitHubIcon style={{ margin: 'auto' }}/>
                <span className="icon-title">GitHub</span>
              </a>
              <a href="mailto:masadbali190@gmail.com" className="icon-link email">
                <EmailIcon style={{ margin: 'auto' }}/>
                <span className="icon-title">Email</span>
              </a>
              <a href="https://drive.google.com/file/d/121oTfe4bYpKRSHnOslxKqCDFRnNhujN3/view?usp=sharing" className="icon-link badge" target="_blank" rel="noopener noreferrer">
                <ContactPageIcon style={{ margin: 'auto', marginLeft: '-5px' }}/>
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
