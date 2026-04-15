import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

function About() {
  return (
    <section id="about" className="relative py-20 md:py-24 px-4">
      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-3">
          <span className="eyebrow">About</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-3 tracking-tight">
            Hi, I'm Asad.
          </h2>
          <div className="mt-5 space-y-4 text-ocean-50/85 leading-relaxed text-base md:text-lg">
            <p>
              I'm a final-year software engineering student at uOttawa. Most of my time
              goes toward real product work, most recently a full-stack rebuild of the
              Faculty of Law's course platform. On the side, I tend to build the tools I
              wish were free: I'd rather put in the engineering time than pay a monthly
              subscription for something I could own. That's where{' '}
              <Link to="/project/10" className="text-ocean-200 underline decoration-ocean-400/50 underline-offset-4 hover:text-white hover:decoration-ocean-300 transition-colors">
                CS2 Meta Engine
              </Link>{' '}
              came from. I'm not about to pay $70 a month to improve at a game I play at
              a high level, so I'm building the analysis pipeline myself.
            </p>
            <p>
              This summer I'm heading back to <span className="text-ocean-100">Health
              Canada</span>. That'll be my fourth SWE role, after internships at{' '}
              <span className="text-ocean-100">8x8</span>, Health Canada, and part-time
              fullstack work at <span className="text-ocean-100">uOttawa's Faculty of
              Law</span>. In between I advise the uOttawa Software Engineering Students'
              Association and spend a lot of time going deep on AI: how modern agentic
              workflows are built, how to weave them into real products, and where they
              actually move the needle.
            </p>
            <p>
              I care about software that feels fast, stays small, and respects the user.
              If that sounds like your kind of thing, let's talk.
            </p>
          </div>
        </div>

        <aside
          className="md:col-span-2 rounded-3xl border border-white/15 bg-ocean-950/45 shadow-glass p-6 md:p-7"
          style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="eyebrow">Currently</span>
          </div>

          <dl className="space-y-4 text-sm">
            <Row label="Role" value="Incoming SWE Intern @ Health Canada (Summer 2026)" />
            <Row
              label="Building"
              value={
                <Link to="/project/10" className="inline-flex items-center gap-1.5 text-ocean-100 hover:text-white transition-colors">
                  CS2 Meta Engine <FaArrowRight className="h-2.5 w-2.5" />
                </Link>
              }
            />
            <Row label="Learning" value="AI workflows & LLMs in production" />
            <Row label="Based in" value="Ottawa, Ontario" />
            <Row label="Grinding" value="CS2 at a top-2,000 NA Faceit level" />
          </dl>
        </aside>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[88px_1fr] gap-3 items-baseline">
      <dt className="text-[11px] font-semibold uppercase tracking-widest text-ocean-200/60">{label}</dt>
      <dd className="text-ocean-50/90 leading-snug">{value}</dd>
    </div>
  );
}

export default About;
