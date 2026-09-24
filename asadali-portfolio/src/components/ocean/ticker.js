// One requestAnimationFrame for every ocean animation, split into a read phase (layout
// measurements) and a write phase (moving things). Measuring layout after anything on the
// page has moved forces the browser to redo layout mid-frame; with each animation doing
// that separately it cost more than all the animation itself, badly so on phones.

import { isMotionPaused, onMotionPausedChange } from '../../hooks/useReducedMotion';

const subscribers = new Set();
let raf = 0;

function tick(now) {
  raf = requestAnimationFrame(tick);
  for (const sub of subscribers) if (sub.read) sub.read(now);
  for (const sub of subscribers) sub.write(now);
}

// Subscribes { read?(now), write(now) } to every frame; returns an unsubscribe function.
export function subscribe(sub) {
  subscribers.add(sub);
  if (!raf) raf = requestAnimationFrame(tick);
  return () => {
    subscribers.delete(sub);
    if (!subscribers.size && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

// Runs { read, write } every frame while `el` is on screen (within `rootMargin`) and the
// visitor hasn't paused motion from the footer. Pausing simply stops the frames, so
// everything freezes where it is. `onStart` runs each time frames (re)start, to reset
// clocks. Returns a function that stops it for good.
export function runWhileVisible(el, sub, { rootMargin = '0px', onStart } = {}) {
  let unsubscribe = null;
  let visible = false;
  const sync = () => {
    const run = visible && !isMotionPaused();
    if (run && !unsubscribe) {
      if (onStart) onStart();
      unsubscribe = subscribe(sub);
    } else if (!run && unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    },
    { rootMargin }
  );
  observer.observe(el);
  const stopWatchingPause = onMotionPausedChange(sync);
  return () => {
    observer.disconnect();
    stopWatchingPause();
    visible = false;
    sync();
  };
}
