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

// Commits the changes to main; resolves to { sha, url }.
export const publishChanges = (changes) =>
  authed('/api/editor/save', {
    method: 'POST',
    body: JSON.stringify({ changes: changes.map(({ path, after }) => ({ path, value: after })) }),
  });

// Deploy progress for a commit: { state: 'pending' | 'running' | 'success' | 'failure', url }.
export const deployStatus = (sha) => authed(`/api/editor/status?sha=${encodeURIComponent(sha)}`);
