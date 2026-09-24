import React, { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import "react-vertical-timeline-component/style.min.css";
import { FaBriefcase, FaHandsHelping, FaHourglassHalf, FaMapMarkerAlt } from 'react-icons/fa';
import { FadeInSection } from '../components/animations';
import OceanLife from '../components/ocean/OceanLife';
import Editable from '../editor/Editable';
import { useContent } from '../editor/store';

// Logo images stay in code; each entry in src/content/experience.json picks one by key.
const LOGOS = {
  sunLife: process.env.PUBLIC_URL + '/assets/sunlife.svg?v=3',
  healthCanada: process.env.PUBLIC_URL + '/assets/health-canada.svg?v=3',
  uOttawa: process.env.PUBLIC_URL + '/assets/uottawa.svg?v=3',
  sesa: process.env.PUBLIC_URL + '/assets/SESA.svg?v=3',
  eightByEight: process.env.PUBLIC_URL + '/assets/8x8.svg?v=3',
  uOttaHack: process.env.PUBLIC_URL + '/assets/uOttaHack.svg?v=3',
};

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

const CONTENT_STYLE = {
  background: 'transparent',
  boxShadow: 'none',
  padding: 0,
  borderRadius: 0,
};

const CONTENT_ARROW_STYLE = { display: 'none' };

// `entry` is the published entry (for structure); its text is rendered from `path` so edits show live.
function TimelineCard({ entry, path }) {
  const { kind, logo, org, location, skills, description } = entry;
  const isIncoming = kind === 'incoming';

  return (
    <div
      className="group relative rounded-2xl overflow-hidden border border-white/15 bg-ocean-950/50 hover:bg-ocean-950/60 hover:border-white/25 transition-all duration-300 shadow-glass"
      style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${ACCENTS[kind]}`} />
      <div className="p-5 sm:p-6">
        {/* Header: Logo + Right Content (Title Row with Date Badge, Role, Location) */}
        <div className="flex items-start gap-3.5 mb-2.5">
          {/* Logo Badge */}
          <div className="flex-shrink-0 h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white shadow-md flex items-center justify-center p-2 overflow-hidden">
            {isIncoming ? (
              <span className="text-3xl font-bold text-amber-500 font-display">?</span>
            ) : (
              <img src={LOGOS[logo]} alt={org} className="h-full w-full object-contain" />
            )}
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
            {location && (
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

        {description && (
          <Editable path={`${path}.description`} as="p" className="text-ocean-50/85 text-xs sm:text-sm leading-relaxed mb-3" />
        )}

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1.5 mt-1">
            {skills.map((skill, idx) => (
              <Editable
                key={idx}
                path={`${path}.skills.${idx}`}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.05] border border-white/[0.08] text-ocean-200/90 group-hover:bg-white/[0.08] group-hover:border-white/15 transition-all"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Experience() {
  const [isMobile, setIsMobile] = useState(false);
  const content = useContent('experience');

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
        <FadeInSection direction="up" delay={0.3} threshold={0.2}>
          <VerticalTimeline lineColor="rgba(255,255,255,0.18)" animate={!isMobile}>
            {content.entries.map((entry, i) => {
              const Icon = ICONS[entry.kind];
              return (
                <VerticalTimelineElement
                  key={i}
                  iconStyle={ICON_STYLES[entry.kind]}
                  icon={<Icon />}
                  contentStyle={CONTENT_STYLE}
                  contentArrowStyle={CONTENT_ARROW_STYLE}
                >
                  <TimelineCard entry={entry} path={`experience.entries.${i}`} />
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
