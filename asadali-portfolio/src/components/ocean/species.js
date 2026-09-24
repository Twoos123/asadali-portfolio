import React from 'react';
import { around, limbPath, smoothLine } from './geometry';

// Every creature is drawn as a flat silhouette in `currentColor`, facing right (or up for
// the drifters), with the moving parts split out and tagged with data-part so the engine
// can pose them every frame. Secondary shading uses the --detail / --glow custom
// properties set per creature from the section config.

const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '100%',
  height: '100%',
  fill: 'currentColor',
  overflow: 'visible',
  'aria-hidden': true,
};

const eye = (cx, cy, r) => `M${cx + r} ${cy}a${r} ${r} 0 1 0 ${-2 * r} 0a${r} ${r} 0 1 0 ${2 * r} 0Z`;

const TAU = Math.PI * 2;
const rand = (min, max) => min + Math.random() * (max - min);
const clampUnit = (v) => (v < -1 ? -1 : v > 1 ? 1 : v);

// ---------------------------------------------------------------------------------------
// Art
// ---------------------------------------------------------------------------------------

function SmallFishArt() {
  return (
    <svg viewBox="0 0 64 28" {...svgProps}>
      <path data-part="tail" d="M18 14C14 10.5 9 5.5 2.5 2.2C5.5 7 7 10.5 8 14C7 17.5 5.5 21 2.5 25.8C9 22.5 14 17.5 18 14Z" />
      <path d="M27 6.8Q33 -0.5 43 4.6Z" />
      <path d="M30 21.6Q33 27 39 23.4Z" />
      <path fillRule="evenodd" d={`M62.5 14.5C60 8.5 50 4.5 40 4.5C30 4.5 22 8.5 16 12.6L16 15.4C22 19.5 30 23.5 40 23.5C50 23.5 60 20 62.5 14.5Z${eye(53.6, 11.6, 2)}`} />
    </svg>
  );
}

function TropicalFishArt() {
  return (
    <svg viewBox="0 0 60 50" {...svgProps}>
      <path data-part="tail" d="M21 25C17 21 12 18.5 5.5 17.5C7 21.5 7 28.5 5.5 32.5C12 31.5 17 29 21 25Z" />
      <path d="M42 9.2C38 3.5 30 0.8 21 2.2C24.5 5.5 26.5 10 26.8 13.5Z" />
      <path d="M42 40.8C38 46.5 30 49.2 21 47.8C24.5 44.5 26.5 40 26.8 36.5Z" />
      <path fillRule="evenodd" d={`M57.5 25C56 14.5 47 8.5 37 8.5C28.5 8.5 22.5 14 19.5 20C18.8 22 18.8 28 19.5 30C22.5 36 28.5 41.5 37 41.5C47 41.5 56 35.5 57.5 25Z${eye(50, 21, 2.1)}`} />
      <g fill="var(--detail)">
        <path d="M45 10C47.2 16 47.2 34 45 40L41.2 40.9C43.2 34 43.2 16 41.2 9.2Z" />
        <path d="M34.5 8.8C36.8 16 36.8 34 34.5 41.2L30 40C32.2 33 32.2 17 30 10Z" />
        <path d="M24.5 15.5C25.6 20 25.6 30 24.5 34.5L22 31.5C22.6 28 22.6 22 22 18.5Z" />
      </g>
      <path data-part="fin" fill="var(--detail)" d="M40 27C36 28.5 33 31 31.5 34C35.5 33.5 38.5 31.5 41 29Z" />
    </svg>
  );
}

