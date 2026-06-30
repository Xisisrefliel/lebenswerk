import type { PaperSize } from '@cv/core';

/**
 *
 */
export interface PaperDimensions {
  widthMm: number;
  heightMm: number;
  cssSize: string;
}

export const PAPER_DIMENSIONS: Record<PaperSize, PaperDimensions> = {
  A4: { widthMm: 210, heightMm: 297, cssSize: 'A4' },
  Letter: { widthMm: 215.9, heightMm: 279.4, cssSize: 'letter' },
};

/**
 *
 * @param size
 * @returns The paper dimensions including width, height, and CSS size name
 */
export function paperDimensions(size: PaperSize): PaperDimensions {
  return PAPER_DIMENSIONS[size];
}
