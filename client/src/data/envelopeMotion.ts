export type PaperPose = { y: number; scale: number; rotate: number };

/** Opening beat 1 — the flap has finished opening and the envelope still
 * holds its home position: the pack rises out of its seat while the
 * envelope descends to its dock. The pack keeps its seated scale; it does
 * not grow until beat 2. */
export function openingTravel(seated: PaperPose, hover: PaperPose, home: PaperPose, dock: PaperPose) {
  return {
    pack: {
      y: [seated.y, hover.y],
      scale: [seated.scale, hover.scale],
      rotate: [seated.rotate, hover.rotate],
    },
    envelope: {
      y: [home.y, dock.y],
      scale: [home.scale, dock.scale],
      rotate: [home.rotate, dock.rotate],
    },
  };
}

/** Opening beat 2 — the envelope has docked; the pack comes quickly
 * forward, growing from its hover pose into the full reading position. */
export function openingGrowth(hover: PaperPose, reading: PaperPose) {
  return {
    pack: {
      y: [hover.y, reading.y],
      scale: [hover.scale, reading.scale],
      rotate: [hover.rotate, reading.rotate],
    },
  };
}

/** The whole pack (including its staggered top edges) clears the pocket of
 * the given envelope pose at the given pack scale. */
export function packClearance(envelope: PaperPose, envH: number, cardW: number, cardH: number, packScale: number): PaperPose {
  const radians = Math.abs(envelope.rotate) * Math.PI / 180;
  const packHalfHeight = (cardH / 2 + 40) * packScale * Math.cos(radians)
    + (cardW / 2 + 32) * packScale * Math.sin(radians);
  return {
    y: envelope.y - envH * envelope.scale / 2 - packHalfHeight - 20,
    scale: packScale,
    rotate: envelope.rotate,
  };
}
