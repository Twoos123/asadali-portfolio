// Sets up (or resets) the site editor's login and prints the three values to paste into
// Render's Environment tab:
//   npm run setup-editor
//
// 1. Asks for a password twice without echoing it (so it stays out of your shell history).
// 2. Creates an authenticator secret: add it to an authenticator app (Google Authenticator,
//    1Password, Authy, …) as a setup key, then type the code it shows to confirm.
// 3. Creates a random session secret.
// Running it again and replacing the values logs out every existing session.

const crypto = require('crypto');
const readline = require('readline');
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
  console.log('\nNow add the editor to your authenticator app. Choose "enter a setup key" and type:');
  console.log(`\n    Account:  asadbinali.com editor`);
  console.log(`    Key:      ${secret.match(/.{1,4}/g).join(' ')}`);
  console.log('    Type:     time-based\n');
  console.log(`(Or, in an app that takes links: ${totp.setupUri(secret, 'editor', 'asadbinali.com')})\n`);

  for (let tries = 0; ; tries++) {
    const code = (await ask('Code shown in the app: ')).replace(/\s/g, '');
    if (totp.verify(secret, code) !== null) break;
    if (tries === 2) fail("Those codes didn't match. Check that the app's clock is right and run the setup again.");
    console.log("That code didn't match. Wait for the next one and try again.");
  }
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
