import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';

function ProjectItem({ id, image, name, skills, repoUrl }) {
  return (
    <div className="projectItem">
      <div style={{ backgroundImage: `url(${image})` }} className="bgImage" />
      <h1> {name} </h1>
      <div className="projectInfo">
        <p>{skills}</p>
        <GitHubIcon style={{ fontSize: '2rem', cursor: 'pointer' }} onClick={() => window.open(repoUrl, '_blank')} />
      </div>
    </div>
  );
}
export default ProjectItem;
