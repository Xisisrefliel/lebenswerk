import type { ComponentRenderProps } from '@cv/layout-engine';
import { formatIsoDate } from './format.js';
import { getLabel } from './labels.js';
import { optStr } from './optionUtils.js';

/**
 *
 * @param root0
 * @returns React element displaying the certificates list, or null if empty
 */
export function CertificatesList({ resume, locale, tokens, slot }: ComponentRenderProps) {
  if (resume.certificates.length === 0) return null;

  const isMain = slot === 'main';
  const sectionCls = isMain ? 'cv-section cv-main-section' : 'cv-section';

  return (
    <section className={sectionCls}>
      <h2
        className={`cv-section-title cv-section-title--${optStr(tokens.options, 'sectionTitleStyle', 'uppercase-spaced')}`}
      >
        {getLabel(locale, 'certificates')}
      </h2>
      {isMain ? (
        resume.certificates.map((c) => (
          <article key={c.id} className="cv-entry">
            <div className="cv-entry-date">{formatIsoDate(c.date, locale)}</div>
            <div className="cv-entry-head">
              <div className="cv-entry-title">{c.name}</div>
              {c.issuer && <div className="cv-entry-org">{c.issuer}</div>}
            </div>
          </article>
        ))
      ) : (
        <div className="cv-cert-sidebar">
          {resume.certificates.map((c) => (
            <div key={c.id} className="cv-cert-sidebar-item">
              <div className="cv-cert-sidebar-name">{c.name}</div>
              <div className="cv-cert-sidebar-meta">
                {c.issuer && <span>{c.issuer}</span>}
                {c.issuer && c.date && <span> · </span>}
                {c.date && <span>{formatIsoDate(c.date, locale)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
