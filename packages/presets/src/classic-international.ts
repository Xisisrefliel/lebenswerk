import { createPreset } from './createPreset.js';

export const classicInternationalPreset = createPreset({
  id: 'classic-international',
  name: { de: 'Klassisch International', en: 'Classic International' },
  description: {
    de: 'Internationales CV-Layout — ohne Geburtsdaten und Nationalität',
    en: 'International CV layout — without birth details and nationality',
  },
  designId: 'sidebar-left',
  overrides: {
    slotAssignments: {
      sidebar: [
        { componentId: 'photo', options: { shape: 'rounded', size: 'md' } },
        { componentId: 'contact-info', options: { layout: 'vertical', displayStyle: 'both' } },
        { componentId: 'skills-list', options: { displayMode: 'dots' } },
        { componentId: 'languages-list', options: {} },
      ],
      main: [
        { componentId: 'personal-info', options: { showFields: ['name', 'label'] } },
        { componentId: 'summary', options: {} },
        { componentId: 'experience-list', options: { showHighlights: true } },
        { componentId: 'education-list', options: {} },
      ],
    },
  },
});
