import { useCallback, useMemo } from 'react';
import { useCoverLetterStore } from '../../state/coverLetterStore.js';
import {
  useActiveDesign,
  useDesignStore,
  useResolvedSlotAssignments,
} from '../../state/designStore.js';

/**
 * Reads and writes a specific option for a component in a specific slot.
 *
 * For regular CV slots: uses the design store (resolved slot assignments).
 * For anschreiben zones (slot name starts with 'anschreiben-'): uses the
 * cover letter store, falling back to design's anschreibenConfig defaults.
 */
export function useSlotComponentOption(
  slotName: string,
  componentId: string,
  optionKey: string,
  defaultValue: string,
) {
  const isAnschreibenZone = slotName.startsWith('anschreiben-');

  // CV slot path
  const updateComponentOptions = useDesignStore((s) => s.updateComponentOptions);
  const allAssignments = useResolvedSlotAssignments();

  // Anschreiben zone path
  const cl = useCoverLetterStore((s) => s.coverLetter);
  const updateZoneComponentOptions = useCoverLetterStore((s) => s.updateZoneComponentOptions);
  const design = useActiveDesign();

  // Anschreiben zone path (computed unconditionally to satisfy rules-of-hooks)
  const zone = slotName === 'anschreiben-header' ? ('header' as const) : ('footer' as const);
  const overrideKey =
    zone === 'header' ? 'headerComponentOverrides' : ('footerComponentOverrides' as const);
  const configKey = zone === 'header' ? 'headerComponents' : ('footerComponents' as const);
  const rawAnschreibenDefaults = design?.anschreibenConfig?.[configKey];
  const anschreibenDefaults = useMemo(() => rawAnschreibenDefaults ?? [], [rawAnschreibenDefaults]);
  const anschreibenAssignments = cl[overrideKey] ?? anschreibenDefaults;
  const anschreibenMatch = anschreibenAssignments.find((a) => a.componentId === componentId);
  const anschreibenValue =
    (anschreibenMatch?.options[optionKey] as string | undefined) ?? defaultValue;

  const setAnschreibenValue = useCallback(
    (newValue: string) => {
      updateZoneComponentOptions(zone, componentId, { [optionKey]: newValue }, anschreibenDefaults);
    },
    [zone, componentId, optionKey, updateZoneComponentOptions, anschreibenDefaults],
  );

  // Regular CV slot path
  const cvAssignments = allAssignments[slotName] ?? [];
  const cvMatch = cvAssignments.find((a) => a.componentId === componentId);
  const cvValue = (cvMatch?.options[optionKey] as string | undefined) ?? defaultValue;

  const setCvValue = useCallback(
    (newValue: string) => {
      updateComponentOptions(slotName, componentId, { [optionKey]: newValue });
    },
    [slotName, componentId, optionKey, updateComponentOptions],
  );

  if (isAnschreibenZone) {
    return [anschreibenValue, setAnschreibenValue] as const;
  }

  return [cvValue, setCvValue] as const;
}
