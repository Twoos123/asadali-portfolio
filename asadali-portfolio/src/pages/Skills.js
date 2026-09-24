import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExpand, FaTimes, FaAws, FaCode } from 'react-icons/fa';
import { FadeInSection } from '../components/animations';
import OceanLife from '../components/ocean/OceanLife';
import Editable from '../editor/Editable';
import { AddItem, EditableImage, EditSelect, ItemControls, LinkEdit } from '../editor/controls';
import { safeUrl } from '../editor/markup';
import { editorStore, useContent, useEditing, useField } from '../editor/store';
import { SiSupabase, SiStripe, SiTerraform, SiAnsible, SiPrometheus, SiGrafana, SiDuckdb, SiBitbucket, SiTrino } from 'react-icons/si';

// Skills live in src/content/skills.json. A skill's `icon` is an image path (or URL), or
// "react:<Name>" for one of these react-icons components. Anything else (e.g. "") shows the
// fallback icon.
const REACT_ICON_PREFIX = 'react:';
const REACT_ICONS = {
  SiSupabase: { component: SiSupabase, color: '#3ECF8E' },
  SiStripe: { component: SiStripe, color: '#635BFF' },
  SiTerraform: { component: SiTerraform, color: '#844FBA' },
  SiAnsible: { component: SiAnsible, color: '#EE0000' },
  SiPrometheus: { component: SiPrometheus, color: '#E6522C' },
  SiGrafana: { component: SiGrafana, color: '#F46800' },
  SiDuckdb: { component: SiDuckdb, color: '#FFF000' },
  FaAws: { component: FaAws, color: '#FF9900' },
  SiBitbucket: { component: SiBitbucket, color: '#0052CC' },
  SiTrino: { component: SiTrino, color: '#DD00A1' },
};
const FALLBACK_ICON = { component: FaCode, color: '#bae6fd' };

const ICON_SHADOW = { filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))' };

const DIRECTIONS = [
  { value: 'left', label: '← Left' },
  { value: 'right', label: 'Right →' },
];

const NEW_SKILL = { name: 'New skill', link: '', icon: '' };

const newCategory = (list) => {
  const label = `${String(list.length + 1).padStart(2, '0')} · NEW CATEGORY`;
  return {
    rowLabel: label,
    modalLabel: label,
    title: 'New category',
    direction: list.length % 2 ? 'right' : 'left',
    duration: 40,
    items: [NEW_SKILL],
  };
};

function SkillIcon({ path, icon, name, size, className, style }) {
  const editing = useEditing();
  const isImage = typeof icon === 'string' && icon !== '' && !icon.startsWith(REACT_ICON_PREFIX);
  if (isImage) {
    return <EditableImage path={path} alt={name} width={size} height={size} className={className} style={style} />;
  }

  const reactIcon = (typeof icon === 'string' && REACT_ICONS[icon.slice(REACT_ICON_PREFIX.length)]) || FALLBACK_ICON;
  const glyph = <reactIcon.component size={size} style={{ color: reactIcon.color, ...style }} className={className} />;
  if (!editing) return glyph;
  // While editing, a see-through image over the icon lets it be replaced by an uploaded one.
  return (
    <span className="relative inline-flex shrink-0">
      {glyph}
      <EditableImage path={path} alt="" className="absolute inset-0 h-full w-full" />
    </span>
  );
}

function SkillChip({ skill, path }) {
  return (
    <a
      href={safeUrl(skill.link)}
      target="_blank"
      rel="noopener noreferrer"
      className="group shrink-0 flex items-center gap-3 sm:gap-4 px-5 py-3 sm:px-7 sm:py-4 mx-1.5 sm:mx-2 rounded-2xl bg-white/[0.08] border border-white/10 hover:bg-white/[0.14] hover:border-white/30 hover:-translate-y-1 transition-[background-color,border-color,transform] duration-300"
      aria-label={skill.name}
    >
      <SkillIcon
        path={`${path}.icon`}
        icon={skill.icon}
        name={skill.name}
        size={36}
        className="shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={ICON_SHADOW}
      />
      <span className="whitespace-nowrap text-base font-semibold text-ocean-50 group-hover:text-white transition-colors tracking-tight">
        {skill.name}
      </span>
    </a>
  );
}

function RowHeader({ path, count, children }) {
  return (
    <div className="flex items-center gap-3 px-2">
      <Editable path={`${path}.rowLabel`} className="eyebrow" />
      <span className="flex-1 h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
      <span className="text-xs font-semibold text-ocean-100/70 tabular-nums px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
        {count}
      </span>
      {children}
    </div>
  );
}

