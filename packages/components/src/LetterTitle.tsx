import type { ComponentRenderProps } from '@cv/layout-engine';
import { optStr } from './optionUtils.js';

/**
 * Compact name + job title block for DIN 5008 letter header.
 * Reads from component options — independent of resume data.
 * @param root0
 * @returns React element displaying the letter title block, or null if no name
 */
export function LetterTitle({ options }: ComponentRenderProps) {
  const name = optStr(options, 'name', '');
  const label = optStr(options, 'label', '');

  if (!name) return null;

  return (
    <div className="cv-lh-title">
      <span className="cv-lh-title-name">{name}</span>
      {label && <span className="cv-lh-title-label">{label}</span>}
    </div>
  );
}
