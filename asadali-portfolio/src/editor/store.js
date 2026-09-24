import { useSyncExternalStore } from 'react';
import siteContent, { CONTENT_FILES } from '../content';
import { getSession } from './api';

// The editor's state lives outside React so that editing one thing only re-renders what
// depends on it. `draft` is a full working copy of the site content: text edits, added,
// removed and reordered list items, and images waiting to be uploaded (stored as
// "upload:<id>" until they're committed).

const clone = (value) => JSON.parse(JSON.stringify(value));
const keysOf = (path) => (path === '' ? [] : String(path).split('.'));

export const getAt = (obj, path) => keysOf(path).reduce((node, key) => (node == null ? undefined : node[key]), obj);

function setIn(node, [key, ...rest], value) {
  const copy = Array.isArray(node) ? node.slice() : { ...node };
  copy[key] = rest.length ? setIn(node[key], rest, value) : value;
  return copy;
}

const SESSION_FLAG = 'site-editor';

let published = clone(siteContent);
let draft = published;
const uploads = new Map(); // "upload:<id>" -> { file, url }
let editing = false;
let version = 0;
const listeners = new Set();

// Edit mode is only for the logged-in owner (see AdminConsole); visitors never see it.
try {
  const wanted = new URLSearchParams(window.location.search).has('edit') || window.sessionStorage.getItem(SESSION_FLAG) === '1';
  editing = wanted && Boolean(getSession());
  if (editing) window.sessionStorage.setItem(SESSION_FLAG, '1');
  else window.sessionStorage.removeItem(SESSION_FLAG);
} catch {
  // No URL or storage (tests, locked-down browsers): stay in view mode.
}

const emit = () => {
  version += 1;
  listeners.forEach((listener) => listener());
};

const setDraft = (next) => {
  draft = next;
  emit();
};

const updateList = (listPath, update) => {
  const list = getAt(draft, listPath);
  if (!Array.isArray(list)) return;
  setDraft(setIn(draft, keysOf(listPath), update(list.slice())));
};

// ---------------------------------------------------------------------------------------
// Readable diff between the published and draft content, for the confirm dialog.
// ---------------------------------------------------------------------------------------

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

function alignLists(a, b) {
  // Longest common subsequence of identical items, so an insertion or removal in the
  // middle of a list shows up as one added/removed item instead of every item shifting.
  const as = a.map((x) => JSON.stringify(x));
  const bs = b.map((x) => JSON.stringify(x));
  const lcs = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = as[i] === bs[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && as[i] === bs[j]) {
      ops.push({ type: 'keep', i: i++, j: j++ });
    } else if (j < b.length && (i >= a.length || lcs[i][j + 1] >= lcs[i + 1][j])) {
      ops.push({ type: 'add', j: j++ });
    } else {
      ops.push({ type: 'remove', i: i++ });
    }
  }
  return ops;
}

function diff(before, after, path, out) {
  if (same(before, after)) return;
  if (Array.isArray(before) && Array.isArray(after)) {
    const ops = alignLists(before, after);
    // An item removed in one place and added unchanged in another was moved.
    const removed = new Map();
    for (const op of ops) {
      if (op.type === 'remove') removed.set(op, JSON.stringify(before[op.i]));
    }
    const moved = new Set();
    for (const op of ops) {
      if (op.type !== 'add') continue;
      const key = JSON.stringify(after[op.j]);
      const match = [...removed].find(([removal, removedKey]) => removedKey === key && !moved.has(removal));
      if (match) {
        moved.add(match[0]);
        moved.add(op);
      }
    }
    if (moved.size) out.push({ path, kind: 'reordered', before, after });

    // Between two unchanged items, the first removed item and the first added one are the
    // same item edited in place (and so on in order): show what changed inside each. Any
    // left over were really added or removed.
    let removes = [];
    let adds = [];
    const flush = () => {
      const pairs = Math.min(removes.length, adds.length);
      for (let k = 0; k < pairs; k++) {
        const was = before[removes[k].i];
        const now = after[adds[k].j];
        if (typeof was === typeof now) {
          diff(was, now, `${path}.${adds[k].j}`, out);
        } else {
          out.push({ path: `${path}.${removes[k].i}`, kind: 'removed', before: was, after: undefined });
          out.push({ path: `${path}.${adds[k].j}`, kind: 'added', before: undefined, after: now });
        }
      }
      for (const op of adds.slice(pairs)) out.push({ path: `${path}.${op.j}`, kind: 'added', before: undefined, after: after[op.j] });
      for (const op of removes.slice(pairs)) out.push({ path: `${path}.${op.i}`, kind: 'removed', before: before[op.i], after: undefined });
      removes = [];
      adds = [];
    };
    for (const op of ops) {
      if (op.type === 'keep') flush();
      else if (!moved.has(op)) (op.type === 'remove' ? removes : adds).push(op);
    }
    flush();
    return;
  }
  if (isObject(before) && isObject(after)) {
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) diff(before[key], after[key], `${path}.${key}`, out);
    return;
  }
  out.push({ path, kind: before === undefined ? 'added' : after === undefined ? 'removed' : 'changed', before, after });
}

