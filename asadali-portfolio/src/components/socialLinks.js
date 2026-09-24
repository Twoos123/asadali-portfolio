import React from 'react';
import { FaEnvelope, FaFileAlt, FaGithub, FaGlobe, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { SiX } from 'react-icons/si';
import Editable from '../editor/Editable';
import { EditSelect, LinkEdit } from '../editor/controls';

// Social links (hero.social and footer.social in src/content) store one of these keys as
// their `icon`; an unknown key falls back to the globe. `hover` / `groupHover` are the
// icon's hover colour, written out in full so Tailwind keeps the classes.
export const SOCIAL_ICONS = {
  linkedin: { label: 'LinkedIn', Icon: FaLinkedin, hover: 'hover:text-blue-300', groupHover: 'group-hover:text-blue-300' },
  github: { label: 'GitHub', Icon: FaGithub, hover: 'hover:text-gray-300', groupHover: 'group-hover:text-gray-300' },
  email: { label: 'Email', Icon: FaEnvelope, hover: 'hover:text-blue-300', groupHover: 'group-hover:text-blue-300' },
  x: { label: 'X / Twitter', Icon: SiX, hover: 'hover:text-gray-300', groupHover: 'group-hover:text-gray-300' },
  instagram: { label: 'Instagram', Icon: FaInstagram, hover: 'hover:text-pink-300', groupHover: 'group-hover:text-pink-300' },
  youtube: { label: 'YouTube', Icon: FaYoutube, hover: 'hover:text-red-300', groupHover: 'group-hover:text-red-300' },
  website: { label: 'Website', Icon: FaGlobe, hover: 'hover:text-blue-300', groupHover: 'group-hover:text-blue-300' },
  resume: { label: 'Resume', Icon: FaFileAlt, hover: 'hover:text-blue-300', groupHover: 'group-hover:text-blue-300' },
};

const ICON_OPTIONS = Object.entries(SOCIAL_ICONS).map(([value, { label }]) => ({ value, label }));

export const socialIcon = (key) => SOCIAL_ICONS[key] || SOCIAL_ICONS.website;

export const NEW_SOCIAL_LINK = { icon: 'website', label: 'New link', url: '' };

// mailto: links open in place; everything else in a new tab, as the social links always have.
export const linkTargetProps = (href) =>
  href && !href.startsWith('mailto:') ? { target: '_blank', rel: 'noopener noreferrer' } : {};

// Edit-mode fields under a social link: its label, URL and icon.
export function SocialLinkFields({ path, labelClassName }) {
  return (
    <>
      <Editable path={`${path}.label`} className={labelClassName} />
      <LinkEdit path={`${path}.url`} label="URL" />
      <EditSelect path={`${path}.icon`} options={ICON_OPTIONS} label="Icon" />
    </>
  );
}
