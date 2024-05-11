import React from 'react';
import "../styles/Footer.css";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import BadgeIcon from '@mui/icons-material/Badge';

function Footer() {
  return (
    <div className="footer">
        <div className="prompt"> 
        <a href="https://www.linkedin.com/in/asadbinali/" target="_blank" className="icon-link linkedin" rel="noopener noreferrer">
            <LinkedInIcon />
            <span className="icon-title">LinkedIn</span>
          </a>
          <a href="https://github.com/Twoos123" target="_blank" className="icon-link github" rel="noopener noreferrer">
            <GitHubIcon />
            <span className="icon-title">GitHub</span>
          </a>
          <a href="mailto:masadbali190@gmail.com" className="icon-link email">
            <EmailIcon />
            <span className="icon-title">Email</span>
          </a>
          <a href="https://drive.google.com/file/d/121oTfe4bYpKRSHnOslxKqCDFRnNhujN3/view?usp=sharing" className="icon-link badge" target="_blank" rel="noopener noreferrer">
            <BadgeIcon />
            <span className="icon-title">Resume</span>
          </a>    
        </div>
        <p> © 2024 asadali-portfolio.com</p>
    </div>
  );
}

export default Footer;
