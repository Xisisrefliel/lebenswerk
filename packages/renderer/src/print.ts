/**
 * Triggers the browser's native print dialog. The app's global @media print
 * stylesheet is responsible for hiding editor chrome and showing only the
 * print root.
 *
 * The `data-cv-print-root` attribute marks the element that should be visible
 * in print. Everything else is hidden via CSS.
 */
export function triggerPrint(): void {
  if (typeof window === 'undefined') return;
  window.print();
}

export const PRINT_ROOT_ATTRIBUTE = 'data-cv-print-root';
