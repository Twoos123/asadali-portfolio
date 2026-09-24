// Site editor API: lets the owner edit the website's content from the site itself.
//
//   POST /api/editor/login   { password }                       -> { token, expires }
//   POST /api/editor/save    { files: { about: {...}, ... },     (Bearer token)
//                              uploads: [{ id, name, type, data(base64) }] }
//                            -> one commit to main with the changed src/content/*.json files
//                               and new images in public/assets/uploads
//                            -> { sha, url, paths: { [uploadId]: '/assets/uploads/...' } }
//   GET  /api/editor/status?sha=...                              (Bearer token)
//                            -> deploy progress of that commit
//
// Every saved file is checked against the shape of the version already committed (and the
// shapes remembered in src/content/_shape.json): new list items may only use fields that
// similar items have had, values keep their types, links can't use javascript:/data:
// schemes, and uploads must really be PNG/JPEG/WebP/GIF.
//
// Environment:
//   EDITOR_PASSWORD_HASH   scrypt hash of the editor password (npm run hash-password)
//   EDITOR_SESSION_SECRET  32+ random characters used to sign sessions
//   GITHUB_TOKEN           fine-grained token for this repo: Contents read/write, Actions read
//   GITHUB_REPO            owner/name (default Twoos123/asadali-portfolio)
//   GITHUB_BRANCH          branch to commit to (default main)
//   EDITOR_DRY_RUN=true    write to the local files instead of GitHub (development)

const express = require('express');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { typeOf, mergeShapes, shapeOf, shapeToJson, shapeFromJson } = require('./contentShape');

const router = express.Router();
// Its own body limit: saves can carry images (the app-wide parser is capped at 100 kB).
router.use(express.json({ limit: '30mb' }));

const REPO_APP_DIR = 'asadali-portfolio';
const CONTENT_DIR = `${REPO_APP_DIR}/src/content`;
const UPLOAD_DIR = `${REPO_APP_DIR}/public/assets/uploads`;
const LOCAL_APP_DIR = path.join(__dirname, '..');
const FILES = ['nav', 'hero', 'about', 'skills', 'projects', 'experience', 'resume', 'contact', 'footer', 'caseStudy'];
const SHAPE_FILE = '_shape';

const SESSION_MS = 2 * 60 * 60 * 1000;
const MAX_LENGTH = 20000;
const MAX_ITEMS = 500;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_UPLOADS = 8;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_UPLOAD_TOTAL = 20 * 1024 * 1024;
const UNSAFE_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
// Fields holding URLs or asset paths (github, repoUrl, heroImage, logo, …); their scheme,
// if any, must be http(s) or mailto. Other strings are only ever rendered as text, and the
// site passes every content URL through safeUrl() before using it in an href or src.
const URL_KEY = /(^|[a-z_-])(url|href|link|github|repo|demo|image|img|src|logo|icon|screenshot|resume|avatar|photo|thumbnail|embed|download)s?$/i;

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
// Validation
// ---------------------------------------------------------------------------------------

function checkString(value, where, key) {
  if (value.length > MAX_LENGTH) throw new HttpError(400, `${where} is too long.`);
  if (!URL_KEY.test(key)) return;
  // Skill icons can name a built-in icon ("react:SiSupabase") instead of an image.
  if (/icon$/i.test(key) && /^react:[A-Za-z0-9]+$/.test(value)) return;
  // Browsers ignore whitespace and control characters inside a scheme ("java\nscript:").
  const compact = value.replace(/[\u0000- \u007f]+/g, '');
  if (/^[a-z][a-z0-9+.-]*:/i.test(compact) && !/^(https?|mailto):/i.test(compact)) {
    throw new HttpError(400, `${where} must be an https://, mailto: or site link.`);
  }
}

