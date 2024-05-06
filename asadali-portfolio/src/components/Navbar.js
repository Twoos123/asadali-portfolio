import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../styles/Navbar.css";
import ReorderIcon from '@mui/icons-material/Reorder';

function Navbar() {
    const [expandNavbar, setExpandNavbar] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setExpandNavbar(false);
    }, [location]);

    // Function to handle scrolling to the desired section
    const handleScrollToSection = (sectionId) => {
        // Close the navbar if it's expanded
        setExpandNavbar(false);

        // Wait for the navigation to complete, then scroll to the section
        setTimeout(() => {
            const section = document.querySelector(sectionId);
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 20, // Adjust the offset as needed
                    behavior: 'smooth'
                });
            }
        }, 0);
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
                <Link to="/" onClick={() => handleScrollToSection('#home')}>Home</Link>
                <Link to="/" onClick={() => handleScrollToSection('#skills')}>Skills</Link>
                <Link to="/" onClick={() => handleScrollToSection('#projects')}>Projects</Link>
                <Link to="/" onClick={() => handleScrollToSection('#experience')}>Experience</Link>
            </div>
        </div>
    );
}

export default Navbar;