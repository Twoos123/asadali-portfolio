import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExpand, FaTimes } from 'react-icons/fa';
import { FadeInSection } from '../components/animations';
import { oceanLife } from '../helpers/oceanLife';
import { SiSupabase, SiStripe } from 'react-icons/si';

const SVG_FILE_MAP = {
  'Groq': 'Groq.svg',
  'Co:Here': 'Cohere.svg',
  'Flask': 'Flask.svg',
  'React': 'React.svg',
  'Python': 'Python.svg',
  'Java': 'Java.svg',
  'JavaScript': 'JavaScript.svg',
  'TypeScript': 'TypeScript.svg',
  'Kotlin': 'Kotlin.svg',
  'C++': 'C++ (CPlusPlus).svg',
  'HTML5': 'HTML5.svg',
  'CSS3': 'CSS3.svg',
  'Next.js': 'Next.js.svg',
  'Spring Boot': 'Spring.svg',
  'Node.js': 'Node.js.svg',
  'Express': 'Express.svg',
  'Tailwind CSS': 'Tailwind CSS.svg',
  'Chakra UI': 'Chakra UI.svg',
  'PHP': 'PHP.svg',
  'Vite': 'Vite.js.svg',
  'GraphQL': 'GraphQL.svg',
  'Streamlit': 'Streamlit.svg',
  'GitHub': 'GitHub.svg',
  'Git': 'Git.svg',
  'Docker': 'Docker.svg',
  'Kubernetes': 'Kubernetes.svg',
  'Android Studio': 'Android Studio.svg',
  'Vercel': 'Vercel.svg',
  'Firebase': 'Firebase.svg',
  'Supabase': 'Supabase.svg',
  'MongoDB': 'MongoDB.svg',
  'Drupal': 'Drupal.svg',
  'Apache': 'Apache.svg',
  'Linux': 'Linux.svg',
  'PostgreSQL': 'PostgresSQL.svg',
  'MySQL': 'MySQL.svg',
  'Redis': 'Redis.svg',
  'SQLite': 'SQLite.svg',
  'Postman': 'Postman.svg',
  'JIRA': 'Jira.svg',
  'Jenkins': 'Jenkins.svg',
  'Stripe': 'Stripe.svg',
  'Cloudinary': 'Cloudinary.svg',
  'OpenAI': 'Openai.svg',
  'OAuth 2.0': 'Oauth.svg',
  'Bash': 'Bash.svg',
  'FastAPI': 'FastAPI.svg',
  'Elixir': 'Elixir.svg',
};

const REACT_ICON_MAP = {
  'Supabase': { component: SiSupabase, color: '#3ECF8E' },
  'Stripe': { component: SiStripe, color: '#635BFF' },
};

function SkillChip({ name, link }) {
  const reactIcon = REACT_ICON_MAP[name];
  const filename = SVG_FILE_MAP[name] || `${name}.svg`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group shrink-0 flex items-center gap-3 sm:gap-4 px-5 py-3 sm:px-7 sm:py-4 mx-1.5 sm:mx-2 rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.14] hover:border-white/30 hover:-translate-y-1 transition-all duration-300"
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      aria-label={name}
    >
      {reactIcon ? (
        <reactIcon.component
          size={36}
          style={{
            color: reactIcon.color,
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))',
          }}
          className="shrink-0 transition-transform duration-300 group-hover:scale-110"
        />
      ) : (
        <img
          src={`${process.env.PUBLIC_URL}/assets/skills/${filename}`}
          alt={name}
          width={36}
          height={36}
          className="shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))' }}
        />
      )}
      <span className="whitespace-nowrap text-base font-semibold text-ocean-50 group-hover:text-white transition-colors tracking-tight">
        {name}
      </span>
    </a>
  );
}

