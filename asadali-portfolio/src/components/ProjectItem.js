import React from 'react';
import { FaGithub } from 'react-icons/fa';

function ProjectItem({ id, image, name, skills, repoUrl }) {
  return (
    <div className="max-w-sm w-full h-[420px] rounded overflow-hidden shadow-2xl bg-blue-900 bg-opacity-70 transition-all duration-300 transform hover:scale-105 flex flex-col subtle-hover hover:shadow-2xl hover:shadow-cyan-500/20">
      <img className="w-full h-48 object-cover transition-transform duration-300 hover:scale-102" src={image} alt={name} />
      <div className="px-6 py-4 flex-grow flex flex-col">
        <div className="font-bold text-xl mb-2 text-blue-100 transition-colors duration-300 hover:text-cyan-200">{name}</div>
        <p className="text-blue-200 text-lg font-medium flex-grow line-clamp-2 transition-colors duration-300 hover:text-blue-100">
          {skills}
        </p>
      </div>
      <div className="px-6 py-4 mt-auto">
        <div className="flex justify-center">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
          >
            <FaGithub className="mr-2 transition-transform duration-300" />
            View Repository
          </a>
        </div>
      </div>
    </div>
  );
}



export default ProjectItem;
