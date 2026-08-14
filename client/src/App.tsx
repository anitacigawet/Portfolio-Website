import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Github, Globe2, Sparkles } from 'lucide-react';
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
      <a className="project-image-link" href={project.source} target="_blank" rel="noreferrer">
        <img src={asset(`projects/${project.image}`)} alt={`${project.title} interface`} loading="lazy" />
      </a>
      <div className="project-card-body">
        <div className="project-heading">
          <h3>{project.title}</h3>
          <a className="icon-link" href={project.source} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <p>{project.description}</p>
        {project.note && <p className="project-note">{project.note}</p>}
        <ul className="tag-list" aria-label={`${project.title} themes`}>
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </motion.article>
  );
}

export default function App() {
  const scrollToWork = () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Portfolio home">J<span>·</span>S</a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#approach">Approach</a>
          <a href="#about">About</a>
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
            <h1 id="hero-title">I build useful ways through complicated problems.</h1>
            <p className="hero-lede">
              Civic technology, research workflows, and practical tools that turn scattered information into work people can understand, verify, and use.
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
            <h2 id="work-title">Making local government easier to follow.</h2>
            <p>
              Z‑SPAN is a virtual library that turns local government meetings into source-linked, searchable episode pages: key decisions, what comes next, and word-synced transcripts anchored to each city’s own recording.
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
              <p className="status"><span aria-hidden="true" /> In active development</p>
              <h3>Z‑SPAN</h3>
              <p>
                A public-interest project built around a simple promise: people should be able to understand what happened in a local meeting and trace every summary back to the public record.
              </p>
              <div className="project-actions">
                <a className="primary-link" href="https://zspan.org" target="_blank" rel="noreferrer">
                  <Globe2 aria-hidden="true" /> Visit zspan.org
                </a>
                <a className="secondary-link" href="https://github.com/anitacigawet/Z-SPAN-dev" target="_blank" rel="noreferrer">
                  <Github aria-hidden="true" /> View repository
                </a>
              </div>
            </div>
          </motion.article>

          <div className="released-heading">
            <p className="eyebrow">Released projects</p>
            <h2>Tools for research, decisions, and public understanding.</h2>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}
          </div>
        </section>

        <section className="approach-section" id="approach" aria-labelledby="approach-title">
          <div className="section-wrap approach-inner">
            <div className="approach-copy">
              <p className="eyebrow">How I work</p>
              <h2 id="approach-title">The tool comes after the understanding.</h2>
              <p>
                The projects differ, but the method stays consistent: learn the shape of the problem, make the evidence visible, design a responsible process, and turn it into something another person can actually use.
              </p>
            </div>
            <ol className="process-list">
              <li><span>01</span><div><h3>Understand the problem</h3><p>Start with the people, constraints, and decisions—not a preferred technology.</p></div></li>
              <li><span>02</span><div><h3>Map the evidence</h3><p>Separate what is known, inferred, missing, synthetic, or likely to change.</p></div></li>
              <li><span>03</span><div><h3>Design the process</h3><p>Build verification and honest boundaries into the workflow itself.</p></div></li>
              <li><span>04</span><div><h3>Make it usable</h3><p>Give the work a clear surface that helps someone move forward.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="about-section section-wrap" id="about" aria-labelledby="about-title">
          <div className="about-mark" aria-hidden="true">JS</div>
          <div className="about-copy">
            <p className="eyebrow">About</p>
            <h2 id="about-title">Public-interest systems builder and program-operations generalist.</h2>
            <p>
              I build tools and research workflows that help mission-driven organizations turn complicated information into defensible, usable work. I’m most at home where civic questions, program operations, research, and technology overlap.
            </p>
            <a className="primary-link dark" href="https://github.com/anitacigawet" target="_blank" rel="noreferrer">
              <Github aria-hidden="true" /> Explore all repositories
            </a>
          </div>
        </section>
      </main>

      <footer>
        <p>Built for public-interest work.</p>
        <p>© 2026 ScootSolute LLC · Source available under PolyForm Noncommercial 1.0.0</p>
      </footer>
    </div>
  );
}
