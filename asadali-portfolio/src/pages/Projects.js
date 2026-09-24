import React, { useRef, useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import OceanLife from '../components/ocean/OceanLife';
import Editable from '../editor/Editable';
import { useContent, useEditing } from '../editor/store';
import { AddItem, EditableImage, ItemControls, LinkEdit } from '../editor/controls';
import { safeUrl } from '../editor/markup';
import { NEW_SKILL, newProject } from '../helpers/ProjectList';
import { FaSearch, FaFilter, FaGithub, FaBookOpen, FaCode } from 'react-icons/fa';
import { SiSupabase, SiStripe } from 'react-icons/si';

// A project's skills are plain names in projects.json. This maps a name to its icon file in
// public/assets/skills; any other name tries "<name>.svg" there, and a name with no icon file
// (e.g. one just typed in the editor) gets a generic code icon.
const SKILL_ICON_FILES = {
  'Groq API': 'Groq.svg',
  'Co:Here NLP': 'Cohere.svg',
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
  'Rust': 'Rust.svg',
  'Recharts': 'Recharts.svg',
  'Anthropic Claude': 'Anthropic.svg',
  'Claude': 'Claude.svg',
  'Drupal': 'Drupal.svg',
  'Elixir': 'Elixir.svg',
  'PHP': 'PHP.svg',
  'Linux': 'Linux.svg',
  'Apache': 'Apache.svg',
};

// Skills drawn with react-icons in their brand colors instead of a file.
const SKILL_REACT_ICONS = {
  'Supabase': { component: SiSupabase, color: '#3ECF8E' },
  'Stripe': { component: SiStripe, color: '#635BFF' },
};

const SKILL_SIZE_MULTIPLIER = {
  'Chakra UI': 1.4,
};

// Exact name first, then ignoring case (so "react" still finds React's icon).
const lookup = (map, name) => {
  if (map[name] !== undefined) return map[name];
  const lower = name.toLowerCase();
  const key = Object.keys(map).find((k) => k.toLowerCase() === lower);
  return key === undefined ? undefined : map[key];
};

// A skill's icon: a brand react-icon, its SVG file, or the generic icon.
const SkillGlyph = ({ skill, size = 20, style }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const name = typeof skill === 'string' ? skill.trim() : '';
  const reactIcon = name ? lookup(SKILL_REACT_ICONS, name) : undefined;
  const file = name ? lookup(SKILL_ICON_FILES, name) || `${encodeURIComponent(name)}.svg` : '';
  const src = file ? `${process.env.PUBLIC_URL}/assets/skills/${file}` : '';

  if (reactIcon) {
    const IconComponent = reactIcon.component;
    return <IconComponent size={size} style={{ color: reactIcon.color, ...style }} />;
  }
  if (!src || failedSrc === src) {
    return <FaCode size={size} style={{ color: '#bae6fd', ...style }} />;
  }
  const computedSize = Math.round(size * (lookup(SKILL_SIZE_MULTIPLIER, name) || 1));
  return (
    <img
      src={src}
      alt={name}
      width={computedSize}
      height={computedSize}
      style={style}
      className="transition-colors duration-300 drop-shadow-lg "
      onError={() => setFailedSrc(src)}
    />
  );
};

// Move SkillIcon OUTSIDE the Projects component
const SkillIcon = React.memo(({ skill }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SkillGlyph
        skill={skill}
        size={20}
        style={{
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s ease-in-out',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
        }}
      />
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap z-30 pointer-events-none shadow-lg">
          {skill}
        </div>
      )}
    </div>
  );
});

// Edit mode: a skill as a chip with its icon, editable name and move/remove buttons.
const SkillChip = ({ skill, listPath, index, count }) => (
  <div className="relative inline-flex items-center gap-1.5 min-h-[34px] pl-2.5 pr-[82px] rounded-full bg-white/5 border border-white/10">
    <SkillGlyph skill={skill} size={16} />
    <Editable path={`${listPath}.${index}`} className="inline-block min-w-[1.5rem] text-xs text-ocean-50/90" />
    <ItemControls listPath={listPath} index={index} count={count} label="skill" />
  </div>
);

const VISIBLE_SKILLS = 7;
const stopPropagation = (e) => e.stopPropagation();

