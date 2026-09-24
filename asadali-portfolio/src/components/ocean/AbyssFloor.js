import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import OceanLife from './OceanLife';
import { seeded } from './Kelp';
import { useWidth } from './Seafloor';
import { readPointer, releasePointer, retainPointer } from './pointer';
import { runWhileVisible } from './ticker';
import useReducedMotion from '../../hooks/useReducedMotion';
import Editable from '../../editor/Editable';
import { LinkEdit } from '../../editor/controls';
import { useContent } from '../../editor/store';
import { safeUrl } from '../../editor/markup';

// The bottom of the dive, under the contact section: an abyssal seabed the footer rests on.
// Where the hero's reef is sunlit sand and swaying plants, down here it's dark basalt and
// hydrothermal chimneys ("black smokers") breathing smoke, and the only light comes from
// what lives here: tube worms that duck into their tubes when the cursor comes near, a crab
// picking its way over the rocks, a few drifting specks, and treasure chests to open
// (footer.abyss.chests in src/content/footer.json).
//
// Two layers (see .abyss-* in index.css):
// - the rock, ridges, chimneys and smoke sit *under* the page-wide darkness (DeepLight.js),
//   so they're dimmed like the water around them and the cursor's light picks them out;
// - everything that glows, the chests and the near ledge sit above it, in their own colours.
//   The footer carries on in the near ledge's colour, so it sits on the seabed.
//
// Like the hero reef, it's art-directed at a 1440px reference width and scales with the
// scene; smaller screens drop the lower-tier pieces.

const REF_WIDTH = 1440;
const REF_HEIGHT = 400;

// x: centre across the width; h, base and top: height and widths at the reference width.
// tier: 1 always shown, 2 from 640px, 3 from 1100px (as in Seafloor.js).
const CHIMNEYS = [
  { x: 0.3, h: 168, base: 64, top: 21, tier: 1 },
  { x: 0.655, h: 120, base: 54, top: 18, tier: 1 },
  { x: 0.722, h: 74, base: 40, top: 14, tier: 3 },
];

// Tube worm clusters beside a chimney: dx from its centre, and each tube's height.
const WORM_CLUSTERS = [
  { chimney: 0, dx: -54, tubes: [40, 58, 34, 52, 28], tier: 1 },
  { chimney: 0, dx: 50, tubes: [34, 48, 28], tier: 2 },
  { chimney: 1, dx: -48, tubes: [30, 46, 38, 26], tier: 2 },
];

// Angular basalt outcrops standing behind the rock surface.
const OUTCROPS = [
  { x: 0.075, w: 96, h: 60, tier: 1 },
  { x: 0.195, w: 62, h: 38, tier: 2 },
  { x: 0.47, w: 74, h: 30, tier: 3 },
  { x: 0.84, w: 118, h: 66, tier: 1 },
  { x: 0.955, w: 72, h: 44, tier: 2 },
];

// Pillow-lava boulders on the rock.
const BOULDERS = [
  { x: 0.13, w: 40, tier: 2 },
  { x: 0.405, w: 30, tier: 3 },
  { x: 0.585, w: 38, tier: 2 },
  { x: 0.775, w: 44, tier: 1 },
  { x: 0.915, w: 32, tier: 3 },
];

// Big dark boulders in the near ledge, framing the scene.
const NEAR_ROCKS = [
  { x: 0.02, w: 120, h: 34, tier: 1 },
  { x: 0.345, w: 90, h: 22, tier: 2 },
  { x: 0.7, w: 110, h: 28, tier: 1 },
  { x: 0.985, w: 100, h: 30, tier: 2 },
];

// Glowing specks; y is a fraction of the scene's height from the bottom.
const SPECKS = [
  { x: 0.07, y: 0.5, tier: 2 },
  { x: 0.19, y: 0.36, tier: 1, violet: true },
  { x: 0.42, y: 0.6, tier: 2 },
  { x: 0.53, y: 0.44, tier: 3, violet: true },
  { x: 0.79, y: 0.55, tier: 1 },
  { x: 0.92, y: 0.4, tier: 2, violet: true },
  { x: 0.36, y: 0.3, tier: 3 },
];

// Where the chests lie, in content order (footer.abyss.chests): wedged between the vent
// chimneys, half-buried in the near ledge, far back on a ridge, and tucked in behind the
// first cluster of tube worms. The further away, the smaller (size) and the more they fade
// toward the water's blue (haze). All but the ledge chest are drawn under the page's
// darkness like the rock around them, so their colours are lifted to make up for it.
const CHEST_SLOTS = [
  { place: 'vent', size: 0.7, haze: 0.18, lift: 1.75 },
  { place: 'ledge', x: 0.855, phoneX: 0.6, size: 1, haze: 0, lift: 1 },
  { place: 'ridge', x: 0.47, size: 0.46, haze: 0.5, lift: 1.9, blur: true },
  { place: 'worms', size: 0.68, haze: 0.16, lift: 1.75 },
];

// The chest's colours at the front; deeper chests mix these toward HAZE.
const CHEST_COLORS = {
  inside: '#1f1206',
  gold: '#f59e0b',
  goldLight: '#fcd34d',
  shine: '#fffbeb',
  wood: '#4a2c17',
  lid: '#5a3519',
  grain: '#2a170a',
  band: '#8c6a2c',
  bandShade: '#6f5324',
  trim: '#a88436',
  lock: '#c29a45',
};
const HAZE = [58, 78, 118];

// A colour brightened by `lift`, then mixed toward the haze by `haze`.
function tone(hex, { lift = 1, haze = 0 }) {
  const n = parseInt(hex.slice(1), 16);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c, i) => Math.min(255, c * lift) * (1 - haze) + HAZE[i] * haze);
  return `rgb(${rgb.map((c) => Math.round(c)).join(',')})`;
}

