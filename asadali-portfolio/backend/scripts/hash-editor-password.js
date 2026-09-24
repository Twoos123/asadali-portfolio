// Prints the EDITOR_PASSWORD_HASH value for the site editor's password.
//   npm run hash-password
// The password is read without echoing it, so it doesn't end up in your shell history.

const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
rl.stdoutMuted = false;
rl._writeToOutput = function writeToOutput(text) {
  if (!rl.stdoutMuted || text.includes('\n')) rl.output.write(text);
};

rl.question('Editor password: ', (password) => {
  rl.output.write('\n');
  rl.close();
  if (password.length < 12) {
    console.error('Use at least 12 characters.');
    process.exit(1);
  }
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 32);
  console.log(`\nEDITOR_PASSWORD_HASH=scrypt$${salt.toString('hex')}$${hash.toString('hex')}`);
});
rl.stdoutMuted = true;
