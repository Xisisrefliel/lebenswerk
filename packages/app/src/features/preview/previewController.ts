/**
 * Minimal module-level registry that lets the PrintButton call into the
 * active PreviewPane's renderer without prop-drilling or a React context.
 * There's only one preview pane in the app, so a singleton is simpler
 * than a provider and still cleans up on unmount.
 */

let activePrint: (() => void) | null = null;

export function registerPreviewPrint(fn: (() => void) | null): void {
  activePrint = fn;
}

export function triggerPreviewPrint(): void {
  if (!activePrint) {
    console.warn('[previewController] print() called with no active preview');
    return;
  }
  activePrint();
}
