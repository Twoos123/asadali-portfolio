import React from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { setMotionPaused, useMotionPaused } from '../hooks/useReducedMotion';
import Editable from '../editor/Editable';
import { useContent, useEditing } from '../editor/store';
import { AddItem, ItemControls } from '../editor/controls';
import { safeUrl } from '../editor/markup';
import { NEW_SOCIAL_LINK, SocialLinkFields, linkTargetProps, socialIcon } from './socialLinks';

function Footer() {
  const motionPaused = useMotionPaused();
  const { social } = useContent('footer');
  const editing = useEditing();

  return (
    <footer className="bg-transparent text-white py-8 relative" style={{
      background: 'linear-gradient(to bottom, transparent 0%, hsl(230, 95%, 5%) 50%, hsl(240, 100%, 3%) 100%)'
    }}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex flex-col md:flex-row items-center gap-3 md:gap-5">
            <Editable path="footer.copyright" as="p" className="text-blue-200" />
            <button
              type="button"
              onClick={() => setMotionPaused(!motionPaused)}
              aria-pressed={motionPaused}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-blue-200 hover:text-white hover:border-white/30 transition-colors"
            >
              {motionPaused ? <FaPlay size={9} /> : <FaPause size={9} />}
              {motionPaused ? 'Play animations' : 'Pause animations'}
            </button>
          </div>
          <div className={`flex space-x-8${editing ? ' items-center' : ''}`}>
            {social.map((link, i) => (
              <FooterLink key={i} link={link} index={i} count={social.length} editing={editing} />
            ))}
            <AddItem listPath="footer.social" template={NEW_SOCIAL_LINK} label="social link" />
          </div>
        </div>
      </div>
    </footer>
  );
}

// One footer social link: footer.social in src/content/footer.json ({ icon, label, url }).
function FooterLink({ link, index, count, editing }) {
  const path = `footer.social.${index}`;
  const { Icon, hover, groupHover } = socialIcon(link.icon);
  const href = safeUrl(link.url);
  const anchor = (
    <a
      href={href}
      {...linkTargetProps(href)}
      className={`group ${hover} transition-all duration-300 transform hover:scale-105 subtle-hover`}
    >
      <Icon size={30} className={`text-blue-200 ${groupHover}`} />
      <span className="sr-only">{link.label}</span>
    </a>
  );
  if (!editing) return anchor;

  return (
    <div className="relative flex flex-col items-center gap-1.5 pt-8">
      <ItemControls listPath="footer.social" index={index} count={count} label="social link" />
      {anchor}
      <SocialLinkFields path={path} labelClassName="text-xs text-blue-200" />
    </div>
  );
}

export default Footer;
