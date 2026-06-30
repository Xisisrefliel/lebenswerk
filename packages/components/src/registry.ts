import type { ComponentDefinition } from '@cv/layout-engine';
import { z } from 'zod';
import { registerComponent } from '@cv/layout-engine';
import { CertificatesList } from './CertificatesList.js';
import { ContactInfo } from './ContactInfo.js';
import { CustomSection } from './CustomSection.js';
import { EducationList } from './EducationList.js';
import { ExperienceList } from './ExperienceList.js';
import { InterestsList } from './InterestsList.js';
import { LanguagesList } from './LanguagesList.js';
import { LetterContact } from './LetterContact.js';
import { LetterPhoto } from './LetterPhoto.js';
import { LetterTitle } from './LetterTitle.js';
import { PersonalInfo } from './PersonalInfo.js';
import { Photo } from './Photo.js';
import { ProjectsList } from './ProjectsList.js';
import { SkillsList } from './SkillsList.js';
import { Summary } from './Summary.js';

const componentDefinitions: ComponentDefinition[] = [
  {
    id: 'photo',
    name: { de: 'Foto', en: 'Photo' },
    dataFields: ['basics.image'],
    allowedSlots: ['sidebar', 'header', 'aside', 'banner', 'hero'],
    optionsSchema: z.object({
      shape: z.enum(['square', 'rounded', 'circle']).default('circle'),
      size: z.enum(['sm', 'md', 'lg']).default('md'),
    }),
    defaultOptions: { shape: 'circle', size: 'md' },
    render: Photo,
  },
  {
    id: 'personal-info',
    name: { de: 'Persönliche Daten', en: 'Personal Info' },
    dataFields: [
      'basics.name',
      'basics.label',
      'basics.birthDate',
      'basics.birthPlace',
      'basics.nationality',
    ],
    allowedSlots: ['sidebar', 'header', 'main', 'aside', 'banner', 'hero'],
    optionsSchema: z.object({
      showFields: z
        .array(z.string())
        .default(['name', 'label', 'birthDate', 'birthPlace', 'nationality']),
    }),
    defaultOptions: { showFields: ['name', 'label', 'birthDate', 'birthPlace', 'nationality'] },
    render: PersonalInfo,
  },
  {
    id: 'contact-info',
    name: { de: 'Kontakt', en: 'Contact' },
    dataFields: [
      'basics.email',
      'basics.phone',
      'basics.url',
      'basics.location',
      'basics.profiles',
    ],
    allowedSlots: [
      'sidebar',
      'header',
      'main',
      'aside',
      'banner',
      'hero',
      'footer',
      'footer-left',
      'footer-right',
      'meta',
    ],
    optionsSchema: z.object({
      layout: z.enum(['vertical', 'horizontal']).default('vertical'),
      displayStyle: z.enum(['icons', 'text', 'both']).default('both'),
    }),
    defaultOptions: { layout: 'vertical', displayStyle: 'both' },
    render: ContactInfo,
  },
  {
    id: 'summary',
    name: { de: 'Profil', en: 'Summary' },
    dataFields: ['basics.summary'],
    allowedSlots: ['main', 'header', 'hero'],
    optionsSchema: z.object({}),
    defaultOptions: {},
    render: Summary,
  },
  {
    id: 'experience-list',
    name: { de: 'Berufserfahrung', en: 'Work Experience' },
    dataFields: ['work'],
    allowedSlots: ['main', 'timeline'],
    optionsSchema: z.object({
      showHighlights: z.boolean().default(true),
      dateFormat: z.enum(['range', 'duration']).default('range'),
    }),
    defaultOptions: { showHighlights: true, dateFormat: 'range' },
    render: ExperienceList,
  },
  {
    id: 'education-list',
    name: { de: 'Bildungsweg', en: 'Education' },
    dataFields: ['education'],
    allowedSlots: ['main', 'timeline'],
    optionsSchema: z.object({
      showCourses: z.boolean().default(false),
    }),
    defaultOptions: { showCourses: false },
    render: EducationList,
  },
  {
    id: 'skills-list',
    name: { de: 'Kenntnisse', en: 'Skills' },
    dataFields: ['skills'],
    allowedSlots: ['sidebar', 'main', 'aside'],
    optionsSchema: z.object({
      displayMode: z.enum(['text', 'bar', 'stars', 'dots', 'none']).default('none'),
      columns: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
    }),
    defaultOptions: { displayMode: 'none' },
    render: SkillsList,
  },
  {
    id: 'languages-list',
    name: { de: 'Sprachen', en: 'Languages' },
    dataFields: ['languages'],
    allowedSlots: ['sidebar', 'main', 'aside'],
    optionsSchema: z.object({}),
    defaultOptions: {},
    render: LanguagesList,
  },
  {
    id: 'projects-list',
    name: { de: 'Projekte', en: 'Projects' },
    dataFields: ['projects'],
    allowedSlots: ['main', 'timeline'],
    optionsSchema: z.object({
      showHighlights: z.boolean().default(true),
    }),
    defaultOptions: { showHighlights: true },
    render: ProjectsList,
  },
  {
    id: 'certificates-list',
    name: { de: 'Zertifikate', en: 'Certificates' },
    dataFields: ['certificates'],
    allowedSlots: ['main', 'sidebar', 'aside'],
    optionsSchema: z.object({}),
    defaultOptions: {},
    render: CertificatesList,
  },
  {
    id: 'interests-list',
    name: { de: 'Interessen', en: 'Interests' },
    dataFields: ['interests'],
    allowedSlots: ['sidebar', 'main', 'aside'],
    optionsSchema: z.object({
      layout: z.enum(['tags', 'list']).default('list'),
    }),
    defaultOptions: { layout: 'list' },
    render: InterestsList,
  },
  {
    id: 'custom-section',
    name: { de: 'Benutzerdefiniert', en: 'Custom' },
    dataFields: ['custom'],
    allowedSlots: [
      'main',
      'sidebar',
      'aside',
      'footer',
      'footer-left',
      'footer-right',
      'meta',
      'references',
    ],
    optionsSchema: z.object({}),
    defaultOptions: {},
    render: CustomSection,
  },
  {
    id: 'letter-photo',
    name: { de: 'Foto (Briefkopf)', en: 'Photo (Letter)' },
    dataFields: [],
    allowedSlots: ['letter-header'],
    optionsSchema: z.object({
      shape: z.enum(['square', 'rounded', 'circle']).default('circle'),
      image: z.string().default(''),
      name: z.string().default(''),
    }),
    defaultOptions: { shape: 'circle', image: '', name: '' },
    render: LetterPhoto,
  },
  {
    id: 'letter-title',
    name: { de: 'Name & Titel', en: 'Name & Title' },
    dataFields: [],
    allowedSlots: ['letter-header'],
    optionsSchema: z.object({
      name: z.string().default(''),
      label: z.string().default(''),
    }),
    defaultOptions: { name: '', label: '' },
    render: LetterTitle,
  },
  {
    id: 'letter-contact',
    name: { de: 'Kontakt', en: 'Contact' },
    dataFields: [],
    allowedSlots: ['letter-header', 'letter-footer'],
    optionsSchema: z.object({
      email: z.string().default(''),
      phone: z.string().default(''),
      url: z.string().default(''),
      city: z.string().default(''),
      profiles: z
        .array(
          z.object({
            network: z.string(),
            username: z.string().optional(),
            url: z.string().optional(),
          }),
        )
        .default([]),
    }),
    defaultOptions: { email: '', phone: '', url: '', city: '', profiles: [] },
    render: LetterContact,
  },
];

/**
 *
 */
export function registerAllComponents(): void {
  for (const def of componentDefinitions) {
    registerComponent(def);
  }
}

export { componentDefinitions };
