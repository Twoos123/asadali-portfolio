import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { projectList } from "../helpers/ProjectList";
import GitHubIcon from '@mui/icons-material/GitHub';

function ProjectDisplay() {
  const { id } = useParams();
  const project = projectList.find(p => p.id.toString() === id);

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []); 

  if (!project) {
    return <div className="py-16 px-4 max-w-2xl mx-auto text-gray-100">Project not found!</div>;
  }

  // Helper function to display skills properly
  const displaySkills = (skills) => {
    if (Array.isArray(skills)) {
      return skills.join(', ');
    }
    return skills;
  };

  return (
    <div className='project py-16 px-4 max-w-2xl mx-auto'>
      <h1 className="text-3xl font-bold text-gray-100 mb-4"> {project.name} </h1>
      <img src={project.image} alt={project.name} className="w-full h-64 object-cover mb-4" />
      <p className="text-gray-300 mb-4">
        <b>Skills:</b> {displaySkills(project.skills)}
      </p>
      <div className="flex justify-center mt-4">
        <a href={project.repoUrl || project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300">
          <GitHubIcon className="mr-2" />
          View Repository
        </a>
      </div>
    </div>
  );
}

export default ProjectDisplay;
