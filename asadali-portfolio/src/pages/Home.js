import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <div className="about">
        <h2> Hi, My Name is Asad</h2>
        <div className="prompt"> 
        <p> A software engineer with a passion for learning and creating innovative solutions.</p>
        <LinkedInIcon />
        <EmailIcon />
        <GitHubIcon />
        </div>
      </div>
      <div className="skills"> 
        <h1> Skills</h1>
        <ol className="list">
          <li className="item">
            <h2> Frontend</h2>
            <span> 
              {/* write stuff here, update according to resume */}
            </span>
          </li>
          <li className="item">
            <h2> Backend</h2>
            <span> 
              {/* write stuff here, update according to resume */}
            </span>
          </li>
          <li className="item">
            <h2> Frameworks</h2>
            <span>
              {/* write stuff here, update according to resume */}
            </span>
          </li>
        </ol>
      </div>
    </div>
  )
}

export default Home;
