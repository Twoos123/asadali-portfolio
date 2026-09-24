import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaArrowRight, FaChevronLeft, FaChevronRight, FaLinkedin, FaPlus, FaTimes } from 'react-icons/fa';
import Editable from '../editor/Editable';
import { editorStore, useContent, useEditing } from '../editor/store';
import { AddItem, EditableImage, ItemControls, LinkEdit } from '../editor/controls';
import { safeUrl } from '../editor/markup';
import { notify } from '../editor/dialogs';
import {
  NEW_CREDIT_GROUP,
  NEW_CREDIT_PERSON,
  NEW_DECISION,
  NEW_LAYER,
  NEW_LEARNING,
  NEW_SKILL,
  NEW_TECH,
  PLACEHOLDER_IMAGE,
  newCaseStudy,
  newFeature,
} from '../helpers/ProjectList';

const list = (value) => (Array.isArray(value) ? value : []);
const clone = (value) => JSON.parse(JSON.stringify(value));

function ProjectDisplay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = useEditing();
  const projectList = useContent('projects').items;
  // Everything is edited by the project's position in projects.json, not its id.
  const projectIndex = projectList.findIndex((p) => String(p.id) === id);
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

  const skills = list(project.skills);
  const cs = project.caseStudy;
  const githubUrl = safeUrl(project.github);
  const demoUrl = safeUrl(project.demo);
  const ctaVariant = demoUrl ? 'withDemo' : 'withoutDemo';

  const layers = list(cs?.architecture);
  const features = list(cs?.features);
  const decisions = list(cs?.decisions);
  const learnings = list(cs?.learnings);
  const groups = list(cs?.credits?.groups);

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
          {cs && (cs.tagline || editing) && (
            <Editable
              path={`${csPath}.tagline`}
              as="p"
              className="text-lg md:text-xl text-ocean-100/80 mt-4 max-w-3xl leading-relaxed"
            />
          )}

          <TagList
            listPath={`${path}.skills`}
            items={skills}
            label="skill"
            template={NEW_SKILL}
            className="flex flex-wrap gap-2 mt-6"
            tagClassName="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-ocean-50/85"
          />

          <div className="flex flex-wrap gap-3 mt-8">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
              >
                <FaGithub className="h-4 w-4" />
                <Editable path="caseStudy.headerButtons.viewRepository" />
              </a>
            )}
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-ocean-500 to-ocean-400 hover:from-ocean-400 hover:to-ocean-300 text-white text-sm font-semibold shadow-glow"
              >
                <FaExternalLinkAlt className="h-3 w-3" />
                <Editable path="caseStudy.headerButtons.liveDemo" />
              </a>
            )}
          </div>

          {editing && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <LinkEdit path={`${path}.github`} label="GitHub" />
              <LinkEdit path={`${path}.demo`} label="Demo" />
              {cs && (
                <button
                  type="button"
                  className="site-edit-control inline-flex items-center gap-1.5"
                  onClick={() => {
                    const previous = editorStore.get(csPath);
                    editorStore.set(csPath, null);
                    notify('Removed the case study (the project card and its links stay).', {
                      action: { label: 'Undo', run: () => editorStore.set(csPath, previous) },
                    });
                  }}
                >
                  <FaTimes className="h-2.5 w-2.5" />
                  Remove case study
                </button>
              )}
            </div>
          )}
        </header>

        <div
          className="rounded-3xl overflow-hidden border border-white/15 bg-ocean-950/40 shadow-glass mb-16"
          style={{ backdropFilter: 'blur(18px) saturate(180%)', WebkitBackdropFilter: 'blur(18px) saturate(180%)' }}
        >
          {/* Without its own hero image, the page shows (and edits) the project's card image. */}
          <EditableImage
            path={cs?.heroImage ? `${csPath}.heroImage` : `${path}.image`}
            alt={project.name}
            className="w-full h-auto object-cover"
          />
        </div>

        {!cs && (
          <div className="rounded-3xl border border-white/15 bg-ocean-950/40 shadow-glass p-8 text-center"
            style={{ backdropFilter: 'blur(18px) saturate(180%)', WebkitBackdropFilter: 'blur(18px) saturate(180%)' }}>
            <Editable path="caseStudy.noCaseStudy" as="p" className="text-ocean-100/80" />
            {editing && (
              <button
                type="button"
                className="site-add-item mt-6"
                onClick={() => editorStore.set(csPath, clone(newCaseStudy(project)))}
              >
                <FaPlus className="h-2.5 w-2.5" />
                Add case study
              </button>
            )}
          </div>
        )}

        {cs && (
          <>
            {(cs.origin || editing) && (
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

            {(layers.length > 0 || editing) && (
              <Section path="caseStudy.sections.architecture">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {layers.map((layer, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="relative rounded-2xl border border-white/15 bg-white/[0.04] p-6"
                    >
                      <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-gradient-to-b from-ocean-400 to-ocean-600" />
                      <ItemControls listPath={`${csPath}.architecture`} index={i} count={layers.length} label="layer" />
                      <div className="pl-3">
                        <Editable path={`${csPath}.architecture.${i}.subtitle`} className="eyebrow text-[10px]" />
                        <Editable
                          path={`${csPath}.architecture.${i}.title`}
                          as="h3"
                          className="font-display text-lg font-semibold text-white mt-1 tracking-tight"
                        />
                        <Editable path={`${csPath}.architecture.${i}.desc`} as="p" className="text-sm text-ocean-100/80 mt-2 leading-relaxed" />
                        <TagList
                          listPath={`${csPath}.architecture.${i}.tech`}
                          items={list(layer.tech)}
                          label="tech"
                          template={NEW_TECH}
                          className="flex flex-wrap gap-1.5 mt-3"
                          tagClassName="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-ocean-200/80"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <AddItem listPath={`${csPath}.architecture`} template={NEW_LAYER} label="layer" className="mt-4" />
              </Section>
            )}

            {(features.length > 0 || editing) && (
              <Section path="caseStudy.sections.features">
                <div className="space-y-10">
                  {features.map((feat, i) => {
                    const featurePath = `${csPath}.features.${i}`;
                    const shots = list(feat.screenshots);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.45, delay: i * 0.05 }}
                        className={`grid grid-cols-1 md:grid-cols-5 gap-6 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
                      >
                        {(shots.length > 0 || editing) && (
                          <div className="md:col-span-3 rounded-2xl overflow-hidden border border-white/10 bg-ocean-950/50 shadow-glass">
                            {editing ? (
                              <ScreenshotEditor listPath={`${featurePath}.screenshots`} shots={shots} alt={feat.name} />
                            ) : shots.length > 1 ? (
                              <FeatureSlider listPath={`${featurePath}.screenshots`} files={shots} alt={feat.name} />
                            ) : (
                              <EditableImage
                                path={`${featurePath}.screenshots.0`}
                                alt={feat.name}
                                className="w-full h-auto block"
                                loading="lazy"
                              />
                            )}
                          </div>
                        )}
                        <div className={`relative md:col-span-2${editing ? ' pt-8' : ''}`}>
                          <ItemControls listPath={`${csPath}.features`} index={i} count={features.length} label="feature" />
                          <span className="eyebrow text-[10px]">0{i + 1}</span>
                          <Editable
                            path={`${featurePath}.name`}
                            as="h3"
                            className="font-display text-xl font-semibold text-white mt-1 tracking-tight"
                          />
                          <Editable path={`${featurePath}.desc`} as="p" className="text-sm text-ocean-100/80 mt-2 leading-relaxed" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <AddItem
                  listPath={`${csPath}.features`}
                  template={() => newFeature(PLACEHOLDER_IMAGE)}
                  label="feature"
                  className="mt-6"
                />
              </Section>
            )}

            {(decisions.length > 0 || editing) && (
              <Section path="caseStudy.sections.decisions">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {decisions.map((d, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className={`relative rounded-2xl border border-white/15 bg-white/[0.04] p-6${editing ? ' pt-10' : ''}`}
                    >
                      <ItemControls listPath={`${csPath}.decisions`} index={i} count={decisions.length} label="decision" />
                      <Editable
                        path={`${csPath}.decisions.${i}.q`}
                        as="h3"
                        className="font-display text-base font-semibold text-white tracking-tight mb-2"
                      />
                      <Editable path={`${csPath}.decisions.${i}.a`} as="p" className="text-sm text-ocean-100/80 leading-relaxed" />
                    </motion.div>
                  ))}
                </div>
                <AddItem listPath={`${csPath}.decisions`} template={NEW_DECISION} label="decision" className="mt-4" />
              </Section>
            )}

            {(learnings.length > 0 || editing) && (
              <Section path="caseStudy.sections.learnings">
                <ul className="space-y-4">
                  {learnings.map((l, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.35, delay: i * 0.08 }}
                      className={`relative pl-6 text-ocean-50/85 leading-relaxed text-base md:text-lg${editing ? ' pr-24' : ''}`}
                    >
                      <span className="absolute left-0 top-2.5 h-1.5 w-1.5 rounded-full bg-ocean-300 shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
                      <Editable path={`${csPath}.learnings.${i}`} />
                      <ItemControls listPath={`${csPath}.learnings`} index={i} count={learnings.length} label="lesson" />
                    </motion.li>
                  ))}
                </ul>
                <AddItem listPath={`${csPath}.learnings`} template={NEW_LEARNING} label="lesson" className="mt-4" />
              </Section>
            )}

            {cs.credits && (cs.credits.blurb || groups.length > 0 || editing) && (
              <Section path="caseStudy.sections.credits">
                {(cs.credits.blurb || editing) && (
                  <Editable
                    path={`${csPath}.credits.blurb`}
                    as="p"
                    className="text-ocean-50/85 leading-relaxed text-base md:text-lg mb-8"
                  />
                )}
                <div className="space-y-6">
                  {groups.map((g, gi) => {
                    const groupPath = `${csPath}.credits.groups.${gi}`;
                    const people = list(g.people);
                    return (
                      <div key={gi} className="relative">
                        <ItemControls listPath={`${csPath}.credits.groups`} index={gi} count={groups.length} label="credit group" />
                        <Editable path={`${groupPath}.label`} as="div" className={`eyebrow ${editing ? 'mb-7' : 'mb-3'}`} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {people.map((p, pi) => (
                            <CreditCard
                              key={pi}
                              person={p}
                              path={`${groupPath}.people.${pi}`}
                              listPath={`${groupPath}.people`}
                              index={pi}
                              count={people.length}
                              editing={editing}
                            />
                          ))}
                        </div>
                        <AddItem listPath={`${groupPath}.people`} template={NEW_CREDIT_PERSON} label="credit" className="mt-3" />
                      </div>
                    );
                  })}
                </div>
                <AddItem listPath={`${csPath}.credits.groups`} template={NEW_CREDIT_GROUP} label="credit group" className="mt-6" />
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
                {demoUrl && (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-ocean-500 to-ocean-400 hover:from-ocean-400 hover:to-ocean-300 text-white text-sm font-semibold shadow-glow"
                  >
                    <FaExternalLinkAlt className="h-3 w-3" /> <Editable path="caseStudy.cta.liveSite" /> <FaArrowRight className="h-3 w-3" />
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-colors ${
                      demoUrl
                        ? 'bg-white/10 border border-white/15 hover:bg-white/20'
                        : 'bg-gradient-to-r from-ocean-500 to-ocean-400 hover:from-ocean-400 hover:to-ocean-300 shadow-glow'
                    }`}
                  >
                    <FaGithub className="h-4 w-4" /> <Editable path="caseStudy.cta.viewOnGithub" />
                  </a>
                )}
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

// A row of tags from a list of strings in the content (skills, tech). While editing each tag
// is editable text with move/remove buttons beside it, plus an "Add" button at the end.
function TagList({ listPath, items, label, template, className, tagClassName }) {
  const editing = useEditing();
  return (
    <div className={className}>
      {items.map((item, i) => (editing ? (
        <span key={i} className="relative inline-flex items-center min-h-[32px] pr-[80px]">
          <Editable path={`${listPath}.${i}`} className={`${tagClassName} min-w-[2rem]`} />
          <ItemControls listPath={listPath} index={i} count={items.length} label={label} />
        </span>
      ) : (
        <span key={i} className={tagClassName}>
          {item}
        </span>
      )))}
      <AddItem listPath={listPath} template={template} label={label} />
    </div>
  );
}

// One person or project in the credits. While editing it isn't a link: its name, subtitle
// and URL are edited in place instead.
function CreditCard({ person, path, listPath, index, count, editing }) {
  const url = safeUrl(person.url);
  const isGithub = url?.includes('github.com');
  const Icon = isGithub ? FaGithub : FaLinkedin;
  const Card = editing ? 'div' : 'a';
  const linkProps = editing ? {} : { href: url, target: '_blank', rel: 'noopener noreferrer' };
  return (
    <Card
      {...linkProps}
      className={`relative group flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 px-5 py-4 transition-colors${editing ? ' pt-10' : ''}`}
    >
      <ItemControls listPath={listPath} index={index} count={count} label="credit" />
      <div className="min-w-0">
        <Editable
          path={`${path}.name`}
          as="div"
          className="font-display text-base font-semibold text-white tracking-tight truncate"
        />
        {(person.subtitle || editing) && (
          <Editable path={`${path}.subtitle`} as="div" className="text-xs text-ocean-200/70 mt-0.5 truncate" />
        )}
        {editing && (
          <div className="mt-2">
            <LinkEdit path={`${path}.url`} label="Link" />
          </div>
        )}
      </div>
      {url && <Icon className="h-4 w-4 shrink-0 text-ocean-200/80 group-hover:text-white transition-colors" />}
    </Card>
  );
}

// Edit mode for a feature's screenshots: every one visible (instead of the slider), each
// replaceable by clicking it, with move/remove buttons and an "Add" button.
function ScreenshotEditor({ listPath, shots, alt }) {
  return (
    <div className="p-3 space-y-3">
      <div className={`grid gap-3 ${shots.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {shots.map((_, i) => (
          <div key={i} className="relative">
            <EditableImage path={`${listPath}.${i}`} alt={`${alt} ${i + 1} of ${shots.length}`} className="w-full h-auto block" />
            <ItemControls listPath={listPath} index={i} count={shots.length} label="screenshot" />
          </div>
        ))}
      </div>
      <AddItem listPath={listPath} template={PLACEHOLDER_IMAGE} label="screenshot" />
    </div>
  );
}

// `listPath` is the feature's screenshot list in the content, e.g.
// "projects.items.0.caseStudy.features.3.screenshots".
function FeatureSlider({ listPath, files, alt }) {
  const [index, setIndex] = useState(0);
  const [ratio, setRatio] = useState(null);
  const total = files.length;
  const current = Math.min(index, total - 1);
  const go = (delta) => setIndex((i) => (i + delta + total) % total);

  return (
    <div className="relative group">
      <div
        className="relative w-full overflow-hidden"
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        {files.map((_, i) => (
          <EditableImage
            key={i}
            path={`${listPath}.${i}`}
            alt={`${alt} ${i + 1} of ${total}`}
            onLoad={i === 0 && !ratio ? (e) => setRatio(`${e.currentTarget.naturalWidth} / ${e.currentTarget.naturalHeight}`) : undefined}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out ${
              i === current ? 'opacity-100' : 'opacity-0'
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
              i === current ? 'w-4 bg-ocean-300' : 'w-1.5 bg-white/30 hover:bg-white/50'
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
