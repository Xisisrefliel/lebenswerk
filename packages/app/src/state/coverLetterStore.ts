import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type CoverLetter,
  type CoverLetterParty,
  sampleCoverLetter,
  type SlotAssignment,
} from '@cv/core';
import { STORAGE_KEYS } from './storageKeys.js';

type Zone = 'header' | 'footer';

interface CoverLetterStore {
  coverLetter: CoverLetter;
  setCoverLetter: (coverLetter: CoverLetter) => void;
  patchCoverLetter: (patch: Partial<CoverLetter>) => void;
  resetCoverLetter: () => void;

  patchRecipient: (patch: Partial<CoverLetterParty>) => void;
  patchSender: (patch: Partial<CoverLetterParty>) => void;

  addParagraph: () => void;
  removeParagraph: (index: number) => void;
  updateParagraph: (index: number, value: string) => void;
  moveParagraph: (from: number, to: number) => void;

  setDin5008Form: (form: 'A' | 'B') => void;

  /** Toggle a component on/off in the header or footer zone. */
  toggleZoneComponent: (zone: Zone, componentId: string, defaults: SlotAssignment[]) => void;
  /** Update options for a component in a zone. */
  updateZoneComponentOptions: (
    zone: Zone,
    componentId: string,
    options: Record<string, unknown>,
    defaults: SlotAssignment[],
  ) => void;
  /** Move a component within a zone. */
  moveZoneComponent: (zone: Zone, from: number, to: number, defaults: SlotAssignment[]) => void;
}

export const useCoverLetterStore = create<CoverLetterStore>()(
  persist(
    (set) => ({
      coverLetter: sampleCoverLetter,
      setCoverLetter: (coverLetter) => set({ coverLetter }),
      patchCoverLetter: (patch) =>
        set((state) => ({ coverLetter: { ...state.coverLetter, ...patch } })),
      resetCoverLetter: () => set({ coverLetter: sampleCoverLetter }),

      patchRecipient: (patch) =>
        set((state) => ({
          coverLetter: {
            ...state.coverLetter,
            recipient: { ...state.coverLetter.recipient, ...patch },
          },
        })),

      patchSender: (patch) =>
        set((state) => ({
          coverLetter: {
            ...state.coverLetter,
            sender: { ...state.coverLetter.sender, ...patch },
          },
        })),

      addParagraph: () =>
        set((state) => ({
          coverLetter: {
            ...state.coverLetter,
            paragraphs: [...state.coverLetter.paragraphs, ''],
          },
        })),

      removeParagraph: (index) =>
        set((state) => ({
          coverLetter: {
            ...state.coverLetter,
            paragraphs: state.coverLetter.paragraphs.filter((_, i) => i !== index),
          },
        })),

      updateParagraph: (index, value) =>
        set((state) => ({
          coverLetter: {
            ...state.coverLetter,
            paragraphs: state.coverLetter.paragraphs.map((p, i) => (i === index ? value : p)),
          },
        })),

      moveParagraph: (from, to) =>
        set((state) => {
          const paragraphs = [...state.coverLetter.paragraphs];
          const [item] = paragraphs.splice(from, 1);
          if (!item && item !== '') return state;
          paragraphs.splice(to, 0, item);
          return { coverLetter: { ...state.coverLetter, paragraphs } };
        }),

      setDin5008Form: (form) =>
        set((state) => ({
          coverLetter: { ...state.coverLetter, din5008Form: form },
        })),

      toggleZoneComponent: (zone, componentId, defaults) =>
        set((state) => {
          const key = zone === 'header' ? 'headerComponentOverrides' : 'footerComponentOverrides';
          const current = state.coverLetter[key] ?? defaults;
          const exists = current.some((a) => a.componentId === componentId);
          const updated = exists
            ? current.filter((a) => a.componentId !== componentId)
            : [...current, { componentId, options: {} }];
          return { coverLetter: { ...state.coverLetter, [key]: updated } };
        }),

      updateZoneComponentOptions: (zone, componentId, options, defaults) =>
        set((state) => {
          const key = zone === 'header' ? 'headerComponentOverrides' : 'footerComponentOverrides';
          const current = state.coverLetter[key] ?? defaults;
          const updated = current.map((a) =>
            a.componentId === componentId ? { ...a, options: { ...a.options, ...options } } : a,
          );
          return { coverLetter: { ...state.coverLetter, [key]: updated } };
        }),

      moveZoneComponent: (zone, from, to, defaults) =>
        set((state) => {
          const key = zone === 'header' ? 'headerComponentOverrides' : 'footerComponentOverrides';
          const current = [...(state.coverLetter[key] ?? defaults)];
          const [item] = current.splice(from, 1);
          if (!item) return state;
          current.splice(to, 0, item);
          return { coverLetter: { ...state.coverLetter, [key]: current } };
        }),
    }),
    {
      name: STORAGE_KEYS.coverLetter,
      version: 1,
    },
  ),
);
