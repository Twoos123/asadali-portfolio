// Clicking the water feeds the fish and sends up bubbles, so people click it a lot and fast.
// Left alone, the browser reads quick clicks as double and triple clicks and selects the
// nearest text (the hero's subtitle, from empty water far away), and the next press inside
// that selection starts dragging it, showing the "can't drop here" cursor. So: repeated
// clicks on the water don't select anything, and only links and form fields can be dragged.

const TEXT = 'p, h1, h2, h3, h4, h5, h6, li, dt, dd, blockquote, pre, code, a, button, label, input, textarea, select, [contenteditable]';

// Whether a click on `el` is a click on text (where selecting is expected) rather than water.
function onText(el) {
  if (!el || el.nodeType !== 1) return true;
  if (el.closest(TEXT)) return true;
  // Text sitting directly in a plain element, e.g. <div>Showing 6 of 11 projects</div>.
  return [...el.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim());
}

export function installWaterClicks() {
  const onMouseDown = (e) => {
    if (e.detail > 1 && !onText(e.target)) e.preventDefault();
  };
  const onDragStart = (e) => {
    const el = e.target;
    if (!(el.nodeType === 1 && el.closest('a[href], input, textarea, [contenteditable]'))) e.preventDefault();
  };
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('dragstart', onDragStart);
  return () => {
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('dragstart', onDragStart);
  };
}
