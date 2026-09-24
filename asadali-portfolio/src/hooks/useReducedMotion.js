import { useSyncExternalStore } from 'react';
import useMediaQuery from './useMediaQuery';

// Motion preference shared across the app: the visitor's OS setting, or the pause
// toggle in the footer (remembered between visits).

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

// True when animation should be kept still, for either reason.
export default function useReducedMotion() {
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const pausedByVisitor = useMotionPaused();
  return prefersReduced || pausedByVisitor;
}
