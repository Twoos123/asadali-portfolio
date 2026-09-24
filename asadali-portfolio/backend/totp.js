// Time-based one-time codes (RFC 6238), the 6-digit codes from an authenticator app
// (Google Authenticator, 1Password, Authy, …). The editor's second login factor.

const crypto = require('crypto');

const STEP_SECONDS = 30;
const DIGITS = 6;
const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buffer) {
  let bits = '';
  for (const byte of buffer) bits += byte.toString(2).padStart(8, '0');
  let out = '';
  for (let i = 0; i < bits.length; i += 5) out += BASE32[parseInt(bits.slice(i, i + 5).padEnd(5, '0'), 2)];
  return out;
}

function base32Decode(text) {
  const clean = String(text).toUpperCase().replace(/[\s=-]/g, '');
  let bits = '';
  for (const char of clean) {
    const value = BASE32.indexOf(char);
    if (value === -1) throw new Error('The authenticator secret is not valid base32.');
    bits += value.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

// A new random secret (160 bits, as the RFC recommends).
const generateSecret = () => base32Encode(crypto.randomBytes(20));

function codeAt(key, step) {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const mac = crypto.createHmac('sha1', key).update(counter).digest();
  const offset = mac[mac.length - 1] & 0x0f;
  const number = mac.readUInt32BE(offset) & 0x7fffffff;
  return String(number % 10 ** DIGITS).padStart(DIGITS, '0');
}

const currentStep = (now = Date.now()) => Math.floor(now / 1000 / STEP_SECONDS);

// The time step `code` belongs to (allowing one step of clock drift either way), or null.
// Every candidate is compared in constant time.
function verify(secret, code, now = Date.now()) {
  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) return null;
  const key = base32Decode(secret);
  const given = Buffer.from(code);
  const step = currentStep(now);
  let match = null;
  for (const candidate of [step - 1, step, step + 1]) {
    if (crypto.timingSafeEqual(Buffer.from(codeAt(key, candidate)), given) && match === null) match = candidate;
  }
  return match;
}

// otpauth:// link that authenticator apps understand (for a QR code or manual entry).
const setupUri = (secret, account, issuer) =>
  `otpauth://totp/${encodeURIComponent(`${issuer}:${account}`)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=${DIGITS}&period=${STEP_SECONDS}`;

module.exports = { generateSecret, verify, setupUri, codeAt, base32Decode, currentStep };
