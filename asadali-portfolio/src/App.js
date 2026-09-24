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
import { SURFACE_COLOR, onWaterColor } from './components/ocean/waterColor';
import EditorBar from './editor/EditorBar';
import AdminConsole from './editor/AdminConsole';
import EditorDialogs from './editor/dialogs';

function App() {
  const waterRef = useRef(null);

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
      {/* framer-motion follows the OS reduce-motion setting. The footer's pause button
          freezes CSS animations and the ocean loops instead (hooks/useReducedMotion.js). */}
      <MotionConfig reducedMotion="user">
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
          <Route path="/admin" element={<AdminConsole />} />
        </Routes>
        </main>
        <Footer />
        </div>
        {/* On-site editor, only shown in edit mode */}
        <EditorBar />
        <EditorDialogs />
      </Router>
      </MotionConfig>
    </div>
  );
}

export default App;
