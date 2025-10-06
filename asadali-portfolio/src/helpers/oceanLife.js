export const oceanLife = {
  home: {
    bubbles: 8,
    creatures: [
      {
        type: 'small-fish',
        count: 3,
        styles: {
          width: '45px',
          height: '30px',
          filter: 'invert(1)',
          opacity: '0.6',
        },
        animation: {
          className: 'animate-fish-surface',
          duration: () => 12 + Math.random() * 8,
        },
        position: {
          top: () => Math.random() * 20 + 80 + '%',
          left: '-100px',
        },
        zIndex: 1,
      },
      {
        type: 'jellyfish',
        count: 6,
        styles: {
          width: (i) => [55, 60, 52, 58, 53, 57][i] + 'px',
          height: (i) => [65, 70, 62, 68, 63, 67][i] + 'px',
          filter: 'invert(1)',
          opacity: '0.6',
        },
        animation: {
          className: 'animate-jellyfish-float',
          duration: (i) => [8, 9, 7, 10, 6, 8][i],
        },
        position: {
          top: (i) => [25, 36, 25, 30, 35, 27][i] + '%',
          left: (i) => [15, 50, 80, 25, 65, 85][i] + '%',
        },
        zIndex: 49,
      },
    ],
  },
  skills: {
    bubbles: 4,
    creatures: [
      {
        type: 'tropical-fish',
        count: 1,
        styles: {
          width: '50px',
          height: '35px',
          filter: 'invert(0.8) sepia(0.2) saturate(1.5) hue-rotate(200deg) brightness(0.8) contrast(1.2)',
          transform: 'scaleX(-1)',
          opacity: '0.9',
        },
        animation: {
          type: 'transition',
          duration: 18,
          delay: 2,
        },
        position: {
          top: '45%',
          left: '-80px',
        },
        zIndex: 2,
      },
      {
        type: 'sea-turtle',
        count: 1,
        styles: {
          width: '65px',
          height: '50px',
          filter: 'invert(0.8) sepia(0.2) saturate(1.5) hue-rotate(100deg) brightness(0.8) contrast(1.2)',
          opacity: '0.9',
        },
        animation: {
          type: 'transition',
          duration: 25,
          delay: 5,
        },
        position: {
          top: '65%',
          right: '-80px',
        },
        zIndex: 2,
      },
    ],
  },
  projects: {
    bubbles: 3,
    creatures: [
      {
        type: 'shark',
        count: 1,
        styles: {
          width: '70px',
          height: '55px',
          filter: 'invert(1)',
          opacity: '0.7',
        },
        animation: {
          className: 'animate-deep-creature',
          duration: 28,
          delay: 4,
        },
        position: {
          top: '30%',
        },
        zIndex: 1,
      },
      {
        type: 'octopus',
        count: 1,
        styles: {
          width: '60px',
          height: '50px',
          filter: 'invert(1)',
          opacity: '0.8',
        },
        animation: {
          className: 'animate-deep-creature',
          duration: 35,
          delay: 8,
        },
        position: {
          top: '70%',
        },
        zIndex: 1,
      },
    ],
  },
  experience: {
    bubbles: 2,
    creatures: [
      {
        type: 'anglerfish',
        count: 1,
        styles: {
          width: '55px',
          height: '40px',
          filter: 'invert(1)',
        },
        animation: {
          className: 'animate-deep-creature',
          duration: 20,
          delay: () => Math.random() * 5,
        },
        position: {
          top: () => 40 + Math.random() * 30 + '%',
        },
        zIndex: 1,
      },
      {
        type: 'giant-squid',
        count: 1,
        styles: {
          width: '75px',
          height: '60px',
          filter: 'invert(1)',
        },
        animation: {
          className: 'animate-deep-creature',
          duration: 22,
          delay: () => Math.random() * 8,
        },
        position: {
          top: () => 60 + Math.random() * 20 + '%',
        },
        zIndex: 1,
      },
    ],
  },
  resume: {
    bubbles: 5,
    creatures: [
      {
        type: 'kraken',
        count: 1,
        styles: {
          width: '1000px',
          height: '1000px',
          filter: 'invert(0.9) sepia(0.3) saturate(2) hue-rotate(260deg) brightness(0.7) contrast(1.1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))',
          opacity: '1',
        },
        animation: {
          className: 'animate-kraken',
          duration: 20,
          delay: 3,
        },
        position: {
          top: '30%',
        },
        zIndex: 3,
      },
      {
        type: 'jellyfish',
        count: 2,
        styles: {
          width: (i) => [50, 55][i] + 'px',
          height: (i) => [60, 65][i] + 'px',
          filter: 'invert(1)',
          opacity: '0.5',
        },
        animation: {
          className: 'animate-jellyfish-float',
          duration: (i) => [10, 12][i],
        },
        position: {
          top: (i) => [20, 70][i] + '%',
          left: (i) => [20, 80][i] + '%',
        },
        zIndex: 1,
      },
    ],
  },
};
