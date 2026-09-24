// The ocean's depth colour changes on every scroll event, so rather than going through React
// state or an inherited CSS variable (both of which restyle or re-render the whole page),
// it is written straight to the few elements that show it: the fixed water layer behind the
// page and the hero's waves.

export const SURFACE_COLOR = 'hsl(195, 70%, 55%)';

const painters = new Set();
let current = SURFACE_COLOR;

export function setWaterColor(color) {
  if (color === current) return;
  current = color;
  painters.forEach((paint) => paint(color));
}

// Registers a painter, immediately calls it with the current colour, and returns an
// unsubscribe function.
export function onWaterColor(paint) {
  painters.add(paint);
  paint(current);
  return () => painters.delete(paint);
}
