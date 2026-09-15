import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { DeckCards, type DeckCard, type CardSwap } from './Deck';
import { EnvelopeArtwork, type PackPhase } from './EnvelopeArtwork';
import { Tuner } from './Tuner';
import { seatedPack, type EnvelopeAnimation, type EnvelopeConstruction } from '../data/envelopeConstructions';
import { openingTravel, openingGrowth, packClearance, type PaperPose } from '../data/envelopeMotion';

const EASE = [0.22, 0.7, 0.2, 1] as const;

export function Experience({ cards }: { cards: DeckCard[] }) {
  const reduce = !!useReducedMotion();
  const [phase, setPhase] = useState<PackPhase>('sealed');
  const [animationMode, setAnimationMode] = useState<EnvelopeAnimation>('contained');
  const [construction, setConstruction] = useState<EnvelopeConstruction>('classic');
  const [flapBehind, setFlapBehind] = useState(false);
  const [transferFront, setTransferFront] = useState(false);
  const [active, setActive] = useState(0);
  const [swap, setSwap] = useState<CardSwap | null>(null);
  const busy = useRef(false);
  const focusCardAfterTurn = useRef(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);
  const [size, setSize] = useState({ w: 1280, h: 800, cardW: 866, cardH: 531, businessW: 660, envW: 760, envH: 494, headerH: 70 });
  const gesture = useRef({ total: 0, last: 0, blocked: false });
  const touch = useRef<{ x: number; y: number; spent: boolean } | null>(null);

  // Read actual CSS sizes, including the tuner and mobile breakpoints.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const header = document.querySelector<HTMLElement>('.site-header');
    setHeaderEl(header);
    const footprint = canvas.querySelector<HTMLElement>('.deck-footprint')!;
    const envelope = canvas.querySelector<HTMLElement>('.envelope-back')!;
    const business = canvas.querySelector<HTMLElement>('.kind-note')!;
    const measure = () => { if (!canvas.clientWidth || !canvas.clientHeight) return; setSize({
      w: canvas.clientWidth, h: canvas.clientHeight,
      cardW: footprint.offsetWidth, cardH: footprint.offsetHeight,
      businessW: business.offsetWidth,
      envW: envelope.offsetWidth, envH: envelope.offsetHeight,
      headerH: header?.offsetHeight ?? 70,
    }); };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    [canvas, footprint, envelope, business, header].forEach((el) => el && observer?.observe(el));
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const finish = useCallback(() => {
    busy.current = false;
    // Residual wheel momentum belongs to the gesture that started the animation.
    gesture.current.blocked = true;
    gesture.current.total = 0;
  }, []);

  const open = useCallback((skip = false) => {
    if (busy.current) return;
    setTransferFront(false);
    setActive(skip ? 1 : 0);
    if (reduce || skip) {
      setPhase('deck');
      finish();
    } else {
      busy.current = true;
      setPhase('unsealing');
    }
  }, [finish, reduce]);

  const close = useCallback(() => {
    if (busy.current) return;
    setTransferFront(true);
    if (reduce) {
      setPhase('sealed');
      setActive(0);
      finish();
    } else {
      busy.current = true;
      setPhase(animationMode === 'simple' ? 'dismissing' : 'returning');
    }
  }, [finish, reduce, animationMode]);

  const goTo = useCallback((next: number) => {
    if (busy.current || phase !== 'deck') return;
    const to = Math.max(0, Math.min(cards.length - 1, next));
    if (to === active) return;
    focusCardAfterTurn.current = !!canvasRef.current?.querySelector('.is-front')?.contains(document.activeElement);
    gesture.current.blocked = true;
    gesture.current.total = 0;
    if (!reduce) {
      busy.current = true;
      setSwap({ from: active, to, direction: to > active ? 1 : -1, stage: 'out' });
    }
    setActive(to);
  }, [active, cards.length, phase, reduce]);

  useEffect(() => {
    if (phase === 'deck' && !swap && focusCardAfterTurn.current) {
      canvasRef.current?.querySelector<HTMLElement>('.is-front')?.focus({ preventScroll: true });
      focusCardAfterTurn.current = false;
    }
  }, [phase, swap, active]);

  const completeSwap = useCallback(() => {
    if (swap?.stage === 'out') setSwap({ ...swap, stage: 'back' });
    else {
      setSwap(null);
      finish();
    }
  }, [swap, finish]);

  // A phase advances only when its own physical part has completed moving.
  const finishFlap = (completed: PackPhase) => {
    if (completed !== phase) return;
    if (phase === 'unfolding') setPhase(animationMode === 'simple' ? 'appearing' : 'lifting');
    if (phase === 'refolding') setPhase('settling');
  };
  const finishSeal = (completed: PackPhase) => {
    if (completed !== phase) return;
    if (phase === 'unsealing') setPhase('unfolding');
    if (phase === 'resealing') { setPhase('sealed'); setActive(0); finish(); }
  };
  const finishDeck = () => {
    // Beat 1 ends docked: advance to the forward-growth beat. Where the
    // geometry never opened a gap (very short viewports), the growth beat
    // itself is the coming-forward moment, so the pack steps in front now.
    if (phase === 'lifting') { setPhase('growing'); setTransferFront(true); }
    if (phase === 'growing' || phase === 'appearing') { setPhase('deck'); finish(); }
    if (phase === 'returning' || phase === 'dismissing') setPhase('refolding');
  };
  const finishEnvelope = () => {
    if (phase === 'settling') setPhase('resealing');
  };

  useEffect(() => {
    const skip = document.querySelector<HTMLAnchorElement>('.skip-link');
    const skipClick = (event: MouseEvent) => {
      event.preventDefault();
      if (busy.current) return;
      open(true);
      canvasRef.current?.closest<HTMLElement>('section')?.focus({ preventScroll: true });
    };
    skip?.addEventListener('click', skipClick);
    return () => { skip?.removeEventListener('click', skipClick); };
  }, [open]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scroller = (target: EventTarget | null) =>
      target instanceof Element ? target.closest<HTMLElement>('.is-front .card-scroll, .is-front .index-card-body') : null;
    const consumes = (el: HTMLElement | null, down: boolean) => el && (down
      ? el.scrollTop + el.clientHeight < el.scrollHeight - 2
      : el.scrollTop > 2);
    const advance = (down: boolean) => {
      if (phase === 'sealed') { if (down) open(); }
      else if (active === cards.length - 1 && down) close();
      else if (active === 0 && !down) close();
      else goTo(active + (down ? 1 : -1));
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY === 0) return;
      if ((event.target as Element).closest('.tuner-panel')) return;
      const now = performance.now();
      const fresh = now - gesture.current.last > 180;
      if (fresh) { gesture.current.total = 0; gesture.current.blocked = false; }
      gesture.current.last = now;
      if (busy.current || gesture.current.blocked) {
        event.preventDefault();
        gesture.current.blocked = true;
        return;
      }
      const down = event.deltaY > 0;
      if (phase === 'deck' && consumes(scroller(event.target), down)) return;
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? size.h : 1);
      if (Math.sign(gesture.current.total) !== Math.sign(delta)) gesture.current.total = 0;
      gesture.current.total += delta;
      if (Math.abs(gesture.current.total) >= 48) {
        gesture.current.blocked = true;
        gesture.current.total = 0;
        advance(down);
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      const point = event.touches[0];
      touch.current = point ? { x: point.clientX, y: point.clientY, spent: busy.current } : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1 || !touch.current) return;
      if ((event.target as Element).closest('.tuner-panel')) return;
      const start = touch.current;
      const point = event.touches[0];
      const dy = start.y - point.clientY;
      if (busy.current || start.spent) { event.preventDefault(); start.spent = true; return; }
      if (Math.abs(point.clientX - start.x) > Math.abs(dy)) return;
      if (phase === 'deck' && consumes(scroller(event.target), dy > 0)) {
        // Only the unconsumed movement at the boundary may switch a card.
        start.y = point.clientY;
        return;
      }
      event.preventDefault();
      if (Math.abs(dy) >= 54) { start.spent = true; advance(dy > 0); }
    };
    const onTouchEnd = () => { touch.current = null; };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchcancel', onTouchEnd);
    return () => {
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [active, cards.length, phase, size.h, open, close, goTo]);

  const locked = phase !== 'deck' || swap !== null;
  // Three-beat physical opening: the flap opens with the envelope holding
  // its home position and scale; the seated pack is seen inside; the pack
  // then rises while the envelope descends to its dock; only after docking
  // does the pack come quickly forward into its reading size. The return
  // reverses into the same seat before the flap closes.
  const docked = ['lifting', 'growing', 'appearing', 'deck'].includes(phase);
  const simple = animationMode === 'simple';
  const exposed = !simple || phase === 'appearing' || phase === 'deck';
  const dockScale = size.w < 680 ? 0.76 : 0.52;
  const deckLifted = simple || ['lifting', 'growing', 'deck'].includes(phase);
  // The envelope's sealed spot: it does not move while the flap opens.
  const homePose: PaperPose = { y: 12, scale: 1, rotate: reduce ? 0 : -2.2 };
  // The return ends a touch low so the final settle is a real movement.
  const settleTop: PaperPose = { ...homePose, y: homePose.y + 14 };
  const dockPose: PaperPose = { y: size.h / 2 - size.envH * dockScale * .18, scale: dockScale, rotate: 0 };
  const envelopePose: PaperPose = docked ? dockPose
    : phase === 'refolding' || phase === 'dismissing' ? settleTop
    : homePose;
  // Opening and return share exactly one seat. No second downward tuck.
  const seat = seatedPack(size.envW, size.envH, size.cardW, size.cardH);
  const top = Math.max(size.headerH + 48, (size.h - size.cardH) / 2 + 18);
  const deckY = Math.min(top, size.h - size.cardH - 64) + size.cardH / 2 - size.h / 2;
  const deckPose = {
    opacity: exposed ? 1 : 0,
    y: deckLifted ? deckY : envelopePose.y + seat.y * envelopePose.scale,
    scale: deckLifted ? 1 : seat.scale * envelopePose.scale,
    rotate: deckLifted || reduce ? 0 : -2.2,
  };
  // Beat 1 (lifting): pack rises while the envelope docks. Beat 2 (growing):
  // forward growth at the reading position.
  const traveling = !simple && phase === 'lifting';
  const growing = !simple && phase === 'growing';
  const returning = phase === 'returning';
  const transferring = traveling || growing || returning;
  const seatedHome: PaperPose = { y: homePose.y + seat.y * homePose.scale, scale: seat.scale * homePose.scale, rotate: homePose.rotate };
  const seatedSettle: PaperPose = { y: settleTop.y + seat.y * homePose.scale, scale: seatedHome.scale, rotate: homePose.rotate };
  const midEnvelope: PaperPose = {
    y: (homePose.y + dockPose.y) / 2,
    scale: (homePose.scale + dockPose.scale) / 2,
    rotate: (homePose.rotate + dockPose.rotate) / 2,
  };
  const clearance = packClearance(midEnvelope, size.envH, size.cardW, size.cardH, seat.scale * midEnvelope.scale);
  // Beat 1 ends with the pack hovering at reading height, or just above the
  // docked pocket where that is higher (short viewports) — never lower than
  // either, and never high enough to slide under the header.
  const clearanceY = packClearance(dockPose, size.envH, size.cardW, size.cardH, seatedHome.scale).y;
  const hover: PaperPose = {
    y: Math.max(
      Math.min(clearanceY, deckY),
      size.headerH + 8 + (size.cardH / 2 + 40) * seatedHome.scale - size.h / 2,
    ),
    scale: seatedHome.scale,
    rotate: 0,
  };
  const reading: PaperPose = { y: deckY, scale: 1, rotate: 0 };
  const travelMotion = openingTravel(seatedHome, hover, homePose, dockPose);
  const growthMotion = openingGrowth(hover, reading);
  const frames = (from: PaperPose, middle: PaperPose, to: PaperPose) => {
    const sequence = returning ? [to, middle, from] : [from, middle, to];
    return { y: sequence.map(p => p.y), scale: sequence.map(p => p.scale), rotate: sequence.map(p => p.rotate) };
  };
  // Beat 1: one smooth descent; the pack holds its seated scale throughout.
  const travelTransition = { duration: .9, ease: [.32, 0, .2, 1] as [number, number, number, number] };
  // Beat 2: quicker — the pack comes forward into view.
  const growthTransition = { duration: .5, ease: [.2, .75, .25, 1] as [number, number, number, number] };
  // The approved return: unchanged keyframes, duration and easing.
  const transferTransition = {
    duration: 1.15, times: [0, .5, 1],
    // Keep velocity through the layer handoff; there is no pause above the mouth.
    ease: [[.32, 0, .68, .6], [.32, .4, .68, 1]] as [number, number, number, number][],
  };
  const bodyTransition = { duration: reduce ? 0 : simple && ['appearing', 'dismissing'].includes(phase) ? .65 : phase === 'settling' ? .55 : .95, ease: EASE };
  const envelopeAnimation = traveling ? travelMotion.envelope
    : returning ? frames(settleTop, midEnvelope, dockPose)
    : envelopePose;
  const envelopeTransition = traveling ? travelTransition : returning ? transferTransition : bodyTransition;
  const deckAnimation = traveling ? { ...travelMotion.pack, opacity: 1 }
    : growing ? { ...growthMotion.pack, opacity: 1 }
    : returning ? { ...frames(seatedSettle, clearance, reading), opacity: 1 }
    : deckPose;
  const deckTransition = transferring
    ? { ...(traveling ? travelTransition : growing ? growthTransition : transferTransition), opacity: { duration: 0 } }
    : { ...bodyTransition, opacity: { duration: reduce ? 0 : simple ? .65 : 0 } };
  const packInFront = transferring ? transferFront : ['appearing', 'deck', 'dismissing'].includes(phase);
  const updateTransferLayer = () => {
    const nextFront = phase === 'lifting' || phase === 'growing';
    if (!transferring || transferFront === nextFront) return;
    const canvas = canvasRef.current;
    const pocket = canvas?.querySelector('.envelope-front');
    const pack = canvas?.querySelectorAll('.index-card');
    if (!pocket || !pack?.length) return;
    // Switch only across a visible gap, using the actual responsive card boxes.
    // The next frame's paper overlap therefore cannot cut or pop the card.
    const bottom = Math.max(...Array.from(pack, card => card.getBoundingClientRect().bottom));
    if (bottom < pocket.getBoundingClientRect().top - 4) setTransferFront(nextFront);
  };

  const keyDown = (event: React.KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement;
    if (target.closest('.tuner-panel, input, textarea, select, [role="slider"]')) return;
    const navigationKeys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'];
    if (navigationKeys.includes(event.key) && busy.current) { event.preventDefault(); return; }
    if (phase !== 'deck') return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    else if (active === cards.length - 1 && ['ArrowDown', 'PageDown'].includes(event.key)) {
      const body = canvasRef.current?.querySelector<HTMLElement>('.is-front .index-card-body');
      if (body && body.scrollTop + body.clientHeight < body.scrollHeight - 2) return;
      event.preventDefault();
      close();
    }
    // Up/down and page keys read the focused card. Left/right turn the deck.
    else if (target.closest('.card-scroll') && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) return;
    else if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key)) { event.preventDefault(); goTo(active + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); goTo(active - 1); }
    else if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    else if (event.key === 'End') { event.preventDefault(); goTo(cards.length - 1); }
  };

  return (
    <section className="stage experience-stage" id="work" aria-label="Portfolio deck" tabIndex={-1} onKeyDown={keyDown}>
      <div className={'stage-canvas experience-canvas' + (['deck', 'growing', 'dismissing', 'returning'].includes(phase) ? ' cards-front' : '')}
        ref={canvasRef} data-phase={phase} data-animation={animationMode} data-construction={construction} data-swapping={swap ? 'true' : 'false'}
        role="group" aria-roledescription="envelope and index card deck">
        <div className="deck-footprint" aria-hidden="true" />

        <motion.div className="envelope envelope-back" initial={false} animate={envelopeAnimation}
          transition={envelopeTransition} onAnimationComplete={finishEnvelope}>
          <EnvelopeArtwork plane="back" phase={phase} reduce={reduce} construction={construction} onComplete={finishFlap} />
        </motion.div>

        <div className="deck-window" style={{ zIndex: packInFront ? 6 : 2 }}>
          <motion.div className={'deck-rise' + (locked ? ' is-locked' : '')} initial={false}
            animate={deckAnimation} transition={deckTransition}
            onUpdate={updateTransferLayer}
            onAnimationComplete={finishDeck}>
            <DeckCards cards={cards} active={active} swap={swap} reduce={reduce}
              interactive={!locked} width={size.cardW} businessWidth={size.businessW}
              onSwapComplete={completeSwap} />
          </motion.div>
        </div>

        <motion.div className="envelope envelope-front" initial={false} animate={envelopeAnimation}
          transition={envelopeTransition}>
          <EnvelopeArtwork plane="front" phase={phase} reduce={reduce} construction={construction} onComplete={finishSeal} />
          <button type="button" className="envelope-hit" disabled={busy.current}
            onClick={() => phase === 'sealed' ? open() : close()}
            aria-label={phase === 'sealed' ? 'Open the envelope and read the deck' : 'Return the cards to the envelope and close it'} />
        </motion.div>

        <motion.div className={'envelope envelope-flap-plane' + (flapBehind ? ' is-behind' : '')}
          initial={false} animate={envelopeAnimation} transition={envelopeTransition}>
          <EnvelopeArtwork plane="flap" phase={phase} reduce={reduce} construction={construction}
            onComplete={finishFlap} onFlapTurn={setFlapBehind} />
        </motion.div>

        <motion.div className="envelope envelope-seal-plane" initial={false} animate={envelopeAnimation}
          transition={envelopeTransition}>
          <EnvelopeArtwork plane="seal" phase={phase} reduce={reduce} construction={construction} onComplete={finishSeal} />
        </motion.div>

        {headerEl && createPortal(
          <div className="deck-counter" hidden={phase !== 'deck'} onKeyDown={keyDown}>
            <div className="deck-dots" role="group" aria-label="Go to card">
              {cards.map((card, index) => (
                <button key={card.id} type="button" aria-current={index === active ? 'step' : undefined}
                  aria-label={'Card ' + (index + 1) + ': ' + card.title}
                  className={'deck-dot' + (index === active ? ' on' : '') + (index < active ? ' read' : '')}
                  onClick={() => goTo(index)} disabled={locked} />
              ))}
            </div>
            <div className="deck-arrows">
              <button type="button" className="deck-arrow" onClick={() => goTo(active - 1)} aria-label="Previous card" disabled={locked || active === 0}>‹</button>
              <button type="button" className="deck-arrow" onClick={() => goTo(active + 1)} aria-label="Next card" disabled={locked || active === cards.length - 1}>›</button>
            </div>
          </div>, headerEl,
        )}
        <p className="stage-hint experience-hint">
          {phase === 'sealed' ? 'Scroll or tap the seal to open'
            : phase === 'deck' ? active === cards.length - 1
              ? 'Scroll once more to return the cards to the envelope'
              : 'Scroll the card to read · arrows to turn · envelope to close'
              : ['dismissing', 'returning', 'refolding', 'settling', 'resealing'].includes(phase) ? 'Closing the envelope' : 'Opening the envelope'}
        </p>
        <Tuner construction={construction} onConstructionChange={setConstruction}
          animationMode={animationMode} onAnimationModeChange={setAnimationMode}
          motionLocked={phase !== 'sealed' && phase !== 'deck'} />
      </div>
    </section>
  );
}
