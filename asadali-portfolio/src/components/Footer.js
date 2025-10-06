import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope, FaFileAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-transparent text-white py-8 relative" style={{
      background: 'linear-gradient(to bottom, transparent 0%, hsl(230, 95%, 5%) 50%, hsl(240, 100%, 3%) 100%)'
    }}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-blue-200">&copy; 2025 Asad Ali. All rights reserved.</p>
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

          </div>
        </div>
        <div className="text-center text-gray-300">
          <p className="text-sm mt-2 text-gray-400">
            Made with ❤️ and lots of ☕
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
