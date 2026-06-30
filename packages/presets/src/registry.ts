import type { Preset } from '@cv/core';
import { classicInternationalPreset } from './classic-international.js';
import { classicPreset } from './classic.js';
import { minimalPreset } from './minimal.js';
import { modernInternationalPreset } from './modern-international.js';
import { modernPreset } from './modern.js';

export const presetRegistry: readonly Preset[] = [
  classicPreset,
  modernPreset,
  minimalPreset,
  classicInternationalPreset,
  modernInternationalPreset,
];

/**
 *
 * @param id
 * @returns The preset matching the given id, or undefined if not found
 */
export function getPreset(id: string): Preset | undefined {
  return presetRegistry.find((p) => p.id === id);
}
