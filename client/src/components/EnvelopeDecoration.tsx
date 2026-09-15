import type { EnvelopeDesign } from '../data/envelopeDesigns';

function LeafBranch() {
  return <g>
    <path d="M0 0 C-48 -74 -20 -175 -64 -282" />
    {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${-i * 8} ${-i * 43})`}>
      <path className="env-leaf" d="M-6 -20 C-53 -16 -66 -47 -65 -66 C-36 -64 -11 -47 -6 -20Z" />
      <path className="env-leaf" d="M-8 -33 C26 -41 39 -70 32 -85 C8 -75 -6 -52 -8 -33Z" />
      <path d="M-6 -20 L-52 -54 M-8 -33 L24 -72" />
    </g>)}
  </g>;
}

/** The same print sheet is clipped to the moving flap and the fixed pocket.
 * Decorations therefore stay on their paper during the opening animation. */
export function EnvelopeDecoration({ flap = false }: { flap?: boolean }) {
  return <svg className={`env-design-art${flap ? ' env-design-art--flap' : ''}`}
    viewBox="0 0 1000 650" preserveAspectRatio="none" aria-hidden="true">
    <g className="env-print env-print-letterpress">
      <path d="M27 215 V27 H973 V215 M27 347 V623 H973 V347" />
      <path d="M36 209 V36 H964 V209 M36 350 V614 H964 V350" />
      <path className="env-heading-ornament" d="M390 193 H460 M540 193 H610 M474 193 Q487 175 500 193 Q513 211 526 193 Q513 175 500 193 Q487 211 474 193Z" />
      <path d="M55 575 V595 H105 M55 595 Q76 570 91 594 Q75 610 55 595 M945 575 V595 H895 M945 595 Q924 570 909 594 Q925 610 945 595" />
      <path d="M450 589 H479 L500 581 L521 589 H550 M479 589 L500 597 L521 589" />
    </g>
    <g className="env-print env-print-botanical">
      <g transform="translate(130 587)"><LeafBranch /></g>
      <g transform="translate(870 587) scale(-1 1)"><LeafBranch /></g>
      <path className="env-heading-ornament" d="M358 186 Q432 209 500 187 Q568 209 642 186" />
      <path className="env-leaf env-heading-ornament" d="M425 197 Q405 177 388 184 Q402 201 425 197Z M448 199 Q455 179 474 177 Q469 196 448 199Z M575 197 Q595 177 612 184 Q598 201 575 197Z M552 199 Q545 179 526 177 Q531 196 552 199Z" />
    </g>
    <g className="env-print env-print-deco">
      <path d="M25 212 V25 H375 M975 212 V25 H625 M39 204 V55 H69 V39 H358 M961 204 V55 H931 V39 H642" />
      <path d="M393 25 H466 L500 47 L534 25 H607 M466 25 L500 6 L534 25 M434 25 L500 66 L566 25" />
      <path d="M25 346 V625 H975 V346 M39 352 V595 H69 V611 H931 V595 H961 V352" />
      <path d="M50 596 L50 478 M50 596 L79 484 M50 596 L106 503 M50 596 L131 530 M50 596 L151 564 M50 596 H165 M950 596 V478 M950 596 L921 484 M950 596 L894 503 M950 596 L869 530 M950 596 L849 564 M950 596 H835" />
      <path d="M385 575 H460 L500 559 L540 575 H615 M460 575 L500 591 L540 575 M477 575 L500 566 L523 575 L500 584Z" />
    </g>
    <g className="env-print env-print-field">
      <path strokeDasharray="7 5" d="M24 214 V24 H976 V214 M24 348 V626 H976 V348" />
      <g transform="translate(150 501)">
        <circle r="69" /><circle r="59" />
        <path d="M0 -90 V-72 M0 72 V90 M-90 0 H-72 M72 0 H90 M-44 -44 L44 44 M44 -44 L-44 44 M0 -52 L13 -13 L52 0 L13 13 L0 52 L-13 13 L-52 0 L-13 -13Z" />
        <path className="env-print-solid" d="M0 -52 V0 L13 -13Z M52 0 H0 L13 13Z M0 52 V0 L-13 13Z M-52 0 H0 L-13 -13Z" />
        <circle r="7" />
      </g>
      <path d="M260 175 H510 M260 183 H395" />
    </g>
    <g className="env-print env-print-minimal">
      <path strokeWidth="7" d="M39 397 V583" />
      <path className="env-heading-ornament" d="M435 196 H565" />
      <path d="M90 579 H910" />
    </g>
  </svg>;
}

export function EnvelopeDesignPreview({ design }: { design: EnvelopeDesign }) {
  return <span className="envelope-design-preview" data-envelope-design={design} aria-hidden="true">
    <EnvelopeDecoration />
    <svg className="envelope-preview-folds" viewBox="0 0 1000 650" preserveAspectRatio="none">
      <path d="M0 0 L500 350 L1000 0 M0 650 L500 350 L1000 650" />
      <path className="preview-name" d="M325 102 H675 M385 140 H615" />
      <rect className="preview-stamp" x="901" y="57" width="51" height="66" />
      <circle className="preview-seal" cx="500" cy="340" r="42" />
    </svg>
  </span>;
}
