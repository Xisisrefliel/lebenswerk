import { CURRENT_SCHEMA_VERSION, deserialize, type PersistedState, serialize } from '@cv/core';
import { useCoverLetterStore } from '../../state/coverLetterStore.js';
import { useDesignStore } from '../../state/designStore.js';
import { useResumeStore } from '../../state/resumeStore.js';
import { useSettingsStore } from '../../state/settingsStore.js';

export function exportStateJson(): string {
  const designState = useDesignStore.getState();
  const state: PersistedState = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    resume: useResumeStore.getState().resume,
    coverLetter: useCoverLetterStore.getState().coverLetter,
    settings: useSettingsStore.getState().settings,
    design: {
      activeDesignId: designState.activeDesignId,
      overrides: designState.overrides,
    },
  };
  return serialize(state);
}

export function downloadJson(filename = 'cv.json'): void {
  const json = exportStateJson();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function importJsonFile(file: File): Promise<void> {
  const text = await file.text();
  const state = deserialize(text);
  useResumeStore.getState().setResume(state.resume);
  useCoverLetterStore.getState().setCoverLetter(state.coverLetter);
  useSettingsStore.getState().setSettings(state.settings);
  if (state.design) {
    useDesignStore
      .getState()
      .applyPresetOverrides(state.design.activeDesignId, state.design.overrides);
  }
}
