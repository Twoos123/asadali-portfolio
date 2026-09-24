import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Kelp, { seeded } from './Kelp';
import { readPointer, releasePointer, retainPointer } from './pointer';
import { runWhileVisible } from './ticker';
import useReducedMotion from '../../hooks/useReducedMotion';

// The hero seabed: hazy back dunes and plants, then whatever swims (children), then the
// sand, the main reef and dark foreground kelp. The reef is art-directed at a 1440px-wide
// reference and scales with the scene; smaller screens drop the lower-tier pieces, so the
// composition is the same on every load but still fits anything from phones to ultrawides.

const REF_WIDTH = 1440;
const TERRAIN_HEIGHT = 110;

// x: anchor across the width, h: height at the reference width, sway: bend in degrees for
// soft plants, tier: 1 always shown, 2 from 640px, 3 from 1100px.
const BACK_ROW = [
  { src: 'seaweed/seaweed-3', x: 0.1, h: 100, sway: 2.5, tier: 2 },
  { src: 'seaweed/seaweed-1', x: 0.27, h: 112, sway: 2.2, tier: 3 },
  { src: 'corals/coral-6', x: 0.43, h: 42, tier: 3 },
  { src: 'seaweed/seaweed-2', x: 0.575, h: 118, sway: 1.9, tier: 2 },
  { src: 'seaweed/seaweed-4', x: 0.74, h: 70, sway: 1.4, tier: 3 },
  { src: 'seaweed/seaweed-3', x: 0.885, h: 106, sway: 2.5, tier: 2 },
];

const REEF = [
  { src: 'seaweed/seaweed-1', x: 0.035, h: 150, sway: 2.2, tier: 1 },
  { src: 'corals/coral-1', x: 0.078, h: 44, tier: 2 },
  { src: 'corals/coral-3', x: 0.14, h: 64, sway: 0.7, tier: 2 },
  { src: 'seaweed/seaweed-2', x: 0.205, h: 170, sway: 1.9, tier: 1 },
  { src: 'corals/coral-2', x: 0.255, h: 40, tier: 3 },
  { src: 'seaweed/seaweed-3', x: 0.33, h: 138, sway: 2.5, tier: 2 },
  { src: 'corals/coral-5', x: 0.37, h: 45, sway: 0.6, tier: 3 },
  { src: 'corals/coral-8', x: 0.47, h: 34, tier: 3 },
  { src: 'corals/coral-6', x: 0.535, h: 50, tier: 2 },
  { src: 'seaweed/seaweed-4', x: 0.64, h: 93, sway: 1.4, tier: 2 },
  { src: 'corals/coral-7', x: 0.69, h: 70, sway: 0.7, tier: 1 },
  { src: 'seaweed/seaweed-1', x: 0.8, h: 165, sway: 2.2, tier: 2 },
  { src: 'corals/coral-4', x: 0.852, h: 78, tier: 3 },
  { src: 'corals/coral-8', x: 0.93, h: 42, tier: 1 },
  { src: 'seaweed/seaweed-3', x: 0.968, h: 128, sway: 2.5, tier: 1 },
];

const ROCKS = [
  { x: 0.115, w: 34, tone: '#56747c', tier: 2 },
  { x: 0.425, w: 24, tone: '#4b6870', tier: 3 },
  { x: 0.595, w: 40, tone: '#56747c', tier: 1 },
  { x: 0.905, w: 28, tone: '#4b6870', tier: 2 },
];

const FOREGROUND_KELP = [
  { x: 0.0, h: 250, seed: 7, tier: 1 },
  { x: 1.0, h: 215, seed: 12, tier: 2 },
];

// Terrain profiles in a 1000x100 viewBox that is stretched to the scene's width.
const backSurface = (x) => 42 + 9 * Math.sin(x * 0.008 + 1.3) + 5 * Math.sin(x * 0.019 + 0.2);
const sandSurface = (x) => 64 + 6 * Math.sin(x * 0.011 + 0.5) + 3.5 * Math.sin(x * 0.027 + 2) + 1.5 * Math.sin(x * 0.061 + 1);

function profile(fn) {
  let line = '';
  for (let x = 0; x <= 1000; x += 20) line += `${x ? 'L' : 'M'}${x} ${fn(x).toFixed(1)}`;
  return line;
}

