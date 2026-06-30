import type { DesignDefinition, ResolvedTokens } from './types.js';

/**
 * Generate CSS custom properties from a design's declarations + resolved tokens.
 * Only emits variables that the design actually declares.
 * @param design
 * @param tokens
 * @returns CSS string with custom properties scoped to .cv-page
 */
export function designTokensToCss(design: DesignDefinition, tokens: ResolvedTokens): string {
  const lines: string[] = [];

  // Colors
  for (const decl of design.colors) {
    const value = tokens.colors[decl.key] ?? decl.default;
    lines.push(`  ${decl.cssVar}: ${value};`);
  }

  // Fonts
  for (const decl of design.fonts) {
    const value = tokens.fonts[decl.key] ?? decl.default;
    lines.push(`  ${decl.cssVar}: ${value};`);
  }
  // If design only has 'body' font, also set heading var for components that use it
  const firstFont = design.fonts[0];
  if (design.fonts.length === 1 && firstFont?.key === 'body') {
    const bodyVal = tokens.fonts['body'] ?? firstFont.default;
    if (!design.fonts.some((f) => f.cssVar === '--cv-font-heading')) {
      lines.push(`  --cv-font-heading: ${bodyVal};`);
    }
  }

  // Spacing
  if (design.spacing) {
    const spacingKey = tokens.spacing;
    const scale = design.spacing.scale[spacingKey] ?? design.spacing.scale[design.spacing.default];
    if (scale) {
      lines.push(`  --cv-spacing-section: ${scale.section};`);
      lines.push(`  --cv-spacing-entry: ${scale.entry};`);
      lines.push(`  --cv-spacing-gap: ${scale.gap};`);
    }
  }

  // Global options with cssVar
  if (design.options) {
    for (const [, decl] of Object.entries(design.options)) {
      if (decl.cssVar) {
        const value = tokens.options[decl.key] ?? decl.default;
        const cssValue =
          typeof value === 'string' || typeof value === 'number' ? String(value) : '';
        lines.push(`  ${decl.cssVar}: ${cssValue};`);
      }
    }
  }

  // Ensure background is always set
  if (!design.colors.some((c) => c.cssVar === '--cv-background')) {
    lines.push('  --cv-background: #ffffff;');
  }

  return `.cv-page {\n${lines.join('\n')}\n}`;
}
