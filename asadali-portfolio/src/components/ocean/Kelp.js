import React, { useMemo } from 'react';
import { smoothLine } from './geometry';

// Deterministic PRNG (mulberry32) so procedural scenery looks the same on every load.
export function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A kelp frond: a meandering stipe with alternating blades and float bulbs, drawn in
// currentColor. `blades` scales the blade length for slimmer fronds.
export default function Kelp({ seed = 1, height = 200, blades = 1, className, style }) {
  const shape = useMemo(() => {
    const rng = seeded(seed);
    const width = 64;
    const bend = (rng() - 0.5) * 18;
    const stipeX = (s) => width / 2 + Math.sin(s * Math.PI * 1.15 + 0.3) * bend * s;

    const stipe = [];
    for (let i = 0; i <= 10; i++) {
      const s = i / 10;
      stipe.push(stipeX(s), height - s * (height - 4));
    }

    let leaves = '';
    const bulbs = [];
    let side = rng() < 0.5 ? -1 : 1;
    for (let y = height - 22; y > 14; y -= 15 + rng() * 9) {
      const s = 1 - y / height;
      const x = stipeX(s);
      const len = (16 + rng() * 12) * (1 - s * 0.35) * blades;
      const w = (4 + rng() * 3) * blades;
      leaves +=
        `M${x.toFixed(1)} ${y.toFixed(1)}` +
        `Q${(x + side * len * 0.45).toFixed(1)} ${(y - w * 2.2).toFixed(1)} ${(x + side * len).toFixed(1)} ${(y - len * 0.6).toFixed(1)}` +
        `Q${(x + side * len * 0.55).toFixed(1)} ${(y + w * 0.3).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}Z`;
      bulbs.push([x + side * 2.2, y - 1.5]);
      side = -side;
    }
    return { width, stipe: smoothLine(stipe), leaves, bulbs };
  }, [seed, height, blades]);

  return (
    <svg
      className={className}
      style={style}
      viewBox={`0 0 ${shape.width} ${height}`}
      width={shape.width}
      height={height}
      fill="currentColor"
      overflow="visible"
      aria-hidden="true"
    >
      <path d={shape.stipe} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d={shape.leaves} />
      {shape.bulbs.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.7" />
      ))}
    </svg>
  );
}
