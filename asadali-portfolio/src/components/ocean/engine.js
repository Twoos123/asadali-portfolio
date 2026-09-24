import { SPECIES } from './species';
import { retainPointer, releasePointer, readPointer, readScrollSpeed, readTaps } from './pointer';
import { runWhileVisible } from './ticker';

// A tiny steering-behaviour simulation for one ocean layer. Creatures are plain DOM nodes
// moved with composited transforms; only their small SVG parts repaint. The loop runs only
// while the layer is on screen, and not at all for prefers-reduced-motion.

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const rand = (min, max) => min + Math.random() * (max - min);
const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);
const approach = (current, target, rate, dt) => current + (target - current) * (1 - Math.exp(-rate * dt));

// Smooth pseudo-noise in [0, 1]: a few incommensurate sines are enough to keep speeds and
// headings from looking metronomic.
const drift = (t, seed) =>
  0.5 + (Math.sin(t * 0.63 + seed) + 0.6 * Math.sin(t * 1.37 + seed * 2.1) + 0.8 * Math.sin(t * 0.23 + seed * 3.7)) / 4.8;

const LIST_PARTS = new Set(['tentacles', 'oral', 'arms']);

function collectParts(el) {
  const parts = {};
  el.querySelectorAll('[data-part]').forEach((node) => {
    const name = node.getAttribute('data-part');
    parts[name] = LIST_PARTS.has(name) ? Array.from(node.children) : node;
  });
  return parts;
}

const bandOf = (spec, env) => [spec.band[0] * env.H, spec.band[1] * env.H];

// ---------------------------------------------------------------------------------------
// Creatures
// ---------------------------------------------------------------------------------------

function createCreature(spec, el) {
  const species = SPECIES[spec.species];
  const [w, h] = species.size;
  const c = {
    el,
    spec,
    species,
    parts: collectParts(el),
    w: w * spec.scale,
    h: h * spec.scale,
    origin: species.origin || [0.5, 0.5],
    x: -1e4,
    y: 0,
    vx: 0,
    vy: 0,
    dir: 0,
    seed: rand(0, 100),
    phase: rand(0, TAU),
    finPhase: rand(0, TAU),
    heading: 0,
    speed: 0,
    turning: 0,
    turnSide: 0,
    roll: 1,
    upright: 1,
    face: 1,
    pitch: 0,
    effort: 1,
    full: 0,
    startle: 0,
    interest: 0,
    hover: 0,
    // drifters
    angle: rand(-0.2, 0.2),
    cycle: rand(0, 1),
    period: species.pulse ? species.pulse.period * rand(0.85, 1.2) : 1,
    squeeze: 0,
    skip: false,
    // squid jets
    jetTimer: rand(1, 4),
    jetting: 0,
    spread: 1,
    // kraken
    state: 'wait',
    timer: species.cross ? rand(...species.cross.firstWait) : 0,
  };
  el.style.transformOrigin = `${c.origin[0] * 100}% ${c.origin[1] * 100}%`;
  if (species.setup) species.setup(c);
  return c;
}

function placeCreature(c, env, near) {
  if (c.species.motion === 'cross') return;
  const [top, bottom] = bandOf(c.spec, env);
  if (near) {
    c.x = near.x + rand(-45, 45);
    c.y = clamp(near.y + rand(-22, 22), top, bottom);
    c.dir = near.dir;
  } else {
    c.x = rand(0.06, 0.94) * env.W;
    c.y = rand(top, bottom);
    c.dir = Math.random() < 0.5 ? 0 : Math.PI;
  }
  const swim = c.species.swim;
  if (swim) {
    c.heading = c.dir;
    c.speed = swim.cruise * 0.6;
    c.roll = c.upright = Math.cos(c.dir) >= 0 ? 1 : -1;
  }
}

