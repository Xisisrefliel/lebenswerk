import type { DesignDefinition, ResolvedTokens } from './types.js';
import type { SlotAssignment } from '@cv/core';

/**
 * User overrides — sparse key-value map of customizations.
 * Missing keys fall back to the design's declared defaults.
 */
export interface UserOverrides {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing?: string | undefined;
  options: Record<string, unknown>;
  slotOptions: Record<string, unknown>;
  slotAssignments: Record<string, SlotAssignment[]>;
}

export const emptyOverrides: UserOverrides = {
  colors: {},
  fonts: {},
  options: {},
  slotOptions: {},
  slotAssignments: {},
};

/**
 * Resolve the full token set by merging design defaults with user overrides.
 * @param design
 * @param overrides
 * @returns The fully resolved design tokens
 */
export function resolveTokens(design: DesignDefinition, overrides: UserOverrides): ResolvedTokens {
  const colors: Record<string, string> = {};
  for (const decl of design.colors) {
    colors[decl.key] = overrides.colors[decl.key] ?? decl.default;
  }

  const fonts: Record<string, string> = {};
  for (const decl of design.fonts) {
    fonts[decl.key] = overrides.fonts[decl.key] ?? decl.default;
  }

  const spacing = overrides.spacing ?? design.spacing?.default ?? 'normal';

  const options: Record<string, unknown> = {};
  if (design.options) {
    for (const [key, decl] of Object.entries(design.options)) {
      options[key] = overrides.options[key] ?? decl.default;
    }
  }

  return {
    colors,
    fonts,
    spacing,
    options,
  };
}

/**
 * Resolve slot assignments: user overrides take precedence, fall back to design defaults.
 * @param design
 * @param overrides
 * @returns Record mapping slot names to their resolved component assignments
 */
export function resolveSlotAssignments(
  design: DesignDefinition,
  overrides: UserOverrides,
): Record<string, SlotAssignment[]> {
  const result: Record<string, SlotAssignment[]> = {};
  for (const [slotName, slotDef] of Object.entries(design.slots)) {
    result[slotName] = overrides.slotAssignments[slotName] ?? slotDef.defaultComponents;
  }
  return result;
}

/**
 * Resolve all slot options into a flat map keyed as "slotName.optionKey".
 * @param design
 * @param overrides
 * @returns Flat map of resolved slot options keyed as "slotName.optionKey"
 */
export function resolveAllSlotOptions(
  design: DesignDefinition,
  overrides: UserOverrides,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [slotName, slotDef] of Object.entries(design.slots)) {
    if (!slotDef.options) continue;
    for (const [optionKey, decl] of Object.entries(slotDef.options)) {
      const key = `${slotName}.${optionKey}`;
      result[key] = overrides.slotOptions[key] ?? decl.default;
    }
  }
  return result;
}

/**
 * Helper to create a type-checked DesignDefinition with good DX.
 * @param def
 * @returns The same design definition, for type-checking purposes
 */
export function defineDesign(def: DesignDefinition): DesignDefinition {
  return def;
}