function SharkArt() {
  const gill = (x) => `M${x} 20.8C${x - 0.8} 23.3 ${x - 0.8} 25.7 ${x} 28.2L${x + 1.1} 28.2C${x + 0.3} 25.7 ${x + 0.3} 23.3 ${x + 1.1} 20.8Z`;
  return (
    <svg viewBox="0 0 128 48" {...svgProps}>
      <path data-part="tail" d="M22 24.8C17 19 10 10 3.5 2.5C6.5 11 8 17.5 8.8 23C7.5 27 5.5 31 3 35.5C9.5 32 16 28.5 22 25.6Z" />
      <path d="M70 14.5C73 8.5 77 3 84 0.8C83.5 6 84.5 11 88 14.8Z" />
      <path d="M40 19.2L44.5 14.8L47 18.2Z" />
      <path d="M56 32L52 37L60 32.8Z" />
      <path d="M36 29.6L33 34.5L40 31Z" />
      <path fillRule="evenodd" d={`M126 26C121 21.5 110 17 95 15.2C80 13.5 60 14.5 44 18C34 20.2 26 22 20 23.2L20 26.4C27 27.8 36 29.8 48 31.2C66 33.2 84 33.4 100 31.6C110 30.4 119 28.8 126 26Z${eye(110, 21.8, 1.5)}${gill(96)}${gill(92.5)}${gill(89)}`} />
      <path data-part="fin" d="M90 30C86 35.5 80 41 72 45.5C76.5 40 79 35.5 80.5 31.5Z" />
    </svg>
  );
}

const TURTLE_FLIPPER = 'M72.5 35C69 41 62 49 50 58.5C47 61 44.5 62 45.5 60C52 52.5 60 44 66 35.5Z';

function TurtleArt() {
  return (
    <svg viewBox="0 0 100 66" {...svgProps}>
      <path data-part="far-flipper" opacity="0.55" d={TURTLE_FLIPPER} />
      <path data-part="rear-flipper" d="M29 37C24 42 18 46 10 47.5C14.5 43.5 19 39.5 22 36.5Z" />
      <path d="M22 36L13 38L21 39.5Z" />
      <path fillRule="evenodd" d={`M78 31C81 26.5 87 24 93 25.6C97 26.8 98.2 30.2 96.4 32.6C93.8 35.8 87 36.4 80 36Z${eye(90.5, 28.6, 1.4)}`} />
      <path d="M18 37.5C19 23 33 12.5 51 12C68 11.5 80 21 82 33.5C78 38 68 41.5 50 41.8C34 42 24 40.6 18 37.5Z" />
      <path fill="none" stroke="var(--detail)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M31 19L38 27L52 29L66 27L72 19.5M38 27L33 38M52 29L52 41M66 27L73 37.5M21 35C34 39.5 66 39.8 81 32.5" />
      <path data-part="flipper" d={TURTLE_FLIPPER} />
    </svg>
  );
}

function AnglerfishArt() {
  return (
    <svg viewBox="0 -14 94 80" {...svgProps}>
      <path data-part="tail" d="M22 35C17 29 11 25.5 4 24.5C6.5 30 6.5 40 4 45.5C11 44.5 17 41 22 35Z" />
      <path d="M44 9C41 4.5 36.5 3.5 31.5 5.5C35 7.5 37.5 10 38.5 12.5Z" />
      <g data-part="lure">
        <path d="M58 8.5C58 -2 67 -10 76 -8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <g data-part="glow" fill="var(--glow)">
          <circle cx="76.5" cy="-7.5" r="9" opacity="0.16" />
          <circle cx="76.5" cy="-7.5" r="5.2" opacity="0.32" />
          <circle cx="76.5" cy="-7.5" r="2.6" />
        </g>
      </g>
      <path fillRule="evenodd" d={`M20 34C21 19 34 8 52 8C67 8 79 15 85 27L87 31L73 33.5L89 38.5C87.5 49 74 57.5 55 57.5C38 57.5 23 49 20 36Z${eye(68, 20, 3.4)}`} />
      <circle cx="68.8" cy="20.3" r="1.5" />
      <path d="M84.6 31.2L83.3 34.6L82 31.6ZM80.2 31.9L79 35.2L77.7 32.4ZM86.8 37.7L85.4 34.3L84 37.2ZM82.2 36.5L80.9 33.6L79.5 36.1Z" />
      <path data-part="fin" fill="var(--detail)" d="M47 41C43 45 39 49 33.5 50.5C37 47 40 43.5 42 40Z" />
    </svg>
  );
}

