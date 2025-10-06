import { oceanLife } from './oceanLife';

export const createOceanEffects = (containerId, section) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const sectionLife = oceanLife[section];
  if (!sectionLife) return;

  // Create bubbles
  if (sectionLife.bubbles) {
    for (let i = 0; i < sectionLife.bubbles; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble-3d animate-bubble-stream';
      bubble.style.left = `${Math.random() * 100}%`;
      const size = Math.random() * 8 + 4;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.animationDuration = `${8 + Math.random() * 8}s`;
      container.appendChild(bubble);
    }
  }

  // Create creatures
  if (sectionLife.creatures) {
    sectionLife.creatures.forEach(creature => {
      for (let i = 0; i < creature.count; i++) {
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.pointerEvents = 'none';

        let innerHTML = `<img src="/asadali-portfolio/assets/fish/${creature.type}.svg" alt="${creature.type}" style="`;
        for (const [key, value] of Object.entries(creature.styles)) {
          innerHTML += `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${typeof value === 'function' ? value(i) : value}; `;
        }
        innerHTML += `"/>`;
        el.innerHTML = innerHTML;

        for (const [key, value] of Object.entries(creature.position)) {
          el.style[key] = typeof value === 'function' ? value(i) : value;
        }
        
        if (creature.animation.className) {
          el.className = creature.animation.className;
        }
        
        if (creature.animation.duration) {
          el.style.animationDuration = `${typeof creature.animation.duration === 'function' ? creature.animation.duration(i) : creature.animation.duration}s`;
        }

        if (creature.zIndex) {
          el.style.zIndex = creature.zIndex;
        }
        
        container.appendChild(el);
      }
    });
  }
};
