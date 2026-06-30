import type { ComponentRenderProps } from '@cv/layout-engine';
import { getLabel } from './labels.js';
import { optStr } from './optionUtils.js';
import { toHtml } from './renderHtml.js';

/**
 *
 * @param root0
 * @returns React element displaying the summary section, or null if empty
 */
export function Summary({ resume, locale, tokens }: ComponentRenderProps) {
  if (!resume.basics.summary) return null;

  return (
    <section className="cv-section cv-main-section">
      <h2
        className={`cv-section-title cv-section-title--${optStr(tokens.options, 'sectionTitleStyle', 'uppercase-spaced')}`}
      >
        {getLabel(locale, 'summary')}
      </h2>
      <div
        className="cv-summary"
        dangerouslySetInnerHTML={{ __html: toHtml(resume.basics.summary) }}
      />
    </section>
  );
}
