import type { ComponentRenderProps } from '@cv/layout-engine';
import { formatDateRange } from './format.js';
import { getLabel } from './labels.js';
import { optStr } from './optionUtils.js';
import { toHtml } from './renderHtml.js';

/**
 *
 * @param root0
 * @returns React element displaying the education list, or null if empty
 */
export function EducationList({ resume, locale, tokens }: ComponentRenderProps) {
  if (resume.education.length === 0) return null;

  const timelineStyle = optStr(tokens.options, 'timelineStyle', 'plain');

  const entries = resume.education.map((e) => (
    <article key={e.id} className="cv-entry">
      <div className="cv-entry-date">{formatDateRange(e.startDate, e.endDate, locale)}</div>
      <div className="cv-entry-head">
        <div className="cv-entry-title">
          {e.studyType ? `${e.studyType} ${e.area ?? ''}`.trim() : (e.area ?? '')}
        </div>
        <div className="cv-entry-org">
          {e.institution}
          {e.score ? ` · ${e.score}` : ''}
        </div>
      </div>
      {e.description && (
        <div
          className="cv-entry-summary"
          dangerouslySetInnerHTML={{ __html: toHtml(e.description) }}
        />
      )}
    </article>
  ));

  return (
    <section className="cv-section cv-main-section">
      <h2
        className={`cv-section-title cv-section-title--${optStr(tokens.options, 'sectionTitleStyle', 'uppercase-spaced')}`}
      >
        {getLabel(locale, 'education')}
      </h2>
      <div className={`cv-timeline cv-timeline--${timelineStyle}`}>{entries}</div>
    </section>
  );
}
