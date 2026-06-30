import type { ComponentType } from 'react';

/**
 * Props passed to every slot-aware form component.
 * The form uses these to scope its behavior to a specific slot instance.
 */
export interface SlotFormProps {
  /** Which slot this component instance lives in (e.g., 'sidebar', 'main'). */
  slotName: string;
  /** The component ID this form represents (e.g., 'skills-list'). */
  componentId: string;
  /** Per-slot options for this component instance. */
  options: Record<string, unknown>;
}

/**
 * Registry mapping component IDs to their editor form components.
 *
 * Plug-and-play contract: to add a new component's form, call
 * `registerForm('my-component', MyForm)` at app initialization.
 * The SlotTabs editor will automatically pick it up.
 */
const forms = new Map<string, ComponentType<SlotFormProps>>();

export function registerForm(componentId: string, Form: ComponentType<SlotFormProps>): void {
  forms.set(componentId, Form);
}

export function getForm(componentId: string): ComponentType<SlotFormProps> | undefined {
  return forms.get(componentId);
}
