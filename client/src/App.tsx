import { motion } from 'framer-motion';
import { ArrowDown, Github, MousePointerClick, Sparkles } from 'lucide-react';
import { EnergyVortex } from './components/EnergyVortex';
import { projects } from './data/projects';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <motion.article
      className="project-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.2) }}
    >
      <a className="project-image-link" href={project.showcase} target="_blank" rel="noreferrer" aria-label={`View ${project.title} showcase`}>
        <img src={asset(`projects/${project.image}`)} alt={`${project.title} interface`} loading="lazy" />
      </a>
      <div className="project-card-body">
        <div className="project-heading">
          <h3><a href={project.showcase} target="_blank" rel="noreferrer">{project.title}</a></h3>
        </div>
        <p>{project.description}</p>
        {project.note && <p className="project-note">{project.note}</p>}
        <ul className="tag-list" aria-label={`${project.title} themes`}>
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        <div className="project-card-actions">
          <a className="showcase-link" href={project.showcase} target="_blank" rel="noreferrer">
            <MousePointerClick aria-hidden="true" /> View showcase
          </a>
          <a className="code-link" href={project.source} target="_blank" rel="noreferrer">
            <Github aria-hidden="true" /> See the code here
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function App() {
  const scrollToWork = () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="site-shell" data-build="portfolio-project-links-2026-08-21">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Portfolio home">J<span>·</span>S</a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a className="nav-github" href="https://github.com/anitacigawet" target="_blank" rel="noreferrer">
            <Github aria-hidden="true" /> GitHub
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="stars" aria-hidden="true" />
          <img className="cloud cloud-one" src={asset('assets/cloud1.png')} alt="" aria-hidden="true" />
          <img className="cloud cloud-three" src={asset('assets/cloud3.png')} alt="" aria-hidden="true" />
          <img className="cloud cloud-four" src={asset('assets/cloud4.png')} alt="" aria-hidden="true" />

          <div className="portal-scene" aria-hidden="true">
            <EnergyVortex />
            <img className="portal" src={asset('assets/portal.png')} alt="" />
          </div>

          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow"><Sparkles aria-hidden="true" /> Public-interest systems</p>
            <h1 id="hero-title">I build practical solutions to complicated problems.</h1>
            <p className="hero-lede">
              From civic technology, tools to assist with job &amp; career searches, experimental research workflows, open-source intelligence, or even advocacy sites, the directive is simple: turn complicated problems and scattered data into actionable results.
            </p>
            <button type="button" className="primary-button" onClick={scrollToWork}>
              Enter the work <ArrowDown aria-hidden="true" />
            </button>
          </motion.div>

          <button type="button" className="scroll-cue" onClick={scrollToWork} aria-label="Scroll to selected work">
            <span>Selected work</span><ArrowDown aria-hidden="true" />
          </button>
        </section>

        <section className="work-section section-wrap" id="work" aria-labelledby="work-title">
          <div className="section-intro">
            <p className="eyebrow">Current focus</p>
            <h2 id="work-title">Z-SPAN: A virtual library for local politics</h2>
            <p>
              The goal was simple: Make local government easier to understand.
            </p>
          </div>

          <motion.article
            className="featured-project"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <div className="featured-image">
              <img src={asset('projects/zspan.png')} alt="Z-SPAN for All illustrated banner" />
            </div>
            <div className="featured-copy">
              <div className="featured-heading">
                <p className="status"><span aria-hidden="true" /> In active development</p>
                <h3>Z-SPAN</h3>
              </div>
              <div className="featured-details">
                <p>
                  Z-SPAN converts local government meetings into bite-sized episodes that extract key decisions, quotes, and community calls to action. Every claim is 100% backed with word-synced video citations from the original recording for guaranteed authenticity and transparency.
                </p>
                <p>
                  It includes a Librarian that, when queried, will return <em>exact</em> word-synced video citations for each response, or it will simply not respond at all.
                </p>
                <p>
                  Check it out!
                </p>
                <div className="project-actions">
                  <a className="primary-link" href="https://zspan.org" target="_blank" rel="noreferrer">
                    <MousePointerClick aria-hidden="true" /> Visit zspan.org
                  </a>
                  <a className="secondary-link" href="https://github.com/anitacigawet/Z-SPAN-dev" target="_blank" rel="noreferrer">
                    <Github aria-hidden="true" /> View repository
                  </a>
                </div>
              </div>
            </div>
          </motion.article>

          <div className="released-heading">
            <p className="eyebrow">Released projects</p>
            <h2>Tools for humanity</h2>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}
          </div>
        </section>

      </main>

      <footer>
        <p>Thank you for reading 💙</p>
        <p>© 2026 ScootSolute LLC · Source available under PolyForm Noncommercial 1.0.0</p>
      </footer>
    </div>
  );
}
