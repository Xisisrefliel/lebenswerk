import {
  COMMON_COLOR_TOKENS,
  defineDesign,
  SECTION_TITLE_STYLE_VALUES,
  STANDARD_FONT_OPTIONS,
  STANDARD_SPACING_SCALE,
  TIMELINE_STYLE_VALUES,
} from '@cv/layout-engine';

export const fullWidthDesign = defineDesign({
  id: 'full-width',
  name: { de: 'Minimal', en: 'Minimal' },
  description: {
    de: 'Minimalistisches Layout ohne Seitenleiste',
    en: 'Minimalist layout without sidebar',
  },
  thumbnail: '',

  documentTypes: ['lebenslauf', 'anschreiben'],
  supportedLocales: ['de', 'en'],

  colors: [
    {
      key: 'primary',
      label: { de: 'Akzentfarbe', en: 'Accent' },
      default: '#000000',
      cssVar: '--cv-primary',
    },
    COMMON_COLOR_TOKENS.text,
    COMMON_COLOR_TOKENS.muted,
    COMMON_COLOR_TOKENS.border,
  ],

  fonts: [
    {
      key: 'body',
      label: { de: 'Schrift', en: 'Font' },
      default: 'system-ui, sans-serif',
      cssVar: '--cv-font-body',
      options: STANDARD_FONT_OPTIONS,
    },
  ],

  spacing: { ...STANDARD_SPACING_SCALE, default: 'compact' },

  options: {
    sectionTitleStyle: {
      type: 'enum',
      key: 'sectionTitleStyle',
      label: { de: 'Titelstil', en: 'Title style' },
      values: SECTION_TITLE_STYLE_VALUES.filter((v) =>
        ['normal', 'uppercase-spaced', 'accent-underline'].includes(v.value),
      ),
      default: 'normal',
    },
    timelineStyle: {
      type: 'enum',
      key: 'timelineStyle',
      label: { de: 'Timeline-Stil', en: 'Timeline style' },
      values: TIMELINE_STYLE_VALUES,
      default: 'plain',
    },
  },

  slots: {
    main: {
      accepts: ['main', 'sidebar'],
      defaultComponents: [
        { componentId: 'personal-info', options: { showFields: ['name', 'label'] } },
        { componentId: 'contact-info', options: { layout: 'horizontal', displayStyle: 'both' } },
        { componentId: 'summary', options: {} },
        { componentId: 'experience-list', options: { showHighlights: true } },
        { componentId: 'education-list', options: {} },
        { componentId: 'skills-list', options: { displayMode: 'none' } },
        { componentId: 'languages-list', options: {} },
      ],
    },
  },

  anschreibenConfig: {},

  css: `
.cv-page {
  display: flex;
  flex-direction: column;
}
.cv-slot-main {
  padding: 14mm 16mm;
  display: flex;
  flex-direction: column;
  gap: var(--cv-spacing-gap);
}`,
});
