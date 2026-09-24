// Site editor API: lets the owner edit the website's text from the site itself.
//
//   POST /api/editor/login   { password }            -> { token, expires }
//   POST /api/editor/save    { changes: [{ path, value }] }  (Bearer token)
//                            -> commits src/content/*.json to main -> { sha, url }
//   GET  /api/editor/status?sha=...                   (Bearer token)
//                            -> deploy progress of that commit
//
// Environment:
//   EDITOR_PASSWORD_HASH   scrypt hash of the editor password (npm run hash-password)
//   EDITOR_SESSION_SECRET  32+ random characters used to sign sessions
//   GITHUB_TOKEN           fine-grained token for this repo: Contents read/write, Actions read
//   GITHUB_REPO            owner/name (default Twoos123/asadali-portfolio)
//   GITHUB_BRANCH          branch to commit to (default main)
//   EDITOR_DRY_RUN=true    write to the local content files instead of GitHub (development)

const express = require('express');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const CONTENT_DIR = 'asadali-portfolio/src/content';
const LOCAL_CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');
const FILES = ['nav', 'hero', 'about', 'skills', 'projects', 'experience', 'resume', 'contact', 'footer', 'caseStudy'];
const SESSION_MS = 2 * 60 * 60 * 1000;
const MAX_CHANGES = 200;
const MAX_LENGTH = 5000;
const UNSAFE_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

const repo = () => process.env.GITHUB_REPO || 'Twoos123/asadali-portfolio';
const branch = () => process.env.GITHUB_BRANCH || 'main';
const dryRun = () => process.env.EDITOR_DRY_RUN === 'true';

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const limiterOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false, xForwardedForHeader: false },
};
const loginLimiter = rateLimit({ ...limiterOptions, windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many login attempts. Try again later.' } });
const saveLimiter = rateLimit({ ...limiterOptions, windowMs: 60 * 60 * 1000, max: 30, message: { error: 'Too many saves. Try again later.' } });

// ---------------------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------------------

function sessionSecret() {
  const secret = process.env.EDITOR_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new HttpError(503, 'The editor is not set up on the server (EDITOR_SESSION_SECRET).');
  return secret;
}

function passwordMatches(password) {
  const [scheme, saltHex, hashHex] = (process.env.EDITOR_PASSWORD_HASH || '').split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) throw new HttpError(503, 'The editor is not set up on the server (EDITOR_PASSWORD_HASH).');
  if (typeof password !== 'string' || !password || password.length > 256) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

const hmac = (body) => crypto.createHmac('sha256', sessionSecret()).update(body).digest('base64url');

function issueToken() {
  const expires = Date.now() + SESSION_MS;
  const body = Buffer.from(JSON.stringify({ exp: expires, nonce: crypto.randomBytes(8).toString('hex') })).toString('base64url');
  return { token: `${body}.${hmac(body)}`, expires };
}

function tokenIsValid(token) {
  const [body, signature] = String(token || '').split('.');
  if (!body || !signature) return false;
  const expected = Buffer.from(hmac(body));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return false;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')).exp > Date.now();
  } catch {
    return false;
  }
}

function requireSession(req, res, next) {
  try {
    const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!tokenIsValid(token)) return res.status(401).json({ error: 'Your session expired. Log in again.' });
    return next();
  } catch (error) {
    return next(error);
  }
}

// ---------------------------------------------------------------------------------------
// Changes
// ---------------------------------------------------------------------------------------

function parseChanges(body) {
  const list = body && Array.isArray(body.changes) ? body.changes : null;
  if (!list || !list.length) throw new HttpError(400, 'There are no changes to save.');
  if (list.length > MAX_CHANGES) throw new HttpError(400, `Too many changes at once (max ${MAX_CHANGES}).`);
  return list.map((change) => {
    const { path: fieldPath, value } = change || {};
    if (typeof fieldPath !== 'string' || typeof value !== 'string') throw new HttpError(400, 'Each change needs a path and a text value.');
    if (value.length > MAX_LENGTH) throw new HttpError(400, `"${fieldPath}" is too long (max ${MAX_LENGTH} characters).`);
    const [file, ...keys] = fieldPath.split('.');
    if (!FILES.includes(file) || !keys.length || keys.some((key) => !/^[A-Za-z0-9_-]+$/.test(key) || UNSAFE_KEYS.has(key))) {
      throw new HttpError(400, `"${fieldPath}" is not an editable field.`);
    }
    return { path: fieldPath, file, keys, value };
  });
}

// Only existing text can change: no new keys, no changing lists or objects.
function applyChange(json, { path: fieldPath, keys, value }) {
  let node = json;
  for (const key of keys.slice(0, -1)) {
    if (!node || typeof node !== 'object' || !Object.prototype.hasOwnProperty.call(node, key)) {
      throw new HttpError(400, `"${fieldPath}" doesn't exist in the site content.`);
    }
    node = node[key];
  }
  const last = keys[keys.length - 1];
  if (!node || typeof node !== 'object' || !Object.prototype.hasOwnProperty.call(node, last) || typeof node[last] !== 'string') {
    throw new HttpError(400, `"${fieldPath}" isn't editable text.`);
  }
  node[last] = value;
}

