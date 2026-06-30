import { registerDesign } from '@cv/layout-engine';
import { fullWidthDesign } from './full-width/design.js';
import { sidebarLeftDesign } from './sidebar-left/design.js';
import { topHeaderDesign } from './top-header/design.js';

export const designDefinitions = [sidebarLeftDesign, fullWidthDesign, topHeaderDesign] as const;

/**
 *
 */
export function registerAllDesigns(): void {
  for (const def of designDefinitions) {
    registerDesign(def);
  }
}
