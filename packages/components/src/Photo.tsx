import type { ComponentRenderProps } from '@cv/layout-engine';
import { optStr } from './optionUtils.js';

/**
 *
 * @param root0
 * @returns React element displaying the photo, or null if no image
 */
export function Photo({ resume, options }: ComponentRenderProps) {
  const shape = optStr(options, 'shape', 'circle');
  const size = optStr(options, 'size', 'md');

  if (!resume.basics.image) return null;

  return (
    <img
      className={`cv-photo cv-photo--${shape} cv-photo--${size}`}
      src={resume.basics.image}
      alt={resume.basics.name}
    />
  );
}
