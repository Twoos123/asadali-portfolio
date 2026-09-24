import React, { useRef } from 'react';
import { FaArrowDown, FaArrowUp, FaLink, FaPlus, FaTimes } from 'react-icons/fa';
import { editorStore, useEditing, useField } from './store';
import { safeUrl } from './markup';
import { askText, notify } from './dialogs';

// Editing controls beyond plain text. They render nothing extra when not editing, so the
// live site is unchanged.

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = 'image/png,image/jpeg,image/webp,image/gif';

const stop = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

// <EditableImage path="projects.items.0.image" alt="..." className="..." />
// An <img> whose source comes from content. While editing, clicking it picks a
// replacement (PNG, JPEG, WebP or GIF up to 5 MB), previewed straight away.
export function EditableImage({ path, alt = '', className, ...rest }) {
  const value = useField(path);
  const editing = useEditing();
  const inputRef = useRef(null);
  const src = editorStore.resolveImage(value);
  const shownSrc = src && src.startsWith('blob:') ? src : safeUrl(src);

  if (!editing) return <img src={shownSrc} alt={alt} className={className} {...rest} />;

  const changed = value !== editorStore.original(path);
  return (
    <>
      <img
        src={shownSrc}
        alt={alt}
        className={`${className || ''} site-editable-image${changed ? ' site-editable--changed' : ''}`}
        title="Click to replace this image"
        {...rest}
        onClick={(e) => {
          stop(e);
          inputRef.current.click();
        }}
      />
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES}
        hidden
        onChange={(e) => {
          const file = e.target.files && e.target.files[0];
          e.target.value = '';
          if (!file) return;
          if (!IMAGE_TYPES.split(',').includes(file.type)) {
            notify('Use a PNG, JPEG, WebP or GIF image.', { tone: 'error' });
            return;
          }
          if (file.size > MAX_IMAGE_BYTES) {
            notify('That image is over 5 MB. Please use a smaller one.', { tone: 'error' });
            return;
          }
          editorStore.set(path, editorStore.addUpload(file));
        }}
      />
    </>
  );
}

// Edits a URL stored in content (GitHub, demo, social links…). While editing it shows a
// small pill with the link; clicking it opens a dialog to change it. Renders nothing otherwise.
export function LinkEdit({ path, label = 'Link', className = '' }) {
  const value = useField(path);
  const editing = useEditing();
  if (!editing) return null;
  const changed = value !== editorStore.original(path);
  return (
    <button
      type="button"
      className={`site-edit-control inline-flex max-w-full items-center gap-1.5 ${changed ? 'site-edit-control--changed' : ''} ${className}`}
      title={value || 'No link'}
      onClick={async (e) => {
        stop(e);
        const next = await askText({
          title: label,
          message: 'An https:// link, a mailto: address, or a page on this site like /project/10. Leave it empty for no link.',
          value: value || '',
          placeholder: 'https://…',
          validate: (text) => (text && !safeUrl(text) ? 'Links must start with https://, http://, mailto: or /.' : ''),
        });
        if (next === null) return;
        editorStore.set(path, next || (value === null ? null : ''));
      }}
    >
      <FaLink className="h-2.5 w-2.5 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

// Move/remove buttons for one item of a list in the content. Place it inside the item's
// element, which must be position: relative (the controls sit in its top-right corner).
// Removing is immediate, with an Undo in the toast that follows.
export function ItemControls({ listPath, index, count, label = 'item', className = '' }) {
  const editing = useEditing();
  if (!editing) return null;
  return (
    <span className={`site-item-controls ${className}`} onClick={stop} role="group" aria-label={`${label} ${index + 1} controls`}>
      <button type="button" title={`Move ${label} earlier`} disabled={index === 0} onClick={(e) => { stop(e); editorStore.move(listPath, index, index - 1); }}>
        <FaArrowUp />
      </button>
      <button type="button" title={`Move ${label} later`} disabled={index === count - 1} onClick={(e) => { stop(e); editorStore.move(listPath, index, index + 1); }}>
        <FaArrowDown />
      </button>
      <button
        type="button"
        title={`Remove ${label}`}
        className="site-item-controls__remove"
        onClick={(e) => {
          stop(e);
          const item = editorStore.get(`${listPath}.${index}`);
          editorStore.remove(listPath, index);
          notify(`Removed the ${label}.`, { action: { label: 'Undo', run: () => editorStore.insert(listPath, item, index) } });
        }}
      >
        <FaTimes />
      </button>
    </span>
  );
}

// "+ Add …" for a list in the content. `template` is the new item (or a function that gets
// the current list and returns it, e.g. to pick the next free id).
export function AddItem({ listPath, template, label = 'item', at, className = '' }) {
  const editing = useEditing();
  if (!editing) return null;
  return (
    <button
      type="button"
      className={`site-add-item ${className}`}
      onClick={(e) => {
        stop(e);
        const list = editorStore.get(listPath) || [];
        const item = typeof template === 'function' ? template(list) : template;
        editorStore.insert(listPath, item, at);
      }}
    >
      <FaPlus className="h-2.5 w-2.5" />
      Add {label}
    </button>
  );
}

// A choice between fixed options stored in content (e.g. an experience entry's kind).
export function EditSelect({ path, options, label, className = '' }) {
  const value = useField(path);
  const editing = useEditing();
  if (!editing) return null;
  return (
    <label className={`site-edit-control inline-flex items-center gap-1.5 ${className}`} onClick={(e) => e.stopPropagation()}>
      {label && <span>{label}</span>}
      <select value={value ?? ''} onChange={(e) => editorStore.set(path, e.target.value)} className="bg-transparent outline-none">
        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option} className="text-black">
            {option.label ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}
