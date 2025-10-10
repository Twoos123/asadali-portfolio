import React from 'react';
import { motion } from 'framer-motion';

const SuccessAnimation = ({ message, onReset }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 260,
        damping: 20,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const checkmarkPathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 bg-green-500/20 backdrop-blur-sm rounded-2xl shadow-lg border border-green-500/30"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={childVariants}>
        <svg
          className="w-24 h-24 text-green-400"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="26"
            cy="26"
            r="25"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.path
            d="M14 27l8 8 16-16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={checkmarkPathVariants}
          />
        </svg>
      </motion.div>
      <motion.h2
        className="mt-6 text-2xl font-bold text-white"
        variants={childVariants}
      >
        Success!
      </motion.h2>
      <motion.p className="mt-2 text-center text-gray-300" variants={childVariants}>
        {message}
      </motion.p>
      <motion.button
        onClick={onReset}
        className="mt-8 px-6 py-2 font-semibold text-white bg-green-500/50 rounded-lg hover:bg-green-500/80 transition-colors duration-300"
        variants={childVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Send Another Message
      </motion.button>
    </motion.div>
  );
};

export default SuccessAnimation;
