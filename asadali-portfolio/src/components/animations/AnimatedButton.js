import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  onClick, 
  className = '',
  variant = 'scale',
  disabled = false,
  ...props 
}) => {
  const variants = {
    scale: {
      whileHover: { 
        scale: 1.05,
        transition: { duration: 0.2 }
      },
      whileTap: { 
        scale: 0.95,
        transition: { duration: 0.1 }
      }
    },
    lift: {
      whileHover: { 
        y: -2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        transition: { duration: 0.2 }
      },
      whileTap: { 
        y: 0,
        transition: { duration: 0.1 }
      }
    },
    rotate: {
      whileHover: { 
        rotate: 5,
        scale: 1.05,
        transition: { duration: 0.2 }
      },
      whileTap: { 
        rotate: 0,
        scale: 0.95,
        transition: { duration: 0.1 }
      }
    },
    glow: {
      whileHover: { 
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        transition: { duration: 0.2 }
      }
    }
  };

  return (
    <motion.button
      {...variants[variant]}
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;