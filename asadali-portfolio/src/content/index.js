// All of the site's editable text, one JSON file per section. Components read it through
// the editor (see src/editor), which lets it be edited on the live site and saved back
// here as a commit. Paths into this object look like "about.paragraphs.0".
import nav from './nav.json';
import hero from './hero.json';
import about from './about.json';
import skills from './skills.json';
import projects from './projects.json';
import experience from './experience.json';
import resume from './resume.json';
import contact from './contact.json';
import footer from './footer.json';
import caseStudy from './caseStudy.json';

export const CONTENT_FILES = ['nav', 'hero', 'about', 'skills', 'projects', 'experience', 'resume', 'contact', 'footer', 'caseStudy'];

const siteContent = { nav, hero, about, skills, projects, experience, resume, contact, footer, caseStudy };

export default siteContent;
