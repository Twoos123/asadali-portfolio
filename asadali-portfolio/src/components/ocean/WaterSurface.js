import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { readTaps, releasePointer, retainPointer } from './pointer';
import { smoothLine } from './geometry';
import useReducedMotion from '../../hooks/useReducedMotion';
import useMediaQuery from '../../hooks/useMediaQuery';
import { onWaterColor } from './waterColor';
import { runWhileVisible } from './ticker';

// The hero's water surface: rolling waves drawn every frame, boats that ride them, and
// ripples that spread along the surface from clicks near the waterline. It sits in a 100px
// band just above the ocean. Waves are defined in real pixels, so they keep the same length
// on a phone as on a wide screen instead of bunching up when squeezed.

// On phones the boats are smaller and pulled in from the edges so neither is cut off.
const BOATS = [
  { src: 'boat-1', x: 0.2, phoneX: 0.2, className: 'w-12 sm:w-16', draft: 8 },
  { src: 'boat-2', x: 0.9, phoneX: 0.8, className: 'w-14 sm:w-20', draft: 9 },
];

const RING_COUNT = 4;
const RING_LIFE = 1.4;

// Surface height (px down from the top of the band) at x px, including spreading ripples.
function surfaceAt(x, t, ripples) {
  let y = 52 + 10 * Math.sin(x * 0.0075 - t * 0.55 + 0.4) + 5.5 * Math.sin(x * 0.015 + t * 0.8 + 1.7) + 2.5 * Math.sin(x * 0.0335 - t * 1.3);
  for (const r of ripples) {
    const age = t - r.t;
    const d = Math.abs(x - r.x) - age * 200;
    y += 7 * Math.exp(-age / 1.3) * Math.exp(-(d * d) / 3600) * Math.sin(d * 0.114);
  }
  return y;
}

function wavePath(width, t, ripples) {
  const pts = [];
  const step = Math.max(12, width / 60);
  for (let x = 0; x < width + step; x += step) pts.push(Math.min(x, width), surfaceAt(x, t, ripples));
  return `${smoothLine(pts)}L${width} 100L0 100Z`;
}

export default function WaterSurface() {
  const bandRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const boatRefs = useRef([]);
  const ringRefs = useRef([]);
  const still = useReducedMotion();
  const isPhone = useMediaQuery('(max-width: 640px)');

  // Same colour as the water below it, updated as the page scrolls deeper.
  useEffect(
    () =>
      onWaterColor((color) => {
        pathRef.current.style.fill = color;
      }),
    []
  );

  // A layout effect, so the first wave is drawn before the page first paints.
  useLayoutEffect(() => {
    const band = bandRef.current;
    const ripples = [];
    const rings = ringRefs.current.map((el) => ({ el, age: Infinity, x: 0 }));
    let t = 0;
    let last = 0;
    let lastTap = performance.now();
    let rect = null;

    let drawnWidth = 0;
    const draw = (width) => {
      if (width !== drawnWidth) {
        svgRef.current.setAttribute('viewBox', `0 0 ${width} 100`);
        drawnWidth = width;
      }
      pathRef.current.setAttribute('d', wavePath(width, t, ripples));
      BOATS.forEach((boat, i) => {
        const el = boatRefs.current[i];
        if (!el) return;
        const x = (isPhone ? boat.phoneX : boat.x) * width;
        const y = surfaceAt(x, t, ripples);
        const slope = (surfaceAt(x + 10, t, ripples) - surfaceAt(x - 10, t, ripples)) / 20;
        // Sit the hull on the water and tilt it with the wave under it.
        el.style.transform = `translate3d(-50%,${(y + boat.draft).toFixed(1)}px,0) translateY(-100%) rotate(${Math.atan(slope).toFixed(4)}rad)`;
      });
      for (const ring of rings) {
        if (ring.age >= RING_LIFE) {
          if (ring.shown) ring.el.style.opacity = '0';
          ring.shown = false;
          continue;
        }
        ring.shown = true;
        const k = ring.age / RING_LIFE;
        const y = surfaceAt(ring.x, t, ripples);
        ring.el.style.transform = `translate3d(${ring.x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${(0.25 + k * 1.5).toFixed(3)})`;
        ring.el.style.opacity = (0.6 * (1 - k)).toFixed(2);
      }
    };

    draw(band.getBoundingClientRect().width);
    if (still) return undefined;

    const read = () => {
      rect = band.getBoundingClientRect();
    };

    const write = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      // Clicking at or just under the waterline sends a ripple along the surface.
      for (const tap of readTaps(rect, lastTap)) {
        lastTap = tap.t;
        if (tap.x < 0 || tap.x > rect.width || tap.y < 25 || tap.y > rect.height + 80) continue;
        ripples.push({ x: tap.x, t });
        const ring = rings.reduce((oldest, r) => (r.age > oldest.age ? r : oldest), rings[0]);
        ring.age = 0;
        ring.x = tap.x;
      }
      while (ripples.length && t - ripples[0].t > 4) ripples.shift();
      for (const ring of rings) ring.age += dt;

      draw(rect.width);
    };

    const stop = runWhileVisible(
      band,
      { read, write },
      {
        onStart: () => {
          last = performance.now();
          lastTap = last;
        },
      }
    );
    retainPointer();
    return () => {
      stop();
      releasePointer();
    };
  }, [still, isPhone]);

  return (
    <div ref={bandRef} className="water-surface" aria-hidden="true">
      <svg ref={svgRef} width="100%" height="100" preserveAspectRatio="none">
        <path ref={pathRef} />
      </svg>
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <span key={i} ref={(el) => (ringRefs.current[i] = el)} className="water-ring" />
      ))}
      {BOATS.map((boat, i) => (
        <div key={boat.src} ref={(el) => (boatRefs.current[i] = el)} className="water-boat" style={{ left: `${(isPhone ? boat.phoneX : boat.x) * 100}%` }}>
          <img src={`${process.env.PUBLIC_URL}/assets/boats/${boat.src}.svg`} alt="" className={`${boat.className} h-auto`} />
        </div>
      ))}
    </div>
  );
}
