import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "../styles/Navbar.css";
import ReorderIcon from '@mui/icons-material/Reorder';

function Navbar() {
    const [expandNavbar, setExpandNavbar] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setExpandNavbar(false);
    }, [location]);

    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        const section = document.querySelector(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="navbar" id={expandNavbar ? "open" : "close"}> 
            <div className="toggleButton"> 
                <button 
                    onClick={() => {
                        setExpandNavbar((prev) => !prev);
                    }}
                > 
                    <ReorderIcon /> 
                </button>
            </div> 
            <div className="links">
                <a href="#home" onClick={(e) => scrollToSection(e, '#home')}>Home</a>
                <a href="#skills" onClick={(e) => scrollToSection(e, '#skills')}>Skills</a>
                <a href="#projects" onClick={(e) => scrollToSection(e, '#projects')}>Projects</a>
                <a href="#experience" onClick={(e) => scrollToSection(e, '#experience')}>Experience</a>
            </div>
        </div>
    );
}

export default Navbar;