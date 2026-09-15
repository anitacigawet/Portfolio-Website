/** Physical paper surfaces, independent of color and printed decoration. */
export const ENVELOPE_CONSTRUCTIONS = {
  classic: {
    label: 'Classic folds', description: 'Balanced triangular folds · light paper',
    flap: 'M0 0 H1000 L542 337 Q500 363 458 337 Z',
    pocket: 'M0 0 L462 311 Q500 333 538 311 L1000 0 V650 H0 Z',
    bottom: 'M0 650 L462 350 Q500 324 538 350 L1000 650 Z',
    seam: 'M0 650 L462 350 Q500 324 538 350 L1000 650',
    blur: 4, depth: .22, edge: 1.2, light: .12, shade: .12, texture: 'plain',
  },
  soft: {
    label: 'Soft stationery', description: 'Curved folds · broad, soft shadows',
    flap: 'M0 0 H1000 C866 101 700 271 548 336 Q500 356 452 336 C300 271 134 101 0 0Z',
    pocket: 'M0 0 C150 55 316 263 460 308 Q500 322 540 308 C684 263 850 55 1000 0 V650 H0Z',
    bottom: 'M0 650 C161 578 326 393 448 365 Q500 350 552 365 C674 393 839 578 1000 650Z',
    seam: 'M0 650 C161 578 326 393 448 365 Q500 350 552 365 C674 393 839 578 1000 650',
    blur: 11, depth: .2, edge: .8, light: .26, shade: .08, texture: 'fiber',
  },
  crisp: {
    label: 'Crisp origami', description: 'Sharp facets · precise, narrow creases',
    flap: 'M0 0 H1000 L500 352Z',
    pocket: 'M0 0 L500 319 L1000 0 V650 H0Z',
    bottom: 'M0 650 L500 322 L1000 650Z',
    seam: 'M0 650 L500 322 L1000 650',
    blur: 1.3, depth: .32, edge: 1.4, light: .08, shade: .25, texture: 'plain',
  },
  cushion: {
    label: 'Heavy cotton', description: 'Thick folded edges · deep soft relief',
    flap: 'M0 0 H1000 C833 88 654 258 548 331 Q500 365 452 331 C346 258 167 88 0 0Z',
    pocket: 'M0 0 L446 292 Q500 324 554 292 L1000 0 V650 H0Z',
    bottom: 'M0 650 L427 362 Q500 307 573 362 L1000 650Z',
    seam: 'M0 650 L427 362 Q500 307 573 362 L1000 650',
    blur: 9, depth: .4, edge: 4, light: .35, shade: .18, texture: 'fiber',
  },
  diamond: {
    label: 'Diamond folds', description: 'Interlocking facets · high bottom fold',
    flap: 'M0 0 H1000 L540 331 L500 354 L460 331Z',
    pocket: 'M0 0 L421 282 L500 313 L579 282 L1000 0 V650 H0Z',
    bottom: 'M0 650 L426 359 L500 313 L574 359 L1000 650Z',
    seam: 'M0 650 L426 359 L500 313 L574 359 L1000 650',
    blur: 3, depth: .32, edge: 2, light: .23, shade: .27, texture: 'plain',
  },
  worn: {
    label: 'Worn paper', description: 'Uneven folded edges · textured paper',
    flap: 'M0 0 H1000 L873 87 L721 185 L558 327 Q502 368 448 328 L288 193 L126 91Z',
    pocket: 'M0 0 L151 96 L312 206 L456 302 Q503 337 549 303 L717 190 L852 93 L1000 0 V650 H0Z',
    bottom: 'M0 650 L156 548 L312 444 L453 355 Q500 326 549 357 L717 467 L865 563 L1000 650Z',
    seam: 'M0 650 L156 548 L312 444 L453 355 Q500 326 549 357 L717 467 L865 563 L1000 650',
    blur: 6, depth: .32, edge: 2.5, light: .17, shade: .22, texture: 'grain',
  },
} as const;
export type EnvelopeConstruction = keyof typeof ENVELOPE_CONSTRUCTIONS;
export type EnvelopeAnimation = 'contained' | 'simple';

/** Fit the whole pack (including its staggered top edges) inside the paper. */
export function seatedPack(envW: number, envH: number, cardW: number, cardH: number) {
  const scale = Math.min(envW * .86 / cardW, envH * .8 / (cardH + 40));
  return { scale, y: envH * .04 };
}
