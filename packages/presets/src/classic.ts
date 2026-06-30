import { createPreset } from './createPreset.js';

export const classicPreset = createPreset({
  id: 'classic',
  name: { de: 'Klassisch', en: 'Classic' },
  description: {
    de: 'Klassisches deutsches Lebenslauf-Layout mit Seitenleiste',
    en: 'Classic German CV layout with sidebar',
  },
  designId: 'sidebar-left',
});
