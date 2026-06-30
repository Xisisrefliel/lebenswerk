import { useCallback, useMemo } from 'react';
import { useCoverLetterStore } from '../../state/coverLetterStore.js';
import { useActiveDesign } from '../../state/designStore.js';

/**
 * Reads and writes the full options object for a letter component in a
 * header/footer zone. Unlike useSlotComponentOption (single key, string only),
 * this supports any value type — needed for arrays (profiles) and complex data.
 */
export function useZoneComponentOptions(
  slotName: string,
  componentId: string,
): [Record<string, unknown>, (patch: Record<string, unknown>) => void] {
  const zone = slotName === 'anschreiben-header' ? ('header' as const) : ('footer' as const);
  const overrideKey =
    zone === 'header' ? 'headerComponentOverrides' : ('footerComponentOverrides' as const);
  const configKey = zone === 'header' ? 'headerComponents' : ('footerComponents' as const);

  const cl = useCoverLetterStore((s) => s.coverLetter);
  const updateZoneComponentOptions = useCoverLetterStore((s) => s.updateZoneComponentOptions);
  const design = useActiveDesign();

  const rawDefaults = design?.anschreibenConfig?.[configKey];
  const defaults = useMemo(() => rawDefaults ?? [], [rawDefaults]);
  const assignments = cl[overrideKey] ?? defaults;
  const match = assignments.find((a) => a.componentId === componentId);
  const options = match?.options ?? {};

  const patchOptions = useCallback(
    (patch: Record<string, unknown>) => {
      updateZoneComponentOptions(zone, componentId, patch, defaults);
    },
    [zone, componentId, updateZoneComponentOptions, defaults],
  );

  return [options, patchOptions];
}
