import { useEffect, useRef, useState } from 'react';
import { asset } from '../lib/asset';

export type GateShowcase = { name: string; tagline?: string; href: string };

/* The header's gated entrance: two gold wrought-iron leaves with a split
   JJ engraving. Hovering (or clicking, to pin) swings the gates open, the
   dim cosmic portal behind them comes alive, and a glass drop-down lists
   every showcase so visitors can jump straight to a project instead of
   paging through the envelope deck. */

export function GateNav({ items }: { items: GateShowcase[] }) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const timer = useRef(0);

  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 280);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const toggle = () => {
    if (open || pinned) {
      setPinned(false);
      window.clearTimeout(timer.current);
      setOpen(false);
    } else {
      setPinned(true);
      show();
    }
  };

  return (
    <div
      className={'gate-nav' + (open ? ' is-open' : '')}
      onMouseEnter={show}
      onMouseLeave={() => { if (!pinned) hide(); }}
      onFocus={show}
      onBlur={(e) => { if (!pinned && !e.currentTarget.contains(e.relatedTarget as Node | null)) hide(); }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setPinned(false);
          window.clearTimeout(timer.current);
          setOpen(false);
        }
      }}
    >
      <button type="button" className="gate-frame" onClick={toggle}
        aria-expanded={open} aria-haspopup="true" aria-label="Showcase directory — open the gates">
        <span className="gate-portal" aria-hidden="true">
          <img src={asset('assets/portal.png')} alt="" />
        </span>
        <span className="gate-pillar" aria-hidden="true" />
        <span className="gate-door gate-left" aria-hidden="true">
          <svg viewBox="0 0 41 58" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gateGoldL" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f3e5b0" />
                <stop offset=".35" stopColor="#d9b95c" />
                <stop offset=".7" stopColor="#a9852e" />
                <stop offset="1" stopColor="#8a6d1f" />
              </linearGradient>
            </defs>
            <path d="M2.5 55 V21 C2.5 11 10 8.2 20 6.4 C27 5.2 33 4.4 38.5 4 V55 Z"
              fill="rgba(243,229,176,0.04)" stroke="url(#gateGoldL)" strokeWidth="2" strokeLinejoin="round" />
            <path d="M10 12 V44 M17.5 9.4 V44 M25 7.6 V44 M31.5 6 V44"
              stroke="url(#gateGoldL)" strokeWidth="1.3" opacity=".9" />
            <path d="M2.5 36 C13 32 28 40 38.5 33.5"
              fill="none" stroke="url(#gateGoldL)" strokeWidth="1.2" opacity=".85" />
            <rect x="2.5" y="47" width="36" height="8" fill="url(#gateGoldL)" opacity=".16" />
          </svg>
          <span className="gate-letter">J</span>
        </span>
        <span className="gate-door gate-right" aria-hidden="true">
          <svg viewBox="0 0 41 58" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gateGoldR" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f3e5b0" />
                <stop offset=".35" stopColor="#d9b95c" />
                <stop offset=".7" stopColor="#a9852e" />
                <stop offset="1" stopColor="#8a6d1f" />
              </linearGradient>
            </defs>
            <path d="M2.5 55 V21 C2.5 11 10 8.2 20 6.4 C27 5.2 33 4.4 38.5 4 V55 Z"
              fill="rgba(243,229,176,0.04)" stroke="url(#gateGoldR)" strokeWidth="2" strokeLinejoin="round" />
            <path d="M10 12 V44 M17.5 9.4 V44 M25 7.6 V44 M31.5 6 V44"
              stroke="url(#gateGoldR)" strokeWidth="1.3" opacity=".9" />
            <path d="M2.5 36 C13 32 28 40 38.5 33.5"
              fill="none" stroke="url(#gateGoldR)" strokeWidth="1.2" opacity=".85" />
            <rect x="2.5" y="47" width="36" height="8" fill="url(#gateGoldR)" opacity=".16" />
          </svg>
          <span className="gate-letter">J</span>
        </span>
      </button>

      <nav className="gate-menu" aria-label="Showcase directory">
        <p className="gate-menu-head">Showcases <em>· every project, one click</em></p>
        <ul>
          {items.map((item, i) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noreferrer"
                onClick={() => { setPinned(false); window.clearTimeout(timer.current); setOpen(false); }}>
                <span className="gate-item-no" aria-hidden="true">№ {i + 1}</span>
                <span className="gate-item-name">{item.name}</span>
                {item.tagline && <span className="gate-item-tag">{item.tagline}</span>}
                <span className="gate-item-go" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
