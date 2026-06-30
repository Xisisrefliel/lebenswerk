import type { SlotAssignment } from '@cv/core';
import type { DesignDefinition, DocumentType, ResolvedTokens } from '@cv/layout-engine';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  emptyOverrides,
  getDesign,
  resolveAllSlotOptions,
  resolveSlotAssignments,
  resolveTokens,
  type UserOverrides,
} from '@cv/layout-engine';
import { STORAGE_KEYS } from './storageKeys.js';

interface DesignStore {
  /** ID of the active design. */
  activeDesignId: string;
  /** User customizations on top of the design's defaults. */
  overrides: UserOverrides;
  /** Which document type tab is active in the preview. */
  activeDocumentType: DocumentType;

  // --- Actions ---

  /** Switch to a different design, resetting all overrides to defaults. */
  applyDesign: (designId: string) => void;
  /** Apply overrides from a preset (design + overrides bundle). */
  applyPresetOverrides: (designId: string, overrides: UserOverrides) => void;

  /** Set a color override. */
  setColor: (key: string, value: string) => void;
  /** Set a font override. */
  setFont: (key: string, value: string) => void;
  /** Set the spacing override. */
  setSpacing: (value: string) => void;
  /** Set a global design option override. */
  setOption: (key: string, value: unknown) => void;
  /** Set a slot-level option override. */
  setSlotOption: (slotName: string, optionKey: string, value: unknown) => void;

  /** Replace slot assignments for a specific slot. */
  setSlotAssignments: (slotName: string, assignments: SlotAssignment[]) => void;
  /** Move a component within a slot. */
  moveComponent: (slotName: string, fromIndex: number, toIndex: number) => void;
  /** Toggle a component on/off in a slot. */
  toggleComponent: (slotName: string, componentId: string) => void;
  /** Update options for a component in a slot. */
  updateComponentOptions: (
    slotName: string,
    componentId: string,
    options: Record<string, unknown>,
  ) => void;

  /** Set the active document type tab. */
  setActiveDocumentType: (type: DocumentType) => void;
}

export const useDesignStore = create<DesignStore>()(
  persist(
    (set) => ({
      activeDesignId: 'sidebar-left',
      overrides: { ...emptyOverrides },
      activeDocumentType: 'lebenslauf',

      applyDesign: (designId) =>
        set({ activeDesignId: designId, overrides: { ...emptyOverrides } }),

      applyPresetOverrides: (designId, overrides) => set({ activeDesignId: designId, overrides }),

      setColor: (key, value) =>
        set((s) => ({
          overrides: { ...s.overrides, colors: { ...s.overrides.colors, [key]: value } },
        })),

      setFont: (key, value) =>
        set((s) => ({
          overrides: { ...s.overrides, fonts: { ...s.overrides.fonts, [key]: value } },
        })),

      setSpacing: (value) => set((s) => ({ overrides: { ...s.overrides, spacing: value } })),

      setOption: (key, value) =>
        set((s) => ({
          overrides: { ...s.overrides, options: { ...s.overrides.options, [key]: value } },
        })),

      setSlotOption: (slotName, optionKey, value) =>
        set((s) => ({
          overrides: {
            ...s.overrides,
            slotOptions: { ...s.overrides.slotOptions, [`${slotName}.${optionKey}`]: value },
          },
        })),

      setSlotAssignments: (slotName, assignments) =>
        set((s) => ({
          overrides: {
            ...s.overrides,
            slotAssignments: { ...s.overrides.slotAssignments, [slotName]: assignments },
          },
        })),

      moveComponent: (slotName, fromIndex, toIndex) =>
        set((s) => {
          const design = getDesign(s.activeDesignId);
          const defaults = design?.slots[slotName]?.defaultComponents ?? [];
          const current = [...(s.overrides.slotAssignments[slotName] ?? defaults)];
          const [item] = current.splice(fromIndex, 1);
          if (!item) return s;
          current.splice(toIndex, 0, item);
          return {
            overrides: {
              ...s.overrides,
              slotAssignments: { ...s.overrides.slotAssignments, [slotName]: current },
            },
          };
        }),

      toggleComponent: (slotName, componentId) =>
        set((s) => {
          const design = getDesign(s.activeDesignId);
          const defaults = design?.slots[slotName]?.defaultComponents ?? [];
          const current = s.overrides.slotAssignments[slotName] ?? defaults;
          const exists = current.some((a) => a.componentId === componentId);
          const updated = exists
            ? current.filter((a) => a.componentId !== componentId)
            : [...current, { componentId, options: {} }];
          return {
            overrides: {
              ...s.overrides,
              slotAssignments: { ...s.overrides.slotAssignments, [slotName]: updated },
            },
          };
        }),

      updateComponentOptions: (slotName, componentId, options) =>
        set((s) => {
          const design = getDesign(s.activeDesignId);
          const defaults = design?.slots[slotName]?.defaultComponents ?? [];
          const current = s.overrides.slotAssignments[slotName] ?? defaults;
          const updated = current.map((a) =>
            a.componentId === componentId ? { ...a, options: { ...a.options, ...options } } : a,
          );
          return {
            overrides: {
              ...s.overrides,
              slotAssignments: { ...s.overrides.slotAssignments, [slotName]: updated },
            },
          };
        }),

      setActiveDocumentType: (type) => set({ activeDocumentType: type }),
    }),
    { name: STORAGE_KEYS.settings + '-design' },
  ),
);

// ---------------------------------------------------------------------------
// Derived selectors — compute resolved values from design + overrides
// ---------------------------------------------------------------------------

/** Get the active DesignDefinition. */
export function useActiveDesign(): DesignDefinition | undefined {
  const id = useDesignStore((s) => s.activeDesignId);
  return getDesign(id);
}

/** Get resolved tokens (design defaults merged with user overrides). */
export function useResolvedTokens(): ResolvedTokens | undefined {
  const design = useActiveDesign();
  const overrides = useDesignStore((s) => s.overrides);
  if (!design) return undefined;
  return resolveTokens(design, overrides);
}

/** Get resolved slot assignments. */
export function useResolvedSlotAssignments(): Record<string, SlotAssignment[]> {
  const design = useActiveDesign();
  const overrides = useDesignStore((s) => s.overrides);
  if (!design) return {};
  return resolveSlotAssignments(design, overrides);
}

/** Get resolved slot options as flat map. */
export function useResolvedSlotOptions(): Record<string, unknown> {
  const design = useActiveDesign();
  const overrides = useDesignStore((s) => s.overrides);
  if (!design) return {};
  return resolveAllSlotOptions(design, overrides);
}
