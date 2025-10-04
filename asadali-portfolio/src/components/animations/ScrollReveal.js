import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const ScrollReveal = ({ 
  children, 
  className = '',
  offset = 100,
  threshold = 0.1
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start end+${offset}px`, `end start-${offset}px`]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;