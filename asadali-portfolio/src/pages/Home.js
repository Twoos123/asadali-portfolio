import React, {useEffect, useState }from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import "../styles/Home.css";
import { TypeAnimation } from 'react-type-animation';


function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
}


function Home() {

  const isMobile = useIsMobile();

  const style = {
    color: '#e9d35b',
    fontSize: isMobile ? '40px' : '80px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  };

  return (
    <div className="home">
      <div className="about">
        <TypeAnimation
          sequence={[
            'Hi, My Name is Asad', // Text
            1000,
            'Im a software engineer!', // New text replaces previous after pause
            500, 
            'I have a passion for learning.',
            500,
            'and creating innovative solutions.'
          ]}
          wrapper="h2"
          cursor={true}
          repeat={Infinity}
          speed={40}
          style={style}
        />
        <div className="prompt"> 
          <a href="https://www.linkedin.com/in/asadbinali/" target="_blank" rel="noopener noreferrer">
            <LinkedInIcon />
          </a>

          <a href="https://github.com/Twoos123" target="_blank" rel="noopener noreferrer">
            <GitHubIcon />
          </a>
        
          <a href="mailto:masadbali190@gmail.com">
          <EmailIcon />
          </a>
        </div>
      </div>
      <div className="skills"> 
        <h1> Skills</h1>
        <ol className="list">
          <li className="item">
            <h2> Programming Languages</h2>
            <span> 
              Java, Python, HTML, CSS, JavaScript, SQL, LaTex, C/C++
            </span>
          </li>
          <li className="item">
            <h2> Frameworks</h2>
            <span> 
              React.js, Node.js, REST APIs, SpringBoot, Maven
            </span>
          </li>
          <li className="item">
            <h2> Developer Tools</h2>
            <span>
            GitHub, Git, Bash, Co:here, MySQL, Android Studio, Firebase, SQLite, Postman, Kubernetes, Docker, OCI, JIRA, Jenkins, OAuth 2.0
            </span>
          </li>
        </ol>
      </div>
    </div>
  )
}

export default Home;