// Heading intent for a lone swimmer or a whole school: a slowly drifting turn rate, pulled
// back toward level so courses stay mostly horizontal, and reflected at the edges.
function wander(o, x, y, dt, env, swim, top, bottom, margin) {
  o.dir += (drift(env.t * 0.5, o.seed) - 0.5) * 2 * swim.wander * dt;
  const cos = Math.cos(o.dir);
  o.dir = approach(o.dir, cos >= 0 ? Math.round(o.dir / TAU) * TAU : Math.round((o.dir - Math.PI) / TAU) * TAU + Math.PI, 0.6, dt);

  const heading = Math.cos(o.dir);
  if ((x < -margin && heading < 0) || (x > env.W + margin && heading > 0)) {
    o.dir = Math.PI - o.dir;
  } else if (((x < env.W * 0.06 && heading < 0) || (x > env.W * 0.94 && heading > 0)) && Math.random() < 0.35 * dt) {
    // Sometimes turn back before leaving the view, sometimes swim out and return.
    o.dir = Math.PI - o.dir;
  }
  const climb = Math.sin(o.dir);
  if ((y < top && climb < 0) || (y > bottom && climb > 0)) o.dir = -o.dir;
}

function updateSchool(school, dt, env) {
  let cx = 0;
  let cy = 0;
  let vx = 0;
  let vy = 0;
  for (const m of school.members) {
    cx += m.x;
    cy += m.y;
    vx += m.vx;
    vy += m.vy;
  }
  const n = school.members.length;
  school.x = cx / n;
  school.y = cy / n;
  school.vx = vx / n;
  school.vy = vy / n;

  if (school.parade) {
    if (school.x > env.W + 260) parkSchool(school);
    return;
  }

  const lead = school.members[0];
  const [top, bottom] = bandOf(lead.spec, env);
  wander(school, school.x, school.y, dt, env, lead.species.swim, top, bottom, lead.w * 2);

  for (const tap of env.taps) {
    if (Math.hypot(school.x - tap.x, school.y - tap.y) < 280) {
      school.dir = school.x >= tap.x ? 0 : Math.PI;
    }
  }
}

function parkSchool(school) {
  school.dormant = true;
  school.parade = false;
  for (const m of school.members) {
    m.x = -1e4;
    m.el.style.transform = 'translate3d(-10000px,0,0)';
  }
}

// Nearest flake of food this fish can see, if it isn't still full from the last one.
function findMeal(c, env) {
  if (!env.food || c.full > 0) return null;
  let best = 340;
  let meal = null;
  for (const f of env.food) {
    if (f.life <= 0.6 || f.age < 0.5) continue;
    const d = Math.hypot(f.x - c.x, f.y - c.y);
    if (d < best) {
      best = d;
      meal = f;
    }
  }
  return meal;
}

