import type { DesignDefinition } from './types.js';

/**
 * Validates a DesignDefinition at registration time.
 * Throws on hard errors (missing id, duplicate keys).
 * Warns on soft issues (unknown component IDs — may be registered later).
 * @param def
 * @param componentLookup Optional function to check if a component exists.
 *   When omitted, component-existence warnings are skipped.
 */
export function validateDesign(
  def: DesignDefinition,
  componentLookup?: (id: string) => unknown,
): void {
  // Hard: id must be non-empty
  if (!def.id) {
    throw new Error('DesignDefinition must have a non-empty id.');
  }

  // Hard: documentTypes must be non-empty
  if (def.documentTypes.length === 0) {
    throw new Error(`Design "${def.id}": documentTypes must be non-empty.`);
  }

  // Hard: supportedLocales must be non-empty
  if (def.supportedLocales.length === 0) {
    throw new Error(`Design "${def.id}": supportedLocales must be non-empty.`);
  }

  // Hard: unique color keys and cssVars
  const colorKeys = new Set<string>();
  const colorCssVars = new Set<string>();
  for (const decl of def.colors) {
    if (colorKeys.has(decl.key)) {
      throw new Error(`Design "${def.id}": duplicate color key "${decl.key}".`);
    }
    colorKeys.add(decl.key);
    if (colorCssVars.has(decl.cssVar)) {
      throw new Error(`Design "${def.id}": duplicate color cssVar "${decl.cssVar}".`);
    }
    colorCssVars.add(decl.cssVar);
  }

  // Hard: unique font keys and cssVars
  const fontKeys = new Set<string>();
  const fontCssVars = new Set<string>();
  for (const decl of def.fonts) {
    if (fontKeys.has(decl.key)) {
      throw new Error(`Design "${def.id}": duplicate font key "${decl.key}".`);
    }
    fontKeys.add(decl.key);
    if (fontCssVars.has(decl.cssVar)) {
      throw new Error(`Design "${def.id}": duplicate font cssVar "${decl.cssVar}".`);
    }
    fontCssVars.add(decl.cssVar);
  }

  // Soft: warn about unknown component IDs in defaultComponents
  if (componentLookup) {
    for (const [slotName, slotDef] of Object.entries(def.slots)) {
      for (const assignment of slotDef.defaultComponents) {
        if (!componentLookup(assignment.componentId)) {
          console.warn(
            `Design "${def.id}", slot "${slotName}": component "${assignment.componentId}" is not registered. It may be registered later.`,
          );
        }
      }
    }
  }
}
