import { motion } from 'framer-motion';
import { asset } from '../lib/asset';
import { EnvelopeDecoration } from './EnvelopeDecoration';
import { EnvelopePaper } from './EnvelopePaper';
import type { EnvelopeConstruction } from '../data/envelopeConstructions';

export type PackPhase = 'sealed' | 'unsealing' | 'unfolding' | 'lifting' | 'growing' | 'appearing' | 'deck' | 'dismissing' | 'returning' | 'refolding' | 'settling' | 'resealing';

/** The flap has its own scene layer: in front while shut, behind past its hinge. */
export function EnvelopeArtwork({ plane, phase, reduce, construction, onComplete, onFlapTurn }: {
  plane: 'back' | 'front' | 'flap' | 'seal';
  phase: PackPhase;
  reduce: boolean;
  construction: EnvelopeConstruction;
  onComplete: (phase: PackPhase) => void;
  onFlapTurn?: (behind: boolean) => void;
}) {
  const flapOpen = ['unfolding', 'lifting', 'growing', 'appearing', 'deck', 'dismissing', 'returning'].includes(phase);
  const sealClosed = phase === 'sealed' || phase === 'resealing';
  const waxSealAsset = asset('assets/wax-seal-j.png');

  if (plane === 'back') return (
    <div className="env-face env-backplane">
      <EnvelopePaper construction={construction} surface="back" />
    </div>
  );

  if (plane === 'flap') return (
    <motion.div className="env-flap" initial={false}
      animate={{ rotateX: flapOpen ? -180 : 0 }}
      transition={{ duration: reduce ? 0 : 1.05, ease: [0.4, 0, 0.2, 1] }}
      onUpdate={(latest) => onFlapTurn?.(Number(latest.rotateX) < -90)}
      onAnimationComplete={() => onComplete(phase)}>
      <div className="env-flap-face">
        <EnvelopePaper construction={construction} surface="flap" />
        <EnvelopeDecoration flap />
        <div className="env-envelope-content">
          <div className="env-postage" aria-hidden="true">
            <img src={asset('assets/vintage-earth-stamp.png')} alt="" />
          </div>
          <h1 className="env-name">James Jones</h1>
          <p className="env-tagline">Practical solutions to complicated problems.</p>
        </div>
      </div>
      <div className="env-flap-back" aria-hidden="true">
        <EnvelopePaper construction={construction} surface="reverse" />
      </div>
    </motion.div>
  );

  if (plane === 'front') return (
      <div className="env-pocket" aria-hidden="true">
        <EnvelopePaper construction={construction} surface="pocket" />
        <EnvelopeDecoration />
        <div className="env-address-zone">
          <p className="env-to">For: anyone with a complicated problem</p>
          <div className="env-lines"><span /><span /><span /></div>
        </div>
        <p className="env-meta env-bottom-meta">ScootSolute LLC · Oregon, USA</p>
      </div>
  );

  return (
      <motion.div className="env-seal" aria-hidden="true" initial={false}
        animate={{ opacity: sealClosed ? 1 : 0, scale: sealClosed ? 1 : 1.16 }}
        transition={{ duration: reduce ? 0 : 0.24 }}
        onAnimationComplete={() => onComplete(phase)}>
        <motion.span className="seal-half seal-left" style={{ backgroundImage: 'url("' + waxSealAsset + '")' }}
          animate={{ x: sealClosed ? 0 : -14, rotate: sealClosed ? 0 : -9 }} />
        <motion.span className="seal-half seal-right" style={{ backgroundImage: 'url("' + waxSealAsset + '")' }}
          animate={{ x: sealClosed ? 0 : 14, rotate: sealClosed ? 0 : 9 }} />
      </motion.div>
  );
}
