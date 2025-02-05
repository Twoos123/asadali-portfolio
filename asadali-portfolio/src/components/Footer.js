import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope, FaFileAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="py-8 bg-blue-800 bg-opacity-40 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2024 asadali-portfolio.com</p>
          </div>
          <div className="flex space-x-8">
            <a
              href="https://www.linkedin.com/in/asadbinali/"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:text-blue-300 transition-colors duration-300 transform hover:scale-110"
            >
              <FaLinkedin size={30} className="text-white group-hover:text-blue-300" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="https://github.com/Twoos123"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:text-gray-300 transition-colors duration-300 transform hover:scale-110"
            >
              <FaGithub size={30} className="text-white group-hover:text-gray-300" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="mailto:masadbali190@gmail.com"
              className="group hover:text-red-300 transition-colors duration-300 transform hover:scale-110"
            >
              <FaEnvelope size={30} className="text-white group-hover:text-red-300" />
              <span className="sr-only">Email</span>
            </a>
            <a
              href="https://drive.google.com/file/d/17k-FbUlKWx263njOeZHt0rcvE-LiNiSi/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:text-green-300 transition-colors duration-300 transform hover:scale-110"
            >
              <FaFileAlt size={30} className="text-white group-hover:text-green-300" />
              <span className="sr-only">Resume</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
