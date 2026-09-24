// Logging in to the site editor. Layers, each enough on its own to stop password guessing:
//
// - Two factors: the password (scrypt-hashed) and a 6-digit code from an authenticator app.
//   Both are always checked and a failure never says which one was wrong. A code works once.
// - Failed logins are limited per visitor (5 per 15 minutes) and across everyone (10 per
//   hour, after which login is locked for everyone until the hour has passed), so spreading
//   guesses over many addresses doesn't help. Each failure is also slowed down.
// - The owner gets an email for every successful login and when login locks, so a leaked
//   password can't be used quietly.
// - Sessions are signed with a key derived from the session secret AND the current password
//   and authenticator secrets: running the setup again logs every session out. They last an
//   hour, and logging out revokes the session on the server.
//
// Environment (npm run setup-editor prints all three):
//   EDITOR_PASSWORD_HASH   scrypt$N$r$p$salt$hash
//   EDITOR_TOTP_SECRET     base32 authenticator secret
//   EDITOR_SESSION_SECRET  32+ random characters

const crypto = require('crypto');
const { promisify } = require('util');
const totp = require('./totp');

const scrypt = promisify(crypto.scrypt);

const SESSION_MS = 60 * 60 * 1000;
const CLIENT_WINDOW_MS = 15 * 60 * 1000;
const CLIENT_MAX_FAILURES = 5;
const GLOBAL_WINDOW_MS = 60 * 60 * 1000;
const GLOBAL_MAX_FAILURES = 10;
const MAX_TRACKED_CLIENTS = 5000;

class AuthError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const notSetUp = (name) => new AuthError(503, `The editor is not set up on the server (${name}).`);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------------------
// Secrets
// ---------------------------------------------------------------------------------------

function passwordConfig() {
  const parts = (process.env.EDITOR_PASSWORD_HASH || '').split('$');
  if (parts[0] !== 'scrypt') throw notSetUp('EDITOR_PASSWORD_HASH');
  // scrypt$N$r$p$salt$hash (from setup-editor), or the older scrypt$salt$hash.
  const [N, r, p, saltHex, hashHex] = parts.length === 6 ? [...parts.slice(1, 4).map(Number), parts[4], parts[5]] : [16384, 8, 1, parts[1], parts[2]];
  if (![N, r, p].every(Number.isInteger) || !saltHex || !hashHex) throw notSetUp('EDITOR_PASSWORD_HASH');
  return { N, r, p, salt: Buffer.from(saltHex, 'hex'), hash: Buffer.from(hashHex, 'hex') };
}

function totpSecret() {
  const secret = process.env.EDITOR_TOTP_SECRET || '';
  if (secret.replace(/\s/g, '').length < 16) throw notSetUp('EDITOR_TOTP_SECRET');
  return secret;
}

function sessionSecret() {
  const secret = process.env.EDITOR_SESSION_SECRET || '';
  if (secret.length < 32) throw notSetUp('EDITOR_SESSION_SECRET');
  return secret;
}

// Which parts are set up (never the values), for the admin console.
function setupStatus() {
  const ok = (fn) => {
    try {
      fn();
      return true;
    } catch {
      return false;
    }
  };
  return { password: ok(passwordConfig), twoFactor: ok(totpSecret), session: ok(sessionSecret) };
}

// Password checks run one at a time: each needs tens of megabytes, and a burst of parallel
// attempts must not be able to exhaust the server's memory.
let hashing = Promise.resolve();

function passwordMatches(password) {
  const { N, r, p, salt, hash } = passwordConfig();
  // Hash even an unusable password, so every attempt takes the same time.
  const candidate = typeof password === 'string' && password.length <= 256 ? password : '';
  const check = hashing.then(async () => {
    const actual = await scrypt(candidate, salt, hash.length, { N, r, p, maxmem: 256 * N * r });
    return candidate !== '' && crypto.timingSafeEqual(actual, hash);
  });
  hashing = check.catch(() => {});
  return check;
}

// ---------------------------------------------------------------------------------------
// Failed-login limits
// ---------------------------------------------------------------------------------------

const clientFailures = new Map(); // client -> [timestamps]
let globalFailures = []; // timestamps
let lockAlertSent = 0;

// The visitor's address as Render's proxy saw it: the last X-Forwarded-For entry is the one
// the proxy appended itself, so unlike the first entry it can't be made up by the client.
function clientOf(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  return forwarded[forwarded.length - 1] || req.socket.remoteAddress || 'unknown';
}

const recent = (times, windowMs, now) => times.filter((t) => now - t < windowMs);

// Minutes until login opens again for this client, or 0.
function lockedFor(client, now) {
  globalFailures = recent(globalFailures, GLOBAL_WINDOW_MS, now);
  const mine = recent(clientFailures.get(client) || [], CLIENT_WINDOW_MS, now);
  let until = 0;
  if (globalFailures.length >= GLOBAL_MAX_FAILURES) until = globalFailures[globalFailures.length - GLOBAL_MAX_FAILURES] + GLOBAL_WINDOW_MS;
  if (mine.length >= CLIENT_MAX_FAILURES) until = Math.max(until, mine[mine.length - CLIENT_MAX_FAILURES] + CLIENT_WINDOW_MS);
  return until > now ? Math.ceil((until - now) / 60000) : 0;
}