// Coins and bubbles thrown up by an opening chest (offsets in px at the reference size).
const COINS = [
  { dx: -26, dy: -44, r: 200, d: 0 },
  { dx: -9, dy: -60, r: -160, d: 0.05 },
  { dx: 9, dy: -54, r: 240, d: 0.02 },
  { dx: 25, dy: -42, r: -220, d: 0.08 },
  { dx: 38, dy: -28, r: 180, d: 0.12 },
  { dx: -38, dy: -26, r: -200, d: 0.1 },
];
const POPS = [
  { dx: -8, rise: -80, size: 6, d: 0.05 },
  { dx: 7, rise: -104, size: 8, d: 0.18 },
  { dx: 15, rise: -70, size: 5, d: 0.3 },
  { dx: -2, rise: -112, size: 7, d: 0.42 },
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const f1 = (n) => n.toFixed(1);
const polyline = (points) => points.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');

// Everything is laid out in px for the scene's actual width; heights are measured up from
// the bottom and flipped into SVG coordinates (y down) where drawn.
function layoutAbyss(W) {
  const s = clamp(W / REF_WIDTH, 0.62, 1.15);
  const H = Math.round(REF_HEIGHT * s);
  const tier = W >= 1100 ? 3 : W >= 640 ? 2 : 1;
  const visible = (items) => items.filter((item) => item.tier <= tier);
  const rng = seeded(4242);
  const jitter = (amount) => (rng() - 0.5) * 2 * amount;
  // Small creatures and the chests shrink less than the scenery, so they stay visible (and
  // tappable) on phones.
  const ls = Math.max(s, 0.82);
  const cs = clamp(W / REF_WIDTH, 0.8, 1.1);

  const chimneys = visible(CHIMNEYS).map((c) => ({ ...c, cx: c.x * W, h: c.h * s, base: c.base * s, top: c.top * s }));
  const clusters = visible(WORM_CLUSTERS).map((cluster) => ({ ...cluster, cx: CHIMNEYS[cluster.chimney].x * W + cluster.dx * s }));

  // The crab's beat: the rock between the first two chimneys, clear of any worms.
  const [c0, c1] = chimneys;
  let from = c0.cx + c0.base / 2 + 22 * s;
  let to = c1.cx - c1.base / 2 - 22 * s;
  for (const cluster of clusters) {
    const half = (cluster.tubes.length * 3.5 + 12) * ls;
    if (cluster.cx > c0.cx && cluster.cx < (c0.cx + c1.cx) / 2) from = Math.max(from, cluster.cx + half);
    else if (cluster.cx < c1.cx && cluster.cx >= (c0.cx + c1.cx) / 2) to = Math.min(to, cluster.cx - half);
  }
  const beatMid = (from + to) / 2;
  const beatHalf = Math.max(0, Math.min((to - from) / 2, 130 * s));

  // The rock surface: rolling, angular, with mounds where the chimneys stand.
  const mound = (x) => chimneys.reduce((sum, c) => sum + 30 * Math.exp(-(((x - c.cx) / (c.base * 1.5)) ** 2)), 0);
  const step = Math.max(8, Math.round(14 * s));
  const ground = [];
  for (let x = 0; ; x += step) {
    const px = Math.min(x, W);
    const xf = px / W;
    const smooth = (104 + 10 * Math.sin(xf * 6.3 + 0.8) + 6 * Math.sin(xf * 15.1 + 2.1)) * s + mound(px) * s;
    // Smoother where the crab walks, so it doesn't bob on every edge.
    const calm = Math.abs(px - beatMid) < beatHalf + 16 ? 0.3 : 1;
    ground.push([px, smooth + jitter(3.4 * s * calm)]);
    if (px === W) break;
  }
  const groundAt = (x) => {
    const i = clamp(Math.floor(x / step), 0, ground.length - 2);
    const [x0, h0] = ground[i];
    const [x1, h1] = ground[i + 1];
    const t = x1 > x0 ? clamp((x - x0) / (x1 - x0), 0, 1) : 0;
    return h0 + (h1 - h0) * t;
  };
  const surface = ground.map(([x, h]) => [x, H - h]);
  const rock = `${polyline(surface)}L${W} ${H}L0 ${H}Z`;

  // Distant ridges, soft and faint.
  const ridge = (fn, spacing, jag) => {
    const points = [];
    for (let x = 0; ; x += spacing) {
      const px = Math.min(x, W);
      points.push([px, H - fn(px / W) * s + jitter(jag)]);
      if (px === W) break;
    }
    return { fill: `${polyline(points)}L${W} ${H}L0 ${H}Z`, edge: polyline(points) };
  };
  const farHeight = (xf) => 222 + 38 * Math.sin(xf * 4.3 + 1.1) + 20 * Math.sin(xf * 10.1 + 0.3) + 9 * Math.sin(xf * 23.7 + 2.2);
  const farRidge = ridge(farHeight, 26 * s, 1.5 * s);
  const nearRidge = ridge((xf) => 168 + 24 * Math.sin(xf * 5.6 + 2.6) + 14 * Math.sin(xf * 13.3 + 0.9) + 7 * Math.sin(xf * 29 + 1.4), 18 * s, 3.5 * s);

  // Basalt outcrops, rooted behind the rock surface.
  const outcrops = visible(OUTCROPS).map((o) => {
    const x = o.x * W;
    const w = o.w * s;
    const h = o.h * s;
    const g = H - groundAt(x) + 12 * s;
    const shape = [
      [-0.5, 0],
      [-0.42, 0.5],
      [-0.3, 0.72],
      [-0.16, 0.95],
      [0.02, 1],
      [0.14, 0.84],
      [0.28, 0.78],
      [0.4, 0.46],
      [0.5, 0],
    ].map(([dx, dy], i, all) => [x + dx * w + (i && i < all.length - 1 ? jitter(3 * s) : 0), g - dy * (h + 12 * s) + (i && i < all.length - 1 ? jitter(3 * s) : 0)]);
    return { d: `${polyline(shape)}Z`, rim: polyline(shape.slice(0, 5)) };
  });

  // Cracks running down the rock face.
  let cracks = '';
  for (let i = 0, n = Math.round(W / 80); i < n; i++) {
    let x = (i + 0.2 + rng() * 0.6) * (W / n);
    let y = H - groundAt(x) + 5 * s;
    cracks += `M${f1(x)} ${f1(y)}`;
    for (let k = 0; k < 4; k++) {
      x += jitter(5 * s);
      y += (6 + rng() * 10) * s;
      cracks += `L${f1(x)} ${f1(y)}`;
    }
  }

  const boulders = visible(BOULDERS).map((b) => {
    const x = b.x * W;
    const w = b.w * s;
    const h = w * 0.5;
    const y = H - groundAt(x) + 3 * s;
    return {
      d: `M${f1(x - w / 2)} ${f1(y)}C${f1(x - w / 2)} ${f1(y - h * 0.8)} ${f1(x - w * 0.25)} ${f1(y - h)} ${f1(x)} ${f1(y - h)}C${f1(x + w * 0.3)} ${f1(y - h)} ${f1(x + w / 2)} ${f1(y - h * 0.65)} ${f1(x + w / 2)} ${f1(y)}Z`,
      shine: `M${f1(x - w * 0.34)} ${f1(y - h * 0.5)}Q${f1(x - w * 0.14)} ${f1(y - h * 0.95)} ${f1(x + w * 0.14)} ${f1(y - h * 0.9)}`,
    };
  });

  // Chimneys: knobbly tapering columns sunk into the rock, a glowing mouth on top, and
  // smoke that rises above the scene (behind the section above) before it fades out.
  const vents = chimneys.map((c, n) => {
    const g = groundAt(c.cx);
    const baseY = H - g + 12 * s;
    const topY = H - g - c.h;
    const left = [];
    const right = [];
    const segs = 8;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const half = (c.base + (c.top - c.base) * t ** 0.65) / 2;
      const y = baseY + (topY - baseY) * t;
      const knob = i > 0 && i < segs ? 1 : 0;
      left.push([c.cx - half - knob * (rng() - 0.25) * 6 * s, y]);
      right.push([c.cx + half + knob * (rng() - 0.25) * 6 * s, y]);
    }
    const rimL = left[segs];
    const rimR = right[segs];
    const outline = `${polyline(left)}L${f1(c.cx)} ${f1(topY - 1.5 * s)}${right
      .slice()
      .reverse()
      .map(([x, y]) => `L${f1(x)} ${f1(y)}`)
      .join('')}Z`;
    const streak = (ox, len) => {
      const x = c.cx + ox;
      const y = topY + 5 * s;
      return `M${f1(x)} ${f1(y)}Q${f1(x + 2.5 * s)} ${f1(y + len * 0.3)} ${f1(x - 1 * s)} ${f1(y + len * 0.6)}T${f1(x + 0.5 * s)} ${f1(y + len)}`;
    };
    // Flanges: ledges of mineral crust sticking out of the column.
    const flanges = [0.35, 0.62].map((t, k) => {
      const i = Math.round(t * segs);
      const [lx, ly] = k ? right[i] : left[i];
      const dir = k ? 1 : -1;
      return `M${f1(lx)} ${f1(ly)}L${f1(lx + dir * 7 * s)} ${f1(ly + 1.5 * s)}L${f1(lx + dir * 5 * s)} ${f1(ly + 4.5 * s)}L${f1(lx)} ${f1(ly + 6 * s)}Z`;
    });
    const mouthH = g + c.h;
    const size = c.top / (21 * s);
    const puffCount = tier >= 2 ? 8 : 5;
    const dur = 11 + n * 1.4 + rng();
    const puffs = Array.from({ length: puffCount }, (_, i) => {
      const f = (i + 0.5) / puffCount;
      const drift = (14 + jitter(20)) * s;
      const grow = 2.3 + rng() * 0.8;
      const rise = (150 + 60 * size + jitter(20)) * s;
      return {
        size: (34 + rng() * 16) * s * size ** 0.6,
        drift,
        rise,
        grow,
        dur,
        delay: -(i / puffCount) * dur - rng() * 0.6,
        // Where this puff is drawn when motion is reduced: spread up the column.
        still: `translate(${f1(drift * f)}px, ${f1(-rise * f)}px) scale(${(0.45 + (grow - 0.45) * f).toFixed(2)})`,
        stillOpacity: (0.75 * (1 - f)).toFixed(2),
      };
    });
    const embers = Array.from({ length: tier >= 2 ? 3 : 1 }, () => ({
      drift: jitter(8 * s),
      rise: (30 + rng() * 30) * s,
      dur: 2.6 + rng() * 1.4,
      delay: -rng() * 3,
    }));
    return {
      x: c.cx,
      left: (c.cx / W) * 100,
      mouth: mouthH,
      outline,
      flanges: flanges.join(''),
      rim: polyline([left[segs - 1], rimL, [c.cx, topY - 1.5 * s], rimR, right[segs - 1]]),
      edge: polyline(left.slice(1)),
      mouthRx: ((rimR[0] - rimL[0]) / 2) * 0.78,
      mouthRy: 2.4 * s,
      topY,
      streaks: `${streak(-c.top * 0.15, c.h * 0.42)}${streak(c.top * 0.2, c.h * 0.3)}${streak(c.top * 0.02, c.h * 0.55)}`,
      glow: { w: (60 + 60 * size) * s, h: (40 + 34 * size) * s },
      stem: { w: (16 + 18 * size) * s, h: (70 + 50 * size) * s },
      puffs,
      embers,
      delay: -n * 1.1,
    };
  });

  // Tube worms: a cluster of tubes (drawn in front) with a glowing plume in each.
  const worms = [];
  const tubeClusters = clusters.map((cluster) => {
    const n = cluster.tubes.length;
    const tubes = cluster.tubes.map((th, i) => {
      const x = cluster.cx + (i - (n - 1) / 2) * 6.5 * ls + jitter(1.2 * ls);
      const base = groundAt(x) - 6 * ls;
      const top = base + th * ls;
      const lean = jitter(3 * ls);
      const width = (4.2 + rng() * 1.3) * ls;
      worms.push({
        x: x + lean,
        left: ((x + lean) / W) * 100,
        mouth: top,
        w: 16 * ls,
        h: 26 * ls,
        sink: 7 * ls,
        depth: 20 * ls,
        reach: 60 * s + 24,
        sway: { dur: 3.6 + rng() * 2.2, delay: -rng() * 5 },
      });
      return { x, base, top, lean, width };
    });
    const minX = Math.min(...tubes.map((t) => t.x - t.width)) - 4;
    const maxX = Math.max(...tubes.map((t) => t.x + t.width)) + 4;
    const minBase = Math.min(...tubes.map((t) => t.base));
    const maxTop = Math.max(...tubes.map((t) => t.top)) + 4;
    const height = maxTop - minBase;
    const paths = tubes.map((t) => {
      const bx = t.x - minX;
      const by = height - (t.base - minBase);
      const ty = height - (t.top - minBase);
      const tx = bx + t.lean;
      const wb = t.width * 0.6;
      const wt = t.width * 0.5;
      return {
        d: `M${f1(bx - wb)} ${f1(by)}Q${f1(bx - wb + t.lean * 0.3)} ${f1((by + ty) / 2)} ${f1(tx - wt)} ${f1(ty)}L${f1(tx + wt)} ${f1(ty)}Q${f1(bx + wb + t.lean * 0.3)} ${f1((by + ty) / 2)} ${f1(bx + wb)} ${f1(by)}Z`,
        rings: [0.22, 0.42, 0.62].map((k) => {
          const y = ty + (by - ty) * k;
          const cx = tx + (bx - tx) * k;
          const hw = wt + (wb - wt) * k;
          return `M${f1(cx - hw)} ${f1(y)}Q${f1(cx)} ${f1(y + 1.1 * ls)} ${f1(cx + hw)} ${f1(y)}`;
        }),
        mouth: { cx: tx, cy: ty, rx: wt, ry: 1 * ls },
      };
    });
    return { left: (minX / W) * 100, bottom: minBase, width: maxX - minX, height, paths };
  });

  const crab = {
    from: beatMid - beatHalf,
    to: beatMid + beatHalf,
    start: beatMid,
    w: 30 * ls,
    h: 18 * ls,
    sink: 2 * ls,
  };

  const specks = visible(SPECKS).map((p) => ({
    left: p.x * 100,
    bottom: p.y * H,
    size: 11 * ls,
    violet: p.violet,
    dx: jitter(16 * s),
    dy: (10 + rng() * 14) * s,
    dur: 9 + rng() * 6,
    delay: -rng() * 10,
  }));

  // The near ledge: a dark band of rock in the foreground with a few big boulders, and a
  // chest half-buried in it with a stone or two against it.
  const chestW = 70 * cs;
  const chestH = chestW * (50 / 60);
  const cardW = Math.min(250, W - 24);
  const ledgeBase = (x) => {
    const xf = x / W;
    return (36 + 6 * Math.sin(xf * 9.1 + 1.3) + 3 * Math.sin(xf * 23 + 0.7)) * s;
  };
  const wormCluster = clusters.find((cluster) => cluster.chimney === 0 && cluster.dx < 0);
  const slotX = (slot) => {
    const w = chestW * slot.size;
    if (slot.place === 'vent') return c1.cx + c1.base / 2 + w / 2 + 1 * s;
    if (slot.place === 'worms') return wormCluster.cx - 12 * ls;
    return (tier === 1 && slot.phoneX ? slot.phoneX : slot.x) * W;
  };
  const ledgeSlots = CHEST_SLOTS.filter((slot) => slot.place === 'ledge').map(slotX);
  // Boulders that would bury the ledge chest are left out.
  const nearRocks = visible(NEAR_ROCKS)
    .map((r) => ({ x: r.x * W, w: r.w * s, h: r.h * s }))
    .filter((r) => ledgeSlots.every((cx) => Math.abs(r.x - cx) > r.w / 2 + chestW * 0.6));
  const lumps = (x) => {
    let h = 0;
    for (const cx of ledgeSlots) {
      h += 11 * cs * Math.exp(-(((x - cx + chestW * 0.54) / (8 * cs)) ** 2));
      h += 8 * cs * Math.exp(-(((x - cx - chestW * 0.56) / (7 * cs)) ** 2));
    }
    for (const r of nearRocks) {
      const t = (x - r.x) / (r.w / 2);
      if (Math.abs(t) < 1) h = Math.max(h, r.h * Math.sqrt(1 - t * t) * (1 - 0.25 * t));
    }
    return h;
  };
  const ledgePoints = [];
  const ledgeStep = Math.max(6, Math.round(10 * s));
  for (let x = 0; ; x += ledgeStep) {
    const px = Math.min(x, W);
    ledgePoints.push([px, H - (ledgeBase(px) + lumps(px) + jitter(1.8 * s))]);
    if (px === W) break;
  }
  let ledgeCracks = '';
  for (let i = 0, n = Math.round(W / 140); i < n; i++) {
    let x = (i + 0.3 + rng() * 0.4) * (W / n);
    let y = H - ledgeBase(x) + 6 * s;
    ledgeCracks += `M${f1(x)} ${f1(y)}`;
    for (let k = 0; k < 2; k++) {
      x += jitter(6 * s);
      y += (7 + rng() * 8) * s;
      ledgeCracks += `L${f1(x)} ${f1(y)}`;
    }
  }
  // Cards stay on screen, and clear of the kelp framing the page from 768px (Home.js).
  const margin = W >= 768 ? 76 : 12;
  const chests = CHEST_SLOTS.map((slot) => {
    const x = slotX(slot);
    const w = chestW * slot.size;
    const h = chestH * slot.size;
    const onLedge = slot.place === 'ledge';
    // What the chest rests on (height up from the bottom at a given x).
    const surface = onLedge ? ledgeBase : slot.place === 'ridge' ? (px) => farHeight(px / W) * s : groundAt;
    // Sit it on the lowest point under it, sunk a little into the rock.
    let rest = Infinity;
    for (let k = -0.4; k <= 0.4; k += 0.2) rest = Math.min(rest, surface(x + k * w));
    const buried = onLedge ? h * 0.3 : h * 0.16;
    const bottom = (onLedge ? ledgeBase(x) : rest) - buried;
    // Chests set into the rock behind are clipped along its surface, so they sink into it.
    let clip;
    if (!onLedge) {
      // (Open to well above the chest, so a lifted lid isn't clipped.)
      const points = ['-10% -80%', '110% -80%'];
      for (let k = 1; k >= 0; k -= 0.125) {
        const depth = clamp(surface(x + (k - 0.5) * w) - bottom, 0, h);
        points.push(`${(k * 100).toFixed(1)}% ${f1(h - depth)}px`);
      }
      clip = `polygon(${points.join(',')})`;
    }
    const left = x - cardW / 2;
    return {
      place: slot.place,
      back: !onLedge,
      left: (x / W) * 100,
      bottom: bottom + buried,
      w,
      h: h - buried,
      buried,
      scale: cs * slot.size,
      clip,
      blur: slot.blur,
      colors: Object.fromEntries(Object.entries(CHEST_COLORS).map(([name, hex]) => [name, tone(hex, slot)])),
      // Stones wedging the vent chest in place.
      stones:
        slot.place === 'vent'
          ? [
              { dx: -w * 0.55, w: w * 0.42, h: h * 0.42 },
              { dx: w * 0.5, w: w * 0.36, h: h * 0.34 },
            ].map((stone) => ({ ...stone, left: ((x + stone.dx) / W) * 100, bottom: groundAt(x + stone.dx) - 2 * s }))
          : [],
      // A knoll on the far ridge for the far chest to sit in.
      knoll: slot.place === 'ridge' ? { left: (x / W) * 100, bottom: bottom + buried - 11 * s, w: w * 2.3, h: 16 * s } : null,
      cardW,
      shift: clamp(left, margin, W - margin - cardW) - left,
    };
  });

  return {
    W,
    H,
    s,
    groundAt,
    farRidge,
    nearRidge,
    outcrops,
    rock,
    rim: polyline(surface),
    cracks,
    boulders,
    vents,
    worms,
    tubeClusters,
    crab,
    specks,
    chests,
    ledge: `${polyline(ledgePoints)}L${W} ${H}L0 ${H}Z`,
    ledgeRim: polyline(ledgePoints),
    ledgeCracks,
  };
}

