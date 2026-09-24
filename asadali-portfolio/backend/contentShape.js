// The "shape" of site content: which fields exist, their types, and what list items look
// like. Saves from the editor are checked against it, so the editor can change and add
// content but never invent new fields. Shapes are remembered in src/content/_shape.json,
// so emptying a list doesn't forget what its items look like.

const typeOf = (value) => (value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value);

function mergeShapes(a, b) {
  if (!a) return b;
  if (!b) return a;
  const merged = { types: new Set([...a.types, ...b.types]) };
  if (a.item || b.item) merged.item = mergeShapes(a.item, b.item);
  if (a.keys || b.keys) {
    merged.keys = { ...(a.keys || {}) };
    for (const [key, shape] of Object.entries(b.keys || {})) merged.keys[key] = mergeShapes(merged.keys[key], shape);
  }
  return merged;
}

// Types per field, the union of fields across a list's items (so a new item can use any
// field its siblings use), and nested shapes.
function shapeOf(value) {
  const type = typeOf(value);
  if (type === 'array') return { types: new Set(['array']), item: value.reduce((acc, item) => mergeShapes(acc, shapeOf(item)), undefined) };
  if (type === 'object') {
    const keys = {};
    for (const [key, child] of Object.entries(value)) keys[key] = shapeOf(child);
    return { types: new Set(['object']), keys };
  }
  return { types: new Set([type]) };
}

function shapeToJson(shape) {
  if (!shape) return undefined;
  const out = { types: [...shape.types].sort() };
  if (shape.item) out.item = shapeToJson(shape.item);
  if (shape.keys) out.keys = Object.fromEntries(Object.entries(shape.keys).map(([key, child]) => [key, shapeToJson(child)]));
  return out;
}

function shapeFromJson(json) {
  if (!json || !Array.isArray(json.types)) return undefined;
  const shape = { types: new Set(json.types) };
  if (json.item) shape.item = shapeFromJson(json.item);
  if (json.keys) shape.keys = Object.fromEntries(Object.entries(json.keys).map(([key, child]) => [key, shapeFromJson(child)]));
  return shape;
}

module.exports = { typeOf, mergeShapes, shapeOf, shapeToJson, shapeFromJson };