function MarqueeRow({ path, category }) {
  const { items, direction, duration } = category;
  const trackStyle = { animationDuration: `${duration}s` };
  const doubled = [...items, ...items];

  // The marquee can't run on the compositor, so it costs main-thread work every frame;
  // pause it while it's off screen so the rest of the page doesn't pay for it.
  const viewportRef = useRef(null);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => setOnScreen(entries[entries.length - 1].isIntersecting));
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-4">
      <RowHeader path={path} count={items.length} />
      <div ref={viewportRef} className="marquee-viewport marquee-mask overflow-hidden py-1">
        <div className={`marquee-track ${direction}${onScreen ? '' : ' is-offscreen'}`} style={trackStyle}>
          {doubled.map((skill, i) => (
            <SkillChip key={i} skill={skill} path={`${path}.items.${i % items.length}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Seconds for one full loop of a row (lower is faster). Kept as a number in the content.
function DurationControl({ path }) {
  const value = useField(path);
  const [text, setText] = useState(String(value ?? ''));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(String(value ?? ''));
  }, [value, focused]);

  const changed = value !== editorStore.original(path);
  return (
    <label
      className={`site-edit-control inline-flex items-center gap-1.5${changed ? ' site-edit-control--changed' : ''}`}
      title="Seconds for one full loop of this row (lower is faster)"
    >
      <span>Loop</span>
      <input
        type="number"
        min={5}
        max={600}
        step={1}
        value={text}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          setText(e.target.value);
          const seconds = Number(e.target.value);
          if (e.target.value !== '' && Number.isFinite(seconds) && seconds >= 5 && seconds <= 600) editorStore.set(path, seconds);
        }}
        className="w-12 bg-transparent outline-none tabular-nums"
      />
      <span>s</span>
    </label>
  );
}

// Edit mode: the row as a static wrapped list (no animation, no duplicates), so every chip
// can be clicked and edited.
function SkillRowEditor({ path, category, index, count }) {
  const { items } = category;
  return (
    <div className="relative space-y-4 rounded-2xl border border-dashed border-white/15 p-3 sm:p-4">
      <RowHeader path={path} count={items.length} />
      <div className="flex flex-wrap items-center gap-2 px-2">
        <EditSelect path={`${path}.direction`} options={DIRECTIONS} label="Scrolls" />
        <DurationControl path={`${path}.duration`} />
        <ItemControls listPath="skills.categories" index={index} count={count} label="category" className="!static ml-auto" />
      </div>
      <div className="flex flex-wrap items-start gap-3">
        {items.map((skill, i) => {
          const skillPath = `${path}.items.${i}`;
          return (
            <div
              key={i}
              className="relative flex flex-col items-start gap-2 px-4 pt-9 pb-3 rounded-2xl bg-white/[0.08] border border-white/10"
            >
              <ItemControls listPath={`${path}.items`} index={i} count={items.length} label="skill" />
              <div className="flex items-center gap-3">
                <SkillIcon path={`${skillPath}.icon`} icon={skill.icon} name={skill.name} size={36} className="shrink-0" style={ICON_SHADOW} />
                <Editable path={`${skillPath}.name`} className="whitespace-nowrap text-base font-semibold text-ocean-50 tracking-tight" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <LinkEdit path={`${skillPath}.link`} label="Link" />
                <LinkEdit path={`${skillPath}.icon`} label="Icon URL" />
              </div>
            </div>
          );
        })}
        <AddItem listPath={`${path}.items`} template={NEW_SKILL} label="skill" className="self-center" />
      </div>
    </div>
  );
}

function SkillGridItem({ skill, path }) {
  const editing = useEditing();
  const Tag = editing ? 'div' : 'a';
  const linkProps = editing ? {} : { href: safeUrl(skill.link), target: '_blank', rel: 'noopener noreferrer' };
  return (
    <Tag
      {...linkProps}
      className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 transition-all duration-200"
    >
      <SkillIcon path={`${path}.icon`} icon={skill.icon} name={skill.name} size={28} className="shrink-0" />
      <Editable path={`${path}.name`} className="text-sm font-medium text-ocean-50 group-hover:text-white truncate" />
    </Tag>
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
                <Editable path="skills.modal.eyebrow" className="eyebrow" />
                <Editable
                  path="skills.modal.heading"
                  as="h2"
                  className="font-display text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight"
                />
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
              {categories.map((cat, ci) => {
                const path = `skills.categories.${ci}`;
                return (
                  <motion.section
                    key={ci}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + ci * 0.08, duration: 0.4 }}
                  >
                    <div className="flex items-end justify-between mb-5">
                      <div>
                        <Editable path={`${path}.modalLabel`} className="eyebrow" />
                        <Editable
                          path={`${path}.title`}
                          as="h3"
                          className="font-display text-xl md:text-2xl font-semibold text-white mt-1 tracking-tight"
                        />
                      </div>
                      <span className="text-xs font-semibold text-ocean-100/70 tabular-nums px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                        {cat.items.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {cat.items.map((skill, i) => (
                        <SkillGridItem key={i} skill={skill} path={`${path}.items.${i}`} />
                      ))}
                    </div>
                  </motion.section>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Skills() {
  const [expanded, setExpanded] = useState(false);
  const content = useContent('skills');
  const editing = useEditing();
  const { categories } = content;

  return (
    <div id="skills" className="py-12 md:py-16 relative overflow-hidden" style={{
      backgroundSize: '120vw 120vh',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    }}>
      <OceanLife section="skills" />
      <div className="container mx-auto px-4 relative z-10">
        <FadeInSection direction="up" delay={0.2} threshold={0.3}>
          <div className="text-center mb-10">
            <Editable path="skills.eyebrow" className="eyebrow" />
            <Editable path="skills.heading" as="h1" className="font-display text-4xl md:text-5xl font-bold text-white mt-3 tracking-tight" />
            <Editable path="skills.intro" as="p" className="text-ocean-100/70 mt-3 max-w-xl mx-auto text-sm md:text-base" />
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
              <Editable path="skills.viewAll" className="hidden sm:inline text-xs font-medium tracking-tight" />
            </motion.button>

            {categories.map((category, i) => {
              const path = `skills.categories.${i}`;
              return editing ? (
                <SkillRowEditor key={i} path={path} category={category} index={i} count={categories.length} />
              ) : (
                <MarqueeRow key={i} path={path} category={category} />
              );
            })}

            {editing && (
              <div className="flex justify-center">
                <AddItem listPath="skills.categories" template={newCategory} label="category" />
              </div>
            )}
          </div>
        </FadeInSection>
      </div>

      <ExpandedSkillsModal open={expanded} onClose={() => setExpanded(false)} categories={categories} />
    </div>
  );
}

export default Skills;
