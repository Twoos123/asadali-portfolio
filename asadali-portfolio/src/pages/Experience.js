import React, { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import "react-vertical-timeline-component/style.min.css";
import { FaBriefcase, FaHandsHelping, FaHourglassHalf, FaMapMarkerAlt } from 'react-icons/fa';
import { FadeInSection } from '../components/animations';
import { oceanLife } from '../helpers/oceanLife';

const uOttaHack = process.env.PUBLIC_URL + '/assets/uOttaHack.svg';
const eightbyeight = process.env.PUBLIC_URL + '/assets/8x8.svg';
const SESA = process.env.PUBLIC_URL + '/assets/SESA.svg';
const uOttawa = process.env.PUBLIC_URL + '/assets/uottawa.svg';
const HealthCanada = process.env.PUBLIC_URL + '/assets/health-canada.svg';

const SunLife = process.env.PUBLIC_URL + '/assets/sunlife.svg';

const ACCENTS = {
  work: 'from-ocean-400 to-ocean-500',
  volunteer: 'from-violet-400 to-fuchsia-500',
  incoming: 'from-amber-300 to-orange-400',
};

const ICON_STYLES = {
  work: { background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)' },
  volunteer: { background: 'linear-gradient(135deg, #a78bfa, #d946ef)' },
  incoming: { background: 'linear-gradient(135deg, #fcd34d, #fb923c)' },
};

const CONTENT_STYLE = {
  background: 'transparent',
  boxShadow: 'none',
  padding: 0,
  borderRadius: 0,
};

const CONTENT_ARROW_STYLE = { display: 'none' };

function TimelineCard({ kind, org, role, period, location, logo, logoAlt, logoClass, isIncoming, skills, children }) {
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
              <img src={logo} alt={logoAlt} className={logoClass || "h-full w-full object-contain"} />
            )}
          </div>

          {/* Texts & Date Badge */}
          <div className="min-w-0 flex-1">
            {/* Top row: Organization name + Period badge */}
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight leading-tight m-0">{org}</h3>
              <span className="shrink-0 hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wider uppercase bg-white/10 border border-white/10 text-ocean-100">
                {period}
              </span>
            </div>

            {/* Role */}
            <div className="text-xs sm:text-sm font-semibold text-ocean-200 tracking-wide mt-0.5 whitespace-nowrap">{role}</div>

            {/* Location */}
            {location && (
              <div className="text-[11px] sm:text-xs text-ocean-300/80 flex items-center gap-1.5 mt-0.5 font-medium tracking-wide whitespace-nowrap">
                <FaMapMarkerAlt className="text-ocean-400 text-[10px] shrink-0" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile period display */}
        <div className="sm:hidden mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/10 border border-white/10 text-ocean-100">
            {period}
          </span>
        </div>

        {children && (
          <p className="text-ocean-50/85 text-xs sm:text-sm leading-relaxed mb-3">{children}</p>
        )}

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1.5 mt-1">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.05] border border-white/[0.08] text-ocean-200/90 group-hover:bg-white/[0.08] group-hover:border-white/15 transition-all"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Experience() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const createOceanEffects = (containerId, section) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = '';

      const sectionLife = oceanLife[section];
      if (!sectionLife) return;

      for (let i = 0; i < sectionLife.bubbles; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-3d animate-bubble-stream';
        bubble.style.left = `${Math.random() * 100}%`;
        const size = Math.random() * 8 + 4;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.animationDuration = `${8 + Math.random() * 8}s`;
        container.appendChild(bubble);
      }

      sectionLife.creatures.forEach(creature => {
        for (let i = 0; i < creature.count; i++) {
          const el = document.createElement('div');
          el.style.position = 'absolute';
          el.style.pointerEvents = 'none';

          let innerHTML = `<img src="${process.env.PUBLIC_URL}/assets/fish/${creature.type}.svg" alt="${creature.type}" style="`;
          for (const [key, value] of Object.entries(creature.styles)) {
            innerHTML += `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${typeof value === 'function' ? value(i) : value}; `;
          }
          innerHTML += `"/>`;
          el.innerHTML = innerHTML;

          for (const [key, value] of Object.entries(creature.position)) {
            el.style[key] = typeof value === 'function' ? value(i) : value;
          }

          if (creature.animation.className) {
            el.className = creature.animation.className;
          }

          if (creature.animation.duration) {
            el.style.animationDuration = `${typeof creature.animation.duration === 'function' ? creature.animation.duration(i) : creature.animation.duration}s`;
          }

          if (creature.zIndex) {
            el.style.zIndex = creature.zIndex;
          }

          container.appendChild(el);
        }
      });
    };

    createOceanEffects('experience-creatures-container', 'experience');
  }, []);

  return (
    <div className="experience-section relative min-h-screen bg-transparent" style={{
      backgroundSize: '120vw 120vh',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    }}>
      <div id="experience-creatures-container" className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex: 0}}></div>

      <FadeInSection direction="up" delay={0.2} threshold={0.3}>
        <div className='py-16 text-center relative z-10'>
          <span className="eyebrow">Journey so far</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-3 tracking-tight">Experience</h1>
        </div>
      </FadeInSection>

      <div className="relative z-10">
        <FadeInSection direction="up" delay={0.3} threshold={0.2}>
          <VerticalTimeline lineColor="rgba(255,255,255,0.18)" animate={!isMobile}>

            {/* Next Chapter / New Grad Availability */}
            <VerticalTimelineElement
              iconStyle={{ ...ICON_STYLES.incoming, color: '#fff', boxShadow: '0 0 0 4px rgba(251, 191, 36, 0.25), 0 0 20px rgba(251, 191, 36, 0.5)' }}
              icon={<FaHourglassHalf />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="incoming"
                org="Next Chapter"
                role="Software Engineer · Seeking New Grad Roles"
                period="Available Dec 2026"
                location="Ottawa · Toronto · Montreal · Vancouver · Remote"
                isIncoming={true}
                skills={['Full-Stack', 'Backend', 'Distributed Systems', 'Cloud & DevOps']}
              />
            </VerticalTimelineElement>

            {/* Sun Life */}
            <VerticalTimelineElement
              iconStyle={{ ...ICON_STYLES.work, color: '#fff' }}
              icon={<FaBriefcase />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="work"
                org="Sun Life"
                role="Cloud Infrastructure Analyst Intern · DevOps"
                period="Sep 2026 - Dec 2026"
                location="Toronto, ON · Remote"
                logo={SunLife}
                logoAlt="Sun Life"
                logoClass="h-full w-full object-contain"
                skills={['Kubernetes', 'Docker', 'Terraform', 'Ansible', 'Prometheus', 'AWS']}
              />
            </VerticalTimelineElement>

            {/* Health Canada 2026 */}
            <VerticalTimelineElement
              iconStyle={{ ...ICON_STYLES.work, color: '#fff' }}
              icon={<FaBriefcase />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="work"
                org="Health Canada"
                role="Software Engineer Intern · Fullstack"
                period="May 2026 - Aug 2026"
                location="Ottawa, ON · Hybrid"
                logo={HealthCanada}
                logoAlt="Health Canada"
                logoClass="h-full w-full object-contain"
                skills={['React.js', 'FastAPI', 'Python', 'Vite', 'SQLite', 'CI/CD']}
              />
            </VerticalTimelineElement>

            {/* uOttawa Faculty of Law */}
            <VerticalTimelineElement
              iconStyle={{ ...ICON_STYLES.work, color: '#fff' }}
              icon={<FaBriefcase />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="work"
                org="University of Ottawa"
                role="Software Engineer Intern · Fullstack"
                period="Oct 2025 - Apr 2026"
                location="Ottawa, ON · Hybrid"
                logo={uOttawa}
                logoAlt="University of Ottawa"
                logoClass="h-full w-full object-contain"
                skills={['PHP', 'MySQL', 'Docker', 'Apache', 'Linux', 'Drupal']}
              />
            </VerticalTimelineElement>

            {/* Health Canada 2025 */}
            <VerticalTimelineElement
              iconStyle={{ ...ICON_STYLES.work, color: '#fff' }}
              icon={<FaBriefcase />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="work"
                org="Health Canada"
                role="Software Engineer Intern · Fullstack"
                period="May 2025 - Aug 2025"
                location="Ottawa, ON · Hybrid"
                logo={HealthCanada}
                logoAlt="Health Canada"
                logoClass="h-full w-full object-contain"
                skills={['Python', 'Pandas', 'Streamlit', 'ArcGIS', 'DuckDB', 'Excel']}
              />
            </VerticalTimelineElement>

            {/* SESA */}
            <VerticalTimelineElement
              iconStyle={{ ...ICON_STYLES.volunteer, color: '#fff' }}
              icon={<FaHandsHelping />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="volunteer"
                org="uOttawa SESA"
                role="Co-Director → Advisor"
                period="Apr 2024 - Present"
                location="Ottawa, ON"
                logo={SESA}
                logoAlt="uOttawa SESA"
                logoClass="h-full w-full object-contain"
                skills={['Leadership', 'Full-Stack Web', 'Event Operations', 'Mentorship']}
              />
            </VerticalTimelineElement>

            {/* 8x8 */}
            <VerticalTimelineElement
              iconStyle={{ ...ICON_STYLES.work, color: '#fff' }}
              icon={<FaBriefcase />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="work"
                org="8x8"
                role="Software Engineer Intern · Backend"
                period="Jan 2024 - May 2024"
                location="Ottawa, ON · Hybrid"
                logo={eightbyeight}
                logoAlt="8x8"
                logoClass="h-full w-full object-contain"
                skills={['Java', 'Spring Boot', 'Docker', 'REST APIs', 'OAuth', 'Postman']}
              />
            </VerticalTimelineElement>

            {/* uOttaHack */}
            <VerticalTimelineElement
              iconStyle={{ ...ICON_STYLES.volunteer, color: '#fff' }}
              icon={<FaHandsHelping />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="volunteer"
                org="uOttaHack"
                role="MLH Hackathon Organizer"
                period="Jun 2023 - Mar 2024"
                location="Ottawa, ON"
                logo={uOttaHack}
                logoAlt="uOttaHack"
                logoClass="h-full w-full object-contain"
                skills={['Event Logistics', 'Technical Workshops', 'Community']}
              />
            </VerticalTimelineElement>
          </VerticalTimeline>
        </FadeInSection>
      </div>
    </div>
  );
}

export default Experience;
