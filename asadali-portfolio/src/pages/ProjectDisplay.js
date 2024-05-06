import React from 'react';
import { useParams } from "react-router-dom";
import { projectList } from "../helpers/ProjectList";
import GitHubIcon from '@mui/icons-material/GitHub';
import "../styles/ProjectDisplay.css"


function ProjectDisplay() {
  const { id } = useParams();
  const project = projectList.find(p => p.id.toString() === id);

  if (!project) {
      return <div>Project not found!</div>;
  }

  return (
      <div className='project'>
          <h1> {project.name} </h1>
          <img src={project.image} alt={project.name} />
          <p>
            <b>Skills:</b> {project.skills}
          </p>
          <GitHubIcon />
      </div>
  )
}

export default ProjectDisplay;