// ---------------------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------------------

let uploadCounter = 0;

export const editorStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  get: (path) => getAt(draft, path),
  original: (path) => getAt(published, path),
  set(path, value) {
    if (same(getAt(draft, path), value)) return;
    setDraft(setIn(draft, keysOf(path), value));
  },

  // Lists: insert a copy of `item` at `index` (end if omitted), remove, or move items.
  insert(listPath, item, index) {
    updateList(listPath, (list) => {
      list.splice(index == null ? list.length : index, 0, clone(item));
      return list;
    });
  },
  remove(listPath, index) {
    updateList(listPath, (list) => {
      list.splice(index, 1);
      return list;
    });
  },
  move(listPath, from, to) {
    updateList(listPath, (list) => {
      if (to < 0 || to >= list.length) return list;
      const [item] = list.splice(from, 1);
      list.splice(to, 0, item);
      return list;
    });
  },

  // Images: keep the chosen file locally (with a preview URL) until it's published.
  addUpload(file) {
    uploadCounter += 1;
    const id = `upload:${Date.now().toString(36)}${uploadCounter}`;
    uploads.set(id, { file, url: URL.createObjectURL(file) });
    return id;
  },
  resolveImage: (value) => (typeof value === 'string' && value.startsWith('upload:') ? uploads.get(value)?.url : value),
  // Uploads still referenced by the draft (an image replaced twice only uploads the last).
  pendingUploads() {
    const text = JSON.stringify(draft);
    return [...uploads].filter(([id]) => text.includes(`"${id}"`)).map(([id, { file }]) => ({ id, file }));
  },

  changedFiles: () => CONTENT_FILES.filter((file) => !same(published[file], draft[file])),
  draftFile: (file) => draft[file],
  changes() {
    const out = [];
    for (const file of CONTENT_FILES) diff(published[file], draft[file], file, out);
    return out;
  },

  discard() {
    uploads.forEach(({ url }) => URL.revokeObjectURL(url));
    uploads.clear();
    setDraft(published);
  },
  // After a successful publish: swap upload ids for their committed paths and make the
  // draft the new published baseline.
  markPublished(paths = {}) {
    let text = JSON.stringify(draft);
    for (const [id, committedPath] of Object.entries(paths)) text = text.split(`"${id}"`).join(JSON.stringify(committedPath));
    published = JSON.parse(text);
    uploads.forEach(({ url }) => URL.revokeObjectURL(url));
    uploads.clear();
    setDraft(published);
  },

  isEditing: () => editing,
  setEditing(value) {
    editing = Boolean(value) && Boolean(getSession());
    try {
      if (value) window.sessionStorage.setItem(SESSION_FLAG, '1');
      else window.sessionStorage.removeItem(SESSION_FLAG);
    } catch {
      // Storage unavailable; edit mode just won't survive a reload.
    }
    emit();
  },
};

// The current (possibly edited) value at a path.
export function useField(path) {
  return useSyncExternalStore(editorStore.subscribe, () => getAt(draft, path));
}

// A whole section of the current content, for structure: lists, ids, links, images.
// Render its text with <Editable> so each field can be edited in place.
export function useContent(section) {
  return useSyncExternalStore(editorStore.subscribe, () => draft[section]);
}

export function useEditing() {
  return useSyncExternalStore(editorStore.subscribe, editorStore.isEditing);
}

let cachedChanges = { version: -1, changes: [] };

export function useChanges() {
  const current = useSyncExternalStore(editorStore.subscribe, () => version);
  if (cachedChanges.version !== current) cachedChanges = { version: current, changes: editorStore.changes() };
  return cachedChanges.changes;
}
