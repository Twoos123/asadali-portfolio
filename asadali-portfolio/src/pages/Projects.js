import React from 'react';
import ProjectItem from '../components/ProjectItem';
import "../styles/Projects.css";
import { projectList } from "../helpers/ProjectList";

function Projects() {
  return (
    <div className="projects">
      <h1> Personal Projects</h1>
      <div className="projectList">
        {projectList.map((project, index) => {
          return <ProjectItem key={index} id={index} name={project.name} image={project.image} skills={project.skills} repoUrl={project.repoUrl} />
        })}
      </div>
    </div>
  )
}

export default Projects;