function validate(value, shape, where, key = '') {
  const type = typeOf(value);
  const allowed = shape ? shape.types : new Set(['string']);
  // "Not set" fields flip between null and text.
  const fits = allowed.has(type) || (type === 'null' && allowed.has('string')) || (type === 'string' && allowed.has('null'));
  if (!fits) throw new HttpError(400, `${where} should be ${[...allowed].join(' or ')}, not ${type}.`);

  if (type === 'string') checkString(value, where, key);
  else if (type === 'number' && !Number.isFinite(value)) throw new HttpError(400, `${where} isn't a valid number.`);
  else if (type === 'array') {
    if (value.length > MAX_ITEMS) throw new HttpError(400, `${where} has too many items.`);
    value.forEach((item, i) => validate(item, shape && shape.item, `${where}.${i}`, key));
  } else if (type === 'object') {
    for (const [childKey, child] of Object.entries(value)) {
      if (UNSAFE_KEYS.has(childKey) || !/^[A-Za-z0-9_-]+$/.test(childKey)) throw new HttpError(400, `${where} has an invalid field name.`);
      const childShape = shape && shape.keys ? shape.keys[childKey] : undefined;
      if (!childShape) throw new HttpError(400, `${where}.${childKey} isn't a field the site knows about.`);
      validate(child, childShape, `${where}.${childKey}`, childKey);
    }
  }
}

function detectImage(buffer) {
  if (buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg';
  const head = buffer.subarray(0, 12).toString('latin1');
  if (head.startsWith('GIF87a') || head.startsWith('GIF89a')) return 'gif';
  if (head.startsWith('RIFF') && head.slice(8, 12) === 'WEBP') return 'webp';
  return null;
}

// Decodes and checks the uploads, and gives each one its final path.
function parseUploads(list) {
  if (list == null) return [];
  if (!Array.isArray(list) || list.length > MAX_UPLOADS) throw new HttpError(400, `Up to ${MAX_UPLOADS} images per save.`);
  let total = 0;
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return list.map((upload) => {
    const { id, data } = upload || {};
    if (typeof id !== 'string' || !/^upload:[a-z0-9]+$/.test(id) || typeof data !== 'string') throw new HttpError(400, 'Invalid image upload.');
    const buffer = Buffer.from(data, 'base64');
    if (!buffer.length || buffer.length > MAX_UPLOAD_BYTES) throw new HttpError(400, 'Each image must be under 5 MB.');
    total += buffer.length;
    if (total > MAX_UPLOAD_TOTAL) throw new HttpError(400, 'Too many images in one save (20 MB total).');
    const ext = detectImage(buffer);
    if (!ext) throw new HttpError(400, 'Images must be PNG, JPEG, WebP or GIF files.');
    const name = `${stamp}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    return { id, buffer, repoPath: `${UPLOAD_DIR}/${name}`, localPath: path.join(LOCAL_APP_DIR, 'public', 'assets', 'uploads', name), sitePath: `/assets/uploads/${name}` };
  });
}

// Checks the submitted documents against the committed ones (plus every shape remembered in
// _shape.json, so an emptied list still accepts new items) and swaps upload ids for paths.
// Returns the files to write, including _shape.json when the save taught it something.
async function prepareFiles(files, uploads, readCurrent, storedShapes) {
  if (!files || typeof files !== 'object' || Array.isArray(files)) throw new HttpError(400, 'Nothing to save.');
  const names = Object.keys(files);
  if (!names.length && !uploads.length) throw new HttpError(400, 'Nothing to save.');
  const shapes = { ...storedShapes };
  const prepared = await Promise.all(
    names.map(async (name) => {
      if (!FILES.includes(name)) throw new HttpError(400, `"${name}" isn't part of the site content.`);
      let text = JSON.stringify(files[name]);
      if (text === undefined || Buffer.byteLength(text) > MAX_FILE_BYTES) throw new HttpError(400, `${name} is too large.`);
      for (const upload of uploads) text = text.split(JSON.stringify(upload.id)).join(JSON.stringify(upload.sitePath));
      if (/"upload:[a-z0-9]+"/.test(text)) throw new HttpError(400, 'An image was missing from the upload. Try replacing it again.');
      const doc = JSON.parse(text);
      const shape = mergeShapes(shapeFromJson(storedShapes[name]), shapeOf(await readCurrent(name)));
      validate(doc, shape, name);
      shapes[name] = shapeToJson(mergeShapes(shape, shapeOf(doc)));
      return { name, content: `${JSON.stringify(doc, null, 2)}\n` };
    })
  );
  if (JSON.stringify(shapes) !== JSON.stringify(storedShapes)) prepared.push({ name: SHAPE_FILE, content: `${JSON.stringify(shapes, null, 2)}\n` });
  return prepared;
}

