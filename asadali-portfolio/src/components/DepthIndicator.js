import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollProgress from '../hooks/useScrollProgress';

function DepthIndicator() {
  const [isOpen, setIsOpen] = useState(false);
  const { depth, depthZone, pressureEffect, lightLevel } = useScrollProgress();

  const getDepthZoneInfo = () => {
    switch (depthZone) {
      case 'surface':
        return {
          name: 'Surface Zone',
          description: 'Sunlight zone with abundant marine life',
          color: '#4FC3F7',
          icon: '☀️'
        };
      case 'sunlight':
        return {
          name: 'Sunlight Zone',
          description: 'Euphotic zone - where photosynthesis occurs',
          color: '#29B6F6',
          icon: '🌊'
        };
      case 'twilight':
        return {
          name: 'Twilight Zone',
          description: 'Dysphotic zone - dim light, mysterious creatures',
          color: '#1976D2',
          icon: '🌙'
        };
      case 'midnight':
        return {
          name: 'Midnight Zone',
          description: 'Aphotic zone - no sunlight, bioluminescent life',
          color: '#0D47A1',
          icon: '✨'
        };
      case 'abyssal':
        return {
          name: 'Abyssal Zone',
          description: 'Deep ocean - extreme pressure, rare life forms',
          color: '#01579B',
          icon: '🗻'
        };
      default:
        return {
          name: 'Ocean Surface',
          description: 'Beginning your descent',
          color: '#4FC3F7',
          icon: '🏄‍♂️'
        };
    }
  };

  const zoneInfo = getDepthZoneInfo();

  return (
    <div className="fixed top-20 right-4 z-50">
      {/* Info Button */}
      <motion.button
        className="backdrop-blur-sm rounded-full p-3 border border-blue-700 border-opacity-30 shadow-lg hover:shadow-xl transition-all duration-300 pointer-events-auto"
        style={{
          backgroundColor: `${zoneInfo.color}20`,
        }}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: depth > 10 ? 1 : 0, x: depth > 10 ? 0 : 100 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xl text-white" role="img" aria-label="Ocean Info">
          🌊
        </span>
      </motion.button>

      {/* Popover Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-0 right-16 pointer-events-auto"
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div 
              className="backdrop-blur-sm rounded-2xl p-4 border border-blue-700 border-opacity-30 shadow-2xl drop-shadow-2xl min-w-64"
              style={{
                backgroundColor: `${zoneInfo.color}15`,
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl" role="img" aria-label={zoneInfo.name}>
                  {zoneInfo.icon}
                </span>
                <div>
                  <h3 
                    className="font-bold text-sm text-white"
                  >
                    {zoneInfo.name}
                  </h3>
                  <p className="text-xs text-white/80">
                    {Math.round(depth)}m depth
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-white/70 mb-3">
                {zoneInfo.description}
              </p>
              
              {/* Depth Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <motion.div 
                  className="h-2 rounded-full"
                  style={{ backgroundColor: zoneInfo.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((depth / 1000) * 100, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              {/* Pressure Gauge */}
              <div className="flex justify-between text-xs text-white/60">
                <span>Pressure: {(1 + pressureEffect * 100).toFixed(1)} atm</span>
                <span>Light: {(lightLevel * 100).toFixed(0)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DepthIndicator;