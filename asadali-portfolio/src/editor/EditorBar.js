import React, { useEffect, useRef, useState } from 'react';
import { FaCheck, FaExternalLinkAlt, FaPen, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { editorStore, useChanges, useEditing } from './store';
import { deployStatus, getSession, login, logout, publishDraft } from './api';
import { askConfirm, Dialog } from './dialogs';

// The editing toolbar (shown in edit mode): pending changes, and the publish flow of
// log in -> review and confirm -> commit to main -> wait for the deploy to go live.

const POLL_MS = 5000;
const POLL_LIMIT_MS = 8 * 60 * 1000;

const label = (path) => path.split('.').join(' › ');

// A short, human description of any content value for the review list.
function describe(value) {
  if (value === undefined || value === null || value === '') return '(empty)';
  if (typeof value === 'string') return value.startsWith('upload:') ? '(new image)' : value;
  if (typeof value !== 'object') return String(value);
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? '' : 's'}`;
  const named = ['name', 'title', 'org', 'label', 'heading', 'text'].find((key) => typeof value[key] === 'string');
  if (named) return value[named];
  const firstText = Object.values(value).find((v) => typeof v === 'string' && v);
  return firstText || 'item';
}

export default function EditorBar() {
  const editing = useEditing();
  const changes = useChanges();
  const [step, setStep] = useState(null); // null | 'login' | 'confirm'
  const [status, setStatus] = useState(null); // { state, message, commitUrl, runUrl }
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getSession()));

  // Don't lose unpublished edits to an accidental reload or tab close.
  useEffect(() => {
    if (!changes.length) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [changes.length]);

  if (!editing) return null;

  const startPublish = () => setStep(getSession() ? 'confirm' : 'login');

  const exit = async () => {
    if (changes.length && !(await askConfirm({ title: 'Leave edit mode?', message: `Your ${changes.length} unpublished change${changes.length === 1 ? '' : 's'} will be discarded.`, confirmLabel: 'Discard & leave', danger: true }))) return;
    editorStore.discard();
    editorStore.setEditing(false);
  };

  const signOut = async () => {
    if (changes.length && !(await askConfirm({ title: 'Log out?', message: `Your ${changes.length} unpublished change${changes.length === 1 ? '' : 's'} will be discarded.`, confirmLabel: 'Discard & log out', danger: true }))) return;
    logout();
    setLoggedIn(false);
    editorStore.discard();
    editorStore.setEditing(false);
  };

  const publish = async () => {
    const files = Object.fromEntries(editorStore.changedFiles().map((file) => [file, editorStore.draftFile(file)]));
    const uploads = editorStore.pendingUploads();
    setStep(null);
    setStatus({ state: 'saving', message: uploads.length ? `Uploading ${uploads.length} image${uploads.length === 1 ? '' : 's'} and saving…` : 'Saving your changes…' });
    try {
      const commit = await publishDraft({ files, uploads });
      editorStore.markPublished(commit.paths);
      setStatus({ state: 'running', message: 'Saved. Publishing the site…', commitUrl: commit.url });
      watchDeploy(commit.sha, commit.url, setStatus);
    } catch (error) {
      if (error.needsLogin) {
        setLoggedIn(false);
        setStep('login');
      }
      setStatus({ state: 'failure', message: error.message });
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[2000] flex max-w-[96vw] items-center gap-2 rounded-full border border-white/20 bg-ocean-950/90 px-3 py-2 text-sm text-white shadow-glass-lg backdrop-blur-xl">
        <FaPen className="ml-1 h-3 w-3 shrink-0 text-ocean-300" />
        <span className="px-1 font-medium">
          Editing
          <span className="ml-2 hidden text-ocean-200/80 sm:inline">
            {changes.length ? `${changes.length} unpublished change${changes.length === 1 ? '' : 's'}` : 'Click text or images to change them · double-click links and buttons'}
          </span>
        </span>
        {changes.length > 0 && (
          <>
            <button type="button" onClick={() => editorStore.discard()} className="rounded-full px-3 py-1 text-ocean-100 hover:bg-white/10">
              Discard
            </button>
            <button type="button" onClick={startPublish} className="rounded-full bg-ocean-500 px-4 py-1 font-semibold hover:bg-ocean-400">
              Review &amp; publish
            </button>
          </>
        )}
        {loggedIn && (
          <button type="button" onClick={signOut} aria-label="Log out" title="Log out" className="rounded-full p-2 text-ocean-100 hover:bg-white/10">
            <FaSignOutAlt className="h-3 w-3" />
          </button>
        )}
        <button type="button" onClick={exit} aria-label="Leave edit mode" title="Leave edit mode" className="rounded-full p-2 text-ocean-100 hover:bg-white/10">
          <FaTimes className="h-3 w-3" />
        </button>
      </div>

      {status && <StatusToast status={status} onClose={() => setStatus(null)} />}
      {step === 'login' && (
        <LoginDialog
          onCancel={() => setStep(null)}
          onDone={() => {
            setLoggedIn(true);
            setStep('confirm');
          }}
        />
      )}
      {step === 'confirm' && <ConfirmDialog changes={changes} onCancel={() => setStep(null)} onConfirm={publish} />}
    </>
  );
}

function watchDeploy(sha, commitUrl, setStatus) {
  const started = Date.now();
  const poll = async () => {
    try {
      const { state, url } = await deployStatus(sha);
      if (state === 'success') {
        setStatus({ state: 'success', message: 'Your changes are live.', commitUrl, runUrl: url });
        return;
      }
      if (state === 'failure') {
        setStatus({ state: 'failure', message: 'Saved, but the deploy failed. Check the workflow run.', commitUrl, runUrl: url });
        return;
      }
      setStatus({ state: 'running', message: state === 'pending' ? 'Saved. Waiting for the deploy to start…' : 'Saved. Building and deploying the site…', commitUrl, runUrl: url });
    } catch {
      // Transient (the server may be waking up); keep polling.
    }
    if (Date.now() - started < POLL_LIMIT_MS) setTimeout(poll, POLL_MS);
    else setStatus({ state: 'failure', message: 'Saved, but the deploy is taking unusually long. Check the workflow run.', commitUrl });
  };
  setTimeout(poll, POLL_MS);
}

export function PasswordForm({ onDone, onCancel, submitLabel = 'Log in' }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => inputRef.current?.focus(), []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(password);
      onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <input
        ref={inputRef}
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Editor password"
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-ocean-200/50 outline-none focus:border-ocean-400"
      />
      {error && <p className="text-sm text-rose-300">{error}</p>}
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-ocean-100 hover:bg-white/10">
            Cancel
          </button>
        )}
        <button type="submit" disabled={busy || !password} className="rounded-full bg-ocean-500 px-5 py-2 font-semibold hover:bg-ocean-400 disabled:opacity-50">
          {busy ? 'Checking…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function LoginDialog({ onCancel, onDone }) {
  return (
    <Dialog title="Log in to publish" onClose={onCancel}>
      <PasswordForm onCancel={onCancel} onDone={onDone} />
    </Dialog>
  );
}

const KIND_STYLE = {
  added: { label: 'Added', className: 'text-emerald-300' },
  removed: { label: 'Removed', className: 'text-rose-300' },
  reordered: { label: 'Reordered', className: 'text-ocean-300' },
  changed: { label: 'Changed', className: 'text-amber-200' },
};

function ConfirmDialog({ changes, onCancel, onConfirm }) {
  return (
    <Dialog title={`Publish ${changes.length} change${changes.length === 1 ? '' : 's'}?`} onClose={onCancel} wide>
      <p className="mt-1 text-sm text-ocean-200/80">This commits the new content to main and redeploys the live site.</p>
      <ul className="mt-4 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
        {changes.map(({ path, kind, before, after }) => (
          <li key={`${kind}-${path}`} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm">
            <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-widest">
              <span className="text-ocean-300">{label(path)}</span>
              <span className={KIND_STYLE[kind].className}>{KIND_STYLE[kind].label}</span>
            </div>
            {(kind === 'changed' || kind === 'removed') && (
              <div className="whitespace-pre-wrap text-rose-200/90 line-through decoration-rose-300/40">{describe(before)}</div>
            )}
            {(kind === 'changed' || kind === 'added') && <div className="mt-1 whitespace-pre-wrap text-emerald-200">{describe(after)}</div>}
            {kind === 'reordered' && <div className="text-ocean-100/90">New order: {after.map(describe).join(', ')}</div>}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-ocean-100 hover:bg-white/10">
          Keep editing
        </button>
        <button type="button" onClick={onConfirm} className="rounded-full bg-ocean-500 px-5 py-2 font-semibold hover:bg-ocean-400">
          Confirm &amp; publish
        </button>
      </div>
    </Dialog>
  );
}

function StatusToast({ status, onClose }) {
  const { state, message, commitUrl, runUrl } = status;
  const busy = state === 'saving' || state === 'running';
  const tone = state === 'success' ? 'border-emerald-400/40' : state === 'failure' ? 'border-rose-400/40' : 'border-white/20';
  return (
    <div role="status" className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[2000] flex max-w-[92vw] items-center gap-3 rounded-2xl border ${tone} bg-ocean-950/95 px-4 py-3 text-sm text-white shadow-glass-lg backdrop-blur-xl`}>
      {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : state === 'success' ? <FaCheck className="text-emerald-300" /> : null}
      <span>{message}</span>
      {commitUrl && (
        <a href={commitUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ocean-300 hover:text-white">
          commit <FaExternalLinkAlt className="h-2.5 w-2.5" />
        </a>
      )}
      {runUrl && (
        <a href={runUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ocean-300 hover:text-white">
          deploy <FaExternalLinkAlt className="h-2.5 w-2.5" />
        </a>
      )}
      {!busy && (
        <button type="button" onClick={onClose} aria-label="Dismiss" className="rounded-full p-1 text-ocean-100 hover:bg-white/10">
          <FaTimes className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
