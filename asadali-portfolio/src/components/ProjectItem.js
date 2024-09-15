import React from 'react';
import { FaGithub } from 'react-icons/fa';

function ProjectItem({ id, image, name, skills, repoUrl }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-blue-800 bg-opacity-60 transition-transform duration-300 transform hover:scale-105 flex flex-col">
      <img className="w-full h-48 object-cover" src={image} alt={name} />
      <div className="px-6 py-4 flex-1">
        <div className="font-bold text-xl mb-2 text-gray-100">{name}</div>
        <p className="text-gray-300 text-base">{skills}</p>
      </div>
      <div className="px-6 py-4">
        <div className="flex justify-center">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            <FaGithub className="mr-2" />
            View Repository
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProjectItem;
