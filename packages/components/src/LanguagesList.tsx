import type { LabelKey } from './labels.js';
import type { ComponentRenderProps } from '@cv/layout-engine';
import { getLabel } from './labels.js';
import { optStr } from './optionUtils.js';

/**
 *
 * @param root0
 * @returns React element displaying the languages list, or null if empty
 */
export function LanguagesList({ resume, locale, tokens }: ComponentRenderProps) {
  if (resume.languages.length === 0) return null;

  return (
    <section className="cv-section">
      <h2
        className={`cv-section-title cv-section-title--${optStr(tokens.options, 'sectionTitleStyle', 'uppercase-spaced')}`}
      >
        {getLabel(locale, 'languages')}
      </h2>
      <dl className="cv-kv cv-kv--skill">
        {resume.languages.map((l) => (
          <div key={l.id} style={{ display: 'contents' }}>
            <dt>{l.language}:</dt>
            <dd>{l.fluency ? getLabel(locale, `fluency_${l.fluency}` as LabelKey) : ''}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