function updateSwim(c, dt, env) {
  const p = c.species.swim;
  const school = c.school;
  const [top, bottom] = bandOf(c.spec, env);
  if (!school) wander(c, c.x, c.y, dt, env, p, top, bottom, c.w);
  const guide = school || c;
  if (school?.parade) c.startle = Math.max(c.startle, 0.5);
  c.full = Math.max(0, c.full - dt);

  let speed = p.cruise * (0.7 + 0.6 * drift(env.t * 0.8, c.seed + 5));
  if (p.hover) {
    if (c.hover > 0) {
      c.hover -= dt;
      speed *= 0.12;
    } else if (Math.random() < p.hover * dt) {
      c.hover = rand(1.2, 3);
    }
  }
  // Turtles surge on each downstroke of their front flippers, then glide.
  if (p.stroke) speed *= 0.6 + 0.8 * Math.max(0, Math.sin(c.phase - 0.6));
  // A celebration parade dashes across rather than cruising.
  if (school?.parade) speed *= 3.5;

  let dx = Math.cos(guide.dir) * speed;
  let dy = Math.sin(guide.dir) * speed * p.vertical;

  // Food in the water beats everything but fear: break away from the school and go eat.
  const meal = p.eats ? findMeal(c, env) : null;
  if (meal) {
    const ox = meal.x - c.x;
    const oy = meal.y - c.y;
    const d = Math.hypot(ox, oy) || 1;
    dx = (ox / d) * p.cruise * 1.7;
    dy = (oy / d) * p.cruise * 1.7;
  } else if (school) {
    dx += (school.x - c.x) * 0.6 + (school.vx - c.vx) * 0.4;
    dy += (school.y - c.y) * 0.6 + (school.vy - c.vy) * 0.4;
    const room = c.w * 0.85;
    for (const other of school.members) {
      if (other === c) continue;
      const ox = c.x - other.x;
      const oy = c.y - other.y;
      const d = Math.hypot(ox, oy);
      if (d < room && d > 0.01) {
        const k = ((room - d) / room) * p.cruise * 2.2;
        dx += (ox / d) * k;
        dy += (oy / d) * k;
      }
    }
  }

  // Chasing food may take a fish out of its usual depth.
  const pad = c.h * 0.6;
  if (!meal && c.y < top + pad) dy += (top + pad - c.y) * 2;
  else if (!meal && c.y > bottom - pad) dy -= (c.y - bottom + pad) * 2;

  const ptr = env.pointer;
  if (ptr.active) {
    const ox = c.x - ptr.x;
    const oy = c.y - ptr.y;
    const d = Math.hypot(ox, oy) || 1;
    if (p.flee) {
      // A resting cursor lets fish come fairly close; a sweeping one scatters them.
      const reach = p.flee * (0.55 + Math.min(ptr.speed / 600, 1.5));
      if (d < reach) {
        const k = 1 - d / reach;
        dx += (ox / d) * p.max * k * 1.5;
        dy += (oy / d) * p.max * k * 1.5;
        c.startle = Math.max(c.startle, k * (0.5 + Math.min(ptr.speed / 1200, 0.5)));
      }
    } else if (p.curious) {
      // Predators drift in to investigate, then keep a respectful distance.
      const [near, far] = p.curious;
      if (d < far) {
        const pull = d > near ? (d - near) / (far - near) : -(1 - d / near) * 1.6;
        dx -= (ox / d) * p.cruise * pull;
        dy -= (oy / d) * p.cruise * pull * 0.6;
        c.interest = approach(c.interest, 1, 1.5, dt);
      } else {
        c.interest = approach(c.interest, 0, 0.6, dt);
      }
    }
  } else {
    c.interest = approach(c.interest, 0, 0.6, dt);
  }

  for (const tap of env.taps) {
    const ox = c.x - tap.x;
    const oy = c.y - tap.y;
    const d = Math.hypot(ox, oy) || 1;
    if (d < 170) {
      const k = 1 - d / 170;
      dx += (ox / d) * p.max * k * 2;
      dy += (oy / d) * p.max * k;
      c.speed = Math.max(c.speed, p.max * k);
      c.startle = Math.max(c.startle, 0.5 + k * 0.5);
      if (!school) c.dir = ox >= 0 ? 0 : Math.PI;
    }
  }

  if (p.jet) {
    c.jetTimer -= dt;
    if (c.jetTimer <= 0 || (c.startle > 0.45 && c.jetting < 0.05)) {
      c.speed += p.max * 0.75;
      c.jetting = 1;
      c.spread = 0;
      c.jetTimer = rand(p.jet[0], p.jet[1]);
    }
    c.jetting = Math.max(0, c.jetting - dt * 1.8);
    c.spread = approach(c.spread, 1, 0.9, dt);
  }

  // A fish that bolts lets out a couple of bubbles.
  c.bubbleCooldown = Math.max(0, (c.bubbleCooldown || 0) - dt);
  if (c.startle > 0.55 && c.bubbleCooldown === 0) {
    env.emit(c.x + Math.cos(c.heading) * c.w * 0.4, c.y + Math.sin(c.heading) * c.w * 0.4, 2, 10);
    c.bubbleCooldown = 1.5;
  }

  c.startle = Math.max(0, c.startle - dt * 0.8);
  const topSpeed = p.cruise * 1.5 + (p.max - p.cruise * 1.5) * Math.max(c.startle, c.jetting);
  const accel = p.accel * (1 + 3 * c.startle);

  // Keep courses from getting steeper than a gentle climb or dive (unless chasing food).
  if (!meal) {
    const maxRise = Math.abs(dx) * 1.2 + p.cruise * 0.1;
    dy = clamp(dy, -maxRise, maxRise);
  }

  // Steer the heading round instead of reversing the velocity: a fish that changes
  // direction swims a small curved U-turn rather than stopping and flipping in place.
  let delta = Math.atan2(dy, dx) - c.heading;
  delta -= Math.round(delta / TAU) * TAU;
  if (Math.abs(delta) > 2.7) {
    // Near-reversal: commit to turning over the top or underneath (toward the middle of
    // its depth band) rather than dithering between the two.
    if (!c.turnSide) c.turnSide = (c.y > (top + bottom) / 2) === (Math.cos(c.heading) >= 0) ? -1 : 1;
    if (Math.sign(delta) !== c.turnSide) delta += c.turnSide * TAU;
  } else if (Math.abs(delta) < 1) {
    c.turnSide = 0;
  }
  const maxTurn = p.turn * (1 + 2.5 * c.startle) * dt;
  const turn = clamp(delta, -maxTurn, maxTurn);
  c.heading += turn;
  c.turning = approach(c.turning, Math.abs(turn) / dt, 8, dt);

  // Ease off through tight turns so the arc stays small, but keep moving.
  const sharpness = Math.min(Math.abs(delta) / Math.PI, 1);
  const want = Math.min(Math.hypot(dx, dy), topSpeed) * (1 - 0.4 * sharpness);
  c.speed += clamp(want - c.speed, -accel * dt, accel * dt);
  c.speed = clamp(c.speed, sharpness > 0.3 ? p.cruise * 0.35 : 0, topSpeed);

  c.vx = Math.cos(c.heading) * c.speed;
  c.vy = Math.sin(c.heading) * c.speed;
  c.x += c.vx * dt;
  c.y = meal ? c.y + c.vy * dt : clamp(c.y + c.vy * dt, top - c.h, bottom + c.h);

  if (meal) {
    const mouthX = c.x + Math.cos(c.heading) * c.w * 0.42;
    const mouthY = c.y + Math.sin(c.heading) * c.w * 0.42;
    if (Math.hypot(meal.x - mouthX, meal.y - mouthY) < Math.max(8, c.h * 0.5)) {
      meal.life = 0;
      c.full = rand(3, 6);
      env.emit(mouthX, mouthY, 1, 4);
    }
  }

  // Roll over as the body passes vertical so the dorsal fin ends up on top again.
  const side = Math.cos(c.heading);
  if (side > 0.12) c.upright = 1;
  else if (side < -0.12) c.upright = -1;
  const rollStep = (dt / 0.14) * 2;
  c.roll = c.upright > c.roll ? Math.min(c.upright, c.roll + rollStep) : Math.max(c.upright, c.roll - rollStep);

  c.effort = clamp(c.speed / p.cruise + c.turning * 0.35, 0.2, 3.5);
  c.phase += TAU * p.beat * (0.5 + 0.5 * c.effort) * dt;
  c.finPhase += TAU * 1.6 * dt;
}

