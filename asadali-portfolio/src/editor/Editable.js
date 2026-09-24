import React, { useLayoutEffect, useRef, useState } from 'react';
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

function EditableField({ path, value, Tag, className, rich, multiline, markupOptions, rest }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const raw = !rich || active;
  const changed = value !== (editorStore.original(path) ?? '');

  // The text is managed by hand while editable, so the caret doesn't jump as you type.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!raw || !el) return;
    if (document.activeElement !== el && el.innerText !== value) el.innerText = value;
    if (rich && active && document.activeElement !== el) {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [raw, rich, active, value]);

  const classes = `${className || ''} site-editable${changed ? ' site-editable--changed' : ''}${rich ? ' site-editable--rich' : ''}`;

  return (
    <Tag
      key={raw ? 'raw' : 'formatted'}
      ref={ref}
      {...rest}
      className={classes}
      data-editable={path}
      title={rich ? 'Rich text: **highlight**, [link text](/path)' : undefined}
      contentEditable={raw ? 'plaintext-only' : undefined}
      suppressContentEditableWarning
      spellCheck={raw}
      onClick={(e) => {
        // Editing, not navigating: keep clicks away from any link or card around the text.
        e.preventDefault();
        e.stopPropagation();
        if (rich && !active) setActive(true);
      }}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
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
