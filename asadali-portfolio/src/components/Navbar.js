import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../styles/Navbar.css";
import ReorderIcon from '@mui/icons-material/Reorder';
import logo from "../assets/AsadLogo.png"

function Navbar() {
    const [expandNavbar, setExpandNavbar] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setExpandNavbar(false);
    }, [location]);

   
    const handleScrollToSection = (sectionId) => {
        setExpandNavbar(false);

        
        setTimeout(() => {
            const section = document.querySelector(sectionId);
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 20, 
                    behavior: 'smooth'
                });
            }
        }, 0);
    };

    return (
        <div className="navbar" id={expandNavbar ? "open" : "close"}>
            <div className="logo-container">
            <a href={window.location.href}>
                <img src={logo} alt="Logo" />
            </a>
            </div>
            
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