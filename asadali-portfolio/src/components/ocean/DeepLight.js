import React, { useEffect, useRef } from 'react';
import { readPointer, releasePointer, retainPointer } from './pointer';
import useMediaQuery from '../../hooks/useMediaQuery';
import useReducedMotion from '../../hooks/useReducedMotion';
import { subscribe } from './ticker';

// One page-wide darkness for the deep end of the dive. It thickens smoothly with scroll
// depth (so there are no seams between sections) and the cursor carries a pool of light.
// It sits under the sea life and content, darkening only the water itself.

const LIGHT_RADIUS = 230;
const START = 0.45; // scroll fraction where the dark begins (around Experience)
const FULL = 0.92; // and where it's at full strength

const SCROLL_DRIVEN = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()');

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function DeepLight() {
  const wrapRef = useRef(null);
  const lightRef = useRef(null);
  const still = useReducedMotion();
  const hasCursor = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    const wrap = wrapRef.current;
    const lightEl = lightRef.current;
    const pointer = { active: false };
    const origin = { left: 0, top: 0 };
    const light = { x: window.innerWidth / 2, y: -LIGHT_RADIUS * 2, lit: false };
    let unsubscribe = null;
    let last = 0;

    const place = () => {
      lightEl.style.transform = `translate3d(${(light.x - LIGHT_RADIUS).toFixed(1)}px,${(light.y - LIGHT_RADIUS).toFixed(1)}px,0)`;
    };

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      readPointer(origin, now, pointer);
      const lit = pointer.active;
      if (lit && !light.lit) {
        light.x = pointer.x;
        light.y = pointer.y;
      }
      // Without a cursor the light drifts up and out, leaving the water evenly dark.
      const k = 1 - Math.exp(-(lit ? 12 : 3) * dt);
      light.x += ((lit ? pointer.x : light.x) - light.x) * k;
      light.y += ((lit ? pointer.y : -LIGHT_RADIUS * 2) - light.y) * k;
      light.lit = lit;
      place();
    };

    const onScroll = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const depth = range > 0 ? smoothstep(START, FULL, window.scrollY / range) : 0;
      // With scroll-driven animations the CSS fades it in step with the compositor instead.
      if (!SCROLL_DRIVEN) wrap.style.opacity = depth.toFixed(3);
      // Only follow the cursor while there's darkness to light up.
      const follow = depth > 0.01 && hasCursor && !still;
      if (follow && !unsubscribe) {
        last = performance.now();
        unsubscribe = subscribe({ write: frame });
      } else if (!follow && unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    };

    place();
    onScroll();
    retainPointer();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (unsubscribe) unsubscribe();
      releasePointer();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [still, hasCursor]);

  return (
    <div ref={wrapRef} className="deep-dark" aria-hidden="true">
      <span ref={lightRef} className="deep-light" />
    </div>
  );
}
