import type { LocalizedString, Preset, UserOverrides } from '@cv/core';
import { emptyOverrides } from '@cv/core';

interface CreatePresetArgs {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  designId: string;
  thumbnail?: string;
  overrides?: Partial<UserOverrides>;
}

/**
 * Factory for creating presets with sensible defaults.
 * Empty overrides are filled automatically — only specify what differs.
 * @param args
 * @returns A fully typed Preset object
 */
export function createPreset(args: CreatePresetArgs): Preset {
  return {
    id: args.id,
    name: args.name,
    description: args.description,
    thumbnail: args.thumbnail ?? '',
    designId: args.designId,
    overrides: { ...emptyOverrides, ...args.overrides },
  };
}
