// Who lives at each depth of the page. Rendered by components/ocean/OceanLife, with the art
// and behaviour of every species in components/ocean/species.js.
//
// - band: vertical range the creature keeps to, as fractions of the section's height
//   (mobileBand overrides it on phones)
// - count / mobileCount: groups per layer (a school is one group); 0 hides it on mobile
// - school: [min, max] fish per school
// - scale: [min, max] size multiplier on the species' base size
// - color: silhouette colour (an array gives each individual its own), detail: shading,
//   glow: lures/eyes, shadow: soft bioluminescent halo
// - feeding: clicking drops food that fish with `eats` come to nibble
// - celebrate: reacts to the contact form's success; `parade` schools wait for it
export const oceanLife = {
  home: {
    feeding: true,
    bubbles: { count: 10, mobileCount: 5, band: [0.04, 0.97] },
    creatures: [
      {
        species: 'small-fish',
        count: 2,
        mobileCount: 1,
        school: [4, 6],
        band: [0.32, 0.8],
        mobileBand: [0.6, 0.85],
        scale: [0.62, 0.78],
        color: '#f0f9ff',
        opacity: 0.8,
      },
      {
        species: 'jellyfish',
        count: 4,
        mobileCount: 2,
        band: [0.14, 0.5],
        mobileBand: [0.5, 0.72],
        scale: [0.72, 0.95],
        color: '#ffffff',
        detail: 'rgba(244, 114, 182, 0.55)',
        opacity: 0.62,
      },
    ],
  },
  about: {
    feeding: true,
    bubbles: { count: 4, mobileCount: 2, band: [0, 1] },
    creatures: [
      {
        species: 'whale',
        count: 1,
        mobileCount: 1,
        band: [0.3, 0.6],
        scale: [2.2, 2.2],
        color: '#e0f2fe',
        detail: 'rgba(12, 74, 110, 0.5)',
        opacity: 0.14,
      },
      {
        species: 'small-fish',
        count: 1,
        mobileCount: 1,
        school: [5, 7],
        band: [0.2, 0.85],
        scale: [0.55, 0.7],
        color: '#e0f2fe',
        opacity: 0.5,
      },
    ],
  },
  skills: {
    feeding: true,
    bubbles: { count: 5, mobileCount: 3, band: [0, 1] },
    creatures: [
      {
        species: 'manta',
        count: 1,
        mobileCount: 1,
        band: [0.2, 0.7],
        scale: [1.7, 1.7],
        color: '#e0f2fe',
        opacity: 0.16,
      },
      {
        species: 'tropical-fish',
        count: 3,
        mobileCount: 1,
        band: [0.12, 0.88],
        scale: [0.7, 0.9],
        color: ['#fcd34d', '#fb923c', '#f9a8d4'],
        detail: 'rgba(255, 255, 255, 0.78)',
        opacity: 0.9,
      },
      {
        species: 'sea-turtle',
        count: 1,
        mobileCount: 1,
        band: [0.3, 0.8],
        scale: [0.85, 1],
        color: '#5eead4',
        detail: 'rgba(15, 118, 110, 0.55)',
        opacity: 0.85,
      },
    ],
  },
  projects: {
    bubbles: { count: 4, mobileCount: 2, band: [0, 1] },
    creatures: [
      {
        species: 'shark',
        count: 1,
        mobileCount: 1,
        band: [0.12, 0.55],
        scale: [0.75, 0.9],
        color: '#e2e8f0',
        opacity: 0.55,
      },
      {
        species: 'octopus',
        count: 1,
        mobileCount: 1,
        band: [0.5, 0.9],
        scale: [0.75, 0.9],
        color: '#fca5a5',
        detail: 'rgba(190, 18, 60, 0.35)',
        opacity: 0.6,
      },
    ],
  },
  experience: {
    bubbles: { count: 2, mobileCount: 1, band: [0, 1] },
    creatures: [
      {
        species: 'anglerfish',
        count: 1,
        mobileCount: 1,
        band: [0.25, 0.75],
        scale: [0.75, 0.9],
        color: '#cbd5e1',
        detail: 'rgba(100, 116, 139, 0.6)',
        glow: '#67e8f9',
        opacity: 0.6,
      },
      {
        species: 'giant-squid',
        count: 1,
        mobileCount: 0,
        band: [0.5, 0.9],
        scale: [0.8, 0.95],
        color: '#c7d2fe',
        detail: 'rgba(79, 70, 229, 0.4)',
        opacity: 0.5,
      },
    ],
  },
  resume: {
    bubbles: { count: 5, mobileCount: 2, band: [0, 1] },
    creatures: [
      {
        species: 'kraken',
        count: 1,
        mobileCount: 0,
        band: [0.22, 0.55],
        scale: [3.2, 3.2],
        color: '#2e1065',
        detail: 'rgba(167, 139, 250, 0.22)',
        glow: '#e9d5ff',
        opacity: 0.92,
      },
      {
        species: 'jellyfish',
        count: 2,
        mobileCount: 1,
        band: [0.15, 0.85],
        scale: [0.8, 0.95],
        color: '#a5f3fc',
        detail: 'rgba(244, 114, 182, 0.6)',
        shadow: 'rgba(103, 232, 249, 0.55)',
        opacity: 0.78,
      },
    ],
  },
  // The admin console at /admin.
  admin: {
    feeding: true,
    bubbles: { count: 6, mobileCount: 3, band: [0, 1] },
    creatures: [
      {
        species: 'jellyfish',
        count: 2,
        mobileCount: 1,
        band: [0.1, 0.45],
        scale: [0.75, 0.9],
        color: '#ffffff',
        detail: 'rgba(244, 114, 182, 0.55)',
        opacity: 0.55,
      },
      {
        species: 'small-fish',
        count: 1,
        mobileCount: 1,
        school: [5, 7],
        band: [0.55, 0.9],
        scale: [0.6, 0.72],
        color: '#e0f2fe',
        opacity: 0.6,
      },
    ],
  },
  contact: {
    celebrate: true,
    creatures: [
      {
        species: 'small-fish',
        count: 1,
        mobileCount: 1,
        school: [8, 10],
        parade: true,
        band: [0.2, 0.8],
        scale: [0.6, 0.72],
        color: '#fde68a',
        shadow: 'rgba(253, 230, 138, 0.6)',
        opacity: 0.9,
      },
      {
        species: 'jellyfish',
        count: 2,
        mobileCount: 1,
        band: [0.15, 0.8],
        scale: [0.7, 0.85],
        color: ['#e9d5ff', '#fbcfe8'],
        detail: 'rgba(192, 132, 252, 0.7)',
        shadow: 'rgba(192, 132, 252, 0.6)',
        opacity: 0.7,
      },
    ],
  },
  // The abyssal seabed under the contact section (components/ocean/AbyssFloor.js). Its life
  // (tube worms, a crab) is part of the seabed itself; this layer only carries the bubbles
  // that clicks send up into the sections above.
  abyss: {
    creatures: [],
  },
};
