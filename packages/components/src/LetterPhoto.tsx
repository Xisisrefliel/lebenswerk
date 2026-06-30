import type { ComponentRenderProps } from '@cv/layout-engine';
import { optStr } from './optionUtils.js';

/**
 * Compact photo for DIN 5008 letter header/footer.
 * Reads image from component options — independent of resume data.
 * @param root0
 * @returns React element displaying the letter photo, or null if no image
 */
export function LetterPhoto({ options }: ComponentRenderProps) {
  const shape = optStr(options, 'shape', 'circle');
  const image = optStr(options, 'image', '');
  const name = optStr(options, 'name', '');

  if (!image) return null;

  return <img className={`cv-lh-photo cv-lh-photo--${shape}`} src={image} alt={name} />;
}
