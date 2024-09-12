import React from 'react';
import "../styles/Footer.css";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContactPageIcon from '@mui/icons-material/ContactPage';

function Footer() {
  return (
    <div className="footer">
        <div className="prompt"> 
        <a href="https://www.linkedin.com/in/asadbinali/" target="_blank" className="icon-link-footer linkedin" rel="noopener noreferrer">
            <LinkedInIcon style={{ margin: 'auto' }}/>
            <span className="icon-title-footer">LinkedIn</span>
          </a>
          <a href="https://github.com/Twoos123" target="_blank" className="icon-link-footer github" rel="noopener noreferrer">
            <GitHubIcon style={{ margin: 'auto' }}/>
            <span className="icon-title-footer">GitHub</span>
          </a>
          <a href="mailto:masadbali190@gmail.com" className="icon-link-footer email">
            <EmailIcon style={{ margin: 'auto' }}/>
            <span className="icon-title-footer">Email</span>
          </a>
          <a href="https://drive.google.com/file/d/1ryk_3gcH17wOEyteb3HakdiKBiGf8MaE/view?usp=sharing" className="icon-link-footer badge" target="_blank" rel="noopener noreferrer">
            <ContactPageIcon style={{ margin: 'auto', marginLeft: '-5px' }}/>
            <span className="icon-title-footer">Resume</span>
          </a>    
        </div>
        <p> © 2024 asadali-portfolio.com</p>
    </div>
  );
}

export default Footer;
