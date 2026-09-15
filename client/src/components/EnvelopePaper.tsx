import { useId } from 'react';
import { ENVELOPE_CONSTRUCTIONS, type EnvelopeConstruction } from '../data/envelopeConstructions';

export function EnvelopePaper({ construction, surface }: {
  construction: EnvelopeConstruction; surface: 'back' | 'pocket' | 'flap' | 'reverse';
}) {
  const model = ENVELOPE_CONSTRUCTIONS[construction];
  const id = useId().replace(/:/g, '');
  const url = (name: string) => `url(#${id}-${name})`;
  const flap = surface === 'flap' || surface === 'reverse';
  return <svg className={`envelope-paper paper-${surface}`} viewBox={`0 0 1000 ${flap ? 360 : 650}`}
    preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-paper`} x2=".3" y2="1">
        <stop stopColor="var(--envelope-paper-top)" />
        <stop offset="1" stopColor="var(--envelope-paper-bottom)" />
      </linearGradient>
      <linearGradient id={`${id}-lining`} x2="0" y2="1">
        <stop stopColor="var(--envelope-interior-bottom)" />
        <stop offset="1" stopColor="var(--envelope-interior-top)" />
      </linearGradient>
      <linearGradient id={`${id}-left`} x2="1" y2=".5">
        <stop stopColor="var(--envelope-paper-top)" />
        <stop offset="1" stopColor="var(--envelope-paper-edge)" />
      </linearGradient>
      <linearGradient id={`${id}-right`} x1="1" x2="0" y2=".5">
        <stop stopColor="var(--envelope-paper-bottom)" />
        <stop offset="1" stopColor="var(--envelope-paper-edge)" />
      </linearGradient>
      <linearGradient id={`${id}-bottom`} x2="0" y2="1">
        <stop stopColor="var(--envelope-paper-edge)" />
        <stop offset="1" stopColor="var(--envelope-paper-top)" />
      </linearGradient>
      <linearGradient id={`${id}-volume`} x2=".25" y2="1">
        <stop stopColor="white" stopOpacity={model.light} />
        <stop offset=".65" stopColor="white" stopOpacity="0" />
        <stop offset="1" stopColor="#49311c" stopOpacity={model.shade} />
      </linearGradient>
      <pattern id={`${id}-airmail`} width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)">
        <rect width="44" height="44" fill="var(--envelope-paper-top)" />
        <rect width="14" height="44" fill="var(--envelope-airmail-blue)" />
        <rect x="22" width="14" height="44" fill="var(--envelope-airmail-red)" />
      </pattern>
      <pattern id={`${id}-fiber`} width="12" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 2H7 M5 6H12" stroke="#674827" strokeWidth=".7" opacity=".13" />
        <path d="M1 3H8" stroke="white" strokeWidth=".6" opacity=".4" />
      </pattern>
      <filter id={`${id}-shadow`} x="-15%" y="-15%" width="130%" height="140%">
        <feDropShadow dx="0" dy={model.edge + 2} stdDeviation={model.blur} floodColor="#362415" floodOpacity={model.depth} />
      </filter>
      <filter id={`${id}-grain`}>
        <feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" seed="7" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <clipPath id={`${id}-clip`}><path d={flap ? model.flap : surface === 'pocket' ? model.pocket : 'M0 0H1000V650H0Z'} /></clipPath>
    </defs>
    {surface === 'back' ? <>
      <rect width="1000" height="650" rx="12" fill={url('lining')} />
      <path d="M1 1H999" stroke="#4d3520" strokeOpacity=".3" strokeWidth="5" />
    </> : flap ? <>
      <path d={model.flap} fill={url(surface === 'reverse' ? 'lining' : 'paper')} filter={url('shadow')} />
      <path d={model.flap} fill={url('volume')} stroke="var(--envelope-paper-edge)" strokeWidth={model.edge} />
      <path d={model.flap} transform="translate(0 -2)" fill="none" stroke="white" strokeOpacity={model.light + .15} strokeWidth={model.edge} />
    </> : <>
      <path d={model.pocket} fill={url('paper')} filter={url('shadow')} />
      <g clipPath={url('clip')}>
        <path d="M0 0L530 345L0 650Z" fill={url('left')} />
        <path d="M1000 0L470 345L1000 650Z" fill={url('right')} />
        <path d={model.bottom} fill={url('bottom')} filter={url('shadow')} />
        <path d={model.seam} fill="none" stroke="#4c321a" strokeOpacity={model.depth * .6} strokeWidth={model.edge} />
        <path d={model.seam} transform="translate(0 2)" fill="none" stroke="white" strokeOpacity={model.light + .12} strokeWidth={model.edge} />
        <path d="M6 0V644H994V0" fill="none" stroke={url('airmail')} strokeWidth="13" opacity=".85" />
      </g>
    </>}
    {model.texture !== 'plain' && <g clipPath={url('clip')} opacity={model.texture === 'grain' ? '.14' : '.6'} style={{ mixBlendMode: 'multiply' }}>
      <rect width="1000" height="650" fill={url('fiber')} />
      {model.texture === 'grain' && <rect width="1000" height="650" filter={url('grain')} opacity=".5" />}
    </g>}
  </svg>;
}

export function EnvelopeConstructionPreview({ construction }: { construction: EnvelopeConstruction }) {
  return <span className="construction-preview" aria-hidden="true">
    <EnvelopePaper construction={construction} surface="back" />
    <EnvelopePaper construction={construction} surface="pocket" />
    <span className="construction-preview-flap"><EnvelopePaper construction={construction} surface="flap" /></span>
    <span className="construction-preview-seal" />
  </span>;
}