const byFile = (changes) => {
  const groups = new Map();
  for (const change of changes) {
    if (!groups.has(change.file)) groups.set(change.file, []);
    groups.get(change.file).push(change);
  }
  return groups;
};

const serialize = (json) => `${JSON.stringify(json, null, 2)}\n`;

function commitMessage(changes) {
  const lines = changes.slice(0, 20).map((change) => `- ${change.path}`);
  if (changes.length > 20) lines.push(`- …and ${changes.length - 20} more`);
  return `Edit site text from the on-site editor (${changes.length} change${changes.length === 1 ? '' : 's'})\n\n${lines.join('\n')}`;
}

// ---------------------------------------------------------------------------------------
// GitHub
// ---------------------------------------------------------------------------------------

async function github(pathname, options = {}) {
  if (!process.env.GITHUB_TOKEN) throw new HttpError(503, 'The editor is not set up on the server (GITHUB_TOKEN).');
  const res = await fetch(`https://api.github.com/repos/${repo()}${pathname}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'asadbinali-site-editor',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new HttpError(502, `GitHub rejected the request (${res.status}: ${data.message || 'unknown error'}).`);
    error.githubStatus = res.status;
    throw error;
  }
  return data;
}

// One commit on top of the branch head containing every changed content file.
async function commitToGitHub(changes) {
  const head = await github(`/git/ref/heads/${branch()}`);
  const headSha = head.object.sha;
  const headCommit = await github(`/git/commits/${headSha}`);

  const tree = [];
  for (const [file, fileChanges] of byFile(changes)) {
    const filePath = `${CONTENT_DIR}/${file}.json`;
    const current = await github(`/contents/${filePath}?ref=${headSha}`);
    const json = JSON.parse(Buffer.from(current.content, 'base64').toString('utf8'));
    fileChanges.forEach((change) => applyChange(json, change));
    tree.push({ path: filePath, mode: '100644', type: 'blob', content: serialize(json) });
  }

  const newTree = await github('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: headCommit.tree.sha, tree }) });
  const commit = await github('/git/commits', {
    method: 'POST',
    body: JSON.stringify({ message: commitMessage(changes), tree: newTree.sha, parents: [headSha] }),
  });
  // Fast-forward only, so a push that landed meanwhile is never overwritten.
  await github(`/git/refs/heads/${branch()}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false }) });
  return { sha: commit.sha, url: commit.html_url };
}

async function commitLocally(changes) {
  for (const [file, fileChanges] of byFile(changes)) {
    const filePath = path.join(LOCAL_CONTENT_DIR, `${file}.json`);
    const json = JSON.parse(await fs.readFile(filePath, 'utf8'));
    fileChanges.forEach((change) => applyChange(json, change));
    await fs.writeFile(filePath, serialize(json));
  }
  return { sha: `dry-run-${Date.now()}`, url: null, dryRun: true };
}

// ---------------------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------------------

router.post('/login', loginLimiter, (req, res, next) => {
  try {
    if (!passwordMatches(req.body && req.body.password)) return res.status(401).json({ error: 'Wrong password.' });
    return res.json(issueToken());
  } catch (error) {
    return next(error);
  }
});

router.post('/save', saveLimiter, requireSession, async (req, res, next) => {
  try {
    const changes = parseChanges(req.body);
    if (dryRun()) return res.json(await commitLocally(changes));
    try {
      return res.json(await commitToGitHub(changes));
    } catch (error) {
      // Someone pushed between reading the head and moving it: retry once on the new head.
      if (error.githubStatus === 422) return res.json(await commitToGitHub(changes));
      throw error;
    }
  } catch (error) {
    return next(error);
  }
});

router.get('/status', requireSession, async (req, res, next) => {
  try {
    const sha = String(req.query.sha || '');
    if (dryRun()) return res.json({ state: 'success' });
    if (!/^[0-9a-f]{40}$/.test(sha)) throw new HttpError(400, 'Unknown commit.');
    const { workflow_runs: runs = [] } = await github(`/actions/runs?head_sha=${sha}&per_page=10`);
    const run = runs.find((r) => (r.path || '').endsWith('deploy.yml')) || runs[0];
    if (!run) return res.json({ state: 'pending' });
    let state = 'running';
    if (run.status === 'queued' || run.status === 'waiting' || run.status === 'pending') state = 'pending';
    else if (run.status === 'completed') state = run.conclusion === 'success' ? 'success' : 'failure';
    return res.json({ state, url: run.html_url });
  } catch (error) {
    return next(error);
  }
});

// Errors from these routes carry their own status and a message that is safe to show.
router.use((error, req, res, next) => {
  if (error instanceof HttpError) return res.status(error.status).json({ error: error.message });
  return next(error);
});

module.exports = router;
