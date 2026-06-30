import type { CoverLetter, Resume, Settings } from '@cv/core';
import { useCoverLetterStore } from './coverLetterStore.js';
import { useDesignStore } from './designStore.js';
import { useResumeStore } from './resumeStore.js';
import { useSettingsStore } from './settingsStore.js';

const EMPTY_RESUME: Resume = {
  basics: { name: '', profiles: [] },
  work: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certificates: [],
  publications: [],
  awards: [],
  volunteer: [],
  interests: [],
  references: [],
  custom: [],
};

const EMPTY_COVER_LETTER: CoverLetter = {
  sender: { name: '' },
  recipient: { name: '' },
  subject: '',
  reference: '',
  salutation: '',
  paragraphs: [],
  closing: '',
  din5008Form: 'B',
  showFoldMarks: true,
  showSenderInfo: true,
};

const DEFAULT_SECTION_ORDER: Settings['sectionOrder'] = [
  'personal',
  'summary',
  'experience',
  'education',
  'skills',
  'languages',
  'projects',
  'certificates',
  'interests',
];

const ALL_SECTIONS_HIDDEN: Settings['sectionVisibility'] = {
  personal: false,
  summary: false,
  experience: false,
  education: false,
  skills: false,
  languages: false,
  projects: false,
  certificates: false,
  publications: false,
  awards: false,
  volunteer: false,
  interests: false,
  references: false,
  custom: false,
};

export function clearAllStores(): void {
  useResumeStore.getState().setResume(EMPTY_RESUME);
  useCoverLetterStore.getState().setCoverLetter(EMPTY_COVER_LETTER);
  useDesignStore.getState().applyDesign('sidebar-left');
  useSettingsStore.getState().setSettings({
    uiLocale: useSettingsStore.getState().settings.uiLocale,
    documentLocale: 'de',
    selectedTemplateId: 'classic-de',
    templateOptions: {},
    sectionOrder: DEFAULT_SECTION_ORDER,
    sectionVisibility: ALL_SECTIONS_HIDDEN,
    paperSize: 'A4',
  });
}
