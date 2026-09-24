import React, { useEffect, useMemo, useRef } from 'react';
import { seeded } from './Kelp';

// Drifting particles ("marine snow") for the whole dive. They're drawn as page-tall layers
// of dots, so they scroll natively with the page, and all their motion is CSS the
// compositor runs on its own: a slow sinking drift, plus scroll-driven parallax where it's
// supported (distant specks lag behind the page). Nothing is moved from JavaScript, so
// they stay perfectly in step with even very fast scrolling.
//
// Pale specks fade out with depth as glowing plankton fade in (see .snow-* in index.css).

// Each layer is one large tile of randomly scattered dots, repeated. The tile is wide enough
// that the repeat isn't noticeable, and exactly one drift loop tall (see .snow-drift).
const TILE_WIDTH = 1200;
const TILE_HEIGHT = 900;

function dotTile(seed, count, dot) {
  const rng = seeded(seed);
  let circles = '';
  for (let i = 0; i < count; i++) {
    const r = dot.size[0] + rng() * (dot.size[1] - dot.size[0]);
    const halo = r * dot.halo;
    // Kept clear of the tile's edges so no dot is cut where the tile repeats.
    const x = (halo + rng() * (TILE_WIDTH - 2 * halo)).toFixed(1);
    const y = (halo + rng() * (TILE_HEIGHT - 2 * halo)).toFixed(1);
    circles += `<circle cx='${x}' cy='${y}' r='${halo.toFixed(2)}' fill='url(%23h)'/><circle cx='${x}' cy='${y}' r='${r.toFixed(2)}' fill='${dot.core}'/>`;
  }
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${TILE_WIDTH}' height='${TILE_HEIGHT}'>` +
    `<defs><radialGradient id='h'><stop offset='0' stop-color='${dot.edge}' stop-opacity='${dot.glow}'/><stop offset='1' stop-color='${dot.edge}' stop-opacity='0'/></radialGradient></defs>` +
    `${circles}</svg>`;
  return { backgroundImage: `url("data:image/svg+xml,${svg}")`, backgroundSize: `${TILE_WIDTH}px ${TILE_HEIGHT}px` };
}

// Dot radii in px (so a 0.8 core is a speck about 1.6px across); `halo` is how far the
// soft glow reaches, as a multiple of the core radius, and `glow` its strength.
const LAYERS = [
  { name: 'far', seed: 21, count: 28, dot: { size: [0.4, 0.65], core: 'rgba(255,255,255,0.55)', edge: 'rgb(255,255,255)', halo: 2, glow: 0.3 } },
  { name: 'near', seed: 42, count: 20, dot: { size: [0.55, 0.9], core: 'rgba(255,255,255,0.8)', edge: 'rgb(255,255,255)', halo: 2, glow: 0.35 } },
  { name: 'glow', seed: 77, count: 24, dot: { size: [0.55, 0.85], core: 'rgba(224,251,255,0.95)', edge: 'rgb(103,232,249)', halo: 3, glow: 0.6 } },
];

export default function MarineSnow() {
  const ref = useRef(null);
  const fields = useMemo(() => LAYERS.map((layer) => ({ ...layer, style: dotTile(layer.seed, layer.count, layer.dot) })), []);

  // The parallax needs the page's scroll range, which only changes when the layout does.
  useEffect(() => {
    const el = ref.current;
    const update = () => {
      el.style.setProperty('--snow-range', `${Math.max(0, document.documentElement.scrollHeight - window.innerHeight)}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div ref={ref} className="marine-snow" aria-hidden="true">
      {fields.map((layer) => (
        <div key={layer.name} className={`snow-depth snow-${layer.name}`}>
          <div className="snow-parallax">
            <div className="snow-drift" style={layer.style} />
          </div>
        </div>
      ))}
    </div>
  );
}
