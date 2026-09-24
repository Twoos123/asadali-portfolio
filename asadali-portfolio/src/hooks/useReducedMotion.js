import { useSyncExternalStore } from 'react';
import useMediaQuery from './useMediaQuery';

// Two separate motion settings:
// - the footer's pause toggle (remembered between visits): every animation freezes where it
//   is, and resumes from there. CSS animations pause via html[data-motion-paused] (index.css);
//   animation loops stop their frames (components/ocean/ticker.js runWhileVisible).
// - the visitor's OS "reduce motion" setting: animations are replaced by still versions.

const STORAGE_KEY = 'motion-paused';
const listeners = new Set();

let paused = false;
try {
  paused = window.localStorage.getItem(STORAGE_KEY) === 'true';
} catch {
  // Storage can be unavailable (private mode, blocked site data); default to playing.
}

const apply = () => document.documentElement.toggleAttribute('data-motion-paused', paused);
if (typeof document !== 'undefined') apply();

export function setMotionPaused(value) {
  paused = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // Not persisted, but still applies for this visit.
  }
  apply();
  listeners.forEach((listener) => listener());
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useMotionPaused() {
  return useSyncExternalStore(subscribe, () => paused);
}

// For animation loops outside React.
export const isMotionPaused = () => paused;
export const onMotionPausedChange = subscribe;

// True when the visitor's OS asks for reduced motion.
export default function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
