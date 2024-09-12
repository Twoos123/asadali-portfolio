import React from 'react';
import '../styles/Projects.css';

function ProjectItem({ id, image, name, repoUrl }) {

  const openRepo = () => {
    window.open(repoUrl, '_blank');
  };

  return (
    <div className="projectItemWrapper" onClick={openRepo}>
      <div className="projectItem">
        <div style={{ backgroundImage: `url(${image})` }} className="bgImage" />
        <h1> {name} </h1>
      </div>
    </div>
  );
}

export default ProjectItem;
