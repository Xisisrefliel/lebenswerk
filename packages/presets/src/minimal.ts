import { createPreset } from './createPreset.js';

export const minimalPreset = createPreset({
  id: 'minimal',
  name: { de: 'Minimal', en: 'Minimal' },
  description: {
    de: 'Minimalistisches einseitiges Layout ohne Seitenleiste',
    en: 'Minimalist single-column layout without sidebar',
  },
  designId: 'full-width',
});