// Move ProjectCard OUTSIDE the Projects component
// `path` is the project's place in the content, e.g. "projects.items.3", and `listIndex` its
// index in that list (the grid may be filtered).
const ProjectCard = React.memo(({ project, path, index, listIndex, count }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { threshold: 0.1, once: true });
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const navigate = useNavigate();
  const editing = useEditing();
  const hasCaseStudy = Boolean(project.caseStudy);
  const githubUrl = safeUrl(project.github);
  const demoUrl = safeUrl(project.demo);

  const handleCardClick = useCallback(() => {
    if (hasCaseStudy) {
      navigate(`/project/${project.id}`);
    } else if (demoUrl) {
      window.open(demoUrl, '_blank');
    } else if (githubUrl) {
      window.open(githubUrl, '_blank');
    }
  }, [hasCaseStudy, navigate, project.id, demoUrl, githubUrl]);

  const handleGitHubClick = useCallback((e) => {
    e.stopPropagation();
    window.open(githubUrl, '_blank');
  }, [githubUrl]);

  const skillsPath = `${path}.skills`;
  const skillsArray = Array.isArray(project.skills) ? project.skills : [];
  // Every skill while editing, so none are out of reach behind the "+N".
  const shownSkills = skillsExpanded || editing ? skillsArray : skillsArray.slice(0, VISIBLE_SKILLS);

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer h-full"
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.06 }}
      whileHover={{ y: -8, transition: { duration: 0.2, ease: 'easeOut', delay: 0 } }}
    >
      <div
        className="relative h-full flex flex-col overflow-hidden rounded-3xl border border-white/15 bg-ocean-950/40 shadow-glass transition-all duration-500 group-hover:shadow-glass-lg group-hover:border-white/25"
        style={{
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        }}
      >
        <div className="relative h-52 overflow-hidden">
          <EditableImage
            path={`${path}.image`}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-ocean-950/85 via-ocean-950/20 to-transparent${editing ? ' pointer-events-none' : ''}`} />
          <ItemControls listPath="projects.items" index={listIndex} count={count} label="project" />

          {githubUrl && (
            <motion.button
              onClick={handleGitHubClick}
              className={`absolute ${editing ? 'top-12' : 'top-4'} right-4 p-2.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors duration-300 z-10`}
              style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label={`View ${project.name} on GitHub`}
            >
              <FaGithub size={18} className="text-white" />
            </motion.button>
          )}

          {hasCaseStudy && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ocean-400/25 border border-ocean-300/40 text-ocean-50 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
              <FaBookOpen className="h-2.5 w-2.5" />
              <Editable path="projects.page.card.caseStudyBadge" />
            </div>
          )}
          {!hasCaseStudy && demoUrl && (
            <Editable
              path="projects.page.card.liveDemoBadge"
              as="div"
              className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-100 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm"
            />
          )}
        </div>

        <div className="p-6 flex flex-col flex-1 gap-3">
          <Editable path={`${path}.name`} as="h3" className="font-display text-xl font-semibold text-white tracking-tight" />
          <Editable
            path={`${path}.description`}
            as="p"
            className={`text-ocean-100/80 text-sm leading-relaxed min-h-[3.75rem]${editing ? '' : ' line-clamp-3'}`}
          />

          {/* While editing, clicks around the skill chips and link pills don't open the project. */}
          <div
            className={`flex flex-wrap ${editing ? 'gap-2' : 'gap-3'} items-center pt-2 mt-auto`}
            onClick={editing ? stopPropagation : undefined}
          >
            {shownSkills.map((skill, skillIndex) => (editing ? (
              <SkillChip key={skillIndex} skill={skill} listPath={skillsPath} index={skillIndex} count={skillsArray.length} />
            ) : (
              <SkillIcon key={`${project.id}-${skillIndex}`} skill={skill} />
            )))}
            {skillsArray.length > VISIBLE_SKILLS && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSkillsExpanded((prev) => !prev);
                }}
                className="text-xs text-ocean-100 font-medium px-2.5 py-1 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 hover:border-white/25 transition-colors"
                aria-label={skillsExpanded ? 'Show fewer skills' : 'Show all skills'}
              >
                {skillsExpanded || editing ? <Editable path="projects.page.card.showLessSkills" /> : `+${skillsArray.length - VISIBLE_SKILLS}`}
              </button>
            )}
            {shownSkills.length === skillsArray.length && (
              <AddItem listPath={skillsPath} template={NEW_SKILL} label="skill" />
            )}
          </div>

          {editing && (
            <div className="flex flex-wrap gap-2" onClick={stopPropagation}>
              <LinkEdit path={`${path}.github`} label="GitHub" />
              <LinkEdit path={`${path}.demo`} label="Demo" />
              <button
                type="button"
                className="site-edit-control inline-flex items-center gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/project/${project.id}`);
                }}
              >
                <FaBookOpen className="h-2.5 w-2.5" />
                {hasCaseStudy ? 'Case study' : 'Add case study'}
              </button>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-ocean-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
});

const INITIAL_VISIBLE = 6;
const text = (value) => (typeof value === 'string' ? value : '').toLowerCase();

