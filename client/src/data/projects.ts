export type Project = {
  title: string;
  description: string;
  image: string;
  tags: string[];
  source: string;
  note?: string;
};

export const projects: Project[] = [
  {
    title: 'Job Matrix',
    description:
      'Assists with finding, comparing, and tracking job listings from platforms including Indeed, LinkedIn, and Glassdoor. Keeps your job search organized, intentional, and free from clutter.',
    image: 'job-matrix.png',
    tags: ['Personal operations', 'Local-first', 'Job research'],
    source: 'https://github.com/anitacigawet/Job-Matrix',
  },
  {
    title: 'Project Ganymede',
    description:
      'A multidimensional strategic-reasoning workspace that autonomously develops assumptions, counterarguments, evidence gaps, and revisions. The process appears as a lithography machine you can watch while an idea develops, with a design inspired by the Corpus Callosum: contrasting analytical hemispheres connected through synthesis.',
    image: 'ganymede.png',
    tags: ['Decision support', 'Structured reasoning', 'Research'],
    source: 'https://github.com/anitacigawet/Project-Ganymede',
  },
  {
    title: 'Fractal Framework',
    description:
      'Turn a single prompt into a dynamically generated advocacy site, grounded in research citations and paired with concrete plans of action.',
    image: 'fractal-framework.png',
    tags: ['Civic action', 'Evidence', 'Guided workflow'],
    source: 'https://github.com/anitacigawet/fractal-framework',
  },
  {
    title: 'The Cacti',
    description:
      'A self-hosted civic research workspace for making local records and news easier to collect, connect, and revisit.',
    image: 'the-cacti.png',
    tags: ['Civic research', 'Local records', 'Knowledge workspace'],
    source: 'https://github.com/anitacigawet/The-Cacti',
  },
  {
    title: 'PrisonBreak',
    description:
      'A source-grounded workspace for reading a criminal case record and preparing sharper, better-organized questions for an attorney.',
    image: 'prisonbreak.png',
    tags: ['Document review', 'Legal preparation', 'Source grounding'],
    source: 'https://github.com/anitacigawet/PrisonBreak',
    note: 'Not legal advice.',
  },
  {
    title: 'Arizona Basin Monitor',
    description:
      'A clearly labeled synthetic prototype exploring how Arizona water-basin monitoring could become easier to scan and understand.',
    image: 'water-dashboard.png',
    tags: ['Water policy', 'Interface prototype', 'Data boundaries'],
    source: 'https://github.com/anitacigawet/Water_Dashboard',
    note: 'Demonstration data only—not a live monitoring service.',
  },
  {
    title: 'Who Runs Arizona',
    description:
      'A small civic prototype for learning how Arizona’s state and local institutions fit together without presenting a stale roster as current fact.',
    image: 'who-runs-arizona.png',
    tags: ['Civic education', 'Government structure', 'Arizona'],
    source: 'https://github.com/anitacigawet/Who-Runs-Arizona',
  },
];