function JellyfishArt() {
  return (
    <svg viewBox="0 0 60 120" {...svgProps}>
      <g data-part="oral" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" opacity="0.45">
        <path /><path /><path />
      </g>
      <g data-part="tentacles" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.75">
        <path /><path /><path /><path /><path /><path />
      </g>
      <g data-part="bell">
        <path opacity="0.82" d="M3 31C3 12.5 15 2 30 2C45 2 57 12.5 57 31C53.5 29 50.5 32.5 46.5 30.5C42.5 33 38.5 30 34 32C30 30 26 33 21.5 30.8C17.5 32.6 13.5 29.4 9.5 31.6C7 29.6 5 31.8 3 31Z" />
        <path opacity="0.35" d="M10 27C10.5 15.5 18.5 8 30 8C41.5 8 49.5 15.5 50 27C43 25.5 37 26.5 30 26.5C23 26.5 17 25.5 10 27Z" />
        <g fill="var(--detail)">
          <ellipse cx="22" cy="18.5" rx="3.3" ry="2.5" />
          <ellipse cx="27.5" cy="15.5" rx="3" ry="2.3" />
          <ellipse cx="32.5" cy="15.5" rx="3" ry="2.3" />
          <ellipse cx="38" cy="18.5" rx="3.3" ry="2.5" />
        </g>
        <path d="M13 15C15.5 10 20.5 6.8 26 6" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function OctopusArt() {
  return (
    <svg viewBox="0 0 80 110" {...svgProps}>
      <g data-part="arms">
        <path /><path /><path /><path /><path /><path /><path /><path />
      </g>
      <g data-part="mantle">
        <path fillRule="evenodd" d={`M40 3C55 3 64 15 64 29C64 39 59 46 53 50.5C48 53 32 53 27 50.5C21 46 16 39 16 29C16 15 25 3 40 3Z${eye(31.5, 40, 3.4)}${eye(48.5, 40, 3.4)}`} />
        <circle cx="31.8" cy="40.6" r="1.5" />
        <circle cx="48.2" cy="40.6" r="1.5" />
        <g fill="var(--detail)">
          <circle cx="33" cy="16" r="2.2" />
          <circle cx="44.5" cy="11.5" r="1.7" />
          <circle cx="50" cy="22" r="1.9" />
          <circle cx="27" cy="26" r="1.5" />
        </g>
      </g>
    </svg>
  );
}

function SquidArt() {
  return (
    <svg viewBox="0 0 160 56" {...svgProps}>
      <g data-part="arms">
        <path /><path /><path /><path /><path /><path /><path /><path /><path /><path />
      </g>
      <path fillRule="evenodd" d={`M60 20.5C55 19 49 19.5 45 21.5L44 26L45 31.5C49 33.5 55 34 60 32.5Z${eye(53, 24.5, 2.6)}`} />
      <circle cx="53.3" cy="24.8" r="1.1" />
      <g data-part="fins">
        <path d="M156 26.5C150 18 140 10.5 128 10C132 15 134 20 134.5 24.5Z" />
        <path d="M156 27.5C150 36 140 43.5 128 44C132 39 134 34 134.5 29.5Z" />
      </g>
      <path data-part="mantle" d="M158 27C150 20 130 16.5 104 17C86 17.3 72 18.5 59 20.2L59 32.8C72 34.5 86 35.7 104 36C130 36.5 150 33.5 158 27Z" />
      <path fill="none" stroke="var(--detail)" strokeWidth="0.9" strokeLinecap="round" d="M150 27C130 26.2 100 26.4 64 26.6" />
    </svg>
  );
}

function KrakenArt() {
  return (
    <>
      <div className="ocean-kraken-glow" />
      <svg viewBox="0 0 220 140" {...svgProps}>
        <g data-part="arms">
          <path /><path /><path /><path /><path /><path /><path /><path />
        </g>
        <path d="M216 52C216 24 192 6 162 7C134 8 114 26 108 48C105 60 107 74 113 84C122 94 138 99 154 98C182 96 206 82 213 66C215 61 216 57 216 52Z" />
        <g fill="var(--detail)">
          <circle cx="170" cy="30" r="5" />
          <circle cx="188" cy="46" r="3.5" />
          <circle cx="152" cy="22" r="3" />
          <circle cx="198" cy="64" r="4" />
          <circle cx="160" cy="50" r="2.5" />
        </g>
        <g data-part="eye" fill="var(--glow)">
          <circle cx="126" cy="76" r="13" opacity="0.16" />
          <circle cx="126" cy="76" r="7.5" opacity="0.34" />
          <circle cx="126" cy="76" r="4.6" />
        </g>
        <ellipse cx="126.4" cy="76" rx="1.2" ry="3.6" />
      </svg>
    </>
  );
}

// Distant giants: faint, slow background silhouettes that give the ocean its scale.
function WhaleArt() {
  return (
    <svg viewBox="0 0 240 96" {...svgProps}>
      <path data-part="far-flipper" opacity="0.6" d="M168 50C160 58 150 66 136 72C146 64 152 58 156 51Z" />
      <path data-part="fluke" d="M30 45L10 41.5C5 41 2 43 2 45.5C2 48 5 50 10 49.5L30 48.5Z" />
      <path fillRule="evenodd" d={`M236 42C231 31 215 24 196 22C160 18 122 21 90 28C66 33 46 39 32 43.5L26 45L26 48.5C42 52 64 56 92 58C126 61 162 62 192 58C213 55 230 50 236 44Z${eye(205, 38, 1.6)}`} />
      <path d="M100 27C103 22.5 107 20.5 111 21.2L109 26Z" />
      <path fill="none" stroke="var(--detail)" strokeWidth="1" strokeLinecap="round" d="M226 47C212 50.5 194 52.5 174 53.5M222 50C208 53 192 54.8 172 55.6" />
      <path data-part="flipper" d="M172 52C164 64 150 78 128 88C142 76 154 64 160 53Z" />
    </svg>
  );
}

function MantaArt() {
  return (
    <svg viewBox="0 0 160 96" {...svgProps}>
      <path d="M60 47.4L4 47.1L4 48.9L60 48.6Z" />
      <g data-part="wings">
        <path d="M104 42C95 26 76 10 46 3C57 16 64 30 66 42Z" />
        <path d="M104 54C95 70 76 86 46 93C57 80 64 66 66 54Z" />
      </g>
      <path d="M130 48C127 40 117 38.5 104 40.5L66 42.5C60 43.5 56 45.5 55 48C56 50.5 60 52.5 66 53.5L104 55.5C117 57.5 127 56 130 48Z" />
      <path d="M127 43C133 39.5 138 39.5 140 41.5C136 42.5 131 44 128 45.5ZM127 53C133 56.5 138 56.5 140 54.5C136 53.5 131 52 128 50.5Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------------------
// Poses: run every frame after the motion update, writing only SVG attributes.
// ---------------------------------------------------------------------------------------

const setT = (el, value) => el && el.setAttribute('transform', value);

// Side-on, a fish's tail sweeps toward and away from the viewer, so it foreshortens as
// much as it swings; mixing a small rotation with a squash reads as swimming.
function poseTail(c, pivotX, pivotY, amp) {
  const effort = Math.min(c.effort, 2.2);
  const swing = Math.sin(c.phase) * amp * (0.55 + 0.25 * effort);
  const squash = 0.78 + 0.22 * Math.cos(c.phase * 2);
  setT(c.parts.tail, around(pivotX, pivotY, swing, squash));
}

function jellyPose(c, env) {
  const { parts } = c;
  const squeeze = c.squeeze;
  setT(parts.bell, around(30, 14, 0, 1 - 0.17 * squeeze, 1 + 0.07 * squeeze));

  // Tentacles trail against the jelly's motion (in its own rotated frame) and straighten
  // while it is being pushed upward.
  const cos = Math.cos(c.angle);
  const sin = Math.sin(c.angle);
  const lateral = clampUnit((c.vx * cos + c.vy * sin) / 45);
  const rising = Math.max(0, -(-c.vx * sin + c.vy * cos) / 70);
  const sway = (0.45 + 0.55 * (1 - squeeze)) / (1 + rising);
  const t = env.t;

  c.tentacles.forEach((tt, i) => {
    const rootX = 30 + (tt.x - 30) * (1 - 0.17 * squeeze);
    const length = tt.length * (1 + 0.08 * squeeze + Math.min(rising, 0.6) * 0.2);
    const pts = [];
    for (let k = 0; k <= 6; k++) {
      const s = k / 6;
      pts.push(
        rootX + Math.sin(t * tt.speed + tt.seed - s * 3.2) * (1.5 + 7 * s) * sway - lateral * s * s * 14,
        tt.y + s * length
      );
    }
    parts.tentacles[i].setAttribute('d', smoothLine(pts));
  });
}

function armPose(c, env, arms, rootFor, headingFor, curveFor, widthFor) {
  c.arms.forEach((arm, i) => {
    const [x, y] = rootFor(arm, i);
    arms[i].setAttribute(
      'd',
      limbPath(x, y, headingFor(arm, i), arm.length, arm.segments, (s) => curveFor(arm, s, env.t), (s) => widthFor(arm, s))
    );
  });
}

const taper = (base, tip = 0.7, power = 0.9) => (arm, s) => base * arm.width * Math.pow(1 - s, power) + tip;

// ---------------------------------------------------------------------------------------
// Species table
// ---------------------------------------------------------------------------------------

export const SPECIES = {
  'small-fish': {
    Art: SmallFishArt,
    size: [64, 28],
    motion: 'swim',
    swim: { cruise: 58, max: 320, accel: 240, vertical: 0.32, wander: 0.9, turn: 3.4, beat: 2.6, flee: 120, wiggle: 2.5, eats: true },
    pose(c) {
      poseTail(c, 17, 14, 18);
    },
  },

  'tropical-fish': {
    Art: TropicalFishArt,
    size: [60, 50],
    motion: 'swim',
    swim: { cruise: 34, max: 240, accel: 160, vertical: 0.4, wander: 1.1, turn: 3, beat: 2.2, flee: 130, hover: 0.12, wiggle: 1.5, eats: true },
    pose(c) {
      poseTail(c, 20, 25, 16);
      // Reef fish scull with their pectoral fins, hardest when hovering.
      const scull = 34 - 22 * Math.min(c.effort, 1.5) / 1.5;
      setT(c.parts.fin, around(40, 27.5, Math.sin(c.finPhase) * scull));
    },
  },

  shark: {
    Art: SharkArt,
    size: [128, 48],
    motion: 'swim',
    swim: { cruise: 44, max: 150, accel: 60, vertical: 0.22, wander: 0.45, turn: 1.1, beat: 1.1, curious: [150, 380], wiggle: 1 },
    pose(c) {
      poseTail(c, 21, 25, 14);
      setT(c.parts.fin, around(88, 30.5, Math.sin(c.phase * 0.5) * 4));
    },
  },

  'sea-turtle': {
    Art: TurtleArt,
    size: [100, 66],
    motion: 'swim',
    swim: { cruise: 26, max: 110, accel: 45, vertical: 0.3, wander: 0.5, turn: 0.9, beat: 0.5, flee: 110, stroke: true, eats: true },
    pose(c) {
      const { parts } = c;
      setT(parts.flipper, around(70, 35.5, -8 + 36 * Math.sin(c.phase)));
      setT(parts['far-flipper'], around(69, 34.5, -12 + 34 * Math.sin(c.phase - 0.4)));
      setT(parts['rear-flipper'], around(26, 36.5, 12 * Math.sin(c.phase + 1.6)));
    },
  },

  anglerfish: {
    Art: AnglerfishArt,
    size: [94, 80],
    motion: 'swim',
    swim: { cruise: 16, max: 90, accel: 40, vertical: 0.35, wander: 0.6, turn: 1.3, beat: 1.2, curious: [110, 320], hover: 0.2, wiggle: 1.2 },
    pose(c, env) {
      poseTail(c, 21, 35, 12);
      setT(c.parts.fin, around(45, 41, Math.sin(c.finPhase) * 22));
      setT(c.parts.lure, around(58, 8.5, Math.sin(env.t * 1.1 + c.seed) * 5));
      const glow = 0.55 + 0.2 * Math.sin(env.t * 2.3 + c.seed) + 0.3 * c.interest;
      c.parts.glow.setAttribute('opacity', Math.min(glow, 1).toFixed(2));
    },
  },

  jellyfish: {
    Art: JellyfishArt,
    size: [60, 120],
    origin: [0.5, 0.15],
    motion: 'pulse',
    // rest: how fast it sinks between pulses when resting; lean: tilt toward where it's going.
    pulse: { period: 2.9, contract: 0.3, thrust: 170, sink: 7, rest: 26, lean: 0.5, drag: 1.6, drift: 10, tilt: 0.3, shy: 95, push: 160 },
    setup(c) {
      c.tentacles = [7, 15, 23, 37, 45, 53].map((x) => ({
        x,
        y: 30,
        length: rand(55, 80),
        speed: rand(1.3, 1.9),
        seed: rand(0, TAU),
      }));
      c.orals = [26, 30, 34].map((x) => ({ x, y: 27, length: rand(34, 46), speed: rand(0.9, 1.3), seed: rand(0, TAU) }));
    },
    pose(c, env) {
      jellyPose(c, env);
      const t = env.t;
      const squeeze = c.squeeze;
      c.orals.forEach((o, i) => {
        const pts = [];
        for (let k = 0; k <= 5; k++) {
          const s = k / 5;
          pts.push(o.x + Math.sin(t * o.speed + o.seed - s * 2.6) * (1 + 4 * s) * (1 - 0.4 * squeeze), o.y + s * o.length);
        }
        c.parts.oral[i].setAttribute('d', smoothLine(pts));
      });
    },
  },

  octopus: {
    Art: OctopusArt,
    size: [80, 110],
    origin: [0.5, 0.3],
    motion: 'pulse',
    pulse: { period: 4.2, contract: 0.22, thrust: 260, sink: 12, rest: 30, lean: 0.45, drag: 1.3, drift: 12, tilt: 0.55, shy: 120, push: 220 },
    setup(c) {
      c.arms = [25, 29.5, 34, 38, 42, 46, 50.5, 55].map((x, i) => ({
        x,
        spread: ((i - 3.5) / 3.5) * 0.95,
        side: i < 4 ? -1 : 1,
        length: rand(40, 50),
        width: rand(0.9, 1.1),
        segments: 12,
        seed: rand(0, TAU),
      }));
    },
    pose(c, env) {
      const relax = 1 - c.squeeze;
      setT(c.parts.mantle, around(40, 28, 0, 1 - 0.1 * c.squeeze, 1 + 0.08 * c.squeeze));
      armPose(
        c,
        env,
        c.parts.arms,
        (arm) => [40 + (arm.x - 40) * (0.8 + 0.2 * relax), 48],
        // Angles are in SVG space (y down): arms fan out from straight down and the tips
        // curl outward, away from the body.
        (arm) => Math.PI / 2 - arm.spread * (0.25 + 0.75 * relax),
        (arm, s, t) => -arm.side * 0.06 * s * s * relax + Math.sin(t * 2.2 + arm.seed - s * 5) * 0.022,
        taper(10, 0.9, 1.1)
      );
    },
  },

  'giant-squid': {
    Art: SquidArt,
    size: [160, 56],
    motion: 'swim',
    swim: { cruise: 30, max: 260, accel: 70, vertical: 0.28, wander: 0.5, turn: 1.8, beat: 1.4, flee: 150, jet: [2.5, 5] },
    setup(c) {
      const arms = [22.5, 23.6, 24.6, 25.6, 26.6, 27.6, 28.6, 29.8].map((y) => ({
        y,
        length: rand(32, 42),
        width: rand(0.9, 1.1),
        segments: 9,
        seed: rand(0, TAU),
        tentacle: false,
      }));
      const tentacles = [25.4, 27.2].map((y) => ({ y, length: rand(86, 98), width: 1, segments: 14, seed: rand(0, TAU), tentacle: true }));
      c.arms = [...tentacles, ...arms];
    },
    pose(c, env) {
      const { parts } = c;
      const t = env.t;
      setT(parts.fins, around(136, 27, 0, 1, 0.72 + 0.3 * Math.sin(t * 4.5 + c.seed)));
      setT(parts.mantle, around(110, 27, 0, 1 + 0.03 * c.jetting, 1 - 0.13 * c.jetting));
      const spread = c.spread;
      armPose(
        c,
        env,
        parts.arms,
        (arm) => [45.5, 26.2 + (arm.y - 26.2) * (0.6 + 0.4 * spread)],
        (arm) => Math.PI - (arm.y - 26.2) * 0.06 * spread,
        (arm, s) => Math.sin(t * 2.6 + arm.seed - s * 4) * (arm.tentacle ? 0.012 : 0.03) * (0.35 + 0.65 * spread),
        (arm, s) =>
          arm.tentacle
            ? 2.2 * (1 - s) + 0.6 + (s > 0.84 ? 3.2 * Math.sin(((s - 0.84) / 0.16) * Math.PI) : 0)
            : 4.8 * arm.width * Math.pow(1 - s, 0.9) + 0.6
      );
    },
  },

  kraken: {
    Art: KrakenArt,
    size: [220, 140],
    motion: 'cross',
    // margin: the glow (index.css .ocean-kraken-glow) reaches 20% past the box, arms a bit more.
    cross: { speed: [30, 40], firstWait: [2, 4], wait: [8, 18], margin: 0.25 },
    setup(c) {
      c.arms = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
        root: [110 + i * 2.2, 80 + i * 2.2],
        heading: Math.PI + 0.35 - i * 0.11,
        side: i % 2 ? 1 : -1,
        length: rand(118, 150),
        width: rand(0.9, 1.1),
        segments: 16,
        seed: rand(0, TAU),
      }));
    },
    pose(c, env) {
      // The kraken is large, so its arms are only redrawn at ~30fps.
      c.oddFrame = !c.oddFrame;
      if (c.oddFrame) return;
      c.parts.eye.setAttribute('opacity', (0.75 + 0.25 * Math.sin(env.t * 1.3)).toFixed(2));
      armPose(
        c,
        env,
        c.parts.arms,
        (arm) => arm.root,
        (arm) => arm.heading,
        (arm, s, t) => Math.sin(t * 0.9 + arm.seed - s * 3.5) * 0.012 + arm.side * s * s * s * 0.03,
        taper(15, 1.2)
      );
    },
  },

  whale: {
    Art: WhaleArt,
    size: [240, 96],
    motion: 'cross',
    // Shows up soon after the section comes into view, then only every minute or so.
    cross: { speed: [18, 24], firstWait: [3, 7], wait: [60, 90], beat: 0.3 },
    pose(c) {
      // Whales beat their flukes up and down, which is exactly what a side view shows.
      setT(c.parts.fluke, around(28, 47, Math.sin(c.phase) * 13));
      setT(c.parts.flipper, around(166, 52, Math.sin(c.phase * 0.5) * 5));
      setT(c.parts['far-flipper'], around(162, 50, Math.sin(c.phase * 0.5 + 0.6) * 5));
    },
  },

  manta: {
    Art: MantaArt,
    size: [160, 96],
    motion: 'cross',
    cross: { speed: [26, 34], firstWait: [5, 10], wait: [45, 70], beat: 0.32 },
    pose(c) {
      setT(c.parts.wings, around(80, 48, 0, 1, 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(c.phase))));
    },
  },
};
