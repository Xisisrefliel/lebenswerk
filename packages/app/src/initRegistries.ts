import { registerAllComponents } from '@cv/components';
import { registerAllDesigns } from '@cv/layouts';
import { registerAllForms } from './features/editor/registerForms.js';

/**
 * Registers all built-in components, designs, and editor forms.
 * Must be called once at app startup before any rendering.
 */
export function initRegistries(): void {
  registerAllComponents();
  registerAllDesigns();
  registerAllForms();
}
