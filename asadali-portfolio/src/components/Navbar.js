import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import logo from "../assets/AsadLogo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollToSection = (sectionId) => {
    setIsOpen(false);
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="bg-gray-50 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <button onClick={scrollToTop} className="flex-shrink-0 z-20">
              <img className="h-8 w-8" src={logo} alt="Logo" />
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link to="/" onClick={() => handleScrollToSection('#home')} className="text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-xl font-medium">Home</Link>
              <Link to="/" onClick={() => handleScrollToSection('#skills')} className="text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-xl font-medium">Skills</Link>
              <Link to="/" onClick={() => handleScrollToSection('#projects')} className="text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-xl font-medium">Projects</Link>
              <Link to="/" onClick={() => handleScrollToSection('#experience')} className="text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-xl font-medium">Experience</Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="-mr-2 flex md:hidden z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-controls="mobile-menu"
                aria-expanded={isOpen ? "true" : "false"}
              >
                <span className="sr-only">Open main menu</span>
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-x-0 top-0 bg-gray-50 z-30 transition-all duration-300 ease-in-out transform ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" onClick={() => handleScrollToSection('#home')} className="text-black hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
          <Link to="/" onClick={() => handleScrollToSection('#skills')} className="text-black hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Skills</Link>
          <Link to="/" onClick={() => handleScrollToSection('#projects')} className="text-black hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Projects</Link>
          <Link to="/" onClick={() => handleScrollToSection('#experience')} className="text-black hover:bg-gray-200 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium">Experience</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