function Projects() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { threshold: 0.3, once: true });
  const projectList = useContent('projects').items;
  const editing = useEditing();

  // Cards are edited by the project's position in projects.json, not its id.
  const indexById = useMemo(() => {
    const indexes = new Map();
    projectList.forEach((project, i) => indexes.set(project.id, i));
    return indexes;
  }, [projectList]);

  // State for projects functionality
  const [visibleProjects, setVisibleProjects] = useState(INITIAL_VISIBLE);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique tags from all projects
  const allTags = useMemo(() => {
    const tags = new Set(['All']);
    projectList.forEach(project => {
      if (Array.isArray(project.skills)) {
        project.skills.forEach(skill => {
          if (typeof skill === 'string' && skill.trim()) tags.add(skill);
        });
      }
    });
    return Array.from(tags);
  }, [projectList]);

  // A tag that was renamed or removed in the editor stops filtering.
  const activeTag = allTags.includes(selectedTag) ? selectedTag : 'All';

  // Filter projects based on search and tags
  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return projectList.filter(project => {
      const matchesSearch = text(project.name).includes(term) || text(project.description).includes(term);

      const matchesTag = activeTag === 'All' ||
                        (Array.isArray(project.skills) && project.skills.includes(activeTag));

      return matchesSearch && matchesTag;
    });
  }, [projectList, searchTerm, activeTag]);

  const showSeeMore = filteredProjects.length > visibleProjects;
  const displayedProjects = filteredProjects.slice(0, visibleProjects);

  const handleSeeMore = () => {
    setVisibleProjects(prev => prev + INITIAL_VISIBLE);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setVisibleProjects(INITIAL_VISIBLE); // Reset to initial count when searching
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setVisibleProjects(INITIAL_VISIBLE); // Reset to initial count when filtering
  };

  return (
    <div className="projects py-16 ocean-transition relative" style={{
      backgroundSize: '120vw 120vh',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    }}>
      <OceanLife section="projects" />
      <motion.div
        ref={titleRef}
        className="text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Editable path="projects.page.eyebrow" className="eyebrow" />
        <Editable path="projects.page.heading" as="h1" className="font-display text-4xl md:text-5xl font-bold text-white mt-3 tracking-tight" />
      </motion.div>

      {/* Search and Filter Section */}
      <div className="max-w-4xl mx-auto px-4 mb-8 relative z-10">
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-blue-300" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center mb-4">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFilter className="h-4 w-4" />
            <Editable path="projects.page.filters.toggle" />
          </motion.button>
        </div>

        {/* Filter Tags */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: showFilters ? 'auto' : 0,
            opacity: showFilters ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {allTags.map(tag => (
              <motion.button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeTag === tag
                    ? 'bg-blue-500 text-white'
                    : 'backdrop-blur-sm bg-white/10 border border-white/20 text-blue-200 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag === 'All' ? <Editable path="projects.page.filters.all" /> : tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="text-center text-blue-200 text-sm mb-6">
          <Editable path="projects.page.resultsCount.showing" />
          {' '}{displayedProjects.length}{' '}
          <Editable path="projects.page.resultsCount.of" />
          {' '}{filteredProjects.length}{' '}
          <Editable path="projects.page.resultsCount.projects" />
        </div>
      </div>

      {/* New projects go first, where they're visible straight away. */}
      {editing && (
        <div className="flex justify-center mb-8 relative z-10">
          <AddItem listPath="projects.items" template={newProject} label="project" at={0} />
        </div>
      )}

      {/* Projects Grid */}
      <div className="projectList grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto items-stretch relative z-10">
        {displayedProjects.map((project, index) => {
          const listIndex = indexById.get(project.id);
          return (
            <ProjectCard
              key={project.id}
              project={project}
              path={`projects.items.${listIndex}`}
              index={index}
              listIndex={listIndex}
              count={projectList.length}
            />
          );
        })}
      </div>

      {/* See More Button */}
      {showSeeMore && (
        <div className="flex justify-center mt-12 relative z-10">
          <motion.button
            onClick={handleSeeMore}
            className="px-8 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 hover:bg-white/20 transition-all duration-300 font-medium"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Editable path="projects.page.seeMore.label" />
            {' ('}{filteredProjects.length - visibleProjects}{' '}
            <Editable path="projects.page.seeMore.remaining" />
            {')'}
          </motion.button>
        </div>
      )}

      {/* No Results Message */}
      {filteredProjects.length === 0 && (
        <div className="text-center text-blue-200 mt-12 relative z-10">
          <Editable path="projects.page.noResults.message" as="p" className="text-lg" />
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedTag('All');
              setVisibleProjects(INITIAL_VISIBLE);
            }}
            className="mt-4 px-6 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 hover:bg-white/20 transition-all duration-300"
          >
            <Editable path="projects.page.noResults.clearFilters" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Projects;
