import { useSyncExternalStore } from 'react';
import siteContent from '../content';

// The editor's state lives outside React so that typing in one field only re-renders that
// field, not the whole page (and all its sea life).

export const getAt = (obj, path) => path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), obj);

function setAt(obj, [key, ...rest], value) {
  const copy = Array.isArray(obj) ? obj.slice() : { ...obj };
  copy[key] = rest.length ? setAt(obj[key], rest, value) : value;
  return copy;
}

const SESSION_FLAG = 'site-editor';

let base = siteContent; // what's published
const edits = new Map(); // path -> edited text
let editing = false;
let version = 0;
const listeners = new Set();

try {
  editing = new URLSearchParams(window.location.search).has('edit') || window.sessionStorage.getItem(SESSION_FLAG) === '1';
  if (editing) window.sessionStorage.setItem(SESSION_FLAG, '1');
} catch {
  // No URL or storage (tests, locked-down browsers): stay in view mode.
}

const emit = () => {
  version += 1;
  listeners.forEach((listener) => listener());
};

export const editorStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get: (path) => (edits.has(path) ? edits.get(path) : getAt(base, path)),
  original: (path) => getAt(base, path),
  set(path, value) {
    if (value === getAt(base, path)) edits.delete(path);
    else edits.set(path, value);
    emit();
  },
  changes: () => [...edits].map(([path, value]) => ({ path, before: getAt(base, path), after: value })),
  discard() {
    edits.clear();
    emit();
  },
  // After a successful publish the edits become the new baseline.
  markPublished() {
    for (const [path, value] of edits) base = setAt(base, path.split('.'), value);
    edits.clear();
    emit();
  },
  isEditing: () => editing,
  setEditing(value) {
    editing = value;
    try {
      if (value) window.sessionStorage.setItem(SESSION_FLAG, '1');
      else window.sessionStorage.removeItem(SESSION_FLAG);
    } catch {
      // Storage unavailable; edit mode just won't survive a reload.
    }
    emit();
  },
};

// The current (possibly edited) text at a path.
export function useField(path) {
  return useSyncExternalStore(editorStore.subscribe, () => editorStore.get(path));
}

export function useEditing() {
  return useSyncExternalStore(editorStore.subscribe, editorStore.isEditing);
}

export function useChanges() {
  useSyncExternalStore(editorStore.subscribe, () => version);
  return editorStore.changes();
}

// A whole section as published, for structure (lists, ids, images). Text inside it should
// still be rendered with <Editable> so edits show up live.
export function useContent(section) {
  return siteContent[section];
}
