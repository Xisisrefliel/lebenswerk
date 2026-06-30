import {
  COMMON_COLOR_TOKENS,
  defineDesign,
  SECTION_TITLE_STYLE_VALUES,
  STANDARD_FONT_OPTIONS,
  STANDARD_SPACING_SCALE,
  TIMELINE_STYLE_VALUES,
} from '@cv/layout-engine';

export const topHeaderDesign = defineDesign({
  id: 'top-header',
  name: { de: 'Modern', en: 'Modern' },
  description: {
    de: 'Modernes Layout mit Kopfzeile und Seitenleiste',
    en: 'Modern layout with top header and sidebar',
  },
  thumbnail: '',

  documentTypes: ['lebenslauf', 'anschreiben'],
  supportedLocales: ['de', 'en'],

  colors: [
    {
      key: 'primary',
      label: { de: 'Akzentfarbe', en: 'Accent' },
      default: '#0f172a',
      cssVar: '--cv-primary',
    },
    {
      key: 'secondary',
      label: { de: 'Sekundär', en: 'Secondary' },
      default: '#3b82f6',
      cssVar: '--cv-secondary',
    },
    {
      key: 'sidebar-bg',
      label: { de: 'Seitenleiste', en: 'Sidebar' },
      default: '#f8fafc',
      cssVar: '--cv-sidebar-bg',
    },
    COMMON_COLOR_TOKENS.text,
    COMMON_COLOR_TOKENS.muted,
    COMMON_COLOR_TOKENS.border,
  ],

  fonts: [
    {
      key: 'heading',
      label: { de: 'Überschrift', en: 'Heading' },
      default: "'Inter', system-ui, sans-serif",
      cssVar: '--cv-font-heading',
      options: STANDARD_FONT_OPTIONS,
    },
    {
      key: 'body',
      label: { de: 'Fließtext', en: 'Body' },
      default: "'Inter', system-ui, sans-serif",
      cssVar: '--cv-font-body',
      options: STANDARD_FONT_OPTIONS,
    },
  ],

  spacing: STANDARD_SPACING_SCALE,

  options: {
    sectionTitleStyle: {
      type: 'enum',
      key: 'sectionTitleStyle',
      label: { de: 'Titelstil', en: 'Title style' },
      values: SECTION_TITLE_STYLE_VALUES,
      default: 'accent-underline',
    },
    timelineStyle: {
      type: 'enum',
      key: 'timelineStyle',
      label: { de: 'Timeline-Stil', en: 'Timeline style' },
      values: TIMELINE_STYLE_VALUES,
      default: 'accent',
    },
  },

  slots: {
    header: {
      accepts: ['header'],
      defaultComponents: [
        { componentId: 'personal-info', options: { showFields: ['name', 'label'] } },
        { componentId: 'contact-info', options: { layout: 'horizontal', displayStyle: 'both' } },
      ],
    },
    sidebar: {
      accepts: ['sidebar'],
      defaultComponents: [
        { componentId: 'skills-list', options: { displayMode: 'none' } },
        { componentId: 'languages-list', options: {} },
      ],
    },
    main: {
      accepts: ['main'],
      defaultComponents: [
        { componentId: 'summary', options: {} },
        { componentId: 'experience-list', options: { showHighlights: true } },
        { componentId: 'education-list', options: {} },
      ],
    },
  },

  anschreibenConfig: {
    headerBg: 'var(--cv-sidebar-bg)',
    headerComponents: [
      { componentId: 'letter-photo', options: { shape: 'circle' } },
      { componentId: 'letter-title', options: {} },
      { componentId: 'letter-contact', options: { showFields: ['email', 'phone', 'url'] } },
    ],
    headerAccepts: ['letter-header'],
    showFooter: true,
    footerBg: 'var(--cv-sidebar-bg)',
    footerComponents: [
      { componentId: 'letter-contact', options: { showFields: ['email', 'phone', 'url'] } },
    ],
    footerAccepts: ['letter-footer'],
  },

  css: `
.cv-page {
  display: grid;
  grid-template-columns: 70mm 1fr;
  grid-template-rows: auto 1fr;
}
.cv-slot-header {
  grid-column: 1 / -1;
  padding: 12mm 14mm 8mm;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 3mm 8mm;
  border-bottom: 0.5pt solid var(--cv-border);
}
.cv-slot-sidebar {
  background: var(--cv-sidebar-bg);
  padding: 10mm 10mm;
  display: flex;
  flex-direction: column;
  gap: var(--cv-spacing-gap);
}
.cv-slot-main {
  padding: 10mm 12mm;
  display: flex;
  flex-direction: column;
  gap: var(--cv-spacing-gap);
}`,
});
