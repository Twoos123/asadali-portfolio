import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const positions = new Map();

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const prevPath = useRef(pathname);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }

    if (prevPath.current !== pathname) {
      positions.set(prevPath.current, window.scrollY);
    }
    prevPath.current = pathname;

    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    if (navigationType === 'POP') {
      const saved = positions.get(pathname) ?? 0;
      if (saved <= 0) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        return;
      }
      const start = performance.now();
      const tick = () => {
        window.scrollTo({ top: saved, left: 0, behavior: 'instant' });
        const reached = Math.abs(window.scrollY - saved) <= 2;
        if (reached || performance.now() - start > 1200) return;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, navigationType]);

  return null;
}

export default ScrollToTop;
