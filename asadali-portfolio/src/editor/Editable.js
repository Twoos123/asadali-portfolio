import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { editorStore, useEditing, useField } from './store';
import { renderMarkup } from './markup';

// Renders a piece of site text from src/content by path, e.g.
//   <Editable path="about.heading" as="h2" className="..." />
// In edit mode (?edit) it becomes editable in place. `rich` fields understand the small
// markup in markup.js; while being edited they show that markup raw.
export default function Editable({ path, as: Tag = 'span', className, rich = false, multiline = false, markupOptions, ...rest }) {
  const value = useField(path);
  const editing = useEditing();

  if (!editing) {
    return (
      <Tag className={className} {...rest}>
        {rich ? renderMarkup(value, markupOptions) : value}
      </Tag>
    );
  }
  return (
    <EditableField
      path={path}
      value={value ?? ''}
      Tag={Tag}
      className={className}
      rich={rich}
      multiline={multiline || rich}
      markupOptions={markupOptions}
      rest={rest}
    />
  );
}

// Links and buttons around a piece of text: a single click still follows the link or
// presses the button while editing; a double-click edits the text instead.
const CONTROL = 'a[href], button, [role="button"], summary';
const DOUBLE_CLICK_MS = 280;

function EditableField({ path, value, Tag, className, rich, multiline, markupOptions, rest }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const [inControl, setInControl] = useState(false);
  const [armed, setArmed] = useState(false);
  const clickTimer = useRef(0);
  const raw = !rich || active;
  const editable = raw && (!inControl || armed);
  const changed = value !== (editorStore.original(path) ?? '');

  useLayoutEffect(() => {
    setInControl(Boolean(ref.current && ref.current.parentElement && ref.current.parentElement.closest(CONTROL)));
  }, []);
  useEffect(() => () => clearTimeout(clickTimer.current), []);

  // The text is managed by hand while editable, so the caret doesn't jump as you type.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!raw || !el) return;
    if (document.activeElement !== el && el.innerText !== value) el.innerText = value;
    // Just switched to editing (a rich field opened, or a double-click in a link): focus it
    // with the caret at the end.
    if (((rich && active) || armed) && document.activeElement !== el) {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [raw, rich, active, armed, value]);

  const classes = `${className || ''} site-editable${changed ? ' site-editable--changed' : ''}${rich ? ' site-editable--rich' : ''}${
    inControl && !armed ? ' site-editable--in-control' : ''
  }`;
  const hint = [inControl && 'Double-click to edit this text', rich && 'Rich text: **highlight**, [link text](/path)'].filter(Boolean).join(' · ');

  return (
    <Tag
      key={raw ? 'raw' : 'formatted'}
      ref={ref}
      {...rest}
      className={classes}
      data-editable={path}
      title={hint || undefined}
      contentEditable={editable ? 'plaintext-only' : undefined}
      suppressContentEditableWarning
      spellCheck={editable}
      onClick={(e) => {
        // Editing, not navigating: keep clicks away from any link or card around the text.
        e.preventDefault();
        e.stopPropagation();
        if (inControl && !armed) {
          if (clickTimer.current) {
            clearTimeout(clickTimer.current);
            clickTimer.current = 0;
            setArmed(true);
            if (rich) setActive(true);
            return;
          }
          // Not a double-click after all: pass the click on to the link or button.
          const control = e.currentTarget.parentElement.closest(CONTROL);
          clickTimer.current = setTimeout(() => {
            clickTimer.current = 0;
            control.click();
          }, DOUBLE_CLICK_MS);
          return;
        }
        if (rich && !active) setActive(true);
      }}
      onFocus={() => setActive(true)}
      onBlur={() => {
        setActive(false);
        setArmed(false);
      }}
      onInput={(e) => editorStore.set(path, e.currentTarget.innerText)}
      onPaste={(e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, multiline ? text : text.replace(/\s*\n\s*/g, ' '));
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || (e.key === 'Enter' && !multiline)) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    >
      {raw ? null : renderMarkup(value, markupOptions)}
    </Tag>
  );
}
