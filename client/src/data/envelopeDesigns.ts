/** Print treatments are independent of the envelope's paper palette. */
export const ENVELOPE_DESIGNS = {
  airmail: { label: 'Airmail', description: 'Striped edges · handwritten address' },
  letterpress: { label: 'Letterpress', description: 'Double rules · engraved flourishes' },
  botanical: { label: 'Botanical', description: 'Leaf illustrations · centered address' },
  deco: { label: 'Art Deco', description: 'Stepped corners · geometric fans' },
  field: { label: 'Field Post', description: 'Compass rose · postal address label' },
  minimal: { label: 'Minimal', description: 'Clean type · single-rule layout' },
} as const;

export type EnvelopeDesign = keyof typeof ENVELOPE_DESIGNS;
