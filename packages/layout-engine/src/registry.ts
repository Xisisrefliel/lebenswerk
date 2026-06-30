import type { ComponentDefinition, DesignDefinition } from './types.js';
import { validateDesign } from './validateDesign.js';

// ---------------------------------------------------------------------------
// Component registry
// ---------------------------------------------------------------------------

const components = new Map<string, ComponentDefinition>();

/**
 *
 * @param def
 * @returns void
 */
export function registerComponent(def: ComponentDefinition): void {
  components.set(def.id, def);
}

/**
 *
 * @param id
 * @returns The component definition, or undefined if not found
 */
export function getComponent(id: string): ComponentDefinition | undefined {
  return components.get(id);
}

/**
 *
 * @returns Array of all registered component definitions
 */
export function getAllComponents(): ComponentDefinition[] {
  return [...components.values()];
}

// ---------------------------------------------------------------------------
// Design registry
// ---------------------------------------------------------------------------

const designs = new Map<string, DesignDefinition>();

/**
 *
 * @param def
 * @returns void
 */
export function registerDesign(def: DesignDefinition): void {
  validateDesign(def, (id) => components.get(id));
  if (designs.has(def.id)) {
    throw new Error(`Design "${def.id}" is already registered.`);
  }
  designs.set(def.id, def);
}

/**
 *
 * @param id
 * @returns The design definition, or undefined if not found
 */
export function getDesign(id: string): DesignDefinition | undefined {
  return designs.get(id);
}

/**
 *
 * @returns Array of all registered design definitions
 */
export function getAllDesigns(): DesignDefinition[] {
  return [...designs.values()];
}