// Jellyfish and octopus: contract to push off, then relax and slowly sink.
function updatePulse(c, dt, env) {
  const p = c.species.pulse;
  const [top, bottom] = bandOf(c.spec, env);

  c.cycle += dt / c.period;
  if (c.cycle >= 1) {
    c.cycle %= 1;
    const depth = (c.y - top) / Math.max(bottom - top, 1);
    c.period = p.period * rand(0.85, 1.2) * (depth < 0.2 ? 1.6 : depth > 0.8 ? 0.75 : 1);
    c.skip = c.y < top;
  }

  const k = p.contract;
  const u = c.cycle;
  c.squeeze = u < k ? Math.sin((u / k) * (Math.PI / 2)) : 0.5 + 0.5 * Math.cos(((u - k) / (1 - k)) * Math.PI);
  if (u < k && !c.skip) {
    const thrust = p.thrust * Math.sin((u / k) * Math.PI);
    c.vx += Math.sin(c.angle) * thrust * dt;
    c.vy -= Math.cos(c.angle) * thrust * dt;
  }
  c.vy += p.sink * dt;
  c.vx += (drift(env.t * 0.3, c.seed) - 0.5) * p.drift * dt;

  let tilt = (drift(env.t * 0.25, c.seed * 1.7) - 0.5) * 2 * p.tilt;
  if (c.x < env.W * 0.08) tilt += 0.4;
  else if (c.x > env.W * 0.92) tilt -= 0.4;
  if (c.y > bottom) tilt *= 0.3;

  const ptr = env.pointer;
  if (ptr.active) {
    const ox = c.x - ptr.x;
    const oy = c.y - ptr.y;
    const d = Math.hypot(ox, oy) || 1;
    const reach = p.shy * (0.8 + Math.min(ptr.speed / 900, 1));
    if (d < reach) {
      const kk = 1 - d / reach;
      c.vx += (ox / d) * p.push * kk * dt;
      c.vy += (oy / d) * p.push * kk * dt;
      tilt += (ox / d) * 0.6 * kk;
      // Startled drifters pulse early to get away.
      if (kk > 0.35 && c.cycle > 0.55) {
        c.cycle = 0;
        c.skip = false;
      }
    }
  }
  for (const tap of env.taps) {
    const ox = c.x - tap.x;
    const oy = c.y - tap.y;
    const d = Math.hypot(ox, oy) || 1;
    if (d < 220) {
      c.vx += (ox / d) * 50 * (1 - d / 220);
      if (c.cycle > 0.4) c.cycle = 0;
    }
  }

  const drag = Math.exp(-p.drag * dt);
  c.vx *= drag;
  c.vy *= drag;
  c.angle = approach(c.angle, clamp(tilt, -0.75, 0.75), 1.4, dt);
  c.x = clamp(c.x + c.vx * dt, -c.w, env.W + c.w);
  c.y = clamp(c.y + c.vy * dt, top - c.h * 0.5, bottom + c.h * 0.5);
}

