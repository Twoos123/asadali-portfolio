import React, { useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import '../styles/Projects.css'; // Assuming your CSS is in Projects.css

function ProjectItem({ id, image, name, skills, repoUrl }) {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => {
    setShowInfo(prevShowInfo => !prevShowInfo);
  };

  return (
    <div className={`projectItemWrapper ${showInfo ? 'showInfo' : ''}`} onClick={toggleInfo}>
      <div className="projectItem">
        <div style={{ backgroundImage: `url(${image})` }} className="bgImage" />
        <h1> {name} </h1>
      </div>
      {showInfo && (
        <div className="projectInfo">
          <p>{skills}</p>
          <GitHubIcon style={{ fontSize: '3rem', cursor: 'pointer' }} onClick={(e) => {
            e.stopPropagation();
            window.open(repoUrl, '_blank');
          }} />
        </div>
      )}
    </div>
  );
}

export default ProjectItem;
