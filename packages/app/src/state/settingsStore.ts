import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sampleSettings, type SectionId, type Settings } from '@cv/core';
import { STORAGE_KEYS } from './storageKeys.js';

interface SettingsStore {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  patchSettings: (patch: Partial<Settings>) => void;
  setUiLocale: (locale: Settings['uiLocale']) => void;
  setDocumentLocale: (locale: Settings['documentLocale']) => void;
  setSelectedTemplate: (id: string) => void;
  toggleSection: (id: SectionId) => void;
  reorderSections: (order: SectionId[]) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: sampleSettings,
      setSettings: (settings) => set({ settings }),
      patchSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
      setUiLocale: (uiLocale) => set((state) => ({ settings: { ...state.settings, uiLocale } })),
      setDocumentLocale: (documentLocale) =>
        set((state) => ({ settings: { ...state.settings, documentLocale } })),
      setSelectedTemplate: (selectedTemplateId) =>
        set((state) => ({ settings: { ...state.settings, selectedTemplateId } })),
      toggleSection: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            sectionVisibility: {
              ...state.settings.sectionVisibility,
              [id]: !state.settings.sectionVisibility[id],
            },
          },
        })),
      reorderSections: (order) =>
        set((state) => ({ settings: { ...state.settings, sectionOrder: order } })),
      resetSettings: () => set({ settings: sampleSettings }),
    }),
    { name: STORAGE_KEYS.settings },
  ),
);
