import { Github, Mail } from 'lucide-react';
import { asset } from '../lib/asset';

/* Free-form content for the note and final cards. Project cards are fully
   data-driven and rendered by the Deck (banner, titling, scrollable body,
   footer actions). */

export function AboutContent() {
  return (
    /* The business card stands alone — no filler card around it. A soft
       frosted blur separates it from the deck stacked behind. */
    <div className="business-card">
      <div className="bc-photo">
        <img src={asset('assets/james.png')} alt="Portrait of James Jones" />
      </div>
      <div className="bc-body">
        <p className="bc-name">James Jones</p>
        <p className="bc-tagline">Practical solutions to complicated problems.</p>
        <hr className="bc-rule" aria-hidden="true" />
        <p className="bc-desc">
          From civic technology tools to experimental research workflows,
          open-source intelligence, and advocacy sites.
        </p>
        <div className="bc-contact">
          <span className="bc-mark" aria-hidden="true">JJ</span>
          <span>ScootSolute LLC · Oregon, USA</span>
          <a href="mailto:james@scootsolute.org">james@scootsolute.org</a>
          <a href="https://github.com/anitacigawet" target="_blank" rel="noreferrer">
            github.com/anitacigawet
          </a>
        </div>
      </div>
    </div>
  );
}

export function FinalContent() {
  return (
    <div className="card-final">
      <h2 className="final-title">Thank you for reading.</h2>
      <p className="final-sub">Let’s build something that matters.</p>
      <p className="card-from">— James</p>
      <div className="project-actions">
        <a className="paper-btn primary" href="mailto:james@scootsolute.org">
          <Mail aria-hidden="true" /> Get in touch
        </a>
        <a
          className="paper-btn"
          href="https://github.com/anitacigawet"
          target="_blank"
          rel="noreferrer"
        >
          <Github aria-hidden="true" /> GitHub
        </a>
      </div>
    </div>
  );
}
