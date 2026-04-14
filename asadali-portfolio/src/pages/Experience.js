import React, { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import "react-vertical-timeline-component/style.min.css";
import { FaBriefcase, FaHandsHelping, FaHourglassHalf } from 'react-icons/fa';
import { FadeInSection } from '../components/animations';
import { oceanLife } from '../helpers/oceanLife';

const uOttaHack = process.env.PUBLIC_URL + '/assets/uOttaHack.JPG';
const eightbyeight = process.env.PUBLIC_URL + '/assets/8x8.svg';
const SESA = process.env.PUBLIC_URL + '/assets/SESA.svg';
const uOttawa = process.env.PUBLIC_URL + '/assets/uottawa.svg';
const HealthCanada = process.env.PUBLIC_URL + '/assets/health-canada.png';

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

function TimelineCard({ kind, org, role, period, logo, logoAlt, logoClass, children }) {
  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-white/15 bg-ocean-950/45 shadow-glass"
      style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${ACCENTS[kind]}`} />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-white/95 flex items-center justify-center shadow-lg">
            <img src={logo} alt={logoAlt} className={logoClass} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="eyebrow block text-[10px]">{period}</span>
            <h3 className="font-display text-lg font-semibold text-white leading-snug mt-1 tracking-tight">{org}</h3>
          </div>
        </div>
        <p className="text-sm font-semibold text-ocean-200 mb-2 tracking-wide uppercase">{role}</p>
        <p className="text-ocean-50/85 text-sm leading-relaxed">{children}</p>
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

            <VerticalTimelineElement
              date={<span className="font-display text-amber-200 font-semibold tracking-tight">Incoming · Summer 2026</span>}
              iconStyle={{ ...ICON_STYLES.incoming, color: '#fff', boxShadow: '0 0 0 4px rgba(251, 191, 36, 0.25), 0 0 20px rgba(251, 191, 36, 0.5)' }}
              icon={<FaHourglassHalf />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="incoming"
                org="Health Canada"
                role="Software Engineer Intern · Fullstack (Incoming)"
                period="MAY 2026 — AUG 2026"
                logo={HealthCanada}
                logoAlt="Health Canada"
                logoClass="h-10 w-10 object-contain"
              >
                Returning to Health Canada for Summer 2026 as a fullstack intern — continuing work on secure, department-wide internal tools that power regulatory workflows.
              </TimelineCard>
            </VerticalTimelineElement>

            <VerticalTimelineElement
              date={<span className="font-display text-ocean-200 font-semibold tracking-tight">Oct 2025 — Apr 2026</span>}
              iconStyle={{ ...ICON_STYLES.work, color: '#fff' }}
              icon={<FaBriefcase />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="work"
                org="University of Ottawa — Faculty of Law"
                role="Software Engineer (Part-Time) · Fullstack"
                period="OCT 2025 — APR 2026"
                logo={uOttawa}
                logoAlt="uOttawa"
                logoClass="h-10 w-10 object-contain p-0.5"
              >
                Modernized the Faculty's Course Management System — refactoring 20,000+ lines of legacy code to cut load times by 55% for 100+ users. Built an internal LLM-based Drupal analysis tool that scans 3,800+ pages to flag dead links, reducing manual audit time by 70%. Established QA workflows and technical documentation to standardize deployment.
              </TimelineCard>
            </VerticalTimelineElement>

            <VerticalTimelineElement
              date={<span className="font-display text-ocean-200 font-semibold tracking-tight">May 2025 — Aug 2025</span>}
              iconStyle={{ ...ICON_STYLES.work, color: '#fff' }}
              icon={<FaBriefcase />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="work"
                org="Health Canada"
                role="Software Engineer Intern · Fullstack"
                period="MAY 2025 — AUG 2025"
                logo={HealthCanada}
                logoAlt="Health Canada"
                logoClass="h-10 w-10 object-contain"
              >
                Built a department-wide Case Management System in Python/Streamlit with role-based access control, audit logs, and secure data pipelines for regulatory workflows. Developed backend modules for SharePoint migration and integrated BM25 + ArcGIS for reliable address matching. Engineered a secure pipeline handling 500+ daily transactions, cutting document processing time by 80%.
              </TimelineCard>
            </VerticalTimelineElement>

            <VerticalTimelineElement
              date={<span className="font-display text-violet-200 font-semibold tracking-tight">Sep 2024 — Present</span>}
              iconStyle={{ ...ICON_STYLES.volunteer, color: '#fff' }}
              icon={<FaHandsHelping />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="volunteer"
                org="uOttawa Software Engineering Students' Association (SESA)"
                role="Co-Director → Advisor"
                period="SEP 2024 — PRESENT"
                logo={SESA}
                logoAlt="uOttawa SESA"
                logoClass="h-10 w-10 rounded-full object-cover"
              >
                Managed operations for a 28-person team and partnered with 20+ companies to run technical workshops, scaling the association's reach to 2,500+ followers and 300k+ impressions. Led full-stack development of SESA's website from design to deployment, improving resource accessibility for 3,000+ EECS students. Now advising the incoming executive team through the transition.
              </TimelineCard>
            </VerticalTimelineElement>

            <VerticalTimelineElement
              date={<span className="font-display text-violet-200 font-semibold tracking-tight">Apr 2024 — Sep 2024</span>}
              iconStyle={{ ...ICON_STYLES.volunteer, color: '#fff' }}
              icon={<FaHandsHelping />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="volunteer"
                org="uOttawa Software Engineering Students' Association (SESA)"
                role="Development Lead"
                period="APR 2024 — SEP 2024"
                logo={SESA}
                logoAlt="uOttawa SESA"
                logoClass="h-10 w-10 rounded-full object-cover"
              >
                Led the development team at uOttawa SESA, driving technical initiatives and full-stack project execution that laid the groundwork for the association's digital infrastructure and student-engagement platform.
              </TimelineCard>
            </VerticalTimelineElement>

            <VerticalTimelineElement
              date={<span className="font-display text-ocean-200 font-semibold tracking-tight">Jan 2024 — May 2024</span>}
              iconStyle={{ ...ICON_STYLES.work, color: '#fff' }}
              icon={<FaBriefcase />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="work"
                org="Fuze: an 8x8 Company"
                role="Software Engineer Intern · Backend"
                period="JAN 2024 — MAY 2024"
                logo={eightbyeight}
                logoAlt="Fuze: an 8x8 Company"
                logoClass="h-10 w-10 object-contain"
              >
                Optimized REST API efficiency via request batching and async execution, cutting CI/CD feedback time by 86% through Docker + Kubernetes containerization. Built Spring Boot + React microservices powering VOIP systems (Cisco, Yealink). Migrated pipelines from Jenkins to GitHub Actions and added automated regression testing, reducing API downtime by 60%.
              </TimelineCard>
            </VerticalTimelineElement>

            <VerticalTimelineElement
              date={<span className="font-display text-violet-200 font-semibold tracking-tight">Jun 2023 — Mar 2024</span>}
              iconStyle={{ ...ICON_STYLES.volunteer, color: '#fff' }}
              icon={<FaHandsHelping />}
              contentStyle={CONTENT_STYLE}
              contentArrowStyle={CONTENT_ARROW_STYLE}
            >
              <TimelineCard
                kind="volunteer"
                org="uOttaHack — Ottawa's Largest Hackathon"
                role="MLH Hackathon Organizer"
                period="JUN 2023 — MAR 2024"
                logo={uOttaHack}
                logoAlt="uOttaHack"
                logoClass="h-10 w-10 object-cover rounded-xl"
              >
                Helped run Ottawa's largest hackathon alongside a 25-person team, serving 1,000+ participants. Coordinated logistics, scheduling, and venue setup for 30+ events across the 36-hour weekend, and led workshops + hacker-experience activities that earned a 95% post-event satisfaction rate.
              </TimelineCard>
            </VerticalTimelineElement>

            <VerticalTimelineElement iconStyle={{ background: 'transparent', border: 'none' }} />
          </VerticalTimeline>
        </FadeInSection>
      </div>
    </div>
  );
}

export default Experience;
