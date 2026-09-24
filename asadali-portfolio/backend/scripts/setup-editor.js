// Sets up (or resets) the site editor's login and prints the three values to paste into
// Render's Environment tab:
//   npm run setup-editor
//
// 1. Asks for a password twice without echoing it (so it stays out of your shell history).
// 2. Creates an authenticator secret and shows it as a QR code to scan with an authenticator
//    app (Google Authenticator, 1Password, Authy, …), then asks for a code to confirm. The QR
//    code is drawn locally (never by a website, which would see the secret).
// 3. Creates a random session secret.
// Running it again and replacing the values logs out every existing session.

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');
const QRCode = require('qrcode');
const totp = require('../totp');

const MIN_LENGTH = 14;
// One of OWASP's recommended scrypt settings (N=2^16, r=8, p=2): as costly to guess as their
// default, with half the memory (64 MiB), which suits the backend's small server.
const N = 2 ** 16;
const R = 8;
const P = 2;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
let muted = false;
rl._writeToOutput = function writeToOutput(text) {
  if (!muted || text.includes('\n')) rl.output.write(text);
};

const ask = (question, { hidden = false } = {}) =>
  new Promise((resolve) => {
    rl.question(question, (answer) => {
      if (hidden) rl.output.write('\n');
      muted = false;
      resolve(answer);
    });
    muted = hidden;
  });

// The browser copy of the QR code, if one was opened: removed whenever the script ends.
let qrPage = null;
const removeQrPage = () => {
  if (qrPage) fs.rmSync(qrPage, { force: true });
  qrPage = null;
};
process.on('exit', removeQrPage);
rl.on('SIGINT', () => process.exit(130));

// A larger QR code in the default browser, for terminals whose font doesn't draw the one
// above cleanly. A local file with no scripts or external requests.
async function openQrPage(uri, key) {
  const svg = await QRCode.toString(uri, { type: 'svg', margin: 4, width: 320, errorCorrectionLevel: 'M' });
  qrPage = path.join(os.tmpdir(), `site-editor-qr-${crypto.randomBytes(6).toString('hex')}.html`);
  fs.writeFileSync(
    qrPage,
    `<!doctype html><meta charset="utf-8"><meta name="referrer" content="no-referrer"><title>Site editor setup</title>
<body style="font-family:system-ui,sans-serif;background:#fff;color:#111;display:grid;place-items:center;min-height:90vh;text-align:center">
<div><h1 style="font-size:20px">Scan with your authenticator app</h1>${svg}
<p>Setup key: <code>${key}</code></p><p style="color:#666">This page is deleted when the setup finishes.</p></div></body>`,
    { mode: 0o600 }
  );
  const [command, args] =
    process.platform === 'win32' ? ['cmd', ['/c', 'start', '', qrPage]] : process.platform === 'darwin' ? ['open', [qrPage]] : ['xdg-open', [qrPage]];
  spawn(command, args, { detached: true, stdio: 'ignore' }).unref();
}

function fail(message) {
  console.error(`\n${message}`);
  rl.close();
  process.exit(1);
}

(async () => {
  console.log(`Site editor setup\n\nChoose a password of at least ${MIN_LENGTH} characters. A few random words`);
  console.log('("harbor-pepper-violin-sunrise") is long, easy to type, and very hard to guess.\n');

  const password = await ask('Password: ', { hidden: true });
  if (password.length < MIN_LENGTH) fail(`Use at least ${MIN_LENGTH} characters.`);
  if (new Set(password).size < 6) fail('That password repeats too few characters. Pick something less predictable.');
  const again = await ask('Password again: ', { hidden: true });
  if (again !== password) fail("The passwords didn't match.");

  const secret = totp.generateSecret();
  const key = secret.match(/.{1,4}/g).join(' ');
  const uri = totp.setupUri(secret, 'editor', 'asadbinali.com');
  console.log('\nNow scan this QR code with your authenticator app (add account → scan a QR code):\n');
  console.log(await QRCode.toString(uri, { type: 'terminal', small: true, errorCorrectionLevel: 'M' }));
  console.log('No camera? Choose "enter a setup key" in the app instead:');
  console.log('    Account:  asadbinali.com editor');
  console.log(`    Key:      ${key}`);
  console.log('    Type:     time-based\n');

  for (let tries = 0; tries < 3; ) {
    const code = (await ask('Code shown in the app (or press Enter to open a bigger QR code in your browser): ')).replace(/\s/g, '');
    if (!code) {
      if (!qrPage) await openQrPage(uri, key);
      console.log('Opened the QR code in your browser. Scan it, then type the code the app shows.');
      continue;
    }
    if (totp.verify(secret, code) !== null) break;
    tries += 1;
    if (tries === 3) fail("Those codes didn't match. Check that your phone's clock is set automatically and run the setup again.");
    console.log("That code didn't match. Wait for the next one and try again.");
  }
  removeQrPage();
  rl.close();

  console.log('\nHashing the password (this takes a moment)…');
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 32, { N, r: R, p: P, maxmem: 256 * N * R });
  const sessionSecret = crypto.randomBytes(32).toString('hex');

  console.log('\nPaste these three into Render (Environment tab), then redeploy the backend:\n');
  console.log(`EDITOR_PASSWORD_HASH=scrypt$${N}$${R}$${P}$${salt.toString('hex')}$${hash.toString('hex')}`);
  console.log(`EDITOR_TOTP_SECRET=${secret}`);
  console.log(`EDITOR_SESSION_SECRET=${sessionSecret}`);
  console.log('\nKeep the authenticator app: you need a code from it every time you log in.');
})();
