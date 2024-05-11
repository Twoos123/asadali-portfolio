import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../styles/Navbar.css";
import ReorderIcon from '@mui/icons-material/Reorder';
import DarkModeToggle from "react-dark-mode-toggle"; 
import logo from "../assets/AsadLogo.png";

function Navbar() {
    const [expandNavbar, setExpandNavbar] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true); 
    const location = useLocation();
    const prevLocation = usePrevious(location.pathname);

    useEffect(() => {
        if (location.pathname !== prevLocation) {
            setExpandNavbar(false);
        }
        document.body.classList.toggle('dark-mode', isDarkMode); 
    }, [location, isDarkMode, prevLocation]);

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

    const handleDarkModeChange = (checked) => {
        setIsDarkMode(checked);
    };

    return (
        <div className="navbar" id={expandNavbar ? "open" : "close"}>
            <div className="logo-container">
                <a href={window.location.href} onClick={(e) => e.preventDefault()}>
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
                <div className='dark-toggle'> 
                    <DarkModeToggle
                        onChange={handleDarkModeChange}
                        checked={isDarkMode}
                        size={80}
                    />
                </div>
            </div>
        </div>
    );
}

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

export default Navbar;
