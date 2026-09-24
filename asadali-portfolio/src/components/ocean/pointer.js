// Shared pointer state for every ocean layer, so the page only ever has one set of
// listeners no matter how many sections are animating.

const state = {
  x: -1e5,
  y: -1e5,
  vx: 0,
  vy: 0,
  lastMove: 0,
  active: false,
  taps: [],
};

// Scroll speed (px/s, positive while scrolling down), so drifting particles can streak
// past as if the reader were sinking through them.
const scroll = { y: 0, t: 0, v: 0 };

let users = 0;

const onMove = (e) => {
  const now = performance.now();
  if (state.active) {
    const dt = Math.max(now - state.lastMove, 8) / 1000;
    // Smooth the velocity a little so a single jittery event doesn't scare everything.
    state.vx += ((e.clientX - state.x) / dt - state.vx) * 0.35;
    state.vy += ((e.clientY - state.y) / dt - state.vy) * 0.35;
  }
  state.x = e.clientX;
  state.y = e.clientY;
  state.lastMove = now;
  state.active = true;
};

const onDown = (e) => {
  onMove(e);
  state.taps.push({ x: e.clientX, y: e.clientY, t: performance.now() });
  if (state.taps.length > 6) state.taps.shift();
};

// Touch pointers stop existing once the finger lifts; a mouse keeps hovering.
const onUp = (e) => {
  if (e.pointerType !== 'mouse') state.active = false;
};

const onLeave = () => {
  state.active = false;
};

const onScroll = () => {
  const now = performance.now();
  const y = window.scrollY;
  if (scroll.t) {
    const dt = Math.max(now - scroll.t, 8) / 1000;
    // Capped so a jump (an anchor link, the End key) reads as a fast dive, not a warp.
    const instant = Math.max(-4000, Math.min(4000, (y - scroll.y) / dt));
    scroll.v += (instant - scroll.v) * 0.3;
  }
  scroll.y = y;
  scroll.t = now;
};

export function retainPointer() {
  if (users++ > 0) return;
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('pointercancel', onUp, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onLeave);
  window.addEventListener('scroll', onScroll, { passive: true });
  scroll.y = window.scrollY;
}

export function releasePointer() {
  if (--users > 0) return;
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerdown', onDown);
  window.removeEventListener('pointerup', onUp);
  window.removeEventListener('pointercancel', onUp);
  document.documentElement.removeEventListener('pointerleave', onLeave);
  window.removeEventListener('blur', onLeave);
  window.removeEventListener('scroll', onScroll);
}

// Pointer position relative to `rect`, with its velocity decayed by how long ago it last
// moved: a resting cursor is much less alarming than one sweeping through the water.
export function readPointer(rect, now, out) {
  const idle = now - state.lastMove;
  const decay = Math.exp(-idle / 180);
  out.active = state.active;
  out.x = state.x - rect.left;
  out.y = state.y - rect.top;
  out.vx = state.vx * decay;
  out.vy = state.vy * decay;
  out.speed = Math.hypot(out.vx, out.vy);
  return out;
}

export function readScrollSpeed(now) {
  return scroll.v * Math.exp(-(now - scroll.t) / 120);
}

// Taps/clicks since `since`, relative to `rect`.
export function readTaps(rect, since) {
  const taps = [];
  for (const tap of state.taps) {
    if (tap.t > since) taps.push({ x: tap.x - rect.left, y: tap.y - rect.top, t: tap.t });
  }
  return taps;
}