function recordFailure(client, now) {
  if (!clientFailures.has(client) && clientFailures.size >= MAX_TRACKED_CLIENTS) {
    // Forget the stalest entries rather than grow without bound.
    for (const [key, times] of clientFailures) {
      if (!recent(times, CLIENT_WINDOW_MS, now).length) clientFailures.delete(key);
    }
    if (clientFailures.size >= MAX_TRACKED_CLIENTS) clientFailures.delete(clientFailures.keys().next().value);
  }
  clientFailures.set(client, [...recent(clientFailures.get(client) || [], CLIENT_WINDOW_MS, now), now]);
  globalFailures.push(now);
}

// Undo recordFailure(client, now) for an attempt that turned out to be the owner's.
function forgetFailure(client, now) {
  const mine = clientFailures.get(client) || [];
  const i = mine.lastIndexOf(now);
  if (i !== -1) mine.splice(i, 1);
  const g = globalFailures.lastIndexOf(now);
  if (g !== -1) globalFailures.splice(g, 1);
}

// ---------------------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------------------

let resend = null;
function sendAlert(subject, lines) {
  if (!process.env.RESEND_API_KEY || !process.env.RECIPIENT_EMAIL) return;
  try {
    if (!resend) {
      const { Resend } = require('resend');
      resend = new Resend(process.env.RESEND_API_KEY);
    }
    const text = `${lines.join('\n')}\n\nIf this wasn't you, run "npm run setup-editor" in the backend folder and replace the three EDITOR_ values on Render: that changes the password and authenticator and logs every session out.`;
    resend.emails
      .send({ from: 'Site editor <onboarding@resend.dev>', to: [process.env.RECIPIENT_EMAIL], subject, text })
      .catch((error) => console.error('Editor alert email failed:', error.message));
  } catch (error) {
    console.error('Editor alert email failed:', error.message);
  }
}

const describeRequest = (req) => [
  `Time: ${new Date().toUTCString()}`,
  `Address: ${clientOf(req)}`,
  `Browser: ${String(req.headers['user-agent'] || 'unknown').slice(0, 200)}`,
];

// ---------------------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------------------

const revoked = new Map(); // session id -> expiry

// Tokens are signed with a key tied to the current credentials, so replacing the password
// or authenticator secret invalidates every existing session.
const signingKey = () =>
  crypto
    .createHmac('sha256', sessionSecret())
    .update(`${process.env.EDITOR_PASSWORD_HASH || ''}|${process.env.EDITOR_TOTP_SECRET || ''}`)
    .digest();
const sign = (body) => crypto.createHmac('sha256', signingKey()).update(body).digest('base64url');

function issueToken() {
  const expires = Date.now() + SESSION_MS;
  const body = Buffer.from(JSON.stringify({ exp: expires, sid: crypto.randomBytes(16).toString('hex') })).toString('base64url');
  return { token: `${body}.${sign(body)}`, expires };
}

// The token's claims if it's genuine, unexpired and not logged out; otherwise null.
function readToken(token) {
  const [body, signature, extra] = String(token || '').split('.');
  if (!body || !signature || extra !== undefined) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  try {
    const claims = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    const now = Date.now();
    if (!(claims.exp > now) || claims.exp - now > SESSION_MS || revoked.has(claims.sid)) return null;
    return claims;
  } catch {
    return null;
  }
}

const bearer = (req) => (req.get('authorization') || '').replace(/^Bearer\s+/i, '');

function requireSession(req, res, next) {
  try {
    if (!readToken(bearer(req))) return res.status(401).json({ error: 'Your session expired. Log in again.' });
    return next();
  } catch (error) {
    return next(error);
  }
}

// ---------------------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------------------

let lastCodeStep = -1;

async function login(req, res, next) {
  try {
    // Fail fast (before any work) when the editor isn't configured.
    passwordConfig();
    const secret = totpSecret();
    sessionSecret();

    const now = Date.now();
    const client = clientOf(req);
    const wait = lockedFor(client, now);
    if (wait) return res.status(429).json({ error: `Too many failed logins. Try again in ${wait} minute${wait === 1 ? '' : 's'}.` });
    // Counted as a failure until proven otherwise, in the same tick as the check above, so a
    // burst of parallel guesses can't all slip in before the first one fails.
    recordFailure(client, now);

    const { password, code } = req.body || {};
    const passwordOk = await passwordMatches(password);
    const step = totp.verify(secret, typeof code === 'string' ? code.replace(/\s/g, '') : '', now);
    const codeOk = step !== null && step > lastCodeStep;

    if (!passwordOk || !codeOk) {
      if (lockedFor(client, now) && globalFailures.length >= GLOBAL_MAX_FAILURES && now - lockAlertSent > GLOBAL_WINDOW_MS) {
        lockAlertSent = now;
        sendAlert('Site editor: login locked after repeated failed attempts', [
          `${GLOBAL_MAX_FAILURES} failed logins in the last hour, so logging in is locked for up to an hour.`,
          'Latest attempt:',
          ...describeRequest(req),
        ]);
      }
      // Slow every failure down a little more.
      await sleep(800 + crypto.randomInt(400));
      return res.status(401).json({ error: 'Wrong password or code.' });
    }

    forgetFailure(client, now);
    lastCodeStep = step;
    sendAlert('Site editor: new login', ['Someone just logged in to your site editor.', ...describeRequest(req)]);
    return res.json(issueToken());
  } catch (error) {
    return next(error);
  }
}

function logout(req, res) {
  const claims = (() => {
    try {
      return readToken(bearer(req));
    } catch {
      return null;
    }
  })();
  if (claims) {
    const now = Date.now();
    for (const [sid, exp] of revoked) if (exp <= now) revoked.delete(sid);
    revoked.set(claims.sid, claims.exp);
  }
  res.json({ ok: true });
}

module.exports = { AuthError, requireSession, login, logout, setupStatus, SESSION_MS };
