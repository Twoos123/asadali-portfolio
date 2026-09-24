import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { SPECIES } from './species';
import { createOceanSim } from './engine';
import { oceanLife } from '../../helpers/oceanLife';
import useMediaQuery from '../../hooks/useMediaQuery';
import useReducedMotion from '../../hooks/useReducedMotion';

const between = ([min, max]) => min + Math.random() * (max - min);
const pick = (value, i) => (Array.isArray(value) ? value[i % value.length] : value);

function buildPlan(config, isMobile) {
  const creatures = [];
  config.creatures.forEach((group, g) => {
    const count = isMobile ? group.mobileCount ?? 0 : group.count;
    for (let i = 0; i < count; i++) {
      const members = group.school ? Math.round(between(group.school)) : 1;
      const scale = between(group.scale);
      for (let m = 0; m < members; m++) {
        creatures.push({
          key: `${g}-${i}-${m}`,
          species: group.species,
          school: group.school ? `${g}-${i}` : null,
          parade: Boolean(group.parade),
          scale: group.school ? scale * between([0.85, 1.12]) : scale,
          band: (isMobile && group.mobileBand) || group.band,
          color: pick(group.color, i + m),
          detail: pick(group.detail, i + m),
          glow: group.glow,
          shadow: group.shadow,
          opacity: group.opacity ?? 1,
        });
      }
    }
  });

  const count = (layer) => (layer ? (isMobile ? layer.mobileCount : layer.count) : 0);
  const bubbles = Array.from({ length: count(config.bubbles) }, () => ({
    size: between([3, 10]),
    band: config.bubbles.band || [0, 1],
  }));
  // Pool for bubbles released by clicks, startled fish and celebrations.
  const bursts = Array.from({ length: config.celebrate ? 36 : isMobile ? 8 : 14 }, () => ({ size: between([3, 7]) }));
  const food = config.feeding ? Array.from({ length: isMobile ? 8 : 12 }, () => ({ size: between([4, 6.5]) })) : [];

  return {
    creatures,
    bubbles,
    bursts,
    food,
    celebrate: Boolean(config.celebrate),
  };
}

function renderCreature(creature) {
  const { Art, size } = SPECIES[creature.species];
  return (
    <div
      key={creature.key}
      data-creature=""
      className="ocean-creature"
      style={{
        width: size[0] * creature.scale,
        height: size[1] * creature.scale,
        color: creature.color,
        opacity: creature.opacity,
        filter: creature.shadow ? `drop-shadow(0 0 6px ${creature.shadow})` : undefined,
        '--detail': creature.detail,
        '--glow': creature.glow,
      }}
    >
      <Art />
    </div>
  );
}

// The living layer of an ocean section: creatures, bubbles, food and bursts, all
// behind the section's content and ignoring pointer events. Sits inside a positioned parent.
export default function OceanLife({ section, className = '', style }) {
  const containerRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const reducedMotion = useReducedMotion();
  const plan = useMemo(() => buildPlan(oceanLife[section], isMobile), [section, isMobile]);

  useLayoutEffect(() => {
    const sim = createOceanSim(containerRef.current, plan, { reducedMotion });
    return () => sim.destroy();
  }, [plan, reducedMotion]);

  return (
    <div ref={containerRef} className={`ocean-layer ${className}`} style={style} aria-hidden="true">
      {plan.bubbles.map((bubble, i) => (
        <span
          key={`bubble-${i}`}
          data-bubble=""
          className="ocean-bubble bubble-3d"
          style={{ width: bubble.size, height: bubble.size, opacity: 0 }}
        />
      ))}
      {plan.bursts.map((burst, i) => (
        <span
          key={`burst-${i}`}
          data-burst=""
          className="ocean-bubble bubble-3d"
          style={{ width: burst.size, height: burst.size, opacity: 0 }}
        />
      ))}
      {plan.food.map((flake, i) => (
        <span key={`food-${i}`} data-food="" className="ocean-food" style={{ width: flake.size, height: flake.size * 0.7, opacity: 0 }} />
      ))}
      {plan.creatures.map(renderCreature)}
    </div>
  );
}
