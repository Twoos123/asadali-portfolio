import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const logo = process.env.PUBLIC_URL + '/assets/AsadLogo.png';

const NAV_LINKS = [
  { label: 'Home', target: '#home' },
  { label: 'About', target: '#about' },
  { label: 'Skills', target: '#skills' },
  { label: 'Projects', target: '#projects' },
  { label: 'Experience', target: '#experience' },
  { label: 'Resume', target: '.resume-section' },
];

const CTA = { label: 'Contact', target: '.contact-section' };

const NAV_HEIGHT_DESKTOP = 80;
const NAV_HEIGHT_MOBILE = 64;
const getNavHeight = () =>
  typeof window !== 'undefined' && window.innerWidth >= 1024 ? NAV_HEIGHT_DESKTOP : NAV_HEIGHT_MOBILE;

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLabel, setActiveLabel] = useState('Home');
  const lockUntilRef = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;

    const trackedTargets = [
      { label: 'Home', target: '#home' },
      { label: 'About', target: '#about' },
      { label: 'Skills', target: '#skills' },
      { label: 'Projects', target: '#projects' },
      { label: 'Experience', target: '#experience' },
      { label: 'Resume', target: '.resume-section' },
      { label: 'Contact', target: '.contact-section' },
    ];

    const getElements = () =>
      trackedTargets
        .map((t) => ({ ...t, el: document.querySelector(t.target) }))
        .filter((t) => t.el);

    let elements = getElements();
    if (elements.length === 0) return;

    const pickActive = () => {
      if (Date.now() < lockUntilRef.current) return;
      if (window.scrollY < 80) {
        setActiveLabel('Home');
        return;
      }
      const probe = window.scrollY + getNavHeight() + 40;
      let current = elements[0];
      for (const entry of elements) {
        const top = entry.el.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) current = entry;
      }
      setActiveLabel(current.label);
    };

    pickActive();
    const onScroll = () => pickActive();
    const onResize = () => {
      elements = getElements();
      pickActive();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [onHome]);

  const scrollToTarget = useCallback((target) => {
    const el = document.querySelector(target);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - getNavHeight();
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const handleNavClick = useCallback(
    (target, label) => {
      setIsOpen(false);
      if (label) setActiveLabel(label);
      lockUntilRef.current = Date.now() + 900;
      if (onHome) {
        scrollToTarget(target);
      } else {
        navigate('/');
        setTimeout(() => {
          lockUntilRef.current = Date.now() + 900;
          scrollToTarget(target);
        }, 80);
      }
    },
    [onHome, navigate, scrollToTarget]
  );

  const handleLogoClick = () => {
    setIsOpen(false);
    setActiveLabel('Home');
    lockUntilRef.current = Date.now() + 900;
    if (onHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-ocean-950/65 border-b border-white/10 shadow-[0_4px_30px_rgba(8,47,73,0.35)]'
            : 'bg-ocean-950/25 border-b border-white/5'
        }`}
        style={{
          backdropFilter: 'blur(22px) saturate(180%)',
          WebkitBackdropFilter: 'blur(22px) saturate(180%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between gap-4">
          <motion.button
            onClick={handleLogoClick}
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300/60 rounded-xl p-1 -m-1 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Scroll to top"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-ocean-400/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <img className="relative h-8 w-8 lg:h-10 lg:w-10" src={logo} alt="" />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="font-display text-lg font-bold text-white tracking-tight">Asad Ali</span>
              <span className="text-[11px] font-medium text-ocean-200/70 tracking-widest uppercase mt-0.5">
                Software Engineer
              </span>
            </div>
          </motion.button>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = onHome && link.label === activeLabel;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.target, link.label)}
                  className={`relative px-4 py-2.5 text-[15px] font-medium tracking-tight rounded-xl transition-colors duration-100 ${
                    isActive ? 'text-white' : 'text-ocean-100/75 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-bg"
                      className="absolute inset-0 rounded-xl bg-white/12 border border-white/20"
                      transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.18 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <motion.button
              onClick={() => handleNavClick(CTA.target, CTA.label)}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-ocean-500 to-ocean-400 hover:from-ocean-400 hover:to-ocean-300 text-white text-sm font-semibold shadow-glow hover:shadow-glow-strong overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative">Let's talk</span>
              <FaArrowRight className="relative h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </div>

          <div className="lg:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-white/8 border border-white/15 text-ocean-50 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300/60"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              whileTap={{ scale: 0.92 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isOpen ? <FaTimes className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden mx-4 mt-2 rounded-2xl p-3 bg-ocean-950/80 border border-white/15 shadow-glass-lg"
            style={{
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            }}
            id="mobile-menu"
          >
            <div className="flex flex-col gap-1">
              {[...NAV_LINKS, CTA].map((link, i) => {
                const isActive = onHome && link.label === activeLabel;
                const isCta = link.label === CTA.label;
                return (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.2 }}
                    onClick={() => handleNavClick(link.target, link.label)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isCta
                        ? 'bg-gradient-to-r from-ocean-500 to-ocean-400 text-white shadow-glow mt-2'
                        : isActive
                        ? 'bg-white/10 border border-white/15 text-white'
                        : 'text-ocean-50 hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isCta && <FaArrowRight className="h-3 w-3" />}
                    {isActive && !isCta && <span className="h-1.5 w-1.5 rounded-full bg-ocean-300" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
