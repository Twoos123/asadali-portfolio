import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import "../styles/Home.css";
import Projects from './Projects';
import Experience from './Experience';


function Home() {

  return (
    <div id="home" className="home">
      <div className="about">
        <h2> Asad Ali </h2>
        <div className="prompt"> 
          <h1> I am a 2nd year Software Engineering student at uOttawa with a passion for learning and developing innovative solutions. </h1>
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
      <div id="skills" className="skills section"> 
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