// The kraken and the distant giants: long, slow crossings with a rest off-screen between.
function updateCross(c, dt, env) {
  const cfg = c.species.cross;
  const [top, bottom] = bandOf(c.spec, env);
  c.phase += TAU * (cfg.beat || 0.3) * dt;
  if (c.state === 'wait') {
    c.timer -= dt;
    c.x = -c.w * 2;
    if (c.timer > 0) return;
    c.state = 'cross';
    c.face = Math.random() < 0.65 ? -1 : 1;
    c.x = c.face < 0 ? env.W + c.w * 0.6 : -c.w * 0.6;
    c.y0 = rand(top, bottom);
    c.rise = rand(-0.1, 0.1) * env.H;
    c.speed = rand(...cfg.speed);
    c.distance = env.W + c.w * 1.2;
    c.traveled = 0;
  }
  const step = c.speed * dt;
  const previousY = c.y;
  c.traveled += step;
  c.x += c.face * step;
  c.y = c.y0 + Math.sin((c.traveled / c.distance) * Math.PI) * c.rise + Math.sin(env.t * 0.4 + c.seed) * 6;
  // Stay wholly inside the section: its layer clips at the section's edges, so anything past
  // them (the kraken's glow, a curling arm) would be cut off along a hard line. `margin` is
  // how far, as a share of the height, the creature's art reaches beyond its box.
  const reach = c.h * (cfg.margin || 0);
  const minY = c.h * c.origin[1] + reach;
  const maxY = env.H - c.h * (1 - c.origin[1]) - reach;
  c.y = minY <= maxY ? clamp(c.y, minY, maxY) : env.H / 2;
  c.pitch = clamp(Math.atan2((c.y - previousY) / Math.max(dt, 1e-3), c.speed), -0.25, 0.25);
  if (c.traveled >= c.distance) {
    c.state = 'wait';
    c.timer = rand(...cfg.wait);
  }
}

const UPDATE = { swim: updateSwim, pulse: updatePulse, cross: updateCross };

