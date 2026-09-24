// One requestAnimationFrame for every ocean animation, split into a read phase (layout
// measurements) and a write phase (moving things). Measuring layout after anything on the
// page has moved forces the browser to redo layout mid-frame; with each animation doing
// that separately it cost more than all the animation itself, badly so on phones.

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
