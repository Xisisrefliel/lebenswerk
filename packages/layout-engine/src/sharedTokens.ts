import type { EnumOptionDeclaration, SpacingDeclaration } from './types.js';

/**
 * Standard font options shared across built-in designs.
 * Designs can use this as-is or declare their own custom font options.
 */
export const STANDARD_FONT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Inter', value: "'Inter', system-ui, sans-serif" },
  { label: 'System UI', value: 'system-ui, sans-serif' },
  { label: 'Georgia', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Roboto', value: "'Roboto', system-ui, sans-serif" },
];

/**
 * Standard spacing scale shared across built-in designs.
 * Individual designs can override the `default` value.
 */
export const STANDARD_SPACING_SCALE: SpacingDeclaration = {
  options: ['compact', 'normal', 'spacious'],
  default: 'normal',
  scale: {
    compact: { section: '3mm', entry: '1.5mm', gap: '4mm' },
    normal: { section: '7mm', entry: '3mm', gap: '7mm' },
    spacious: { section: '10mm', entry: '5mm', gap: '9mm' },
  },
};

/** All section title style values available across layouts. */
export const SECTION_TITLE_STYLE_VALUES: EnumOptionDeclaration['values'] = [
  { value: 'uppercase-spaced', label: { de: 'GROSSBUCHSTABEN', en: 'UPPERCASE' } },
  { value: 'normal', label: { de: 'Normal', en: 'Normal' } },
  { value: 'accent-bar', label: { de: 'Akzent-Balken', en: 'Accent bar' } },
  { value: 'accent-underline', label: { de: 'Akzent-Unterstrich', en: 'Accent underline' } },
];

/** All timeline style values available across layouts. */
export const TIMELINE_STYLE_VALUES: EnumOptionDeclaration['values'] = [
  { value: 'plain', label: { de: 'Schlicht', en: 'Plain' } },
  { value: 'line', label: { de: 'Linie & Punkte', en: 'Line & dots' } },
  { value: 'accent', label: { de: 'Akzentlinie', en: 'Accent line' } },
];

/** Common color token declarations reused across layouts. */
export const COMMON_COLOR_TOKENS = {
  text: { key: 'text', label: { de: 'Text', en: 'Text' }, default: '#1b1f23', cssVar: '--cv-text' },
  muted: {
    key: 'muted',
    label: { de: 'Gedämpft', en: 'Muted' },
    default: '#55606b',
    cssVar: '--cv-muted',
  },
  border: {
    key: 'border',
    label: { de: 'Rahmen', en: 'Border' },
    default: '#d0d7de',
    cssVar: '--cv-border',
  },
} as const;
