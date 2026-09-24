import React from 'react';
import { Link } from 'react-router-dom';

// A deliberately tiny markup for rich text fields, so content stays plain JSON strings that
// are always rendered as text (never as HTML):
//   **Sun Life**                   -> highlighted words
//   [CS2 Meta Engine](/project/10) -> a link (site paths use the router, others open a tab)

const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export const HIGHLIGHT_CLASS = 'text-ocean-100';
export const LINK_CLASS =
  'text-ocean-200 underline decoration-ocean-400/50 underline-offset-4 hover:text-white hover:decoration-ocean-300 transition-colors';

const isSafeUrl = (url) => /^(\/|https?:\/\/|mailto:)/i.test(url);

export function renderMarkup(text, { linkClassName = LINK_CLASS, highlightClassName = HIGHLIGHT_CLASS } = {}) {
  if (typeof text !== 'string' || !text) return text ?? null;
  const out = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(TOKEN)) {
    if (match.index > last) out.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      out.push(
        <span key={key++} className={highlightClassName}>
          {match[1]}
        </span>
      );
    } else if (!isSafeUrl(match[3])) {
      out.push(match[2]);
    } else if (match[3].startsWith('/')) {
      out.push(
        <Link key={key++} to={match[3]} className={linkClassName}>
          {match[2]}
        </Link>
      );
    } else {
      out.push(
        <a key={key++} href={match[3]} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          {match[2]}
        </a>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
