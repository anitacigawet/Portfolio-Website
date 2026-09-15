import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, MousePointerClick } from 'lucide-react';
import { asset } from '../lib/asset';
import type { ProjectShot } from '../data/projects';

export type DeckCard = {
  id: string;
  title: string;
  kind: 'note' | 'featured' | 'project' | 'final';
  content?: React.ReactNode;
  banner?: string;
  bannerW?: number;
  bannerH?: number;
  tagline?: string;
  status?: string;
  description?: string;
  note?: string;
  tags?: string[];
  shots?: ProjectShot[];
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export type CardSwap = { from: number; to: number; direction: 1 | -1; stage: 'out' | 'back' };

const SLOT = [
  { x: 0, y: 0, rotate: 0, scale: 1 },
  { x: 4, y: -10, rotate: -0.65, scale: 0.986 },
  { x: 8, y: -19, rotate: 0.5, scale: 0.973 },
  { x: 12, y: -27, rotate: -0.4, scale: 0.962 },
  { x: 16, y: -34, rotate: 0.3, scale: 0.952 },
];
const slotOf = (q: number) => SLOT[Math.min(Math.max(q, 0), SLOT.length - 1)];

type DeckProps = {
  cards: DeckCard[];
  active: number;
  swap: CardSwap | null;
  reduce: boolean;
  interactive: boolean;
  width: number;
  businessWidth: number;
  onSwapComplete: () => void;
};

export function DeckCards(props: DeckProps) {
  return (
    <div className="deck-perspective">
      {props.cards.map((card, index) => (
        <DeckCardView key={card.id} {...props} card={card} index={index} />
      ))}
    </div>
  );
}
function DeckCardView({
  cards, card, index, active, swap, reduce, interactive, width, businessWidth, onSwapComplete,
}: DeckProps & { card: DeckCard; index: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const n = cards.length;
  const q = (index - active + n) % n;
  const isFront = q === 0;
  const isPage = card.kind === 'project' || card.kind === 'featured';
  const bannerRatio = card.bannerW && card.bannerH ? card.bannerW / card.bannerH : 2.7;
  const isMoving = !!swap && index === (swap.direction === 1 ? swap.from : swap.to);
  const readable = isFront && interactive;
  const showContent = isFront || isMoving;

  useLayoutEffect(() => {
    if (articleRef.current) articleRef.current.inert = !readable;
  }, [readable]);

  // Reset before the incoming card is painted. Its reading area stays locked
  // throughout the turn, including keyboard, pointer and touch input.
  useLayoutEffect(() => {
    if (isFront && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      scrollRef.current.classList.remove('is-scrolled');
    }
  }, [isFront]);

  const slot = slotOf(q);
  const backingScale = active === 0 && card.kind !== 'note' ? businessWidth / width : 1;
  const rest = {
    x: slot.x, y: slot.y, rotate: reduce ? 0 : slot.rotate, rotateY: 0,
    scale: slot.scale * backingScale, opacity: 1,
  };
  const ownWidth = card.kind === 'note' ? businessWidth : width;
  // Turn the paper partly edge-on to make room, then clear the *whole*
  // front card before changing layers. This updates when the viewport/tuner does.
  const frontWidth = Math.max(
    swap?.from === 0 ? businessWidth : width,
    swap?.to === 0 ? businessWidth : width,
  );
  const side = {
    // Perspective widens the near edge as the card moves away from center.
    x: frontWidth / 2 + ownWidth * 0.86 * 0.36 / 2 + ownWidth * 0.13 + 46,
    y: -28, rotate: 5, rotateY: -72, scale: 0.86, opacity: 1,
  };
  const movingToSide = isMoving && swap.stage === 'out';
  const animate = movingToSide ? side : rest;
  const zIndex = isMoving
    ? (swap.direction === 1 ? (swap.stage === 'out' ? 60 : 1) : (swap.stage === 'out' ? 1 : 60))
    : isFront ? 40 : 30 - Math.min(q, 4) * 5;

  return (
    <motion.article
      ref={articleRef}
      className={'index-card kind-' + card.kind + (card.banner ? ' has-banner' : '') +
        (isFront ? ' is-front' : '') + (showContent ? ' shows-content' : '')}
      initial={false}
      animate={animate}
      transition={reduce ? { duration: 0 } : {
        duration: isMoving ? (movingToSide ? 0.52 : 0.66) : 0.64,
        ease: [0.32, 0, 0.18, 1],
      }}
      style={{ zIndex }}
      onAnimationComplete={() => { if (isMoving) onSwapComplete(); }}
      aria-hidden={!readable}
      aria-roledescription="index card"
      aria-label={card.title + ' — card ' + (index + 1) + ' of ' + n}
      tabIndex={readable ? 0 : -1}
    >

      {!isPage && <div className="index-card-rules" aria-hidden="true" />}

      {isPage ? (
        <div className="card-scroll-wrap">
          <div
            ref={scrollRef}
            className="card-scroll" tabIndex={readable ? 0 : -1} aria-label={card.title + ' details'}
            onScroll={(e) => {
              const el = e.currentTarget;
              el.classList.toggle('is-scrolled', el.scrollTop > 12);
            }}
          >
            {card.banner && (
              <div
                className="card-banner-frame"
                style={{ '--banner-ratio': bannerRatio } as React.CSSProperties}
              >
                <img src={asset(card.banner)} alt="" width={card.bannerW} height={card.bannerH} />
              </div>
            )}
            <div className="card-titling">
              {card.status && (
                <span className="project-status">
                  <span aria-hidden="true" /> {card.status}
                </span>
              )}
              <h2 className="project-title">{card.title}</h2>
              {card.tagline && <p className="project-sub">{card.tagline}</p>}
            </div>
            <div className="card-writing">
              {card.description && <p className="project-desc">{card.description}</p>}
              {card.note && <p className="project-note">{card.note}</p>}
              {card.tags && card.tags.length > 0 && (
                <ul className="project-tags" aria-label={`${card.title} themes`}>
                  {card.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
              {card.shots && card.shots.length > 0 && (
                <>
                  <div className="card-gallery">
                    {card.shots.map((shot) => (
                      <figure className="shot" key={shot.caption}>
                        {shot.placeholder ? (
                          <div className="shot-placeholder" aria-hidden="true">
                            <span className="shot-placeholder-glyph">✦</span>
                            <span>screenshot coming soon</span>
                          </div>
                        ) : (
                          <img
                            src={asset(shot.src ?? '')}
                            alt={shot.caption}
                            width={shot.width}
                            height={shot.height}
                          />
                        )}
                        <figcaption>{shot.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                </>
              )}
              <div className="card-actions-end">
                {card.primary && (
                  <a className="paper-btn primary" href={card.primary.href} target="_blank" rel="noreferrer">
                    <MousePointerClick aria-hidden="true" /> {card.primary.label}
                  </a>
                )}
                {card.secondary && (
                  <a className="paper-btn" href={card.secondary.href} target="_blank" rel="noreferrer">
                    <Github aria-hidden="true" /> {card.secondary.label}
                  </a>
                )}
              </div>
            </div>
          </div>
          {card.shots && card.shots.length > 0 && (
            <div className="card-scroll-cue" aria-hidden="true">a look inside ↓</div>
          )}
        </div>
      ) : (
        <div className="index-card-body">{card.content}</div>
      )}
    </motion.article>
  );
}
