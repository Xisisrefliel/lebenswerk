import type { ComponentRenderProps } from '@cv/layout-engine';
import { formatDateRange } from './format.js';
import { getLabel } from './labels.js';
import { optStr } from './optionUtils.js';
import { toHtml } from './renderHtml.js';

/**
 *
 * @param root0
 * @returns React element displaying the work experience list, or null if empty
 */
export function ExperienceList({ resume, locale, tokens }: ComponentRenderProps) {
  if (resume.work.length === 0) return null;

  const timelineStyle = optStr(tokens.options, 'timelineStyle', 'plain');

  const entries = resume.work.map((w) => {
    const endDate = w.currentlyWorking ? undefined : w.endDate;
    return (
      <article key={w.id} className="cv-entry">
        <div className="cv-entry-date">{formatDateRange(w.startDate, endDate, locale)}</div>
        <div className="cv-entry-head">
          <div className="cv-entry-title">{w.position ? w.position : w.name}</div>
          <div className="cv-entry-org">
            {w.position ? w.name : ''}
            {w.location ? (w.position ? ` · ${w.location}` : w.location) : ''}
          </div>
        </div>
        {w.summary && (
          <div
            className="cv-entry-summary"
            dangerouslySetInnerHTML={{ __html: toHtml(w.summary) }}
          />
        )}
      </article>
    );
  });

  return (
    <section className="cv-section cv-main-section">
      <h2
        className={`cv-section-title cv-section-title--${optStr(tokens.options, 'sectionTitleStyle', 'uppercase-spaced')}`}
      >
        {getLabel(locale, 'experience')}
      </h2>
      <div className={`cv-timeline cv-timeline--${timelineStyle}`}>{entries}</div>
    </section>
  );
}