const BACK_LINE = profile(backSurface);
const SAND_LINE = profile(sandSurface);
const BACK_PATH = `${BACK_LINE}L1000 100L0 100Z`;
const SAND_PATH = `${SAND_LINE}L1000 100L0 100Z`;
// The same sand shape in 0..1 units, used to clip the sunlight to the sand.
const SAND_CLIP = (() => {
  let d = '';
  for (let x = 0; x <= 1000; x += 20) d += `${x ? 'L' : 'M'}${x / 1000} ${(sandSurface(x) / 100).toFixed(4)}`;
  return `${d}L1 1L0 1Z`;
})();

// Patches of sunlight drifting over the sand.
const LIGHT = [0.07, 0.2, 0.34, 0.49, 0.62, 0.76, 0.9];
const RIPPLES = (() => {
  const rng = seeded(11);
  let d = '';
  for (let i = 0; i < 18; i++) {
    const x = rng() * 960;
    const y = sandSurface(x + 20) + 8 + rng() * 22;
    if (y > 96) continue;
    const len = 25 + rng() * 40;
    d += `M${x.toFixed(1)} ${y.toFixed(1)}Q${(x + len / 2).toFixed(1)} ${(y - 2.5).toFixed(1)} ${(x + len).toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
})();

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function layoutReef(width) {
  const scale = clamp(width / REF_WIDTH, 0.7, 1.25);
  const tier = width >= 1100 ? 3 : width >= 640 ? 2 : 1;
  const terrain = TERRAIN_HEIGHT * scale;
  const heightAt = (surface, x) => ((100 - surface(x * 1000)) / 100) * terrain;
  const rng = seeded(2025);

  const place = (item, surface, sink) => ({
    ...item,
    bottom: heightAt(surface, item.x) - sink * scale,
    height: item.h * scale,
    // Timing is offset by position, so a current visibly rolls across the reef.
    duration: 4.6 + item.h / 55 + rng() * 0.8,
    delay: -((1 - item.x) * 5 + rng() * 0.7),
  });
  const visible = (items) => items.filter((item) => item.tier <= tier);

  return {
    terrain,
    back: visible(BACK_ROW).map((item) => place(item, backSurface, 3)),
    reef: visible(REEF).map((item) => place(item, sandSurface, 5)),
    rocks: visible(ROCKS).map((rock) => ({ ...rock, bottom: heightAt(sandSurface, rock.x) - 7 * scale, width: rock.w * scale })),
    kelp: visible(FOREGROUND_KELP).map((k) => ({ ...k, height: Math.round(k.h * scale), duration: 7 + rng(), delay: -rng() * 6 })),
    light: LIGHT.map((x, i) => ({
      x,
      bottom: heightAt(sandSurface, x) - (8 + (i % 3) * 7) * scale,
      width: (150 + (i % 2) * 70) * scale,
      height: (18 + (i % 3) * 5) * scale,
      duration: 6 + rng() * 4,
      delay: -rng() * 8,
    })),
  };
}

function useWidth(ref) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    const update = () => setWidth(Math.round(el.getBoundingClientRect().width / 8) * 8);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

const swayStyle = (item, sway = item.sway) => ({
  '--sway': `${sway}deg`,
  '--sway-duration': `${item.duration.toFixed(2)}s`,
  '--sway-delay': `${item.delay.toFixed(2)}s`,
});

function Plant({ item, soft }) {
  const src = `${process.env.PUBLIC_URL}/assets/${item.src}.svg`;
  return (
    <div className="seafloor-item" data-soft={soft && item.sway ? '' : undefined} style={{ left: `${item.x * 100}%`, bottom: item.bottom, height: item.height }}>
      <img src={src} alt="" draggable="false" className={item.sway ? 'seafloor-sway' : undefined} style={item.sway ? swayStyle(item) : undefined} />
    </div>
  );
}

function Rock({ rock }) {
  return (
    <div className="seafloor-item" style={{ left: `${rock.x * 100}%`, bottom: rock.bottom, height: rock.width * 0.6 }}>
      <svg viewBox="0 0 40 24" aria-hidden="true">
        <path d="M2 24C1 15 7 7 16 5C24 3 35 8 38 16C39 19 39 22 38 24Z" fill={rock.tone} />
        <path d="M9 12C12 8.5 17 7 22 7.5" fill="none" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Brushing the cursor through soft plants pushes them aside on a damped spring.
function usePlantSprings(sceneRef, layout, enabled) {
  useEffect(() => {
    if (!layout || !enabled) return undefined;
    const scene = sceneRef.current;
    const plants = Array.from(scene.querySelectorAll('[data-soft]')).map((el) => ({ el, angle: 0, vel: 0, box: null, moving: false }));
    if (!plants.length) return undefined;

    const pointer = { active: false };
    let measuredWidth = -1;
    let last = 0;
    let rect = null;

    const read = () => {
      rect = scene.getBoundingClientRect();
      if (rect.width !== measuredWidth) {
        measuredWidth = rect.width;
        for (const p of plants) {
          const r = p.el.getBoundingClientRect();
          p.box = { left: r.left - rect.left, right: r.right - rect.left, top: r.top - rect.top, bottom: r.bottom - rect.top };
        }
      }
    };

    const write = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      readPointer(rect, now, pointer);

      for (const p of plants) {
        const b = p.box;
        if (pointer.active && pointer.x > b.left - 12 && pointer.x < b.right + 12 && pointer.y > b.top && pointer.y < b.bottom) {
          const reach = (b.bottom - pointer.y) / (b.bottom - b.top);
          p.vel += clamp(pointer.vx, -1200, 1200) * 0.4 * reach * dt;
        }
        p.vel += (-p.angle * 38 - p.vel * 5.5) * dt;
        p.angle = clamp(p.angle + p.vel * dt, -6, 6);
        if (Math.abs(p.angle) > 0.05 || Math.abs(p.vel) > 0.05) {
          p.el.style.transform = `skewX(${(-p.angle).toFixed(2)}deg)`;
          p.moving = true;
        } else if (p.moving) {
          p.el.style.transform = '';
          p.angle = 0;
          p.vel = 0;
          p.moving = false;
        }
      }
    };

    const stop = runWhileVisible(scene, { read, write }, { onStart: () => { last = performance.now(); } });
    retainPointer();
    return () => {
      stop();
      releasePointer();
      plants.forEach((p) => {
        p.el.style.transform = '';
      });
    };
  }, [sceneRef, layout, enabled]);
}

export default function Seafloor({ className = '', style, children }) {
  const sceneRef = useRef(null);
  const width = useWidth(sceneRef);
  const reducedMotion = useReducedMotion();
  const layout = useMemo(() => (width ? layoutReef(width) : null), [width]);
  const id = useId().replace(/:/g, '');
  const gradientId = `sand-${id}`;
  const clipId = `sand-clip-${id}`;
  usePlantSprings(sceneRef, layout, !reducedMotion);

  return (
    <div ref={sceneRef} className={`seafloor ${className}`} style={style} aria-hidden="true">
      {layout && (
        <>
          <svg className="seafloor-terrain" viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ height: layout.terrain }}>
            <path d={BACK_PATH} fill="#c9bf94" opacity="0.7" />
          </svg>
          <div className="seafloor-back">
            {layout.back.map((item, i) => (
              <Plant key={`back-${i}`} item={item} />
            ))}
          </div>
        </>
      )}

      {children}

      {layout && (
        <>
          <svg className="seafloor-terrain" viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ height: layout.terrain }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0.45" stopColor="#ecc978" />
                <stop offset="0.8" stopColor="#d6a650" />
                <stop offset="1" stopColor="#b98536" />
              </linearGradient>
              <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                <path d={SAND_CLIP} />
              </clipPath>
            </defs>
            <path d={SAND_PATH} fill={`url(#${gradientId})`} />
            <path d={SAND_LINE} fill="none" stroke="rgba(255, 247, 214, 0.6)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d={RIPPLES} fill="none" stroke="rgba(150, 105, 40, 0.35)" strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="seafloor-light" style={{ height: layout.terrain, clipPath: `url(#${clipId})` }}>
            {layout.light.map((patch, i) => (
              <span
                key={i}
                style={{
                  left: `${patch.x * 100}%`,
                  bottom: patch.bottom,
                  width: patch.width,
                  height: patch.height,
                  '--light-duration': `${patch.duration.toFixed(2)}s`,
                  '--light-delay': `${patch.delay.toFixed(2)}s`,
                }}
              />
            ))}
          </div>
          {layout.rocks.map((rock, i) => (
            <Rock key={`rock-${i}`} rock={rock} />
          ))}
          {layout.reef.map((item, i) => (
            <Plant key={`reef-${i}`} item={item} soft />
          ))}
          {layout.kelp.map((k) => (
            <div key={`kelp-${k.seed}`} className="seafloor-item seafloor-kelp" data-soft="" style={{ left: `${k.x * 100}%`, bottom: -12, height: k.height }}>
              <Kelp seed={k.seed} height={k.height} className="seafloor-sway" style={swayStyle(k, 3)} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
