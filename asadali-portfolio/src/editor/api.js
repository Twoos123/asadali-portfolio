import { API_BASE } from '../config';

// Talks to the backend's /api/editor routes. The session token lives in sessionStorage, so
// it's forgotten when the tab closes.

const SESSION_KEY = 'site-editor-session';

export function getSession() {
  try {
    const session = JSON.parse(window.sessionStorage.getItem(SESSION_KEY));
    if (session && session.expires > Date.now()) return session;
  } catch {
    // Missing or unreadable: treat as logged out.
  }
  return null;
}

export function logout() {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing stored.
  }
}

async function request(path, options = {}, token) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new Error("Couldn't reach the server. If it was asleep, try again in a few seconds.");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token) {
    logout();
    const error = new Error(data.error || 'Your session expired. Log in again.');
    error.needsLogin = true;
    throw error;
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export async function login(password) {
  const session = await request('/api/editor/login', { method: 'POST', body: JSON.stringify({ password }) });
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function authed(path, options) {
  const session = getSession();
  if (!session) {
    const error = new Error('Log in to publish.');
    error.needsLogin = true;
    return Promise.reject(error);
  }
  return request(path, options, session.token);
}

const readAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(new Error(`Couldn't read ${file.name}.`));
    reader.readAsDataURL(file);
  });

// Commits the changed content files (whole documents) and any new images to main in one
// commit. Resolves to { sha, url, paths }, where paths maps each upload id to its new
// site path.
export async function publishDraft({ files, uploads }) {
  const encoded = await Promise.all(
    uploads.map(async ({ id, file }) => ({ id, name: file.name, type: file.type, data: await readAsBase64(file) }))
  );
  return authed('/api/editor/save', { method: 'POST', body: JSON.stringify({ files, uploads: encoded }) });
}

// Public: is the server up (and how long it took), and which parts of the editor are set up.
export async function serverHealth() {
  const started = performance.now();
  const setup = await request('/api/editor/health');
  return { ...setup, ms: Math.round(performance.now() - started) };
}

// Recent commits that changed the site: { commits: [{ sha, message, date, url }] }.
export const recentActivity = () => authed('/api/editor/activity');

// Deploy progress for a commit: { state: 'pending' | 'running' | 'success' | 'failure', url }.
export const deployStatus = (sha) => authed(`/api/editor/status?sha=${encodeURIComponent(sha)}`);
