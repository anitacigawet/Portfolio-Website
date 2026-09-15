import { describe, expect, it } from 'vitest';
import { seatedPack } from './envelopeConstructions';

describe('the card pack seated inside the envelope', () => {
  it.each([
    [760, 494, 866, 531],
    [350, 227, 362, 660],
    [280, 182, 292, 580],
    [760, 494, 1400, 860],
  ])('keeps the complete pack inside %ipx × %ipx paper', (envW, envH, cardW, cardH) => {
    const seat = seatedPack(envW, envH, cardW, cardH);
    // Include the stack's staggered edges, not just the front card.
    expect((cardW / 2 + 32) * seat.scale).toBeLessThan(envW / 2);
    expect(seat.y - (cardH / 2 + 40) * seat.scale).toBeGreaterThan(-envH / 2);
    expect(seat.y + cardH / 2 * seat.scale).toBeLessThan(envH / 2);
    // Its upper portion remains visible through the open pocket.
    expect(seat.y - cardH / 2 * seat.scale).toBeLessThan(0);
  });
});
