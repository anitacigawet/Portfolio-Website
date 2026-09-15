import { Github } from 'lucide-react';
import { Experience } from './components/Experience';
import type { DeckCard } from './components/Deck';
import { GateNav, type GateShowcase } from './components/GateNav';
import { AboutContent, FinalContent } from './components/cardContent';
import { projects } from './data/projects';
import { asset } from './lib/asset';

const P = 'projects/';

const cards: DeckCard[] = [
  {
    id: 'about',
    title: 'A note from James',
    kind: 'note',
    content: <AboutContent />,
  },
  {
    id: 'zspan',
    title: 'Z-SPAN',
    kind: 'featured',
    banner: `${P}zspan.png`,
    bannerW: 2172,
    bannerH: 724,
    tagline: 'A virtual library for local politics',
    status: 'In active development',
    description:
      'Converts local government meetings into bite-sized episodes that extract key decisions, quotes, and community calls to action. Every claim is 100% backed with word-synced video citations for guaranteed authenticity. It includes a Librarian that, when queried, returns exact word-synced video citations for each response — or simply doesn’t respond at all.',
    tags: ['Civic media', 'Video citations', 'Local politics'],
    shots: [{ placeholder: true, caption: 'The Z-SPAN interface' }],
    primary: { label: 'Visit zspan.org', href: 'https://zspan.org' },
    secondary: { label: 'View repository', href: 'https://github.com/anitacigawet/Z-SPAN-dev' },
  },
  ...projects.map((project, i) => ({
    id: project.title,
    title: project.title,
    kind: 'project' as const,
    banner: project.banner,
    bannerW: project.bannerW,
    bannerH: project.bannerH,
    tagline: project.tagline,
    description: project.description,
    note: project.note,
    tags: project.tags,
    shots: project.shots,
    primary: { label: 'View showcase', href: project.showcase },
    secondary: { label: 'See the code here', href: project.source },
  })),
  {
    id: 'final',
    title: 'Thank you for reading',
    kind: 'final',
    content: <FinalContent />,
  },
];

/* The gate drop-down lists every showcase — the same links the deck cards
   carry, so visitors can jump straight to a project they remember. */
const showcases: GateShowcase[] = cards
  .filter((card) => (card.kind === 'featured' || card.kind === 'project') && card.primary)
  .map((card) => ({ name: card.title, tagline: card.tagline, href: card.primary!.href }));

export default function App() {
  return (
    <div className="site-shell" data-build="portfolio-gate-directory-2026-09-15">
      <a className="skip-link" href="#work">Skip to selected work</a>
      <BackgroundScene />

      <header className="site-header">
        <GateNav items={showcases} />
        <nav aria-label="Main navigation">
          <a
            className="nav-github"
            href="https://github.com/anitacigawet"
            target="_blank"
            rel="noreferrer"
          >
            <Github aria-hidden="true" /> GitHub
          </a>
        </nav>
      </header>

      <main id="top">
        <Experience cards={cards} />
      </main>
    </div>
  );
}

/* Fixed cosmic scene behind the envelope and the deck */
function BackgroundScene() {
  return (
    <div className="background-scene" aria-hidden="true">
      <div className="stars" />
      <img className="cloud cloud-one" src={asset('assets/cloud1.png')} alt="" />
      <img className="cloud cloud-three" src={asset('assets/cloud3.png')} alt="" />
      <img className="cloud cloud-four" src={asset('assets/cloud4.png')} alt="" />
    </div>
  );
}
