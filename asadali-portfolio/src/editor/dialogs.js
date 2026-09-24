import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { FaCheck, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

// In-page replacements for window.prompt / confirm / alert, which some browsers (embedded
// browsers, in-app webviews) block outright and which look out of place on the site.
//
//   const url = await askText({ title: 'GitHub link', value, validate });  // string | null
//   if (await askConfirm({ title: 'Remove the case study?', danger: true })) …
//   notify('Removed skill', { action: { label: 'Undo', run: () => … } });
//
// <EditorDialogs /> (rendered once, in App) shows them.

let dialog = null; // { id, kind: 'text' | 'confirm', ...options, resolve }
let dialogCount = 0;
let toast = null; // { id, message, tone, action }
let toastTimer = null;
const listeners = new Set();
const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

function open(kind, options, cancelValue) {
  return new Promise((resolve) => {
    if (dialog) dialog.resolve(dialog.cancelValue);
    dialog = {
      id: ++dialogCount,
      kind,
      ...options,
      cancelValue,
      resolve: (value) => {
        dialog = null;
        emit();
        resolve(value);
      },
    };
    emit();
  });
}

export const askText = (options) => open('text', options, null);
export const askConfirm = (options) => open('confirm', options, false);

export function notify(message, { tone = 'info', action, duration = 6000 } = {}) {
  clearTimeout(toastTimer);
  toast = { id: Date.now(), message, tone, action };
  emit();
  toastTimer = setTimeout(dismissToast, duration);
}

function dismissToast() {
  clearTimeout(toastTimer);
  toast = null;
  emit();
}

export function Dialog({ title, children, onClose, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-3xl border border-white/15 bg-ocean-950/95 p-6 text-white shadow-glass-lg`}
      >
        <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
        {children}
      </div>
    </div>
  );
}

const BUTTON = 'rounded-full px-5 py-2 font-semibold transition-colors disabled:opacity-50';
const SECONDARY = 'rounded-full px-4 py-2 text-ocean-100 hover:bg-white/10';

function TextDialog({ title, message, value = '', placeholder, confirmLabel = 'Save', validate, resolve, cancelValue }) {
  const [text, setText] = useState(value || '');
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    const problem = validate ? validate(trimmed) : '';
    if (problem) {
      setError(problem);
      return;
    }
    resolve(trimmed);
  };

  return (
    <Dialog title={title} onClose={() => resolve(cancelValue)}>
      {message && <p className="mt-1 text-sm text-ocean-200/80">{message}</p>}
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          placeholder={placeholder}
          spellCheck={false}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-ocean-200/50 outline-none focus:border-ocean-400"
        />
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={() => resolve(cancelValue)} className={SECONDARY}>
            Cancel
          </button>
          <button type="submit" className={`${BUTTON} bg-ocean-500 hover:bg-ocean-400`}>
            {confirmLabel}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

function ConfirmDialog({ title, message, confirmLabel = 'OK', cancelLabel = 'Cancel', danger, resolve }) {
  const confirmRef = useRef(null);
  useEffect(() => confirmRef.current.focus(), []);
  return (
    <Dialog title={title} onClose={() => resolve(false)}>
      {message && <p className="mt-2 text-sm text-ocean-200/80">{message}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={() => resolve(false)} className={SECONDARY}>
          {cancelLabel}
        </button>
        <button
          ref={confirmRef}
          type="button"
          onClick={() => resolve(true)}
          className={`${BUTTON} ${danger ? 'bg-rose-500/90 hover:bg-rose-400' : 'bg-ocean-500 hover:bg-ocean-400'}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}

function Toast({ message, tone, action }) {
  const Icon = tone === 'error' ? FaExclamationTriangle : tone === 'success' ? FaCheck : null;
  return (
    <div
      role="status"
      className={`fixed bottom-20 left-1/2 z-[2050] flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-2xl border ${
        tone === 'error' ? 'border-rose-400/40' : 'border-white/20'
      } bg-ocean-950/95 px-4 py-3 text-sm text-white shadow-glass-lg backdrop-blur-xl`}
    >
      {Icon && <Icon className={tone === 'error' ? 'shrink-0 text-rose-300' : 'shrink-0 text-emerald-300'} />}
      <span>{message}</span>
      {action && (
        <button
          type="button"
          onClick={() => {
            action.run();
            dismissToast();
          }}
          className="rounded-full bg-white/10 px-3 py-1 font-semibold text-ocean-100 hover:bg-white/20"
        >
          {action.label}
        </button>
      )}
      <button type="button" onClick={dismissToast} aria-label="Dismiss" className="rounded-full p-1 text-ocean-100 hover:bg-white/10">
        <FaTimes className="h-3 w-3" />
      </button>
    </div>
  );
}

export default function EditorDialogs() {
  const state = useSyncExternalStore(subscribe, () => dialog);
  const currentToast = useSyncExternalStore(subscribe, () => toast);
  return (
    <>
      {state && state.kind === 'text' && <TextDialog key={state.id} {...state} />}
      {state && state.kind === 'confirm' && <ConfirmDialog key={state.id} {...state} />}
      {currentToast && <Toast key={currentToast.id} {...currentToast} />}
    </>
  );
}
