import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope, FaFileAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="py-8 bg-slate-900 bg-opacity-95 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-blue-200">&copy; 2025 asadali-portfolio.com</p>
          </div>
          <div className="flex space-x-8">
            <a
              href="https://www.linkedin.com/in/asadbinali/"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:text-blue-300 transition-all duration-300 transform hover:scale-105 subtle-hover"
            >
              <FaLinkedin size={30} className="text-blue-200 group-hover:text-blue-300" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="https://github.com/Twoos123"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:text-gray-300 transition-all duration-300 transform hover:scale-105 subtle-hover"
            >
              <FaGithub size={30} className="text-blue-200 group-hover:text-gray-300" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="mailto:masadbali190@gmail.com"
              className="group hover:text-cyan-300 transition-all duration-300 transform hover:scale-105 subtle-hover"
            >
              <FaEnvelope size={30} className="text-blue-200 group-hover:text-cyan-300" />
              <span className="sr-only">Email</span>
            </a>
            <a
              href="https://drive.google.com/file/d/17k-FbUlKWx263njOeZHt0rcvE-LiNiSi/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:text-cyan-300 transition-all duration-300 transform hover:scale-105 subtle-hover"
            >
              <FaFileAlt size={30} className="text-blue-200 group-hover:text-cyan-300" />
              <span className="sr-only">Resume</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
