import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaExternalLinkAlt, FaGithub, FaGlobeAmericas, FaLayerGroup, FaPen, FaRocket, FaSignOutAlt } from 'react-icons/fa';
import { editorStore } from './store';
import { getSession, login, logout, recentActivity, serverHealth } from './api';
import { setWaterColor } from '../components/ocean/waterColor';
import OceanLife from '../components/ocean/OceanLife';

// /admin: the control room for the site editor, styled like the rest of the site. Public
// to visit; anything that changes the site still needs the editor password (checked by
// the server).

const REPO_URL = 'https://github.com/Twoos123/asadali-portfolio';
// The same mid-depth blue the home page reaches around the Projects section.
const ADMIN_WATER = 'hsl(205, 80%, 32%)';
const SWEEP_SECONDS = 4;
const GLASS = { backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' };

// Sonar "contacts": the site's sections around the scope. Clicking one opens the visual
// editor at that section.
const CONTACTS = [
  { label: 'About', target: '#about', angle: 38, r: 0.58 },
  { label: 'Skills', target: '#skills', angle: 102, r: 0.78 },
  { label: 'Projects', target: '#projects', angle: 168, r: 0.46 },
  { label: 'Experience', target: '#experience', angle: 228, r: 0.74 },
  { label: 'Resume', target: '.resume-section', angle: 286, r: 0.52 },
  { label: 'Contact', target: '.contact-section', angle: 334, r: 0.82 },
];

const timeAgo = (iso) => {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

function GlassCard({ className = '', children }) {
  return (
    <div className={`rounded-3xl border border-white/15 bg-ocean-950/45 shadow-glass ${className}`} style={GLASS}>
      {children}
    </div>
  );
}

export default function AdminConsole() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => getSession());
  const [server, setServer] = useState({ state: 'checking' });
  const [activity, setActivity] = useState(null);

  useEffect(() => setWaterColor(ADMIN_WATER), []);

  // Render's free tier sleeps: a first request can take ~30s while it wakes up.
  useEffect(() => {
    let cancelled = false;
    const slow = setTimeout(() => !cancelled && setServer((s) => (s.state === 'checking' ? { state: 'waking' } : s)), 2500);
    serverHealth()
      .then((health) => !cancelled && setServer({ state: 'online', ...health }))
      .catch(() => !cancelled && setServer({ state: 'offline' }))
      .finally(() => clearTimeout(slow));
    return () => {
      cancelled = true;
      clearTimeout(slow);
    };
  }, []);

  useEffect(() => {
    if (!session) return undefined;
    let cancelled = false;
    recentActivity()
      .then(({ commits }) => !cancelled && setActivity(commits))
      .catch((error) => {
        if (cancelled) return;
        if (error.needsLogin) setSession(null);
        setActivity([]);
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  const openEditor = (target) => {
    editorStore.setEditing(true);
    navigate('/');
    if (target) setTimeout(() => document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' }), 400);
  };

  // A sonar contact: for the owner it opens the editor at that section; for everyone else
  // it's just a shortcut to the section on the normal site.
  const pickSection = (target) => {
    if (session) {
      openEditor(target);
      return;
    }
    navigate('/');
    setTimeout(() => document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' }), 400);
  };

  const signOut = () => {
    logout();
    editorStore.discard();
    editorStore.setEditing(false);
    setSession(null);
    setActivity(null);
  };

  const setupMissing = server.state === 'online' ? ['password', 'session', 'github'].filter((key) => !server[key]) : [];
  const setupNames = { password: 'password hash', session: 'session secret', github: 'GitHub token' };

  return (
    <div className="relative min-h-screen px-4 pb-24 pt-28 md:pt-32">
      <OceanLife section="admin" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-10 max-w-2xl">
          <span className="eyebrow">Control room</span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">Admin console</h1>
          <p className="mt-4 text-base leading-relaxed text-ocean-50/85 md:text-lg">
            Edit any word, image, link or list on the site, review your changes, and publish them live. Every save is one commit to main.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* Sonar over the site's sections, and system status */}
          <GlassCard className="p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <span className="eyebrow">Site sections</span>
              <span className="text-xs text-ocean-200/70">{session ? 'Pick one to start editing there' : 'Pick one to jump there'}</span>
            </div>
            <Sonar onPick={pickSection} />
            <dl className="mt-8 space-y-3 text-sm">
              <StatusRow
                label="Server"
                tone={{ online: 'good', waking: 'warn', checking: 'idle', offline: 'bad' }[server.state]}
                value={
                  {
                    checking: 'Checking…',
                    waking: 'Waking up (free tier, ~30s)…',
                    online: `Online · ${server.ms} ms${server.dryRun ? ' · dry run' : ''}`,
                    offline: 'Unreachable',
                  }[server.state]
                }
              />
              <StatusRow
                label="Editor"
                tone={server.state !== 'online' ? 'idle' : setupMissing.length ? 'warn' : 'good'}
                value={
                  server.state !== 'online'
                    ? '—'
                    : setupMissing.length
                      ? `Not set up: ${setupMissing.map((key) => setupNames[key]).join(', ')}`
                      : 'Ready to publish'
                }
              />
              <StatusRow
                label="Session"
                tone={session ? 'good' : 'idle'}
                value={session ? `Signed in until ${new Date(session.expires).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Signed out'}
              />
            </dl>
          </GlassCard>

          <div className="flex flex-col gap-6">
            {session ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ActionTile primary icon={FaPen} title="Open the editor" detail="Edit the site in place" onClick={() => openEditor()} />
                  <ActionTile icon={FaLayerGroup} title="Projects & case studies" detail="Add, edit or reorder projects" onClick={() => openEditor('#projects')} />
                  <ActionTile icon={FaRocket} title="Deploy history" detail="GitHub Actions runs" href={`${REPO_URL}/actions`} />
                  <ActionTile icon={FaGlobeAmericas} title="Live site" detail="asadbinali.com" href="https://asadbinali.com" />
                </div>
                <ActivityFeed commits={activity} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-ocean-200 transition-colors hover:text-white">
                    <FaGithub /> Twoos123/asadali-portfolio
                  </a>
                  <button
                    type="button"
                    onClick={signOut}
                    className="flex items-center gap-2 rounded-full border border-ocean-300/30 bg-ocean-500/20 px-3 py-1.5 text-xs font-medium text-ocean-50 transition-colors duration-300 hover:bg-ocean-500/30"
                  >
                    <FaSignOutAlt className="h-3 w-3" /> Log out
                  </button>
                </div>
              </>
            ) : (
              <LoginCard onDone={() => setSession(getSession())} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Sonar({ onPick }) {
  return (
    <div className="sonar mx-auto w-full max-w-[360px]">
      <div className="sonar-rings" />
      <div className="sonar-cross" />
      <div className="sonar-sweep" style={{ animationDuration: `${SWEEP_SECONDS}s` }} />
      {CONTACTS.map(({ label, target, angle, r }) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <button
            key={label}
            type="button"
            className="sonar-contact"
            style={{
              left: `${50 + 50 * r * Math.sin(rad)}%`,
              top: `${50 - 50 * r * Math.cos(rad)}%`,
              // Each contact flares as the sweep passes over it (a negative delay starts the
              // cycle mid-way, so no blip sits at full brightness before the first pass).
              '--delay': `${(angle / 360 - 1) * SWEEP_SECONDS}s`,
              '--period': `${SWEEP_SECONDS}s`,
            }}
            onClick={() => onPick(target)}
          >
            <span className="sonar-blip" />
            <span className="sonar-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function StatusRow({ label, value, tone }) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-center gap-3">
      <dt className="text-[11px] font-semibold uppercase tracking-widest text-ocean-200/60">{label}</dt>
      <dd className="flex min-w-0 items-center gap-2 text-ocean-50/90">
        <span className={`admin-led admin-led--${tone}`} />
        <span className="truncate">{value}</span>
      </dd>
    </div>
  );
}

function LoginCard({ onDone }) {
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
    <GlassCard className="p-8 md:p-10">
      <span className="eyebrow">Owner access</span>
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">Log in to edit</h2>
      <p className="mt-2 text-ocean-50/80">Only the site owner can publish changes. Sessions last two hours.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          ref={inputRef}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Editor password"
          aria-label="Editor password"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-ocean-200/50 transition focus:border-ocean-300/60 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean-300/20"
        />
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-ocean-500 to-ocean-400 px-6 py-3.5 font-semibold text-white shadow-glow transition-all duration-300 hover:from-ocean-400 hover:to-ocean-300 hover:shadow-glow-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Checking…' : 'Log in'}
          {!busy && <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />}
        </button>
      </form>
    </GlassCard>
  );
}

function ActionTile({ icon: Icon, title, detail, onClick, href, primary }) {
  const className = `group block rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
    primary
      ? 'border-ocean-300/40 bg-gradient-to-br from-ocean-500/35 to-ocean-400/10 shadow-glow hover:shadow-glow-strong'
      : 'border-white/10 bg-ocean-950/45 hover:border-white/25 hover:bg-ocean-950/60'
  }`;
  const body = (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-500/20 text-ocean-100 transition-transform group-hover:scale-110">
        <Icon className="h-4 w-4" />
      </span>
      <span className="mt-4 block font-display text-lg font-semibold text-white">{title}</span>
      <span className="mt-1 flex items-center gap-1.5 text-sm text-ocean-200/80">
        {detail} {href && <FaExternalLinkAlt className="h-2.5 w-2.5" />}
      </span>
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={primary ? undefined : GLASS}>
      {body}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={className} style={primary ? undefined : GLASS}>
      {body}
    </button>
  );
}

function ActivityFeed({ commits }) {
  return (
    <GlassCard className="p-6 md:p-7">
      <span className="eyebrow">Recent changes</span>
      {commits === null ? (
        <p className="mt-4 text-sm text-ocean-200/70">Loading…</p>
      ) : commits.length === 0 ? (
        <p className="mt-4 text-sm text-ocean-200/70">No changes to show yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {commits.map((commit) => (
            <li key={commit.sha}>
              <a
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-white/5"
              >
                <span className="shrink-0 text-xs font-semibold tabular-nums text-ocean-300">{commit.sha}</span>
                <span className="min-w-0 flex-1 truncate text-ocean-50/90">{commit.message}</span>
                <span className="shrink-0 text-xs text-ocean-200/60">{timeAgo(commit.date)}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
