import { describe, expect, it } from 'vitest';
import { openingTravel, openingGrowth, packClearance } from './envelopeMotion';
import { seatedPack } from './envelopeConstructions';

describe('paper transfer clearance', () => {
  it.each([
    [760, 494, 866, 531, .65],
    [350, 227, 362, 660, .88],
    [280, 182, 292, 580, .88],
    [760, 494, 1400, 860, .65],
  ])('keeps the entire rotated pack above the pocket at %ipx envelope width', (envW, envH, cardW, cardH, scale) => {
    const envelope = { y: 250, scale, rotate: -1.1 };
    const seat = seatedPack(envW, envH, cardW, cardH);
    const pack = packClearance(envelope, envH, cardW, cardH, seat.scale * scale);
    const angle = Math.abs(pack.rotate) * Math.PI / 180;
    const bottom = pack.y + (cardH / 2 + 40) * pack.scale * Math.cos(angle)
      + (cardW / 2 + 32) * pack.scale * Math.sin(angle);
    // Compare to the highest rotated corner of the envelope, not its center.
    const mouthTop = envelope.y - envH * scale / 2 * Math.cos(angle)
      - envW * scale / 2 * Math.sin(angle);
    expect(bottom).toBeLessThan(mouthTop - 4);
    expect((cardW + 64) * pack.scale).toBeLessThan(envW * scale);
  });
});

describe('three-beat in-place opening', () => {
  it.each([
    [760, 494, 866, 531, { y: 148, scale: .523, rotate: -2.2 }, { y: 27.5, scale: 1, rotate: 0 }],
    [350, 227, 362, 660, { y: 104, scale: .318, rotate: -2.2 }, { y: 18, scale: 1, rotate: 0 }],
  ])('holds scale while traveling, grows only after docking (envW %i)', (envW, envH, cardW, cardH, seated, reading) => {
    const home = { y: 12, scale: 1, rotate: -2.2 };
    const dock = { y: 314, scale: .52, rotate: 0 };
    const seat = seatedPack(envW, envH, cardW, cardH);
    const seatedHome = { y: home.y + seat.y * home.scale, scale: seat.scale * home.scale, rotate: home.rotate };
    // Mirror the component: hover at reading height, or above the docked
    // pocket when that is higher — the pack never sinks during the rise.
    const hoverY = Math.min(packClearance(dock, envH, cardW, cardH, seatedHome.scale).y, reading.y);
    const hover = { y: hoverY, scale: seatedHome.scale, rotate: 0 };

    const travel = openingTravel(seatedHome, hover, home, dock);
    // Beat 1: the pack rises at a constant seated scale while the envelope
    // travels from its unmoved home position to the dock.
    expect(travel.pack.scale[0]).toBe(seatedHome.scale);
    expect(travel.pack.scale[1]).toBe(seatedHome.scale);
    expect(travel.pack.y[1]).toBeLessThan(travel.pack.y[0]);
    expect(travel.envelope.y[0]).toBe(home.y);
    expect(travel.envelope.scale[0]).toBe(1);
    expect(travel.envelope.y[1]).toBe(dock.y);

    // Beat 2: growth only, starting from the hover pose and finishing at
    // the reading position; scale never decreases across the whole opening.
    const growth = openingGrowth(hover, reading);
    expect(growth.pack.scale[0]).toBe(hover.scale);
    expect(growth.pack.scale[1]).toBe(reading.scale);
    expect(growth.pack.scale[1]).toBeGreaterThan(growth.pack.scale[0]);
    expect(growth.pack.y[1]).toBe(reading.y);
    expect(growth.pack.scale[0]).toBeGreaterThanOrEqual(seatedHome.scale);
  });
});
