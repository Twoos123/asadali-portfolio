import React, { useRef } from 'react';
import { FaGithub } from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';

function ProjectItem({ id, image, name, skills, repoUrl, animationDelay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.3, once: true });

  return (
    <motion.div 
      ref={ref}
      className="rounded overflow-hidden shadow-2xl bg-blue-900 bg-opacity-70 cursor-pointer"
      style={{ 
        display: 'grid',
        gridTemplateRows: '192px 1fr auto',
        height: '420px',
        width: '100%',
        maxWidth: '384px'
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.6, 
        delay: animationDelay, 
        ease: "easeOut" 
      }}
      whileHover={{ 
        scale: 1.05,
        y: -10,
        boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)",
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
        className="overflow-hidden"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        style={{ 
          height: '192px',
          width: '100%'
        }}
      >
        <img 
          src={image} 
          alt={name}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: '192px',
            display: 'block'
          }}
        />
      </motion.div>
      
      <div style={{ padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
        <motion.div 
          style={{ 
            fontWeight: 'bold', 
            fontSize: '1.25rem', 
            lineHeight: '1.75rem',
            marginBottom: '0.5rem',
            color: '#dbeafe'
          }}
          whileHover={{ color: "#22d3ee" }}
          transition={{ duration: 0.2 }}
        >
          {name}
        </motion.div>
        <motion.p 
          style={{ 
            color: '#93c5fd',
            fontSize: '1.125rem',
            lineHeight: '1.75rem',
            fontWeight: '500',
            height: '5.25rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
          whileHover={{ color: "#dbeafe" }}
          transition={{ duration: 0.2 }}
        >
          {skills}
        </motion.p>
      </div>
      
      <div style={{ padding: '1rem 1.5rem 1.5rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <motion.a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontWeight: '500',
            textAlign: 'center',
            color: 'white',
            backgroundColor: '#2563eb',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
          whileHover={{ 
            backgroundColor: "#06b6d4",
            scale: 1.05,
            boxShadow: "0 10px 20px rgba(6, 182, 212, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            style={{ marginRight: '0.5rem' }}
          >
            <FaGithub />
          </motion.div>
          View Repository
        </motion.a>
      </div>
    </motion.div>
  );
}



export default ProjectItem;
