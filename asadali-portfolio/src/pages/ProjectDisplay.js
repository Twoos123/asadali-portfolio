import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaArrowRight, FaChevronLeft, FaChevronRight, FaLinkedin } from 'react-icons/fa';
import Editable from '../editor/Editable';
import { useContent } from '../editor/store';

function ProjectDisplay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectList = useContent('projects').items;
  // Text is edited by the project's position in projects.json, not its id.
  const projectIndex = projectList.findIndex((p) => p.id.toString() === id);
  const project = projectList[projectIndex];
  const path = `projects.items.${projectIndex}`;
  const csPath = `${path}.caseStudy`;
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  if (!project) {
    return (
      <div className="py-32 px-4 max-w-2xl mx-auto text-center">
        <Editable path="caseStudy.notFound.heading" as="h1" className="font-display text-3xl font-semibold text-white mb-4" />
        <button onClick={goBack} className="text-ocean-300 hover:text-ocean-200 inline-flex items-center gap-2">
          <FaArrowLeft className="h-3 w-3" /> <Editable path="caseStudy.notFound.back" />
        </button>
      </div>
    );
  }

  const skills = Array.isArray(project.skills) ? project.skills : [];
  const cs = project.caseStudy;
  const ctaVariant = project.demo ? 'withDemo' : 'withoutDemo';

  return (
    <div className="project-display relative py-24 md:py-28 px-4">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0c4a6e 0%, #082f49 50%, #0a1120 100%)',
        }}
      />
      <div className="max-w-5xl mx-auto">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-ocean-200/80 hover:text-white text-sm font-medium transition-colors mb-8"
        >
          <FaArrowLeft className="h-3 w-3" /> <Editable path="caseStudy.back" />
        </button>

        <header className="mb-10">
          <Editable path="caseStudy.eyebrow" className="eyebrow" />
          <Editable path={`${path}.name`} as="h1" className="font-display text-4xl md:text-5xl font-bold text-white mt-3 tracking-tight" />
          {cs?.tagline && (
            <Editable
              path={`${csPath}.tagline`}
              as="p"
              className="text-lg md:text-xl text-ocean-100/80 mt-4 max-w-3xl leading-relaxed"
            />
          )}

          <div className="flex flex-wrap gap-2 mt-6">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-ocean-50/85"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href={project.github || project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
            >
              <FaGithub className="h-4 w-4" />
              <Editable path="caseStudy.headerButtons.viewRepository" />
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-ocean-500 to-ocean-400 hover:from-ocean-400 hover:to-ocean-300 text-white text-sm font-semibold shadow-glow"
              >
                <FaExternalLinkAlt className="h-3 w-3" />
                <Editable path="caseStudy.headerButtons.liveDemo" />
              </a>
            )}
          </div>
        </header>

        <div
          className="rounded-3xl overflow-hidden border border-white/15 bg-ocean-950/40 shadow-glass mb-16"
          style={{ backdropFilter: 'blur(18px) saturate(180%)', WebkitBackdropFilter: 'blur(18px) saturate(180%)' }}
        >
          <img
            src={cs?.heroImage || project.image}
            alt={project.name}
            className="w-full h-auto object-cover"
          />
        </div>

        {!cs && (
          <div className="rounded-3xl border border-white/15 bg-ocean-950/40 shadow-glass p-8 text-center"
            style={{ backdropFilter: 'blur(18px) saturate(180%)', WebkitBackdropFilter: 'blur(18px) saturate(180%)' }}>
            <Editable path="caseStudy.noCaseStudy" as="p" className="text-ocean-100/80" />
          </div>
        )}

        {cs && (
          <>
            {cs.origin && (
              <div
                className="relative rounded-3xl border border-white/15 bg-ocean-950/50 shadow-glass p-6 md:p-10 mb-16 overflow-hidden"
                style={{ backdropFilter: 'blur(18px) saturate(180%)', WebkitBackdropFilter: 'blur(18px) saturate(180%)' }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-ocean-300 to-ocean-500" />
                <div className="pl-4 md:pl-6">
                  <Editable path="caseStudy.origin.eyebrow" className="eyebrow" />
                  <Editable
                    path={`${csPath}.origin`}
                    as="p"
                    className="mt-4 text-ocean-50/90 leading-relaxed text-base md:text-lg italic"
                  />
                </div>
              </div>
            )}

            <Section path="caseStudy.sections.problem">
              <Editable path={`${csPath}.problem`} as="p" className="text-ocean-50/85 leading-relaxed text-base md:text-lg" />
            </Section>

            <Section path="caseStudy.sections.approach">
              <Editable path={`${csPath}.solution`} as="p" className="text-ocean-50/85 leading-relaxed text-base md:text-lg" />
            </Section>

            <Section path="caseStudy.sections.architecture">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cs.architecture.map((layer, i) => (
                  <motion.div
                    key={layer.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="relative rounded-2xl border border-white/15 bg-white/[0.04] p-6"
                  >
                    <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-gradient-to-b from-ocean-400 to-ocean-600" />
                    <div className="pl-3">
                      <Editable path={`${csPath}.architecture.${i}.subtitle`} className="eyebrow text-[10px]" />
                      <Editable
                        path={`${csPath}.architecture.${i}.title`}
                        as="h3"
                        className="font-display text-lg font-semibold text-white mt-1 tracking-tight"
                      />
                      <Editable path={`${csPath}.architecture.${i}.desc`} as="p" className="text-sm text-ocean-100/80 mt-2 leading-relaxed" />
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {layer.tech.map((t, j) => (
                          <Editable
                            key={t}
                            path={`${csPath}.architecture.${i}.tech.${j}`}
                            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-ocean-200/80"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section path="caseStudy.sections.features">
              <div className="space-y-10">
                {cs.features.map((feat, i) => (
                  <motion.div
                    key={feat.name}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                    className={`grid grid-cols-1 md:grid-cols-5 gap-6 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
                  >
                    <div className="md:col-span-3 rounded-2xl overflow-hidden border border-white/10 bg-ocean-950/50 shadow-glass">
                      {feat.files && feat.files.length > 1 ? (
                        <FeatureSlider
                          files={feat.files}
                          base={cs.screenshotBase}
                          alt={feat.name}
                        />
                      ) : (
                        <img
                          src={`${cs.screenshotBase}/${feat.file || feat.files?.[0]}`}
                          alt={feat.name}
                          className="w-full h-auto block"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <span className="eyebrow text-[10px]">0{i + 1}</span>
                      <Editable
                        path={`${csPath}.features.${i}.name`}
                        as="h3"
                        className="font-display text-xl font-semibold text-white mt-1 tracking-tight"
                      />
                      <Editable path={`${csPath}.features.${i}.desc`} as="p" className="text-sm text-ocean-100/80 mt-2 leading-relaxed" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section path="caseStudy.sections.decisions">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cs.decisions.map((d, i) => (
                  <motion.div
                    key={d.q}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="rounded-2xl border border-white/15 bg-white/[0.04] p-6"
                  >
                    <Editable
                      path={`${csPath}.decisions.${i}.q`}
                      as="h3"
                      className="font-display text-base font-semibold text-white tracking-tight mb-2"
                    />
                    <Editable path={`${csPath}.decisions.${i}.a`} as="p" className="text-sm text-ocean-100/80 leading-relaxed" />
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section path="caseStudy.sections.learnings">
              <ul className="space-y-4">
                {cs.learnings.map((l, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.35, delay: i * 0.08 }}
                    className="relative pl-6 text-ocean-50/85 leading-relaxed text-base md:text-lg"
                  >
                    <span className="absolute left-0 top-2.5 h-1.5 w-1.5 rounded-full bg-ocean-300 shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
                    <Editable path={`${csPath}.learnings.${i}`} />
                  </motion.li>
                ))}
              </ul>
            </Section>

            {cs.credits && (
              <Section path="caseStudy.sections.credits">
                {cs.credits.blurb && (
                  <Editable
                    path={`${csPath}.credits.blurb`}
                    as="p"
                    className="text-ocean-50/85 leading-relaxed text-base md:text-lg mb-8"
                  />
                )}
                <div className="space-y-6">
                  {cs.credits.groups.map((g, gi) => (
                    <div key={g.label}>
                      <Editable path={`${csPath}.credits.groups.${gi}.label`} as="div" className="eyebrow mb-3" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {g.people.map((p, pi) => {
                          const personPath = `${csPath}.credits.groups.${gi}.people.${pi}`;
                          const url = p.url || p.linkedin;
                          const isGithub = url?.includes('github.com');
                          const Icon = isGithub ? FaGithub : FaLinkedin;
                          return (
                            <a
                              key={p.name}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 px-5 py-4 transition-colors"
                            >
                              <div className="min-w-0">
                                <Editable
                                  path={`${personPath}.name`}
                                  as="div"
                                  className="font-display text-base font-semibold text-white tracking-tight truncate"
                                />
                                {p.subtitle && (
                                  <Editable path={`${personPath}.subtitle`} as="div" className="text-xs text-ocean-200/70 mt-0.5 truncate" />
                                )}
                              </div>
                              {url && <Icon className="h-4 w-4 shrink-0 text-ocean-200/80 group-hover:text-white transition-colors" />}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <div className="mt-16 rounded-3xl border border-white/15 bg-ocean-950/40 shadow-glass p-8 md:p-10 text-center"
              style={{ backdropFilter: 'blur(18px) saturate(180%)', WebkitBackdropFilter: 'blur(18px) saturate(180%)' }}>
              <Editable path="caseStudy.cta.eyebrow" className="eyebrow" />
              <Editable
                path={`caseStudy.cta.${ctaVariant}.title`}
                as="h3"
                className="font-display text-2xl md:text-3xl font-semibold text-white mt-2 tracking-tight"
              />
              <Editable path={`caseStudy.cta.${ctaVariant}.body`} as="p" className="text-ocean-100/75 mt-3 max-w-xl mx-auto" />
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-ocean-500 to-ocean-400 hover:from-ocean-400 hover:to-ocean-300 text-white text-sm font-semibold shadow-glow"
                  >
                    <FaExternalLinkAlt className="h-3 w-3" /> <Editable path="caseStudy.cta.liveSite" /> <FaArrowRight className="h-3 w-3" />
                  </a>
                )}
                <a
                  href={project.github || project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-colors ${
                    project.demo
                      ? 'bg-white/10 border border-white/15 hover:bg-white/20'
                      : 'bg-gradient-to-r from-ocean-500 to-ocean-400 hover:from-ocean-400 hover:to-ocean-300 shadow-glow'
                  }`}
                >
                  <FaGithub className="h-4 w-4" /> <Editable path="caseStudy.cta.viewOnGithub" />
                </a>
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
                >
                  <Editable path="caseStudy.cta.back" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FeatureSlider({ files, base, alt }) {
  const [index, setIndex] = useState(0);
  const [ratio, setRatio] = useState(null);
  const total = files.length;
  const go = (delta) => setIndex((i) => (i + delta + total) % total);

  return (
    <div className="relative group">
      <div
        className="relative w-full overflow-hidden"
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        {files.map((f, i) => (
          <img
            key={f}
            src={`${base}/${f}`}
            alt={`${alt} ${i + 1} of ${total}`}
            onLoad={i === 0 && !ratio ? (e) => setRatio(`${e.currentTarget.naturalWidth} / ${e.currentTarget.naturalHeight}`) : undefined}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-ocean-950/70 border border-white/15 text-white hover:bg-ocean-950/90 hover:border-white/30 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
      >
        <FaChevronLeft className="h-3 w-3" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-ocean-950/70 border border-white/15 text-white hover:bg-ocean-950/90 hover:border-white/30 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
      >
        <FaChevronRight className="h-3 w-3" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ocean-950/60 border border-white/15 backdrop-blur-sm">
        {files.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-4 bg-ocean-300' : 'w-1.5 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// `path` points at the section's labels in caseStudy.json, e.g. "caseStudy.sections.problem".
function Section({ path, children }) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <Editable path={`${path}.eyebrow`} className="eyebrow" />
        <Editable path={`${path}.title`} as="h2" className="font-display text-2xl md:text-3xl font-semibold text-white mt-2 tracking-tight" />
      </div>
      {children}
    </section>
  );
}

export default ProjectDisplay;