function MarqueeRow({ label, items, direction, duration }) {
  const trackStyle = { animationDuration: `${duration}s` };
  const doubled = [...items, ...items];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-2">
        <span className="eyebrow">{label}</span>
        <span className="flex-1 h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
        <span className="text-xs font-semibold text-ocean-100/70 tabular-nums px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
          {items.length}
        </span>
      </div>
      <div className="marquee-viewport marquee-mask overflow-hidden py-1">
        <div className={`marquee-track ${direction}`} style={trackStyle}>
          {doubled.map((skill, i) => (
            <SkillChip key={`${skill.name}-${i}`} name={skill.name} link={skill.link} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillGridItem({ name, link }) {
  const reactIcon = REACT_ICON_MAP[name];
  const filename = SVG_FILE_MAP[name] || `${name}.svg`;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 transition-all duration-200"
    >
      {reactIcon ? (
        <reactIcon.component size={28} style={{ color: reactIcon.color }} className="shrink-0" />
      ) : (
        <img
          src={`${process.env.PUBLIC_URL}/assets/skills/${filename}`}
          alt={name}
          width={28}
          height={28}
          className="shrink-0"
        />
      )}
      <span className="text-sm font-medium text-ocean-50 group-hover:text-white truncate">{name}</span>
    </a>
  );
}

function ExpandedSkillsModal({ open, onClose, categories }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-ocean-950/75"
            style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-6xl max-h-[90vh] rounded-3xl border border-white/20 bg-ocean-950/70 shadow-glass-lg overflow-hidden"
            style={{ backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)' }}
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/10">
              <div>
                <span className="eyebrow">Full toolkit</span>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight">
                  Everything I work with
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                className="h-10 w-10 rounded-full bg-white/5 border border-white/15 text-ocean-50 hover:bg-white/15 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Close"
              >
                <FaTimes className="h-4 w-4" />
              </motion.button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-5.5rem)] px-6 md:px-10 py-8 space-y-10">
              {categories.map((cat, ci) => (
                <motion.section
                  key={cat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + ci * 0.08, duration: 0.4 }}
                >
                  <div className="flex items-end justify-between mb-5">
                    <div>
                      <span className="eyebrow">{cat.label}</span>
                      <h3 className="font-display text-xl md:text-2xl font-semibold text-white mt-1 tracking-tight">
                        {cat.title}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-ocean-100/70 tabular-nums px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                      {cat.items.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {cat.items.map((skill) => (
                      <SkillGridItem key={skill.name} name={skill.name} link={skill.link} />
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Skills() {
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const createOceanEffects = () => {
      const skillsSection = document.getElementById('skills');
      if (!skillsSection) return;

      skillsSection.style.position = 'relative';
      skillsSection.style.overflow = 'hidden';

      let creaturesContainer = skillsSection.querySelector('.skills-creatures-container');
      if (!creaturesContainer) {
        creaturesContainer = document.createElement('div');
        creaturesContainer.className = 'skills-creatures-container';
        creaturesContainer.style.position = 'absolute';
        creaturesContainer.style.top = '0';
        creaturesContainer.style.left = '0';
        creaturesContainer.style.right = '0';
        creaturesContainer.style.bottom = '0';
        creaturesContainer.style.pointerEvents = 'none';
        creaturesContainer.style.overflow = 'hidden';
        creaturesContainer.style.zIndex = '1';
        skillsSection.appendChild(creaturesContainer);
      }
      creaturesContainer.innerHTML = '';

      const sectionLife = oceanLife.skills;

      for (let i = 0; i < sectionLife.bubbles; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-3d animate-bubble-stream';
        bubble.style.position = 'absolute';
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.bottom = '0px';
        const size = Math.random() * 6 + 3;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.animationDuration = `${10 + Math.random() * 8}s`;
        creaturesContainer.appendChild(bubble);
      }

      sectionLife.creatures.forEach(creature => {
        if (isMobile && (creature.type === 'tropical-fish' || creature.type === 'small-fish')) {
          return;
        }
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.pointerEvents = 'none';
        el.style.zIndex = creature.zIndex;

        let innerHTML = `<img src="${process.env.PUBLIC_URL}/assets/fish/${creature.type}.svg" alt="${creature.type}" style="`;
        for (const [key, value] of Object.entries(creature.styles)) {
          innerHTML += `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}; `;
        }
        innerHTML += `"/>`;
        el.innerHTML = innerHTML;

        for (const [key, value] of Object.entries(creature.position)) {
          el.style[key] = value;
        }

        if (creature.animation.type === 'transition') {
          el.style.transition = `transform ${creature.animation.duration}s linear`;
          el.style.transform = 'translateX(0px)';
          setTimeout(() => {
            const direction = el.style.left.includes('-') ? 1 : -1;
            el.style.transform = `translateX(${direction * (skillsSection.offsetWidth + 160)}px)`;
          }, creature.animation.delay * 1000);
        }

        creaturesContainer.appendChild(el);
      });
    };

    createOceanEffects();
  }, [isMobile]);

  const programmingLanguages = [
    { name: "Java", link: "https://www.java.com" },
    { name: "Python", link: "https://www.python.org" },
    { name: "JavaScript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "TypeScript", link: "https://www.typescriptlang.org" },
    { name: "PHP", link: "https://www.php.net" },
    { name: "Kotlin", link: "https://kotlinlang.org" },
    { name: "HTML5", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { name: "CSS3", link: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { name: "C++", link: "https://www.cplusplus.com" },
  ];

  const frameworks = [
    { name: "React", link: "https://reactjs.org" },
    { name: "Next.js", link: "https://nextjs.org" },
    { name: "Spring Boot", link: "https://spring.io/projects/spring-boot" },
    { name: "FastAPI", link: "https://fastapi.tiangolo.com" },
    { name: "Node.js", link: "https://nodejs.org" },
    { name: "Express", link: "https://expressjs.com" },
    { name: "Flask", link: "https://flask.palletsprojects.com" },
    { name: "Tailwind CSS", link: "https://tailwindcss.com" },
    { name: "Chakra UI", link: "https://chakra-ui.com" },
    { name: "Vite", link: "https://vitejs.dev" },
    { name: "GraphQL", link: "https://graphql.org" },
    { name: "Streamlit", link: "https://streamlit.io" },
  ];

  const developerTools = [
    { name: "GitHub", link: "https://github.com" },
    { name: "Git", link: "https://git-scm.com" },
    { name: "Docker", link: "https://www.docker.com" },
    { name: "Kubernetes", link: "https://kubernetes.io" },
    { name: "Jenkins", link: "https://www.jenkins.io" },
    { name: "Linux", link: "https://www.kernel.org" },
    { name: "Bash", link: "https://www.gnu.org/software/bash/" },
    { name: "Apache", link: "https://httpd.apache.org" },
    { name: "Drupal", link: "https://www.drupal.org" },
    { name: "Android Studio", link: "https://developer.android.com/studio" },
    { name: "Vercel", link: "https://vercel.com" },
    { name: "Firebase", link: "https://firebase.google.com" },
    { name: "Supabase", link: "https://supabase.com" },
    { name: "MongoDB", link: "https://www.mongodb.com" },
    { name: "PostgreSQL", link: "https://www.postgresql.org" },
    { name: "MySQL", link: "https://www.mysql.com" },
    { name: "Redis", link: "https://redis.io" },
    { name: "SQLite", link: "https://www.sqlite.org" },
    { name: "Postman", link: "https://www.postman.com" },
    { name: "JIRA", link: "https://www.atlassian.com/software/jira" },
    { name: "Stripe", link: "https://stripe.com" },
    { name: "Cloudinary", link: "https://cloudinary.com" },
    { name: "Groq", link: "https://groq.com" },
    { name: "Co:Here", link: "https://cohere.ai" },
    { name: "OpenAI", link: "https://openai.com" },
    { name: "OAuth 2.0", link: "https://oauth.net/2/" },
  ];

  return (
    <div id="skills" className="py-12 md:py-16 relative" style={{
      backgroundSize: '120vw 120vh',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container mx-auto px-4 relative z-10">
        <FadeInSection direction="up" delay={0.2} threshold={0.3}>
          <div className="text-center mb-10">
            <span className="eyebrow">Toolkit</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-3 tracking-tight">Skills</h1>
            <p className="text-ocean-100/70 mt-3 max-w-xl mx-auto text-sm md:text-base">
              The tech I reach for most often, flowing by. Hover to pause, click any chip for the docs.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection direction="up" delay={0.3} threshold={0.1}>
          <div
            className="relative max-w-6xl mx-auto rounded-3xl border border-white/15 bg-ocean-950/40 shadow-glass p-4 pt-14 sm:p-6 sm:pt-14 md:p-10 md:pt-10 space-y-6 sm:space-y-8"
            style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
          >
            <motion.button
              onClick={() => setExpanded(true)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-20 flex items-center gap-2 h-9 px-3.5 rounded-full bg-white/10 border border-white/15 text-ocean-50 hover:bg-white/15 hover:border-white/30 transition-colors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Expand skills"
            >
              <FaExpand className="h-3 w-3" />
              <span className="hidden sm:inline text-xs font-medium tracking-tight">View all</span>
            </motion.button>

            <MarqueeRow
              label="01 · LANGUAGES"
              items={programmingLanguages}
              direction="left"
              duration={40}
            />
            <MarqueeRow
              label="02 · FRAMEWORKS"
              items={frameworks}
              direction="right"
              duration={50}
            />
            <MarqueeRow
              label="03 · TOOLS & PLATFORMS"
              items={developerTools}
              direction="left"
              duration={80}
            />
          </div>
        </FadeInSection>
      </div>

      <ExpandedSkillsModal
        open={expanded}
        onClose={() => setExpanded(false)}
        categories={[
          { label: '01 · LANGUAGES', title: 'Programming Languages', items: programmingLanguages },
          { label: '02 · FRAMEWORKS', title: 'Frameworks & Libraries', items: frameworks },
          { label: '03 · TOOLS', title: 'Tools & Platforms', items: developerTools },
        ]}
      />
    </div>
  );
}

export default Skills;
