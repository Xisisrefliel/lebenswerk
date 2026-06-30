import type { ComponentRenderProps } from '@cv/layout-engine';
import { formatFullDate } from './format.js';
import { getLabel } from './labels.js';
import { optStrArray } from './optionUtils.js';

const ALL_FIELDS = ['name', 'label', 'birthDate', 'birthPlace', 'nationality'] as const;

/**
 *
 * @param root0
 * @returns React element displaying personal information
 */
export function PersonalInfo({ resume, locale, options }: ComponentRenderProps) {
  const showFields = optStrArray(options, 'showFields', [...ALL_FIELDS]);
  const { basics } = resume;

  const showName = showFields.includes('name');
  const showLabel = showFields.includes('label');
  const kvFields = showFields.filter((f) => f !== 'name' && f !== 'label');

  return (
    <section className="cv-section">
      {showName && <h1 className="cv-name">{basics.name}</h1>}
      {showLabel && basics.label && <p className="cv-role">{basics.label}</p>}
      {kvFields.length > 0 && (
        <>
          {!showName && (
            <h2 className="cv-section-title cv-section-title--uppercase-spaced">
              {getLabel(locale, 'personal')}
            </h2>
          )}
          <dl className="cv-kv">
            {kvFields.includes('birthDate') && basics.birthDate && (
              <>
                <dt>{getLabel(locale, 'birthDate')}</dt>
                <dd>{formatFullDate(basics.birthDate, locale)}</dd>
              </>
            )}
            {kvFields.includes('birthPlace') && basics.birthPlace && (
              <>
                <dt>{getLabel(locale, 'birthPlace')}</dt>
                <dd>{basics.birthPlace}</dd>
              </>
            )}
            {kvFields.includes('nationality') && basics.nationality && (
              <>
                <dt>{getLabel(locale, 'nationality')}</dt>
                <dd>{basics.nationality}</dd>
              </>
            )}
          </dl>
        </>
      )}
    </section>
  );
}
