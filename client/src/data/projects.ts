export type ProjectShot = {
  src?: string;
  caption: string;
  /* natural pixel size — reserves the layout box so the card's inner
     scroll height is correct before images finish loading */
  width?: number;
  height?: number;
  /* placeholder: true renders a "screenshot coming soon" frame instead
     of an image (used until a project publishes UI screenshots) */
  placeholder?: boolean;
};

export type Project = {
  title: string;
  tagline: string;
  description: string;
  banner?: string;
  bannerW?: number;
  bannerH?: number;
  shots: ProjectShot[];
  tags: string[];
  showcase: string;
  source: string;
  note?: string;
};

const P = 'projects/';

export const projects: Project[] = [
  {
    title: 'Job Matrix',
    tagline: 'One organized place to find, compare, and track listings',
    description:
      'Assists with finding, comparing, and tracking job listings from various platforms including Indeed, LinkedIn, and Glassdoor. Ensures your job search is organized, intentional, and free from clutter.',
    banner: `${P}job-matrix-banner.png`,
    bannerW: 1774,
    bannerH: 887,
    shots: [
      { src: `${P}shots/job-matrix/dashboard.png`, caption: 'The scoring dashboard', width: 2880, height: 2000 },
      { src: `${P}shots/job-matrix/guided-application.png`, caption: 'Guided application packet', width: 2880, height: 2000 },
    ],
    tags: ['Personal operations', 'Local-first', 'Job research'],
    showcase: 'https://jobmatrix.scootsolute.org',
    source: 'https://github.com/anitacigawet/Job-Matrix',
  },
  {
    title: 'Project Ganymede',
    tagline: 'A strategic-physics research sandbox',
    description:
      'A strategic-physics research sandbox that routes a scenario into the right workflow, develops an initial resolution, sends it through separate fault-finding and connection audits, and makes each analytical stroke visible through its optics-box interface.',
    banner: `${P}project-ganymede-banner.png`,
    bannerW: 1820,
    bannerH: 864,
    shots: [
      { src: `${P}shots/ganymede/ganymede-workspace.png`, caption: 'The workspace', width: 2880, height: 1800 },
      { src: `${P}shots/ganymede/ganymede-route-review.png`, caption: 'Route review', width: 2880, height: 1800 },
      { src: `${P}shots/ganymede/ganymede-optics-resolution.png`, caption: 'Optics resolution', width: 2880, height: 1800 },
    ],
    tags: ['Strategic modeling', 'Audit loop', 'Interactive system'],
    showcase: 'https://ganymede.scootsolute.org',
    source: 'https://github.com/anitacigawet/Project-Ganymede',
  },
  {
    title: 'Fractal Framework',
    tagline: 'A prompt becomes a cited advocacy site',
    description:
      'Turn a single prompt into a dynamically generated advocacy site, grounded in research citations, with concrete plans of action.',
    banner: `${P}fractal-framework-banner.png`,
    bannerW: 1983,
    bannerH: 793,
    shots: [
      { src: `${P}shots/fractal/wizard-home.png`, caption: 'The wizard home', width: 2560, height: 1800 },
      { src: `${P}shots/fractal/generated-site.png`, caption: 'A generated advocacy site', width: 2560, height: 2400 },
      { src: `${P}shots/fractal/citation-hover.png`, caption: 'Hover a claim, see its source', width: 1640, height: 552 },
    ],
    tags: ['Civic action', 'Evidence', 'Guided workflow'],
    showcase: 'https://fractal.scootsolute.org',
    source: 'https://github.com/anitacigawet/fractal-framework',
  },
  {
    title: 'The Cacti',
    tagline: 'A civic research workspace for local records',
    description:
      'A self-hosted civic research workspace for making local records and news easier to collect, connect, and revisit.',
    banner: `${P}the-cacti-banner.png`,
    bannerW: 2172,
    bannerH: 724,
    shots: [
      { src: `${P}shots/cacti/newspaper.png`, caption: 'The daily newspaper', width: 2880, height: 1920 },
    ],
    tags: ['Civic research', 'Local records', 'Knowledge workspace'],
    showcase: 'https://cacti.scootsolute.org',
    source: 'https://github.com/anitacigawet/The-Cacti',
  },
  {
    title: 'PrisonBreak',
    tagline: 'A source-grounded case-reading workspace',
    description:
      'A source-grounded workspace for reading a criminal case record and preparing sharper, better-organized questions for an attorney.',
    banner: `${P}prisonbreak-banner.webp`,
    bannerW: 1774,
    bannerH: 887,
    shots: [
      { src: `${P}shots/prisonbreak/console.png`, caption: 'The case workspace', width: 2880, height: 2896 },
    ],
    tags: ['Document review', 'Legal preparation', 'Source grounding'],
    showcase: 'https://prisonbreak.scootsolute.org',
    source: 'https://github.com/anitacigawet/PrisonBreak',
    note: 'Not legal advice.',
  },
  {
    title: 'Arizona Basin Monitor',
    tagline: 'Arizona groundwater, scannable at a glance',
    description:
      'A clearly labeled synthetic prototype exploring how Arizona water-basin monitoring could become easier to scan and understand.',
    banner: `${P}arizona-basin-monitor-banner.png`,
    bannerW: 2173,
    bannerH: 724,
    shots: [
      { src: `${P}shots/water/console.png`, caption: 'The basin console', width: 2880, height: 2864 },
    ],
    tags: ['Water policy', 'Interface prototype', 'Data boundaries'],
    showcase: 'https://water.scootsolute.org',
    source: 'https://github.com/anitacigawet/Water_Dashboard',
    note: 'Demonstration data only—not a live monitoring service.',
  },
  {
    title: 'Who Runs Arizona',
    tagline: 'How Arizona government fits together',
    description:
      'A small civic prototype for learning how Arizona’s state and local institutions fit together without presenting a stale roster as current fact.',
    banner: `${P}who-runs-arizona-banner.png`,
    bannerW: 2172,
    bannerH: 724,
    shots: [
      { src: `${P}shots/whoruns/who-runs-arizona-overview.png`, caption: 'State overview', width: 2880, height: 2000 },
      { src: `${P}shots/whoruns/who-runs-arizona-structure.png`, caption: 'County structure', width: 2880, height: 2000 },
      { src: `${P}shots/whoruns/who-runs-arizona-mobile.png`, caption: 'On mobile', width: 780, height: 1688 },
    ],
    tags: ['Civic education', 'Government structure', 'Arizona'],
    showcase: 'https://whorunsarizona.scootsolute.org',
    source: 'https://github.com/anitacigawet/Who-Runs-Arizona',
  },
];