// ---------------------------------------------------------------------------------------
// Motion: worms ducking from the cursor and the crab's walk, run on the shared ticker only
// while the seabed is on screen and motion isn't paused (so both freeze where they are).
// ---------------------------------------------------------------------------------------

function useAbyssLife(rootRef, layout, enabled) {
  useEffect(() => {
    if (!layout) return undefined;
    const root = rootRef.current;
    const crabEl = root.querySelector('[data-crab]');
    const beat = layout.crab;
    const crab = { x: beat.start, y: layout.groundAt(beat.start), tilt: 0, target: beat.start, pause: 1 + Math.random() * 2, fast: false, calm: 0, walking: '' };
    let kx = 1;
    let placed = '';
    const placeCrab = () => {
      const transform = `translate3d(${f1(crab.x * kx - beat.w / 2)}px,${f1(beat.sink - crab.y)}px,0) rotate(${crab.tilt.toFixed(1)}deg)`;
      if (transform === placed) return;
      placed = transform;
      crabEl.style.transform = transform;
    };
    placeCrab();
    if (!enabled) return undefined;

    const worms = Array.from(root.querySelectorAll('[data-worm]'), (el, i) => ({ el, ...layout.worms[i], r: 0, shown: 0, hold: 0, linger: 0.5 + Math.random() * 0.9 }));
    const pointer = { active: false };
    const span = beat.to - beat.from;
    let rect = null;
    let last = 0;

    const read = () => {
      rect = root.getBoundingClientRect();
    };

    const write = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!rect || dt <= 0) return;
      kx = rect.width / layout.W;
      readPointer(rect, now, pointer);
      // The pointer in layout px, with y measured up from the bottom like everything else.
      const px = pointer.x / kx;
      const py = rect.height - pointer.y;

      for (const w of worms) {
        if (pointer.active && Math.hypot(px - w.x, py - w.mouth - w.h * 0.3) < w.reach) w.hold = w.linger;
        else w.hold -= dt;
        const target = w.hold > 0 ? 1 : 0;
        // Quick to duck, slow and cautious to come back out.
        w.r += (target - w.r) * (1 - Math.exp(-(target > w.r ? 18 : 1.6) * dt));
        if (w.r < 0.004) {
          if (w.shown) {
            w.el.style.transform = '';
            w.el.style.opacity = '';
            w.shown = 0;
          }
          continue;
        }
        if (Math.abs(w.r - w.shown) < 0.004) continue;
        w.shown = w.r;
        w.el.style.transform = `translateY(${f1(w.r * w.depth)}px) scale(${(1 - 0.6 * w.r).toFixed(3)})`;
        w.el.style.opacity = (1 - 0.85 * w.r).toFixed(2);
      }

      if (span < 4) return;
      // Startled by a cursor close by, the crab scuttles off; otherwise it ambles between
      // spots on its stretch of rock, resting a while at each.
      crab.calm -= dt;
      if (pointer.active && crab.calm <= 0 && Math.abs(px - crab.x) < 48 * layout.s + 18 && Math.abs(py - crab.y) < 50 * layout.s + 18) {
        const away = px > crab.x ? -1 : 1;
        let target = clamp(crab.x + away * span * 0.6, beat.from, beat.to);
        if (Math.abs(target - crab.x) < 12) target = clamp(crab.x - away * span * 0.6, beat.from, beat.to);
        crab.target = target;
        crab.fast = true;
        crab.pause = 0;
        crab.calm = 2.5;
      }
      if (crab.pause > 0) {
        crab.pause -= dt;
        if (crab.pause <= 0) {
          let target = beat.from + Math.random() * span;
          if (Math.abs(target - crab.x) < span * 0.2) target = crab.x > beat.start ? beat.from + Math.random() * span * 0.3 : beat.to - Math.random() * span * 0.3;
          crab.target = target;
        }
      } else {
        const speed = (crab.fast ? 75 : 17) * Math.max(layout.s, 0.75);
        const d = crab.target - crab.x;
        if (Math.abs(d) <= speed * dt) {
          crab.x = crab.target;
          crab.pause = crab.fast ? 1 + Math.random() : 1.5 + Math.random() * 4;
          crab.fast = false;
        } else {
          crab.x += Math.sign(d) * speed * dt;
        }
      }
      const walking = crab.pause > 0 ? '' : crab.fast ? 'fast' : 'walk';
      if (walking !== crab.walking) {
        crab.walking = walking;
        if (walking) crabEl.setAttribute('data-walking', walking);
        else crabEl.removeAttribute('data-walking');
      }
      // Follow the rock's height closely but its slope loosely, so the crab leans with the
      // lie of the land rather than every little edge.
      const reach = beat.w * 0.6;
      const slope = (layout.groundAt(crab.x + reach) - layout.groundAt(crab.x - reach)) / (2 * reach);
      crab.y += (layout.groundAt(crab.x) - crab.y) * (1 - Math.exp(-12 * dt));
      crab.tilt += (clamp((-Math.atan(slope) * 180) / Math.PI, -12, 12) - crab.tilt) * (1 - Math.exp(-4 * dt));
      placeCrab();
    };

    const stop = runWhileVisible(root, { read, write }, { rootMargin: '100px 0px', onStart: () => { last = performance.now(); } });
    retainPointer();
    return () => {
      stop();
      releasePointer();
      crabEl.removeAttribute('data-walking');
      for (const w of worms) {
        w.el.style.transform = '';
        w.el.style.opacity = '';
      }
    };
  }, [rootRef, layout, enabled]);
}

