import type { ComponentRenderProps } from '@cv/layout-engine';
import { formatDateRange } from './format.js';
import { getLabel } from './labels.js';
import { optStr } from './optionUtils.js';
import { toHtml } from './renderHtml.js';

/**
 *
 * @param root0
 * @returns React element displaying the projects list, or null if empty
 */
export function ProjectsList({ resume, locale, tokens }: ComponentRenderProps) {
  if (resume.projects.length === 0) return null;

  const timelineStyle = optStr(tokens.options, 'timelineStyle', 'plain');

  const entries = resume.projects.map((p) => (
    <article key={p.id} className="cv-entry">
      <div className="cv-entry-date">{formatDateRange(p.startDate, p.endDate, locale)}</div>
      <div className="cv-entry-head">
        <div className="cv-entry-title">{p.name}</div>
      </div>
      {p.description && (
        <div
          className="cv-entry-summary"
          dangerouslySetInnerHTML={{ __html: toHtml(p.description) }}
        />
      )}
      {p.keywords.length > 0 && (
        <div className="cv-entry-keywords">
          {p.keywords.map((kw) => (
            <span key={kw} className="cv-entry-keyword">
              {kw}
            </span>
          ))}
        </div>
      )}
    </article>
  ));

  return (
    <section className="cv-section cv-main-section">
      <h2
        className={`cv-section-title cv-section-title--${optStr(tokens.options, 'sectionTitleStyle', 'uppercase-spaced')}`}
      >
        {getLabel(locale, 'projects')}
      </h2>
      <div className={`cv-timeline cv-timeline--${timelineStyle}`}>{entries}</div>
    </section>
  );
}
