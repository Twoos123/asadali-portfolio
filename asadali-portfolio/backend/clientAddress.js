// The visitor's address as Render's proxy saw it, for rate limits. Render's proxy appends the
// address that connected to it to X-Forwarded-For, so the LAST entry is trustworthy. Earlier
// entries (and req.ip with `trust proxy` on, which reads the first one) are whatever the
// client sent, so keying limits on them would let anyone get a fresh limit per request.
module.exports = function clientAddress(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  return forwarded[forwarded.length - 1] || req.socket.remoteAddress || 'unknown';
};