function commitMessage(files, uploads) {
  const parts = [];
  const edited = files.filter((f) => f.name !== SHAPE_FILE);
  if (edited.length) parts.push(`update ${edited.map((f) => f.name).join(', ')}`);
  if (uploads.length) parts.push(`add ${uploads.length} image${uploads.length === 1 ? '' : 's'}`);
  return `Edit site content from the on-site editor: ${parts.join('; ')}`;
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

// One commit on top of the branch head with every changed content file and new image.
async function commitToGitHub(files, uploads) {
  const head = await github(`/git/ref/heads/${branch()}`);
  const headSha = head.object.sha;
  const headCommit = await github(`/git/commits/${headSha}`);

  const readCurrent = async (name) => {
    const current = await github(`/contents/${CONTENT_DIR}/${name}.json?ref=${headSha}`);
    return JSON.parse(Buffer.from(current.content, 'base64').toString('utf8'));
  };
  const storedShapes = await readCurrent(SHAPE_FILE).catch((error) => {
    if (error.githubStatus === 404) return {};
    throw error;
  });
  const prepared = await prepareFiles(files, uploads, readCurrent, storedShapes);

  const tree = prepared.map(({ name, content }) => ({ path: `${CONTENT_DIR}/${name}.json`, mode: '100644', type: 'blob', content }));
  for (const upload of uploads) {
    const blob = await github('/git/blobs', { method: 'POST', body: JSON.stringify({ content: upload.buffer.toString('base64'), encoding: 'base64' }) });
    tree.push({ path: upload.repoPath, mode: '100644', type: 'blob', sha: blob.sha });
  }

  const newTree = await github('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: headCommit.tree.sha, tree }) });
  const commit = await github('/git/commits', {
    method: 'POST',
    body: JSON.stringify({ message: commitMessage(prepared, uploads), tree: newTree.sha, parents: [headSha] }),
  });
  // Fast-forward only, so a push that landed meanwhile is never overwritten.
  await github(`/git/refs/heads/${branch()}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false }) });
  return { sha: commit.sha, url: commit.html_url };
}

async function commitLocally(files, uploads) {
  const readCurrent = async (name) => JSON.parse(await fs.readFile(path.join(LOCAL_APP_DIR, 'src', 'content', `${name}.json`), 'utf8'));
  const storedShapes = await readCurrent(SHAPE_FILE).catch((error) => {
    if (error.code === 'ENOENT') return {};
    throw error;
  });
  const prepared = await prepareFiles(files, uploads, readCurrent, storedShapes);
  for (const upload of uploads) {
    await fs.mkdir(path.dirname(upload.localPath), { recursive: true });
    await fs.writeFile(upload.localPath, upload.buffer);
  }
  for (const { name, content } of prepared) await fs.writeFile(path.join(LOCAL_APP_DIR, 'src', 'content', `${name}.json`), content);
  return { sha: `dry-run-${Date.now()}`, url: null, dryRun: true };
}

// ---------------------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------------------

// Public: which parts of the editor are set up (never the values themselves).
router.get('/health', (req, res) => {
  const [scheme] = (process.env.EDITOR_PASSWORD_HASH || '').split('$');
  res.json({
    password: scheme === 'scrypt',
    session: (process.env.EDITOR_SESSION_SECRET || '').length >= 32,
    github: Boolean(process.env.GITHUB_TOKEN) || dryRun(),
    dryRun: dryRun(),
  });
});

// Recent commits that changed the site content, for the admin console.
router.get('/activity', requireSession, async (req, res, next) => {
  try {
    if (dryRun()) return res.json({ commits: [] });
    const commits = await github(`/commits?sha=${branch()}&path=${REPO_APP_DIR}/src&per_page=8`);
    return res.json({
      commits: commits.map((c) => ({
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split('\n')[0],
        date: c.commit.author && c.commit.author.date,
        url: c.html_url,
      })),
    });
  } catch (error) {
    return next(error);
  }
});

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
    const uploads = parseUploads(req.body && req.body.uploads);
    const files = (req.body && req.body.files) || {};
    const paths = Object.fromEntries(uploads.map((upload) => [upload.id, upload.sitePath]));
    if (dryRun()) return res.json({ ...(await commitLocally(files, uploads)), paths });
    let result;
    try {
      result = await commitToGitHub(files, uploads);
    } catch (error) {
      // Someone pushed between reading the head and moving it: retry once on the new head.
      if (error.githubStatus !== 422) throw error;
      result = await commitToGitHub(files, uploads);
    }
    return res.json({ ...result, paths });
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
  if (error && error.type === 'entity.too.large') return res.status(413).json({ error: 'That save is too large (too many or too big images).' });
  return next(error);
});

module.exports = router;
