// Small path builders for the procedurally animated parts (tentacles, arms).

const f = (n) => Math.round(n * 10) / 10;

// Smooth open path through flat [x0, y0, x1, y1, ...] points using midpoint quadratics.
export function smoothLine(pts, move = 'M') {
  const n = pts.length / 2;
  let d = `${move}${f(pts[0])} ${f(pts[1])}`;
  for (let i = 1; i < n - 1; i++) {
    const x = pts[i * 2];
    const y = pts[i * 2 + 1];
    d += `Q${f(x)} ${f(y)} ${f((x + pts[i * 2 + 2]) / 2)} ${f((y + pts[i * 2 + 3]) / 2)}`;
  }
  return `${d}L${f(pts[n * 2 - 2])} ${f(pts[n * 2 - 1])}`;
}

// A tapered limb grown from (x, y) along `heading`. `curvature(s)` is the turn rate in
// radians per unit of length at s (0 = root, 1 = tip), so waves and curls stay the same
// shape regardless of how many segments are used.
export function limbPath(x, y, heading, length, segments, curvature, widthAt) {
  const step = length / segments;
  const left = [];
  const right = [];
  let a = heading;
  for (let i = 0; i <= segments; i++) {
    const s = i / segments;
    const half = widthAt(s) / 2;
    const nx = -Math.sin(a);
    const ny = Math.cos(a);
    left.push(x + nx * half, y + ny * half);
    right.unshift(x - nx * half, y - ny * half);
    if (i < segments) {
      a += curvature(s) * step;
      x += Math.cos(a) * step;
      y += Math.sin(a) * step;
    }
  }
  return `${smoothLine(left)}${smoothLine(right, 'L')}Z`;
}

// SVG transform that rotates/scales around a pivot point.
export function around(px, py, deg, sx = 1, sy = 1) {
  return `translate(${px} ${py}) rotate(${f(deg)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(${-px} ${-py})`;
}
