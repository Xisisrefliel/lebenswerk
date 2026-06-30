import {
  COMMON_COLOR_TOKENS,
  defineDesign,
  SECTION_TITLE_STYLE_VALUES,
  STANDARD_FONT_OPTIONS,
  STANDARD_SPACING_SCALE,
  TIMELINE_STYLE_VALUES,
} from '@cv/layout-engine';

export const sidebarLeftDesign = defineDesign({
  id: 'sidebar-left',
  name: { de: 'Klassisch', en: 'Classic' },
  description: {
    de: 'Klassisches Layout mit Seitenleiste links oder rechts',
    en: 'Classic layout with sidebar on the left or right',
  },
  thumbnail: '',

  documentTypes: ['lebenslauf', 'anschreiben'],
  supportedLocales: ['de', 'en'],

  colors: [
    {
      key: 'primary',
      label: { de: 'Akzentfarbe', en: 'Accent' },
      default: '#1e3a8a',
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
      default: '#f2f4f7',
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
      default: 'uppercase-spaced',
    },
    timelineStyle: {
      type: 'enum',
      key: 'timelineStyle',
      label: { de: 'Timeline-Stil', en: 'Timeline style' },
      values: TIMELINE_STYLE_VALUES,
      default: 'line',
    },
  },

  slots: {
    sidebar: {
      accepts: ['sidebar'],
      defaultComponents: [
        { componentId: 'photo', options: { shape: 'circle', size: 'md' } },
        {
          componentId: 'personal-info',
          options: { showFields: ['birthDate', 'birthPlace', 'nationality'] },
        },
        { componentId: 'contact-info', options: { layout: 'vertical', displayStyle: 'both' } },
        { componentId: 'skills-list', options: { displayMode: 'none' } },
        { componentId: 'languages-list', options: {} },
      ],
      options: {
        position: {
          type: 'enum',
          key: 'position',
          label: { de: 'Position', en: 'Position' },
          values: [
            { value: 'left', label: { de: 'Links', en: 'Left' } },
            { value: 'right', label: { de: 'Rechts', en: 'Right' } },
          ],
          default: 'left',
        },
      },
    },
    main: {
      accepts: ['main'],
      defaultComponents: [
        { componentId: 'personal-info', options: { showFields: ['name', 'label'] } },
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
      { componentId: 'letter-contact', options: { showFields: ['email', 'phone'] } },
    ],
    headerAccepts: ['letter-header'],
  },

  css: (opts) => {
    const position = (opts['sidebar.position'] as string | undefined) ?? 'left';
    const columns = position === 'right' ? '1fr 70mm' : '70mm 1fr';
    const sidebarOrder = position === 'right' ? 'order: 2;' : '';
    const mainOrder = position === 'right' ? 'order: 1;' : '';

    return `
.cv-page {
  display: grid;
  grid-template-columns: ${columns};
}
.cv-slot-sidebar {
  background: var(--cv-sidebar-bg);
  padding: 10mm 10mm 14mm;
  display: flex;
  flex-direction: column;
  gap: var(--cv-spacing-gap);
  ${sidebarOrder}
}
.cv-slot-main {
  padding: 14mm 12mm;
  display: flex;
  flex-direction: column;
  gap: var(--cv-spacing-gap);
  ${mainOrder}
}`;
  },
});
