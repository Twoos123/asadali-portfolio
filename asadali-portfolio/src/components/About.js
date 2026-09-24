import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import OceanLife from './ocean/OceanLife';
import Editable from '../editor/Editable';
import { useContent } from '../editor/store';

function About() {
  const about = useContent('about');

  return (
    <section id="about" className="relative py-20 md:py-24 px-4">
      <OceanLife section="about" />
      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-3">
          <Editable path="about.eyebrow" className="eyebrow" />
          <Editable
            path="about.heading"
            as="h2"
            className="font-display text-3xl md:text-4xl font-bold text-white mt-3 tracking-tight"
          />
          <div className="mt-5 space-y-4 text-ocean-50/85 leading-relaxed text-base md:text-lg">
            {about.paragraphs.map((_, i) => (
              <Editable key={i} path={`about.paragraphs.${i}`} as="p" rich />
            ))}
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
            <Editable path="about.currently.label" className="eyebrow" />
          </div>

          <dl className="space-y-4 text-sm">
            {about.currently.rows.map((row, i) => (
              <Row key={i} path={`about.currently.rows.${i}`} link={row.link} />
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

// One "Currently" row. A row with a `link` renders its value as a link with an arrow.
function Row({ path, link }) {
  return (
    <div className="grid grid-cols-[88px_1fr] gap-3 items-baseline">
      <Editable path={`${path}.label`} as="dt" className="text-[11px] font-semibold uppercase tracking-widest text-ocean-200/60" />
      {link ? (
        <dd className="text-ocean-50/90 leading-snug">
          <Link to={link} className="inline-flex items-center gap-1.5 text-ocean-100 hover:text-white transition-colors">
            <Editable path={`${path}.value`} />
            <FaArrowRight className="h-2.5 w-2.5" />
          </Link>
        </dd>
      ) : (
        <Editable path={`${path}.value`} as="dd" className="text-ocean-50/90 leading-snug" />
      )}
    </div>
  );
}

export default About;
