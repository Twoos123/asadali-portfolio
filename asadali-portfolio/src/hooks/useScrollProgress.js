import { useState, useEffect } from 'react';

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      
      // Convert scroll to ocean depth (0 = surface, 1000+ = deep ocean)
      const oceanDepth = scrollPercent * 1000;
      
      setScrollProgress(scrollTop);
      setDepth(oceanDepth);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate depth zone for ecosystem changes
  const getDepthZone = () => {
    if (depth < 100) return 'surface';
    if (depth < 300) return 'sunlight';
    if (depth < 600) return 'twilight';
    if (depth < 900) return 'midnight';
    return 'abyssal';
  };

  // Calculate water pressure effect (much more gentle)
  const getPressureEffect = () => {
    return Math.min(depth / 2000, 0.3); // 0 to 0.3 max, slower progression
  };

  // Calculate light penetration (much more gentle, never goes too dark)
  const getLightLevel = () => {
    return Math.max(1 - (depth / 1500), 0.4); // Only dims to 70% at most
  };

  return {
    scrollProgress,
    depth,
    depthZone: getDepthZone(),
    pressureEffect: getPressureEffect(),
    lightLevel: getLightLevel(),
    // Utility functions
    isAtSurface: depth < 50,
    isInTwilight: depth >= 300 && depth < 600,
    isInDeepOcean: depth >= 600
  };
}

export default useScrollProgress;