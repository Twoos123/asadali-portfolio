import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import ProjectDisplay from './pages/ProjectDisplay';
import './index.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PageTransition } from './components/animations';

function App() {
  const [backgroundColor, setBackgroundColor] = useState('hsl(195, 70%, 55%)');

  return (
    <div className="App" style={{ backgroundColor: backgroundColor, transition: 'background-color 0.3s ease', overflow: 'hidden', minHeight: '100vh', position: 'relative' }}>
      <Router
      basename='/asadali-portfolio'>
        <div className="flex flex-col min-h-screen bg-transparent" style={{ overflow: 'hidden', position: 'relative' }}>
        <Navbar />
        <main className='flex-grow bg-transparent' style={{ overflow: 'hidden', position: 'relative' }}>
        <PageTransition>
        <Routes>
          <Route path="/" element={<Home backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDisplay/>} />
          <Route path="/experience" element={<Experience />} />
        </Routes>
        </PageTransition>
        </main>
        <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
