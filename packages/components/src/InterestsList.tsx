import type { ComponentRenderProps } from '@cv/layout-engine';
import { getLabel } from './labels.js';
import { optStr } from './optionUtils.js';

/**
 *
 * @param root0
 * @returns React element displaying the interests list, or null if empty
 */
export function InterestsList({ resume, locale, tokens, options }: ComponentRenderProps) {
  const layout = optStr(options, 'layout', 'list');

  if (resume.interests.length === 0) return null;

  return (
    <section className="cv-section">
      <h2
        className={`cv-section-title cv-section-title--${optStr(tokens.options, 'sectionTitleStyle', 'uppercase-spaced')}`}
      >
        {getLabel(locale, 'interests')}
      </h2>
      {layout === 'tags' ? (
        <div className="cv-tags">
          {resume.interests.map((i) => (
            <span key={i.id} className="cv-tag">
              {i.name}
            </span>
          ))}
        </div>
      ) : (
        <p>{resume.interests.map((i) => i.name).join(' · ')}</p>
      )}
    </section>
  );
}
