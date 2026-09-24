import React, { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import "react-vertical-timeline-component/style.min.css";
import { FaBriefcase, FaHandsHelping, FaHourglassHalf, FaMapMarkerAlt } from 'react-icons/fa';
import { FadeInSection } from '../components/animations';
import OceanLife from '../components/ocean/OceanLife';
import Editable from '../editor/Editable';
import { AddItem, EditableImage, EditSelect, ItemControls, LinkEdit } from '../editor/controls';
import { useContent, useEditing } from '../editor/store';

const ACCENTS = {
  work: 'from-ocean-400 to-ocean-500',
  volunteer: 'from-violet-400 to-fuchsia-500',
  incoming: 'from-amber-300 to-orange-400',
};

const ICONS = {
  work: FaBriefcase,
  volunteer: FaHandsHelping,
  incoming: FaHourglassHalf,
};

const ICON_STYLES = {
  work: { background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', color: '#fff' },
  volunteer: { background: 'linear-gradient(135deg, #a78bfa, #d946ef)', color: '#fff' },
  incoming: {
    background: 'linear-gradient(135deg, #fcd34d, #fb923c)',
    color: '#fff',
    boxShadow: '0 0 0 4px rgba(251, 191, 36, 0.25), 0 0 20px rgba(251, 191, 36, 0.5)',
  },
};

const KIND_OPTIONS = [
  { value: 'work', label: 'Work' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'incoming', label: 'Incoming' },
];

const NEW_ENTRY = {
  kind: 'work',
  logo: '',
  org: 'New organization',
  role: 'Role · Team',
  period: 'Mon YYYY - Mon YYYY',
  location: 'City, Province',
  description: '',
  skills: ['New tag'],
};

const CONTENT_STYLE = {
  background: 'transparent',
  boxShadow: 'none',
  padding: 0,
  borderRadius: 0,
};

const CONTENT_ARROW_STYLE = { display: 'none' };

// Shown in an empty field while editing, so it can still be found and clicked.
const EMPTY_HINT = " min-h-[1.25rem] empty:before:content-['Optional_description'] empty:before:italic empty:before:text-ocean-300/50";

// The logo inside the white badge: "?" for an incoming role, else the logo image, else the
// organization's initial. While editing, an empty logo can still be clicked to upload one.
function Logo({ path, kind, logo, org }) {
  const editing = useEditing();
  if (kind === 'incoming') return <span className="text-3xl font-bold text-amber-500 font-display">?</span>;
  if (logo) return <EditableImage path={path} alt={org} className="h-full w-full object-contain" />;

  const initial = <span className="text-3xl font-bold text-ocean-500 font-display">{(org || '').trim().charAt(0) || '?'}</span>;
  if (!editing) return initial;
  return (
    <>
      {initial}
      <EditableImage path={path} alt="" className="absolute inset-0 h-full w-full" />
    </>
  );
}

// `entry` is the live (draft) entry; its text is rendered from `path` so edits show in place.
function TimelineCard({ entry, path, index, count }) {
  const editing = useEditing();
  const { kind, logo, org, location, skills = [], description } = entry;
  const isIncoming = kind === 'incoming';

  return (
    <div
      className="group relative rounded-2xl overflow-hidden border border-white/15 bg-ocean-950/50 hover:bg-ocean-950/60 hover:border-white/25 transition-all duration-300 shadow-glass"
      style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${ACCENTS[kind] || ACCENTS.work}`} />
      <ItemControls listPath="experience.entries" index={index} count={count} label="entry" />
      <div className="p-5 sm:p-6">
        {editing && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3 pr-20">
            <EditSelect path={`${path}.kind`} options={KIND_OPTIONS} label="Kind" />
            {!isIncoming && <LinkEdit path={`${path}.logo`} label="Logo URL" />}
          </div>
        )}

        {/* Header: Logo + Right Content (Title Row with Date Badge, Role, Location) */}
        <div className="flex items-start gap-3.5 mb-2.5">
          {/* Logo Badge */}
          <div className="relative flex-shrink-0 h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white shadow-md flex items-center justify-center p-2 overflow-hidden">
            <Logo path={`${path}.logo`} kind={kind} logo={logo} org={org} />
          </div>

          {/* Texts & Date Badge */}
          <div className="min-w-0 flex-1">
            {/* Top row: Organization name + Period badge */}
            <div className="flex items-center justify-between gap-2">
              <Editable path={`${path}.org`} as="h3" className="font-display text-lg sm:text-xl font-bold text-white tracking-tight leading-tight m-0" />
              <Editable
                path={`${path}.period`}
                className="shrink-0 hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wider uppercase bg-white/10 border border-white/10 text-ocean-100"
              />
            </div>

            {/* Role */}
            <Editable path={`${path}.role`} as="div" className="text-xs sm:text-sm font-semibold text-ocean-200 tracking-wide mt-0.5 sm:whitespace-nowrap" />

            {/* Location */}
            {(location || editing) && (
              <div className="text-[11px] sm:text-xs text-ocean-300/80 flex items-center gap-1.5 mt-0.5 font-medium tracking-wide sm:whitespace-nowrap">
                <FaMapMarkerAlt className="text-ocean-400 text-[10px] shrink-0" />
                <Editable path={`${path}.location`} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile period display */}
        <div className="sm:hidden mb-2">
          <Editable
            path={`${path}.period`}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/10 border border-white/10 text-ocean-100"
          />
        </div>

        {(description || editing) && (
          <Editable
            path={`${path}.description`}
            as="p"
            className={`text-ocean-50/85 text-xs sm:text-sm leading-relaxed mb-3${editing ? EMPTY_HINT : ''}`}
          />
        )}

        {(skills.length > 0 || editing) && (
          <div className="flex flex-wrap gap-1.5 pt-1.5 mt-1">
            {skills.map((skill, idx) => {
              const tag = (
                <Editable
                  key={idx}
                  path={`${path}.skills.${idx}`}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.05] border border-white/[0.08] text-ocean-200/90 group-hover:bg-white/[0.08] group-hover:border-white/15 transition-all"
                />
              );
              if (!editing) return tag;
              return (
                <span key={idx} className="inline-flex items-center gap-1">
                  {tag}
                  <ItemControls listPath={`${path}.skills`} index={idx} count={skills.length} label="tag" className="!static" />
                </span>
              );
            })}
            <AddItem listPath={`${path}.skills`} template="New tag" label="tag" />
          </div>
        )}
      </div>
    </div>
  );
}

function Experience() {
  const [isMobile, setIsMobile] = useState(false);
  const content = useContent('experience');
  const editing = useEditing();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="experience-section relative min-h-screen bg-transparent" style={{
      backgroundSize: '120vw 120vh',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    }}>
      <OceanLife section="experience" />

      <FadeInSection direction="up" delay={0.2} threshold={0.3}>
        <div className='py-16 text-center relative z-10'>
          <Editable path="experience.eyebrow" className="eyebrow" />
          <Editable path="experience.heading" as="h1" className="font-display text-4xl md:text-5xl font-bold text-white mt-3 tracking-tight" />
        </div>
      </FadeInSection>

      <div className="relative z-10">
        {/* Newest first: new entries go at the top. */}
        {editing && (
          <div className="flex justify-center pb-8">
            <AddItem listPath="experience.entries" template={NEW_ENTRY} label="entry" at={0} />
          </div>
        )}
        <FadeInSection direction="up" delay={0.3} threshold={0.2}>
          <VerticalTimeline lineColor="rgba(255,255,255,0.18)" animate={!isMobile}>
            {content.entries.map((entry, i) => {
              const Icon = ICONS[entry.kind] || ICONS.work;
              return (
                <VerticalTimelineElement
                  key={i}
                  iconStyle={ICON_STYLES[entry.kind] || ICON_STYLES.work}
                  icon={<Icon />}
                  contentStyle={CONTENT_STYLE}
                  contentArrowStyle={CONTENT_ARROW_STYLE}
                >
                  <TimelineCard entry={entry} path={`experience.entries.${i}`} index={i} count={content.entries.length} />
                </VerticalTimelineElement>
              );
            })}
          </VerticalTimeline>
        </FadeInSection>
      </div>
    </div>
  );
}

export default Experience;