function renderCreature(c, env) {
  const tx = c.x - c.w * c.origin[0];
  const ty = c.y - c.h * c.origin[1];
  let orient;
  if (c.species.motion === 'pulse') {
    orient = `rotate(${c.angle.toFixed(4)}rad)`;
  } else if (c.species.motion === 'swim') {
    // Point along the path, mirrored when heading left so the fish stays upright. The
    // roll never quite reaches zero, so the brief mid-turn roll doesn't read as a flat card.
    const wiggle = (c.species.swim.wiggle || 0) * DEG * Math.sin(c.phase + 1.2) * Math.min(c.effort, 2) * 0.5;
    const roll = c.roll >= 0 ? Math.max(c.roll, 0.3) : Math.min(c.roll, -0.3);
    orient = `rotate(${(c.heading + wiggle).toFixed(4)}rad) scaleY(${roll.toFixed(3)})`;
  } else {
    orient = `rotate(${(c.pitch * c.face).toFixed(4)}rad) scaleX(${c.face})`;
  }
  c.el.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) ${orient}`;
  c.species.pose(c, env);
}

// ---------------------------------------------------------------------------------------
// Bubbles
// ---------------------------------------------------------------------------------------

function resetBubble(b, env, anywhere) {
  const [top, bottom] = bandOf(b, env);
  b.x0 = rand(0.03, 0.97) * env.W;
  b.y = anywhere ? rand(top, bottom) : bottom + b.size;
  b.speed = (18 + b.size * 4.5) * rand(0.8, 1.25);
  b.amp = rand(1.5, 4) + b.size * 0.35;
  b.freq = rand(1.4, 2.6);
  b.seed = rand(0, TAU);
  b.delay = anywhere ? 0 : rand(0, 4);
}

function updateBubble(b, dt, env) {
  if (b.delay > 0) {
    b.delay -= dt;
    b.alpha = 0;
    return;
  }
  const [top, bottom] = bandOf(b, env);
  b.y -= (b.speed + env.scrollV * 0.12) * dt;
  b.stretch = 1 + Math.min(Math.abs(env.scrollV) / 1400, 0.7);
  const ptr = env.pointer;
  if (ptr.active) {
    const ox = b.x - ptr.x;
    const d = Math.hypot(ox, b.y - ptr.y);
    if (d < 70) b.x0 += Math.sign(ox || 1) * (1 - d / 70) * 90 * dt;
  }
  b.x = b.x0 + Math.sin(env.t * b.freq + b.seed) * b.amp;
  const life = clamp((bottom - b.y) / Math.max(bottom - top, 1), 0, 1);
  b.alpha = Math.min(1, life * 10, (1 - life) * 8);
  b.grow = 0.7 + 0.45 * life;
  if (b.y < top) resetBubble(b, env, false);
  else if (b.y > bottom + b.size * 2) b.y = bottom;
}

function renderBubble(b) {
  b.el.style.transform = `translate3d(${(b.x - b.size / 2).toFixed(1)}px,${(b.y - b.size / 2).toFixed(1)}px,0) scale(${b.grow.toFixed(3)},${(b.grow * (b.stretch || 1)).toFixed(3)})`;
  b.el.style.opacity = b.alpha.toFixed(2);
}

// Short-lived bubbles released by clicks and startled fish, drawn from a fixed pool.
function spawnBurst(pool, x, y, count, spread) {
  let spawned = 0;
  for (const p of pool) {
    if (p.life > 0) continue;
    p.x = x + rand(-spread, spread) * 0.3;
    p.y = y;
    p.vx = rand(-1, 1) * spread;
    p.vy = -rand(50, 130);
    p.life = p.maxLife = rand(1.1, 1.9);
    p.seed = rand(0, TAU);
    p.age = 0;
    p.passedUp = false;
    p.adoptedAt = -1;
    if (++spawned >= count) break;
  }
}

function updateBurst(p, dt) {
  if (p.life <= 0) return;
  p.life -= dt;
  p.age += dt;
  p.vy -= 40 * dt;
  p.vx *= Math.exp(-2.5 * dt);
  // Wobble on the bubble's own clock, so a copy handed to the section above stays in step.
  p.x += (p.vx + Math.sin(p.age * 9 + p.seed) * 12) * dt;
  p.y += p.vy * dt;
}

// Each section's layer clips at its edges, so a bubble rising out of the top of one would
// vanish mid-water. Instead the section above takes over an identical copy: while the
// bubble straddles the edge both sections draw it (each showing its own half), then the
// lower one lets it go. Running sections register here with their size this frame.
const liveSims = new Set();

function passBurstUp(from, p, now) {
  const x = from.rect.left + p.x;
  const y = from.rect.top + p.y;
  for (const sim of liveSims) {
    const r = sim.rect;
    if (sim === from || sim.frame !== now || !r) continue;
    if (x >= r.left && x <= r.right && r.top <= from.rect.top - 1 && r.bottom >= from.rect.top - 4) {
      sim.adopt(p, x - r.left, y - r.top, now);
      return;
    }
  }
}

function renderBurst(p) {
  const k = clamp(p.life / (p.maxLife || 1), 0, 1);
  if (k === 0) {
    if (p.shown) p.el.style.opacity = '0';
    p.shown = false;
    return;
  }
  p.shown = true;
  p.el.style.transform = `translate3d(${(p.x - p.size / 2).toFixed(1)}px,${(p.y - p.size / 2).toFixed(1)}px,0) scale(${(1.15 - 0.4 * k).toFixed(3)})`;
  p.el.style.opacity = (Math.min(1, k * 2.5) * 0.9).toFixed(2);
}

// ---------------------------------------------------------------------------------------
// Food: flakes dropped by clicking, which slowly sink until something eats them.
// ---------------------------------------------------------------------------------------

function spawnFood(pool, x, y) {
  let spawned = 0;
  for (const f of pool) {
    if (f.life > 0) continue;
    f.x = x + rand(-20, 20);
    f.y = y + rand(-8, 8);
    f.vx = rand(-14, 14);
    f.vy = rand(-12, 4);
    f.sink = rand(12, 22);
    f.life = 14;
    f.age = 0;
    f.spin = rand(0, 360);
    f.spinRate = rand(-90, 90);
    f.seed = rand(0, TAU);
    if (++spawned >= 5) break;
  }
}

function updateFood(f, dt, env) {
  if (f.life <= 0) return;
  f.age += dt;
  f.life -= dt;
  f.vy = approach(f.vy, f.sink, 1.5, dt);
  f.vx *= Math.exp(-1.2 * dt);
  f.x += (f.vx + Math.sin(env.t * 1.7 + f.seed) * 6) * dt;
  f.y += f.vy * dt;
  f.spin += f.spinRate * dt;
  // Uneaten flakes settle near the bottom and fade.
  if (f.y > env.H - 40) f.life = Math.min(f.life, 1);
}

function renderFood(f) {
  if (f.life <= 0) {
    if (f.shown) f.el.style.opacity = '0';
    f.shown = false;
    return;
  }
  f.shown = true;
  f.el.style.transform = `translate3d(${(f.x - f.size / 2).toFixed(1)}px,${(f.y - f.size / 2).toFixed(1)}px,0) rotate(${f.spin.toFixed(0)}deg)`;
  f.el.style.opacity = Math.min(1, f.age * 4, f.life).toFixed(2);
}

// ---------------------------------------------------------------------------------------
// Simulation
// ---------------------------------------------------------------------------------------

export function createOceanSim(container, plan, { reducedMotion = false } = {}) {
  const env = { W: 0, H: 0, t: rand(0, 100), pointer: { active: false }, taps: [], scrollV: 0, food: null };
  const creatureEls = container.querySelectorAll('[data-creature]');
  const bubbleEls = container.querySelectorAll('[data-bubble]');
  const burstEls = container.querySelectorAll('[data-burst]');
  const foodEls = container.querySelectorAll('[data-food]');

  const creatures = plan.creatures.map((spec, i) => createCreature(spec, creatureEls[i]));
  const schools = new Map();
  for (const c of creatures) {
    if (!c.spec.school) continue;
    if (!schools.has(c.spec.school)) schools.set(c.spec.school, { members: [], dir: 0, seed: rand(0, 100), x: 0, y: 0, vx: 0, vy: 0 });
    c.school = schools.get(c.spec.school);
    c.school.members.push(c);
  }
  const bubbles = plan.bubbles.map((spec, i) => ({ ...spec, el: bubbleEls[i], alpha: 0, grow: 1, x: 0, y: 0 }));
  const bursts = plan.bursts.map((spec, i) => ({ ...spec, el: burstEls[i], life: 0 }));
  env.emit = (x, y, count, spread) => spawnBurst(bursts, x, y, count, spread);
  const food = plan.food.map((spec, i) => ({ ...spec, el: foodEls[i], life: 0 }));
  if (food.length) env.food = food;

  let placed = false;
  const measure = () => {
    const rect = container.getBoundingClientRect();
    env.W = rect.width;
    env.H = rect.height;
    return rect;
  };
  const place = () => {
    if (placed || !env.W || !env.H) return;
    placed = true;
    for (const c of creatures) {
      if (c.school && c !== c.school.members[0]) placeCreature(c, env, c.school.members[0]);
      else placeCreature(c, env);
    }
    for (const school of schools.values()) {
      school.dir = school.members[0].dir;
      if (school.members[0].spec.parade) parkSchool(school);
    }
    bubbles.forEach((b) => resetBubble(b, env, true));
  };
  const render = () => {
    for (const c of creatures) {
      if (!c.school?.dormant) renderCreature(c, env);
    }
    for (const b of bubbles) renderBubble(b);
  };

  // The contact form's success: a burst of bubbles and a golden school sweeping across.
  let celebrate = false;
  const onCelebrate = () => {
    celebrate = true;
  };
  const summonParade = () => {
    for (const school of schools.values()) {
      if (!school.members[0].spec.parade) continue;
      school.dormant = false;
      school.parade = true;
      school.dir = 0;
      const y = env.H * rand(0.35, 0.6);
      for (const m of school.members) {
        m.x = -rand(30, 240);
        m.y = y + rand(-35, 35);
        m.heading = 0;
        m.speed = m.species.swim.cruise * 3;
        m.roll = m.upright = 1;
      }
    }
    for (let i = 0; i < 10; i++) env.emit(rand(0.05, 0.95) * env.W, env.H * rand(0.7, 0.95), 3, 30);
  };

  measure();
  place();
  if (placed) {
    // Settle one step so every part has a pose before the first paint.
    for (const c of creatures) {
      if (!c.school?.dormant) UPDATE[c.species.motion](c, 1 / 60, env);
    }
    for (const b of bubbles) updateBubble(b, 0, env);
    render();
  }
  if (reducedMotion) return { destroy() {} };

  let last = 0;
  let lastTap = performance.now();
  let rect = null;

  // This section as other sections see it, for bubbles crossing between them.
  const self = {
    rect: null,
    frame: -1,
    // A bubble rising in from the section below: carry it on in a free slot, sized to match.
    adopt(src, x, y, now) {
      const p = bursts.find((b) => b.life <= 0);
      if (!p) return;
      Object.assign(p, { x, y, vx: src.vx, vy: src.vy, life: src.life, maxLife: src.maxLife, seed: src.seed, age: src.age, passedUp: false, adoptedAt: now });
      if (p.size !== src.size) {
        p.size = src.size;
        p.el.style.width = `${src.size}px`;
        p.el.style.height = `${src.size}px`;
      }
    },
  };
  liveSims.add(self);

  // Measure in the ticker's read phase, before anything on the page has moved this frame.
  const read = (now) => {
    rect = measure();
    self.rect = rect;
    self.frame = now;
  };

  const write = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (dt <= 0 || !rect) return;

    place();
    if (!placed) return;
    env.t += dt;
    readPointer(rect, now, env.pointer);
    env.scrollV = readScrollSpeed(now);
    env.taps = readTaps(rect, lastTap);
    if (env.taps.length) lastTap = env.taps[env.taps.length - 1].t;
    for (const tap of env.taps) {
      if (tap.x >= 0 && tap.x <= env.W && tap.y >= 0 && tap.y <= env.H) {
        env.emit(tap.x, tap.y, 7, 45);
        if (food.length) spawnFood(food, tap.x, tap.y);
      }
    }
    if (celebrate) {
      celebrate = false;
      summonParade();
    }

    for (const school of schools.values()) {
      if (!school.dormant) updateSchool(school, dt, env);
    }
    for (const c of creatures) {
      if (!c.school?.dormant) UPDATE[c.species.motion](c, dt, env);
    }
    for (const b of bubbles) updateBubble(b, dt, env);
    for (const p of bursts) {
      // A bubble adopted earlier this frame has already moved in the section it came from.
      if (p.adoptedAt !== now) updateBurst(p, dt);
      if (p.life <= 0) continue;
      if (!p.passedUp && p.y - p.size / 2 < 0) {
        p.passedUp = true;
        passBurstUp(self, p, now);
      }
      // Fully into the section above: that section carries it from here.
      if (p.passedUp && p.y + p.size / 2 < 0) p.life = 0;
    }
    for (const f of food) updateFood(f, dt, env);
    render();
    for (const p of bursts) renderBurst(p);
    for (const f of food) renderFood(f);
  };

  const stop = runWhileVisible(
    container,
    { read, write },
    {
      rootMargin: '150px 0px',
      onStart: () => {
        last = performance.now();
        lastTap = last;
        rect = null;
      },
    }
  );
  retainPointer();
  if (plan.celebrate) window.addEventListener('ocean:celebrate', onCelebrate);

  return {
    destroy() {
      stop();
      liveSims.delete(self);
      releasePointer();
      window.removeEventListener('ocean:celebrate', onCelebrate);
    },
  };
}
