import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../styles/Navbar.css";
import ReorderIcon from '@mui/icons-material/Reorder';
import { useState, useEffect } from 'react';

function Navbar() {
    const [expandNavbar, setExpandNavbar] = useState(false);

    const location = useLocation();

    useEffect(() => {
        setExpandNavbar(false);
    }, [location])

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
            <Link to="asadali-portfolio/home"> Home </Link>
            <Link to="asadali-portfolio/projects"> Projects </Link>
            <Link to="asadali-portfolio/experience"> Experience </Link>
        </div>
    </div>
  )
}

export default Navbar;