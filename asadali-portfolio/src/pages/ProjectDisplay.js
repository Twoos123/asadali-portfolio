import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaArrowRight, FaChevronLeft, FaChevronRight, FaLinkedin } from 'react-icons/fa';
import { projectList } from '../helpers/ProjectList';

function ProjectDisplay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectList.find((p) => p.id.toString() === id);
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  if (!project) {
    return (
      <div className="py-32 px-4 max-w-2xl mx-auto text-center">
        <h1 className="font-display text-3xl font-semibold text-white mb-4">Project not found</h1>
        <button onClick={goBack} className="text-ocean-300 hover:text-ocean-200 inline-flex items-center gap-2">
          <FaArrowLeft className="h-3 w-3" /> Back
        </button>
      </div>
    );
  }

  const skills = Array.isArray(project.skills) ? project.skills : [];
  const cs = project.caseStudy;

  return (
    <div className="project-display relative py-24 md:py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-ocean-200/80 hover:text-white text-sm font-medium transition-colors mb-8"
        >
          <FaArrowLeft className="h-3 w-3" /> Back
        </button>

        <header className="mb-10">
          <span className="eyebrow">Case study</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-3 tracking-tight">
            {project.name}
          </h1>
          {cs?.tagline && (
            <p className="text-lg md:text-xl text-ocean-100/80 mt-4 max-w-3xl leading-relaxed">
              {cs.tagline}
            </p>
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
              View Repository
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-ocean-500 to-ocean-400 hover:from-ocean-400 hover:to-ocean-300 text-white text-sm font-semibold shadow-glow"
              >
                <FaExternalLinkAlt className="h-3 w-3" />
                Live Demo
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
            <p className="text-ocean-100/80">Head to the repository above for the full write-up and code.</p>
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
                  <span className="eyebrow">How it started</span>
                  <p className="mt-4 text-ocean-50/90 leading-relaxed text-base md:text-lg italic">
                    {cs.origin}
                  </p>
                </div>
              </div>
            )}

            <Section eyebrow="The problem" title="Why this exists">
              <p className="text-ocean-50/85 leading-relaxed text-base md:text-lg">{cs.problem}</p>
            </Section>

            <Section eyebrow="The approach" title="How it works">
              <p className="text-ocean-50/85 leading-relaxed text-base md:text-lg">{cs.solution}</p>
            </Section>

            <Section eyebrow="Architecture" title="Four layers, one pipeline">
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
                      <span className="eyebrow text-[10px]">{layer.subtitle}</span>
                      <h3 className="font-display text-lg font-semibold text-white mt-1 tracking-tight">{layer.title}</h3>
                      <p className="text-sm text-ocean-100/80 mt-2 leading-relaxed">{layer.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {layer.tech.map((t) => (
                          <span key={t} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-ocean-200/80">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section eyebrow="Features" title="What it does">
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
                      <h3 className="font-display text-xl font-semibold text-white mt-1 tracking-tight">{feat.name}</h3>
                      <p className="text-sm text-ocean-100/80 mt-2 leading-relaxed">{feat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section eyebrow="Engineering decisions" title="Why these choices">
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
                    <h3 className="font-display text-base font-semibold text-white tracking-tight mb-2">{d.q}</h3>
                    <p className="text-sm text-ocean-100/80 leading-relaxed">{d.a}</p>
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section eyebrow="What I learned" title="Lessons carried forward">
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
                    {l}
                  </motion.li>
                ))}
              </ul>
            </Section>

            {cs.credits && (
              <Section eyebrow="Credits" title="Built with">
                {cs.credits.blurb && (
                  <p className="text-ocean-50/85 leading-relaxed text-base md:text-lg mb-8">
                    {cs.credits.blurb}
                  </p>
                )}
                <div className="space-y-6">
                  {cs.credits.groups.map((g) => (
                    <div key={g.label}>
                      <div className="eyebrow mb-3">{g.label}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {g.people.map((p) => {
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
                                <div className="font-display text-base font-semibold text-white tracking-tight truncate">{p.name}</div>
                                {p.subtitle && (
                                  <div className="text-xs text-ocean-200/70 mt-0.5 truncate">{p.subtitle}</div>
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
              <span className="eyebrow">Go deeper</span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-white mt-2 tracking-tight">
                {project.demo ? 'Check it out live' : 'Read the code'}
              </h3>
              <p className="text-ocean-100/75 mt-3 max-w-xl mx-auto">
                {project.demo
                  ? 'See it running in production, or dig through the source on GitHub.'
                  : 'Full source is on GitHub, including setup instructions and implementation notes.'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-ocean-500 to-ocean-400 hover:from-ocean-400 hover:to-ocean-300 text-white text-sm font-semibold shadow-glow"
                  >
                    <FaExternalLinkAlt className="h-3 w-3" /> Live Site <FaArrowRight className="h-3 w-3" />
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
                  <FaGithub className="h-4 w-4" /> View on GitHub
                </a>
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
                >
                  Back
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

function Section({ eyebrow, title, children }) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-2 tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default ProjectDisplay;
