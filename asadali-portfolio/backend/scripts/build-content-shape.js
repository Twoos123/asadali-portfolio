// Rebuilds src/content/_shape.json from the current content files, keeping every shape it
// already remembers. Run it after changing the content structure in code:
//   npm run content-shape
// (The editor's save endpoint keeps it up to date on its own.)

const fs = require('fs');
const path = require('path');
const { mergeShapes, shapeOf, shapeToJson, shapeFromJson } = require('../contentShape');

const contentDir = path.join(__dirname, '..', '..', 'src', 'content');
const shapePath = path.join(contentDir, '_shape.json');
const stored = fs.existsSync(shapePath) ? JSON.parse(fs.readFileSync(shapePath, 'utf8')) : {};

const files = fs.readdirSync(contentDir).filter((file) => file.endsWith('.json') && !file.startsWith('_'));
const shapes = {};
for (const file of files) {
  const name = file.replace(/\.json$/, '');
  const doc = JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf8'));
  shapes[name] = shapeToJson(mergeShapes(shapeFromJson(stored[name]), shapeOf(doc)));
}
fs.writeFileSync(shapePath, `${JSON.stringify(shapes, null, 2)}\n`);
console.log(`Wrote ${path.relative(process.cwd(), shapePath)} (${files.length} content files).`);