// CSS animations keep ticking off screen; pause the seabed's while it's out of view (it's
// at the very bottom of a long page, so that's most of the time).
function useIdleOffscreen(ref) {
  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        el.toggleAttribute('data-idle', !entries[entries.length - 1].isIntersecting);
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

// ---------------------------------------------------------------------------------------
// Art
// ---------------------------------------------------------------------------------------

// Under the darkness: ridges, rock, chimneys and the deeper chests.
function AbyssBack({ layout, uid, chests, open }) {
  const { W, H } = layout;
  const id = (name) => `${uid}-${name}`;
  return (
    <div className="abyss-back" aria-hidden="true">
      <svg className="abyss-scene" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={id('far')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#40517c" stopOpacity="0.1" />
            <stop offset="0.25" stopColor="#3a4a72" stopOpacity="0.6" />
            <stop offset="1" stopColor="#222d4a" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id={id('near')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#34405e" />
            <stop offset="0.6" stopColor="#1d2539" />
          </linearGradient>
          <linearGradient id={id('rock')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5a6882" />
            <stop offset="0.45" stopColor="#384356" />
            <stop offset="1" stopColor="#222a39" />
          </linearGradient>
          <linearGradient id={id('chimney')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#66738c" />
            <stop offset="0.3" stopColor="#3a4456" />
            <stop offset="1" stopColor="#191f2b" />
          </linearGradient>
          <linearGradient id={id('heat')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fb923c" stopOpacity="0.55" />
            <stop offset="0.25" stopColor="#c2410c" stopOpacity="0.18" />
            <stop offset="0.5" stopColor="#c2410c" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={id('mouth')}>
            <stop offset="0" stopColor="#fff1c9" />
            <stop offset="0.45" stopColor="#fb923c" />
            <stop offset="1" stopColor="#7c2d12" />
          </radialGradient>
          <filter id={id('soft')} x="-5%" y="-20%" width="110%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <path d={layout.farRidge.fill} fill={`url(#${id('far')})`} filter={`url(#${id('soft')})`} />
        <path d={layout.nearRidge.fill} fill={`url(#${id('near')})`} />
        <path d={layout.nearRidge.edge} fill="none" stroke="rgba(150, 178, 222, 0.22)" strokeWidth="1.2" strokeLinejoin="round" />
        {layout.outcrops.map((o, i) => (
          <g key={i}>
            <path d={o.d} fill={`url(#${id('rock')})`} />
            <path d={o.rim} fill="none" stroke="rgba(176, 202, 240, 0.55)" strokeWidth="1.3" strokeLinejoin="round" />
          </g>
        ))}
        {layout.vents.map((v, i) => (
          <g key={i}>
            <path d={v.outline} fill={`url(#${id('chimney')})`} />
            <path d={v.outline} fill={`url(#${id('heat')})`} />
            <path d={v.flanges} fill="#2c3445" stroke="rgba(176, 202, 240, 0.3)" strokeWidth="0.8" strokeLinejoin="round" />
            <path d={v.streaks} fill="none" stroke="rgba(206, 120, 62, 0.45)" strokeWidth="1.4" strokeLinecap="round" />
            <path d={v.edge} fill="none" stroke="rgba(176, 202, 240, 0.45)" strokeWidth="1.3" strokeLinejoin="round" />
            <path d={v.rim} fill="none" stroke="rgba(253, 164, 90, 0.75)" strokeWidth="1.5" strokeLinejoin="round" />
            <ellipse cx={v.x} cy={v.topY} rx={v.mouthRx} ry={v.mouthRy} fill={`url(#${id('mouth')})`} />
          </g>
        ))}
        <path d={layout.rock} fill={`url(#${id('rock')})`} />
        <path d={layout.cracks} fill="none" stroke="rgba(6, 9, 16, 0.6)" strokeWidth="1.1" strokeLinejoin="round" />
        {layout.boulders.map((b, i) => (
          <g key={i}>
            <path d={b.d} fill="#46536a" />
            <path d={b.shine} fill="none" stroke="rgba(176, 202, 240, 0.5)" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        ))}
        <path d={layout.rim} fill="none" stroke="rgba(160, 190, 232, 0.16)" strokeWidth="4" strokeLinejoin="round" />
        <path d={layout.rim} fill="none" stroke="rgba(180, 206, 242, 0.7)" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
      <SunkChests chests={chests} open={open} />
    </div>
  );
}

// The chimneys' smoke, also under the darkness. Its layer isn't clipped at the top, so the
// smoke can rise on behind the section above and fade out there instead of being cut off.
function AbyssSmoke({ layout }) {
  return (
    <div className="abyss-smoke" aria-hidden="true">
      {layout.vents.map((v, i) => (
        <span key={i} className="abyss-plume-stem" style={{ left: `${v.left}%`, bottom: v.mouth - 2, width: v.stem.w, height: v.stem.h, '--delay': `${v.delay * 2}s` }} />
      ))}
      {layout.vents.map((v, i) =>
        v.puffs.map((p, j) => (
          <span
            key={`${i}-${j}`}
            className="abyss-puff"
            style={{
              left: `${v.left}%`,
              bottom: v.mouth,
              width: p.size,
              height: p.size,
              transform: p.still,
              opacity: p.stillOpacity,
              '--rise': `${f1(p.rise)}px`,
              '--drift': `${f1(p.drift)}px`,
              '--grow': p.grow.toFixed(2),
              '--dur': `${p.dur.toFixed(2)}s`,
              '--delay': `${p.delay.toFixed(2)}s`,
            }}
          />
        ))
      )}
    </div>
  );
}

function WormPlume() {
  return (
    <svg viewBox="0 0 16 26" aria-hidden="true">
      <path d="M7 26V15Q8 13.6 9 15V26Z" fill="#be123c" />
      <path d="M8 16.5C3.6 16 2.6 11 3.4 6.4C4 8.6 4.6 8.2 4.9 4.4C5.6 7.4 6.4 7 6.8 1.6C7.6 6.6 8.3 7 9 3.2C9.4 7 10 7.6 11 5C12.8 9.8 12.4 15.9 8 16.5Z" fill="#fb7185" />
      <path d="M8 16.5C6 16.1 5.3 14 5.5 11.8C6.8 13 9.2 13 10.5 11.8C10.8 14.2 10 16.1 8 16.5Z" fill="#e11d48" opacity="0.6" />
      <path d="M4.2 8.5C4.8 11 5.6 12.4 6.6 13.4M6.8 5C6.9 9 7.3 11.6 7.9 13.4M9.2 6.2C9 9.4 8.8 11.8 8.6 13.4M11 7.6C10.6 10.4 10 12.2 9.4 13.4" fill="none" stroke="#fecdd3" strokeWidth="0.5" strokeLinecap="round" opacity="0.8" />
      <g fill="#fff1f2">
        <circle cx="3.4" cy="6.4" r="0.8" />
        <circle cx="4.9" cy="4.4" r="0.8" />
        <circle cx="6.8" cy="1.8" r="0.9" />
        <circle cx="9" cy="3.3" r="0.8" />
        <circle cx="11" cy="5.1" r="0.8" />
      </g>
    </svg>
  );
}

function Crab({ crab }) {
  return (
    <div className="abyss-crab" data-crab="" style={{ width: crab.w, height: crab.h }}>
      <svg viewBox="0 0 30 18" aria-hidden="true">
        <g fill="none" stroke="#5eead4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <g className="abyss-crab-legs abyss-crab-legs--l">
            <path d="M10 10.5L4.5 10.8L1.5 14.5" />
            <path d="M9.5 12L5 14.2L3.6 17.4" />
            <path d="M10.5 13.2L7.5 15.6L7 17.8" />
          </g>
          <g className="abyss-crab-legs abyss-crab-legs--r">
            <path d="M20 10.5L25.5 10.8L28.5 14.5" />
            <path d="M20.5 12L25 14.2L26.4 17.4" />
            <path d="M19.5 13.2L22.5 15.6L23 17.8" />
          </g>
          <path d="M10.5 8.6L7.2 6.2M19.5 8.6L22.8 6.2M13.4 7V4.6M16.6 7V4.6" />
        </g>
        <path d="M3.6 6.4Q3 2.8 5.8 2.6Q7.8 2.9 7.3 4.9Q6 4.4 5.5 5.8Z" fill="#2dd4bf" />
        <path d="M26.4 6.4Q27 2.8 24.2 2.6Q22.2 2.9 22.7 4.9Q24 4.4 24.5 5.8Z" fill="#2dd4bf" />
        <ellipse cx="15" cy="10.5" rx="7.6" ry="4.6" fill="#14b8a6" />
        <ellipse cx="15" cy="9.1" rx="5" ry="2" fill="#99f6e4" opacity="0.75" />
        <circle cx="13.4" cy="4.2" r="0.95" fill="#ecfeff" />
        <circle cx="16.6" cy="4.2" r="0.95" fill="#ecfeff" />
      </svg>
    </div>
  );
}

// Above the darkness: the glow at each vent, tube worms, the crab and drifting specks.
function AbyssLife({ layout, uid }) {
  const tubeFill = `${uid}-tube`;
  return (
    <div className="abyss-life" aria-hidden="true">
      <svg className="abyss-defs" width="0" height="0">
        <defs>
          <linearGradient id={tubeFill} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a39db8" />
            <stop offset="0.45" stopColor="#686380" />
            <stop offset="1" stopColor="#3b3f52" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {layout.vents.map((v, i) => (
        <React.Fragment key={i}>
          <span className="abyss-vent-glow" style={{ left: `${v.left}%`, bottom: v.mouth, width: v.glow.w, height: v.glow.h, '--delay': `${v.delay}s` }} />
          {v.embers.map((e, j) => (
            <span
              key={j}
              className="abyss-ember"
              style={{ left: `${v.left}%`, bottom: v.mouth, '--drift': `${f1(e.drift)}px`, '--rise': `${f1(e.rise)}px`, '--dur': `${e.dur.toFixed(2)}s`, '--delay': `${e.delay.toFixed(2)}s` }}
            />
          ))}
        </React.Fragment>
      ))}
      {layout.specks.map((p, i) => (
        <span
          key={i}
          className={`abyss-speck${p.violet ? ' abyss-speck--violet' : ''}`}
          style={{
            left: `${p.left}%`,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            '--dx': `${f1(p.dx)}px`,
            '--dy': `${f1(p.dy)}px`,
            '--dur': `${p.dur.toFixed(2)}s`,
            '--delay': `${p.delay.toFixed(2)}s`,
          }}
        />
      ))}
      {layout.worms.map((w, i) => (
        <span
          key={i}
          data-worm=""
          className="abyss-worm"
          style={{ left: `${w.left}%`, bottom: w.mouth - w.sink, width: w.w, height: w.h, '--dur': `${w.sway.dur.toFixed(2)}s`, '--delay': `${w.sway.delay.toFixed(2)}s` }}
        >
          <WormPlume />
        </span>
      ))}
      {layout.tubeClusters.map((cluster, i) => (
        <svg
          key={i}
          className="abyss-tubes"
          viewBox={`0 0 ${f1(cluster.width)} ${f1(cluster.height)}`}
          style={{ left: `${cluster.left}%`, bottom: cluster.bottom, width: cluster.width, height: cluster.height }}
        >
          {cluster.paths.map((t, j) => (
            <g key={j}>
              <path d={t.d} fill={`url(#${tubeFill})`} />
              <path d={t.rings.join('')} fill="none" stroke="rgba(40, 44, 60, 0.45)" strokeWidth="0.8" />
              <ellipse cx={t.mouth.cx} cy={t.mouth.cy} rx={t.mouth.rx} ry={t.mouth.ry} fill="#2a1a2e" stroke="#ddd6fe" strokeOpacity="0.6" strokeWidth="0.8" />
            </g>
          ))}
        </svg>
      ))}
      <Crab crab={layout.crab} />
    </div>
  );
}

// A chest in a given palette (CHEST_COLORS, toned for its depth).
function ChestArt({ colors: c, style }) {
  return (
    <svg className="abyss-chest-art" viewBox="0 0 60 50" style={style} aria-hidden="true" focusable="false">
      {/* What's inside, seen once the lid lifts */}
      <g className="abyss-chest-inside">
        <path d="M7 22L8 13Q30 7 52 13L53 22Z" fill={c.inside} />
        <ellipse cx="32" cy="17" rx="22" ry="9" fill={c.goldLight} opacity="0.3" />
        <path d="M8 22Q12 15.5 17 17Q21 12.5 26 15Q30 11 35 14.5Q40 12 44 16Q49 15 52 22Z" fill={c.gold} />
        <path d="M11 21Q15 17 19 18.5Q23 15 27 17Q31 14 35 16.5Q40 15 43 18Q47 17.5 49 21Z" fill={c.goldLight} />
        <circle cx="20" cy="17" r="1.3" fill={c.shine} />
        <circle cx="33" cy="15" r="1.1" fill={c.shine} />
        <circle cx="42" cy="17.5" r="1" fill={c.shine} />
      </g>
      <path d="M5 21H55V46Q55 49 52 49H8Q5 49 5 46Z" fill={c.wood} />
      <path d="M40 21H55V46Q55 49 52 49H40Z" fill="#000" opacity="0.2" />
      <path d="M5 30H55M5 39H55" stroke={c.grain} strokeWidth="1" />
      <rect x="10" y="21" width="5" height="28" fill={c.band} />
      <rect x="45" y="21" width="5" height="28" fill={c.bandShade} />
      <rect x="5" y="21" width="50" height="3" fill={c.trim} />
      {/* The lid, hinged at the back left */}
      <g className="abyss-chest-lid">
        <path d="M5 22V14Q5 5 30 4Q55 5 55 14V22Z" fill={c.lid} />
        <path d="M40 22V6.2Q51 8 55 14V22Z" fill="#000" opacity="0.18" />
        <path d="M10 22V8.2L15 7V22Z" fill={c.band} />
        <path d="M45 22V7L50 8.2V22Z" fill={c.bandShade} />
        <rect x="5" y="19" width="50" height="3" fill={c.trim} />
        <path d="M9 11Q18 6.5 30 6" fill="none" stroke={c.goldLight} strokeOpacity="0.3" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      <rect x="26" y="19" width="8" height="10" rx="1.5" fill={c.lock} />
      <circle cx="30" cy="23.2" r="1.3" fill={c.grain} />
      <path d="M29.4 23.5H30.6V26.5H29.4Z" fill={c.grain} />
    </svg>
  );
}

// The deeper chests' art, set into the rock under the page's darkness (their buttons are in
// the front layer), with the stones wedging the vent chest in place.
function SunkChests({ chests, open }) {
  return chests.map(
    (c, i) =>
      c.back && (
        <React.Fragment key={i}>
          <div
            className={`abyss-sunk-chest${open === i ? ' is-open' : ''}${c.blur ? ' abyss-sunk-chest--far' : ''}`}
            style={{ left: `${c.left}%`, bottom: c.bottom - c.buried, width: c.w, height: c.h + c.buried, clipPath: c.clip }}
          >
            <ChestArt colors={c.colors} />
          </div>
          {c.knoll && (
            <svg
              className="abyss-stone abyss-sunk-chest--far"
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
              style={{ left: `${c.knoll.left}%`, bottom: c.knoll.bottom, width: c.knoll.w, height: c.knoll.h }}
            >
              <path d="M0 30C12 29 17 11 30 9L70 9C83 11 88 29 100 30Z" fill="#33416a" />
              <path d="M8 24C14 16 20 10 30 9L60 9" fill="none" stroke="rgba(160, 190, 235, 0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
          )}
          {c.stones.map((stone, j) => (
            <svg key={j} className="abyss-stone" viewBox="0 0 40 24" preserveAspectRatio="none" style={{ left: `${stone.left}%`, bottom: stone.bottom, width: stone.w, height: stone.h }}>
              <path d="M1 24C0 14 6 5 16 3C26 1 37 8 39 17C40 20 40 22 39 24Z" fill="#46536a" />
              <path d="M8 11C11 7 16 5.5 21 5.8" fill="none" stroke="rgba(176, 202, 240, 0.5)" strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          ))}
        </React.Fragment>
      )
  );
}

// Links in a chest: "/#section" scrolls to that section of the home page, other site paths
// go through the router, anything else opens in a new tab.
function ChestLink({ href, className, children }) {
  const { pathname } = useLocation();
  if (href.startsWith('/#')) {
    return (
      <a
        href={href}
        className={className}
        onClick={(e) => {
          const target = document.getElementById(decodeURIComponent(href.slice(2)));
          if (pathname !== '/' || !target) return;
          e.preventDefault();
          const navHeight = window.innerWidth >= 1024 ? 80 : 64;
          const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight, behavior: still ? 'instant' : 'smooth' });
        }}
      >
        {children}
      </a>
    );
  }
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

function Chest({ chest, index, slot, open, onToggle, cardId }) {
  const buttonRef = useRef(null);
  const path = `footer.abyss.chests.${index}`;
  const href = safeUrl(chest.link);
  const cs = slot.scale;
  return (
    <div
      className={`abyss-chest${open ? ' is-open' : ''}${slot.back ? ' abyss-chest--sunk' : ''}`}
      style={{
        left: `${slot.left}%`,
        bottom: slot.bottom,
        width: slot.w,
        height: slot.h,
        '--card-w': `${slot.cardW}px`,
        '--card-shift': `${f1(slot.shift)}px`,
        '--sparkle-delay': `${(-index * 1.9).toFixed(1)}s`,
        '--sparkle-size': `${f1(13 * clamp(cs, 0.55, 1))}px`,
        '--coin': `${f1(8 * clamp(cs, 0.6, 1))}px`,
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open && !e.defaultPrevented) {
          onToggle(index);
          buttonRef.current.focus();
        }
      }}
    >
      <span className="abyss-chest-glow" aria-hidden="true" />
      <button
        ref={buttonRef}
        type="button"
        className="abyss-chest-btn"
        aria-expanded={open}
        aria-controls={cardId}
        aria-label={`Treasure chest: ${chest.label || 'unopened'}`}
        onClick={() => onToggle(index)}
      >
        {/* Deeper chests are drawn in the rock behind (SunkChests); the button sits over them. */}
        {!slot.back && <ChestArt colors={slot.colors} style={{ width: slot.w, height: slot.h + slot.buried, bottom: -slot.buried }} />}
        <span className="abyss-chest-sparkle" aria-hidden="true" />
      </button>
      <div id={cardId} className="abyss-chest-card">
        <Editable path={`${path}.label`} className="abyss-chest-label" />
        {href ? (
          <ChestLink href={href} className="abyss-chest-link">
            <Editable path={`${path}.text`} />
          </ChestLink>
        ) : (
          <Editable path={`${path}.text`} as="p" className="abyss-chest-text" />
        )}
        <LinkEdit path={`${path}.link`} label="Link" className="mt-2" />
      </div>
      <span className="abyss-chest-burst" aria-hidden="true">
        {COINS.map((c, i) => (
          <span key={`c${i}`} className="abyss-coin" style={{ '--dx': `${f1(c.dx * cs)}px`, '--dy': `${f1(c.dy * cs)}px`, '--r': `${c.r}deg`, '--d': `${c.d}s` }} />
        ))}
        {POPS.map((p, i) => (
          <span
            key={`p${i}`}
            className="abyss-pop bubble-3d"
            style={{ width: p.size, height: p.size, '--dx': `${f1(p.dx * cs)}px`, '--rise': `${f1(p.rise * cs)}px`, '--d': `${p.d}s` }}
          />
        ))}
      </span>
    </div>
  );
}

// The chests' buttons and cards: footer.abyss.chests in src/content/footer.json ({ label,
// text, link }), one per slot on the seabed (CHEST_SLOTS).
function Chests({ layout, chests, open, onToggle, uid }) {
  if (!chests.length) return null;
  return (
    <div className="abyss-chests" role="group" aria-label="Treasure chests on the seabed">
      {chests.map((chest, i) => (
        <Chest key={i} chest={chest} index={i} slot={layout.chests[i]} open={open === i} onToggle={onToggle} cardId={`${uid}-chest-${i}`} />
      ))}
    </div>
  );
}

export default function AbyssFloor() {
  const rootRef = useRef(null);
  const width = useWidth(rootRef);
  const layout = useMemo(() => (width ? layoutAbyss(width) : null), [width]);
  const reducedMotion = useReducedMotion();
  const uid = `abyss-${useId().replace(/:/g, '')}`;
  const footer = useContent('footer');
  const chests = (footer?.abyss?.chests || []).slice(0, CHEST_SLOTS.length);
  // One chest open at a time, so their cards never overlap.
  const [open, setOpen] = useState(-1);
  const toggle = useCallback((index) => setOpen((current) => (current === index ? -1 : index)), []);
  useAbyssLife(rootRef, layout, !reducedMotion);
  useIdleOffscreen(rootRef);

  return (
    <div ref={rootRef} className="abyss" style={layout ? { height: layout.H } : undefined}>
      {layout && <AbyssBack layout={layout} uid={uid} chests={layout.chests.slice(0, chests.length)} open={open} />}
      {layout && <AbyssSmoke layout={layout} />}
      {/* Clicks on the water send up bubbles here too, rising on into the contact section. */}
      <OceanLife section="abyss" />
      {layout && (
        <div className="abyss-front">
          <AbyssLife layout={layout} uid={uid} />
          <Chests layout={layout} chests={chests} open={open} onToggle={toggle} uid={uid} />
          <svg className="abyss-ledge" viewBox={`0 0 ${layout.W} ${layout.H}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={layout.ledge} fill="#0a0f1c" />
            <path d={layout.ledgeCracks} fill="none" stroke="rgba(0, 0, 0, 0.55)" strokeWidth="1" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <path d={layout.ledgeRim} fill="none" stroke="rgba(130, 162, 208, 0.3)" strokeWidth="1.2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      )}
    </div>
  );
}
