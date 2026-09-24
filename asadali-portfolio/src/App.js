import React, { useEffect, useRef } from 'react';
import { MotionConfig } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import ProjectDisplay from './pages/ProjectDisplay';
import './index.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { useMotionPaused } from './hooks/useReducedMotion';
import { SURFACE_COLOR, onWaterColor } from './components/ocean/waterColor';
import EditorBar from './editor/EditorBar';

function App() {
  const waterRef = useRef(null);
  const motionPaused = useMotionPaused();

  // The ocean's depth colour is painted on its own fixed layer behind the page, so changing
  // it on scroll only repaints that one solid layer (see components/ocean/waterColor.js).
  useEffect(
    () =>
      onWaterColor((color) => {
        waterRef.current.style.backgroundColor = color;
      }),
    []
  );

  return (
    // Transparent (App.css gives .App a grey background) so the water layer shows through.
    <div className="App" style={{ backgroundColor: 'transparent', overflow: 'hidden', minHeight: '100vh', position: 'relative' }}>
      <div ref={waterRef} className="ocean-water" style={{ backgroundColor: SURFACE_COLOR }} aria-hidden="true" />
      <MotionConfig reducedMotion={motionPaused ? 'always' : 'user'}>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-transparent" style={{ overflow: 'hidden', position: 'relative' }}>
        <Navbar />
        <main className='flex-grow bg-transparent' style={{ overflow: 'hidden', position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDisplay/>} />
          <Route path="/experience" element={<Experience />} />
        </Routes>
        </main>
        <Footer />
        </div>
        {/* On-site text editor, only shown with ?edit */}
        <EditorBar />
      </Router>
      </MotionConfig>
    </div>
  );
}

export default App;
