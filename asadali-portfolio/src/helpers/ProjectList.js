import projectsContent from '../content/projects.json';

// The project data (cards and case studies) lives in src/content/projects.json so it can be
// edited on the site. This keeps the old `projectList` import working.
export const projectList = projectsContent.items;

// Templates for the site editor's "Add" buttons. They carry every field the project card and
// case-study page read, so a new item renders (and saves) like the existing ones.

// Shown on a new project (and its first screenshot) until a real image is picked.
export const PLACEHOLDER_IMAGE = '/assets/AsadLogo.png';

export const NEW_SKILL = 'New skill';
export const NEW_TECH = 'New tech';
export const NEW_LAYER = {
  title: 'New layer',
  subtitle: 'Tech used',
  desc: 'What this part of the system does.',
  tech: [NEW_TECH],
};
export const newFeature = (image) => ({
  name: 'New feature',
  desc: 'What this feature does.',
  screenshots: [image || PLACEHOLDER_IMAGE],
});
export const NEW_DECISION = { q: 'Why this choice?', a: 'The reasoning behind it.' };
export const NEW_LEARNING = 'Something learned while building this.';
export const NEW_CREDIT_PERSON = { name: 'New credit', subtitle: '', url: '' };
export const NEW_CREDIT_GROUP = { label: 'New group', people: [NEW_CREDIT_PERSON] };

// A new project card: the next free numeric id, no links and no case study yet.
export const newProject = (list) => ({
  id: list.reduce((max, project) => Math.max(max, Number(project.id) || 0), -1) + 1,
  name: 'New project',
  description: 'A short description of the project.',
  image: PLACEHOLDER_IMAGE,
  skills: [],
  github: '',
  demo: '',
  caseStudy: null,
});

// A starter case study for a project that doesn't have one: one placeholder in every list.
export const newCaseStudy = (project) => ({
  tagline: 'A one-line summary of the project.',
  heroImage: project.image || PLACEHOLDER_IMAGE,
  origin: 'How the project got started.',
  problem: 'The problem this project solves.',
  solution: 'How the project solves it.',
  architecture: [NEW_LAYER],
  features: [newFeature(project.image)],
  decisions: [NEW_DECISION],
  learnings: [NEW_LEARNING],
  credits: {
    blurb: 'Thanks to everyone who helped build this.',
    groups: [NEW_CREDIT_GROUP],
  },
});
