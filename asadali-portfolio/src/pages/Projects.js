import React from 'react';
import ProjectItem from '../components/ProjectItem';
import { projectList } from "../helpers/ProjectList";

function Projects() {
  return (
    <div className="projects py-16 bg-opacity-70 bg-blue-800">
      <h1 className="text-4xl font-bold text-center text-gray-100 mb-12">Personal Projects</h1>
      <div className="projectList grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
        {projectList.map((project) => (
          <ProjectItem 
            key={project.id} 
            id={project.id} 
            name={project.name} 
            image={project.image} 
            skills={project.skills} 
            repoUrl={project.repoUrl} 
          />
        ))}
      </div>
    </div>
  );
}

export default Projects;
