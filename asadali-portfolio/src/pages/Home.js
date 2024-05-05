import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import "../styles/Home.css";
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';


function Home() {
  return (
    <div className="home">
      <div className="about">
        <TypeAnimation
          sequence={[
            'Hi, My Name is Asad', // Text
            1000, // Pause for 1000ms
            'Im a software engineer!', // New text replaces previous after pause
            500, 
            'I have a passion for learning.',
            500,
            'and creating innovative solutions.'
          ]}
          wrapper="h2"
          cursor={true}
          repeat={Infinity}
          speed={40} // Adjust typing speed as needed
          style={{ color: '#e9d35b', fontSize: '80px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}
        />
        <div className="prompt"> 
          <Link href="https://www.linkedin.com/in/asadbinali/" target="_blank" >
            <LinkedInIcon />
          </Link>

          <Link href="https://github.com/Twoos123" target="_blank" >
            <GitHubIcon />
          </Link>
        
          <EmailIcon />
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
