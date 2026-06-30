import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Resume, sampleResume } from '@cv/core';
import { STORAGE_KEYS } from './storageKeys.js';

interface ResumeStore {
  resume: Resume;
  setResume: (resume: Resume) => void;
  patchResume: (patch: Partial<Resume>) => void;
  resetResume: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: sampleResume,
      setResume: (resume) => set({ resume }),
      patchResume: (patch) => set((state) => ({ resume: { ...state.resume, ...patch } })),
      resetResume: () => set({ resume: sampleResume }),
    }),
    { name: STORAGE_KEYS.resume },
  ),
);
