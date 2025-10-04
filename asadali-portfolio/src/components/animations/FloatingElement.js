import { motion } from 'framer-motion';

const FloatingElement = ({ 
  children, 
  intensity = 1, 
  duration = 3,
  delay = 0,
  className = '' 
}) => {
  const floatVariants = {
    animate: {
      y: [-5 * intensity, 5 * intensity, -5 * intensity],
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    }
  };

  return (
    <motion.div
      variants={floatVariants}
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement;