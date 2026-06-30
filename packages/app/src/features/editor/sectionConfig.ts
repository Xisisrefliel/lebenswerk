import type { SectionId } from '@cv/core';
import type { TFunction } from 'i18next';

export interface SectionConfig {
  id: SectionId;
  componentIds: string[];
  titleKey: string;
  isList: boolean;
  summarize?: (item: Record<string, unknown>, t: TFunction) => string;
}

function joinParts(...parts: unknown[]): string {
  return parts.filter((p) => typeof p === 'string' && p.length > 0).join(' \u00b7 ');
}

function dateRange(start: unknown, end: unknown): string {
  const parts = [start, end].filter((d) => typeof d === 'string' && d.length > 0);
  return parts.join(' \u2013 ');
}

export const SECTION_CONFIGS: readonly SectionConfig[] = [
  {
    id: 'personal',
    componentIds: ['photo', 'personal-info', 'contact-info'],
    titleKey: 'sections.personal',
    isList: false,
  },
  {
    id: 'summary',
    componentIds: ['summary'],
    titleKey: 'sections.summary',
    isList: false,
  },
  {
    id: 'experience',
    componentIds: ['experience-list'],
    titleKey: 'sections.experience',
    isList: true,
    summarize: (item) =>
      joinParts(item.position, item.name, dateRange(item.startDate, item.endDate)),
  },
  {
    id: 'education',
    componentIds: ['education-list'],
    titleKey: 'sections.education',
    isList: true,
    summarize: (item) =>
      joinParts(item.studyType, item.institution, dateRange(item.startDate, item.endDate)),
  },
  {
    id: 'skills',
    componentIds: ['skills-list'],
    titleKey: 'sections.skills',
    isList: true,
    summarize: (item) => (item.name as string) || '',
  },
  {
    id: 'languages',
    componentIds: ['languages-list'],
    titleKey: 'sections.languages',
    isList: true,
    summarize: (item, t) => {
      const lang = (item.language as string) || '';
      const fluency = item.fluency
        ? t(`languages.fluency_${item.fluency as string}`, { defaultValue: item.fluency as string })
        : '';
      return joinParts(lang, fluency);
    },
  },
  {
    id: 'projects',
    componentIds: ['projects-list'],
    titleKey: 'sections.projects',
    isList: true,
    summarize: (item) => (item.name as string) || '',
  },
  {
    id: 'certificates',
    componentIds: ['certificates-list'],
    titleKey: 'sections.certificates',
    isList: true,
    summarize: (item) => joinParts(item.name, item.issuer),
  },
  {
    id: 'interests',
    componentIds: ['interests-list'],
    titleKey: 'sections.interests',
    isList: true,
    summarize: (item) => (item.name as string) || '',
  },
];

export const SECTION_BY_ID = new Map(SECTION_CONFIGS.map((s) => [s.id, s]));

export const COMPONENT_TO_SECTION = new Map<string, SectionId>(
  SECTION_CONFIGS.flatMap((s) => s.componentIds.map((c) => [c, s.id] as const)),
);
