import { createPreset } from './createPreset.js';

export const modernPreset = createPreset({
  id: 'modern',
  name: { de: 'Modern', en: 'Modern' },
  description: {
    de: 'Modernes Layout mit Kopfzeile und Akzent-Unterstrichen',
    en: 'Modern layout with top header and accent underlines',
  },
  designId: 'top-header',
});
