import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CARD_COLORS, type CardColor } from '../data/cardColors';
import { ENVELOPE_DESIGNS, type EnvelopeDesign } from '../data/envelopeDesigns';
import { ENVELOPE_COLORS, type EnvelopeColor } from '../data/envelopeColors';
import { EnvelopeDesignPreview } from './EnvelopeDecoration';
import { EnvelopeConstructionPreview } from './EnvelopePaper';
import { ENVELOPE_CONSTRUCTIONS, type EnvelopeAnimation, type EnvelopeConstruction } from '../data/envelopeConstructions';

/* Design tuning mode (for James): toggle it on, then drag the handles on
   the front card's right/bottom/corner edges to resize it, and use the
   sliders for the other element sizes. "Copy my proportions" puts the
   exact values on the clipboard to paste back to the assistant. */

type Vars = {
  w: number;
  h: number;
  shot: number;
  banner: number;
  bc: number;
  postage: number;
  color: CardColor;
  envelopeColor: EnvelopeColor;
  envelopeDesign: EnvelopeDesign;
};

const DEFAULTS: Vars = { w: 866, h: 531, shot: 440, banner: 240, bc: 660, postage: 125, color: 'blue', envelopeColor: 'kraft', envelopeDesign: 'airmail' };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function Tuner({ construction, onConstructionChange, animationMode, onAnimationModeChange, motionLocked }: {
  construction: EnvelopeConstruction;
  onConstructionChange: (construction: EnvelopeConstruction) => void;
  animationMode: EnvelopeAnimation;
  onAnimationModeChange: (mode: EnvelopeAnimation) => void;
  motionLocked: boolean;
}) {
  const [on, setOn] = useState(false);
  const [vars, setVars] = useState<Vars>(DEFAULTS);
  const [rect, setRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const dragging = useRef<{ mode: 'w' | 'h' | 'wh'; x0: number; y0: number; w0: number; h0: number } | null>(null);

  // apply current values as CSS custom properties
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--deck-card-w', `${vars.w}px`);
    r.setProperty('--deck-card-h', `${vars.h}px`);
    r.setProperty('--shot-max', `${vars.shot}px`);
    r.setProperty('--banner-max', `${vars.banner}px`);
    r.setProperty('--bc-width', `${vars.bc}px`);
    r.setProperty('--postage-scale', `${vars.postage / 100}`);
    const paper = CARD_COLORS[vars.color];
    r.setProperty('--card-paper-top', paper.top);
    r.setProperty('--card-paper-bottom', paper.bottom);
    r.setProperty('--card-paper-edge', paper.edge);
    const envelope = ENVELOPE_COLORS[vars.envelopeColor];
    document.documentElement.dataset.envelopeDesign = vars.envelopeDesign;
    r.setProperty('--envelope-paper-top', envelope.top);
    r.setProperty('--envelope-paper-bottom', envelope.bottom);
    r.setProperty('--envelope-paper-edge', envelope.edge);
    r.setProperty('--envelope-interior-top', envelope.interiorTop);
    r.setProperty('--envelope-interior-bottom', envelope.interiorBottom);
    r.setProperty('--envelope-interior-stripe-a', envelope.stripeA);
    r.setProperty('--envelope-interior-stripe-b', envelope.stripeB);
    r.setProperty('--envelope-airmail-red', envelope.red);
    r.setProperty('--envelope-airmail-blue', envelope.blue);
    r.setProperty('--envelope-border-angle', envelope.angle);
    r.setProperty('--envelope-radius', envelope.radius);
    r.setProperty('--envelope-overlay', envelope.overlay);
  }, [vars]);

  // track the front card's box while tuning
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    const measure = () => {
      const el = document.querySelector('.experience-canvas[data-phase="deck"] .index-card.is-front') as HTMLElement | null;
      if (el) {
        const b = el.getBoundingClientRect();
        setRect({ left: b.left, top: b.top, width: b.width, height: b.height });
      } else setRect(null);
      raf = requestAnimationFrame(measure);
    };
    raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  const startDrag = useCallback(
    (mode: 'w' | 'h' | 'wh') => (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragging.current = {
        mode,
        x0: e.clientX,
        y0: e.clientY,
        w0: vars.w,
        h0: vars.h,
      };
    },
    [vars.w, vars.h],
  );

  const onDrag = useCallback(
    (e: React.PointerEvent) => {
      const d = dragging.current;
      if (!d) return;
      const dx = e.clientX - d.x0;
      const dy = e.clientY - d.y0;
      setVars((v) => ({
        ...v,
        w: d.mode === 'h' ? v.w : clamp(d.w0 + dx * 2, 420, Math.round(window.innerWidth * 0.96)),
        h: d.mode === 'w' ? v.h : clamp(d.h0 + dy * 2, 300, Math.round(window.innerHeight * 0.92)),
      }));
    },
    [],
  );

  const endDrag = useCallback(() => { dragging.current = null; }, []);

  const report =
    `Card: ${vars.w} × ${vars.h} (${(vars.w / vars.h).toFixed(2)}:1)\n` +
    `Gallery shot max height: ${vars.shot}px\n` +
    `Banner frame height cap: ${vars.banner}px\n` +
    `Business card width: ${vars.bc}px\n` +
    `Postage stamp size: ${vars.postage}%\n` +
    `Card color: ${CARD_COLORS[vars.color].label}\n` +
    `Envelope color: ${ENVELOPE_COLORS[vars.envelopeColor].label}\n` +
    `Envelope design: ${ENVELOPE_DESIGNS[vars.envelopeDesign].label}\n` +
    `Envelope construction: ${ENVELOPE_CONSTRUCTIONS[construction].label}\n` +
    `Opening style: ${animationMode === 'contained' ? 'Cards inside' : 'Simple reveal'}\n` +
    `CSS: --deck-card-w:${vars.w}px; --deck-card-h:${vars.h}px; --shot-max:${vars.shot}px; ` +
    `--banner-max:${vars.banner}px; --bc-width:${vars.bc}px; --postage-scale:${vars.postage / 100}; ` +
    `--card-paper-top:${CARD_COLORS[vars.color].top}; --card-paper-bottom:${CARD_COLORS[vars.color].bottom}; ` +
    `--card-paper-edge:${CARD_COLORS[vars.color].edge};\n` +
    `Envelope selections: color=${vars.envelopeColor}; design=${vars.envelopeDesign}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = report;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <button
        type="button"
        className="tuner-toggle"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        title="Design tuning mode"
      >
        {on ? '✕ tuning' : '⚖ tune'}
      </button>

      {on && (
        <div className="tuner-panel">
          <p className="tuner-head">design tuning — drag the dots on the card edge</p>

          <label className="tuner-row">
            Postage stamp size {vars.postage}%
            <input type="range" aria-label="Postage stamp size" min={80} max={180} step={5} value={vars.postage}
              onChange={(e) => setVars((v) => ({ ...v, postage: +e.target.value }))} />
          </label>

          <fieldset className="tuner-colors">
            <legend>Card color</legend>
            <div className="tuner-swatches">
              {(Object.keys(CARD_COLORS) as CardColor[]).map((color) => (
                <button key={color} type="button" aria-pressed={vars.color === color}
                  onClick={() => setVars((v) => ({ ...v, color }))}>
                  <span aria-hidden="true" style={{ background: CARD_COLORS[color].bottom }} />
                  {CARD_COLORS[color].label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="tuner-envelopes">
            <legend>Envelope color</legend>
            <div className="tuner-envelope-swatches">
              {(Object.keys(ENVELOPE_COLORS) as EnvelopeColor[]).map((color) => (
                <button key={color} type="button" aria-pressed={vars.envelopeColor === color}
                  onClick={() => setVars((v) => ({ ...v, envelopeColor: color }))}>
                  <span aria-hidden="true" style={{ background: `linear-gradient(145deg, ${ENVELOPE_COLORS[color].top}, ${ENVELOPE_COLORS[color].bottom})` }} />
                  {ENVELOPE_COLORS[color].label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="tuner-envelopes tuner-constructions" disabled={motionLocked}>
            <legend>Envelope construction</legend>
            <p className="tuner-section-note">Compare the paper, folds, creases and shadows. Airmail edges stay on every option.</p>
            <div className="tuner-design-options">
              {(Object.keys(ENVELOPE_CONSTRUCTIONS) as EnvelopeConstruction[]).map((key) => (
                <button key={key} type="button" aria-label={ENVELOPE_CONSTRUCTIONS[key].label}
                  aria-pressed={construction === key} onClick={() => onConstructionChange(key)}>
                  <EnvelopeConstructionPreview construction={key} />
                  <strong>{ENVELOPE_CONSTRUCTIONS[key].label}</strong>
                  <small>{ENVELOPE_CONSTRUCTIONS[key].description}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="tuner-envelopes tuner-motion" disabled={motionLocked}>
            <legend>Opening style</legend>
            <div className="tuner-motion-options">
              <button type="button" aria-pressed={animationMode === 'contained'} onClick={() => onAnimationModeChange('contained')}>
                <strong>Cards inside</strong><small>The flap uncovers the cards, then they lift out. They return to the same seat before it closes.</small>
              </button>
              <button type="button" aria-pressed={animationMode === 'simple'} onClick={() => onAnimationModeChange('simple')}>
                <strong>Simple reveal</strong><small>The envelope opens first, then the cards fade in. They fade out before it closes.</small>
              </button>
            </div>
          </fieldset>

          <fieldset className="tuner-envelopes tuner-designs">
            <legend>Envelope design</legend>
            <p className="tuner-section-note">Optional printed decoration, separate from the paper construction.</p>
            <div className="tuner-design-options">
              {(Object.keys(ENVELOPE_DESIGNS) as EnvelopeDesign[]).map((design) => (
                <button key={design} type="button" aria-label={ENVELOPE_DESIGNS[design].label}
                  aria-pressed={vars.envelopeDesign === design}
                  onClick={() => setVars((v) => ({ ...v, envelopeDesign: design }))}>
                  <EnvelopeDesignPreview design={design} />
                  <strong>{ENVELOPE_DESIGNS[design].label}</strong>
                  <small>{ENVELOPE_DESIGNS[design].description}</small>
                </button>
              ))}
            </div>
          </fieldset>

          {rect && createPortal(
            <>
              <span
                className="tuner-handle tuner-w"
                style={{ left: rect.left + rect.width, top: rect.top + rect.height / 2 }}
                onPointerDown={startDrag('w')}
                onPointerMove={onDrag}
                onPointerUp={endDrag}
                role="slider"
                aria-label="Card width"
                tabIndex={0}
              />
              <span
                className="tuner-handle tuner-h"
                style={{ left: rect.left + rect.width / 2, top: rect.top + rect.height }}
                onPointerDown={startDrag('h')}
                onPointerMove={onDrag}
                onPointerUp={endDrag}
                role="slider"
                aria-label="Card height"
                tabIndex={0}
              />
              <span
                className="tuner-handle tuner-wh"
                style={{ left: rect.left + rect.width, top: rect.top + rect.height }}
                onPointerDown={startDrag('wh')}
                onPointerMove={onDrag}
                onPointerUp={endDrag}
                role="slider"
                aria-label="Card width and height"
                tabIndex={0}
              />
            </>, document.body,
          )}

          <label className="tuner-row">
            card {vars.w} × {vars.h}
            <input type="range" min={420} max={1400} value={vars.w}
              onChange={(e) => setVars((v) => ({ ...v, w: +e.target.value }))} />
            <input type="range" min={300} max={860} value={vars.h}
              onChange={(e) => setVars((v) => ({ ...v, h: +e.target.value }))} />
          </label>
          <label className="tuner-row">
            gallery photo max {vars.shot}px
            <input type="range" min={160} max={720} value={vars.shot}
              onChange={(e) => setVars((v) => ({ ...v, shot: +e.target.value }))} />
          </label>
          <label className="tuner-row">
            banner frame {vars.banner}px
            <input type="range" min={120} max={320} value={vars.banner}
              onChange={(e) => setVars((v) => ({ ...v, banner: +e.target.value }))} />
          </label>
          <label className="tuner-row">
            business card {vars.bc}px
            <input type="range" min={420} max={900} value={vars.bc}
              onChange={(e) => setVars((v) => ({ ...v, bc: +e.target.value }))} />
          </label>

          <div className="tuner-actions">
            <button type="button" onClick={copy}>{copied ? '✓ copied' : 'copy my proportions'}</button>
            <button type="button" disabled={motionLocked} onClick={() => { setVars(DEFAULTS); onConstructionChange('classic'); onAnimationModeChange('contained'); }}>reset</button>
          </div>
          <details className="tuner-output">
            <summary>Current settings</summary>
            <pre className="tuner-report">{report}</pre>
          </details>
        </div>
      )}
    </>
  );
}
