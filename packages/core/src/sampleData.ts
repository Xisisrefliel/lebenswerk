import type { PersistedState } from './migrations/index.js';
import type { CoverLetter } from './schema/coverLetter.js';
import type { Resume } from './schema/resume.js';
import type { Settings } from './schema/settings.js';
import { CURRENT_SCHEMA_VERSION } from './migrations/index.js';

export const sampleResume: Resume = {
  basics: {
    name: 'Alex Muster',
    label: 'Senior Software Engineer',
    email: 'alex.muster@example.com',
    phone: '+49 151 12345678',
    url: 'https://alex-muster.example',
    summary:
      'Erfahrene:r Full-Stack-Entwickler:in mit 8+ Jahren Erfahrung im Aufbau skalierbarer Webanwendungen. Spezialisiert auf TypeScript, React und verteilte Systeme.',
    birthDate: '1992-05-14',
    birthPlace: 'München',
    nationality: 'Deutsch',
    location: {
      city: 'Berlin',
      countryCode: 'DE',
      postalCode: '10115',
      address: 'Musterstraße 1',
    },
    profiles: [
      { network: 'GitHub', username: 'alexmuster', url: 'https://github.com/alexmuster' },
      { network: 'LinkedIn', username: 'alex-muster', url: 'https://linkedin.com/in/alex-muster' },
    ],
  },
  work: [
    {
      id: 'work-1',
      name: 'Acme Corp',
      position: 'Senior Software Engineer',
      location: 'Berlin',
      startDate: '2022-03',
      currentlyWorking: true,
      summary: 'Leitung der Frontend-Plattform, die über 2 Mio. monatliche Nutzer:innen bedient.',
      highlights: [
        'Migration der Frontend-Stack von Angular auf React, Reduktion der Bundle-Größe um 40%.',
        'Einführung eines Design-Systems, das von 6 Produkt-Teams genutzt wird.',
        'Mentoring von 4 Junior-Entwickler:innen.',
      ],
    },
    {
      id: 'work-2',
      name: 'StartupHub GmbH',
      position: 'Full-Stack Developer',
      location: 'München',
      startDate: '2018-09',
      endDate: '2022-02',
      currentlyWorking: false,
      summary: 'Entwicklung einer SaaS-Plattform für Eventmanagement.',
      highlights: [
        'Aufbau des Backend auf Node.js + PostgreSQL, 99.95% Uptime.',
        'Integration von Zahlungssystemen (Stripe, PayPal).',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Technische Universität München',
      area: 'Informatik',
      studyType: 'M.Sc.',
      startDate: '2016',
      endDate: '2018',
      score: '1.4',
      courses: [],
    },
    {
      id: 'edu-2',
      institution: 'Technische Universität München',
      area: 'Informatik',
      studyType: 'B.Sc.',
      startDate: '2012',
      endDate: '2016',
      score: '1.8',
      courses: [],
    },
  ],
  skills: [
    {
      id: 'skill-1',
      name: 'Frontend',
      keywords: [],
      children: [
        { id: 'sc-1', name: 'TypeScript', level: 100 },
        { id: 'sc-2', name: 'React', level: 100 },
        { id: 'sc-3', name: 'Vue', level: 60 },
        { id: 'sc-4', name: 'CSS', level: 60 },
      ],
    },
    {
      id: 'skill-2',
      name: 'Backend',
      keywords: [],
      children: [
        { id: 'sc-5', name: 'Node.js', level: 60 },
        { id: 'sc-6', name: 'PostgreSQL', level: 60 },
        { id: 'sc-7', name: 'Redis', level: 40 },
      ],
    },
    {
      id: 'skill-3',
      name: 'Cloud & DevOps',
      keywords: [],
      children: [
        { id: 'sc-8', name: 'AWS', level: 40 },
        { id: 'sc-9', name: 'Docker', level: 40 },
        { id: 'sc-10', name: 'CI/CD', level: 60 },
      ],
    },
  ],
  languages: [
    { id: 'lang-1', language: 'Deutsch', fluency: 'native' },
    { id: 'lang-2', language: 'Englisch', fluency: 'c1' },
    { id: 'lang-3', language: 'Spanisch', fluency: 'a1' },
  ],
  projects: [],
  certificates: [],
  publications: [],
  awards: [],
  volunteer: [],
  interests: [],
  references: [],
  custom: [],
};

export const sampleCoverLetter: CoverLetter = {
  sender: {
    name: 'Alex Muster',
    location: {
      city: 'Berlin',
      countryCode: 'DE',
      postalCode: '10115',
      address: 'Musterstraße 1',
    },
  },
  recipient: {
    name: 'Frau Dr. Schmidt',
    company: 'Beispiel AG',
    location: {
      city: 'Hamburg',
      postalCode: '20095',
      address: 'Beispielallee 42',
      countryCode: 'DE',
    },
  },
  place: 'Berlin',
  date: '2026-04-11',
  subject: 'Bewerbung als Senior Software Engineer',
  reference: 'Referenz: STL-2026-0042',
  salutation: 'Sehr geehrte Frau Dr. Schmidt,',
  paragraphs: [
    'mit großem Interesse habe ich Ihre Stellenanzeige gelesen. Meine langjährige Erfahrung in der Entwicklung skalierbarer Webanwendungen und mein Fokus auf Codequalität machen mich zu einer idealen Ergänzung für Ihr Team.',
    'Bei Acme Corp habe ich die Frontend-Plattform für über 2 Mio. monatliche Nutzer:innen mitverantwortet und ein Design-System aufgebaut, das heute von mehreren Produkt-Teams eingesetzt wird.',
    'Ich freue mich auf ein persönliches Kennenlernen.',
  ],
  closing: 'Mit freundlichen Grüßen',
  signatureName: 'Alex Muster',
  din5008Form: 'B',
  showFoldMarks: true,
  showSenderInfo: true,
};

export const sampleSettings: Settings = {
  uiLocale: 'de',
  documentLocale: 'de',
  selectedTemplateId: 'classic-de',
  templateOptions: {},
  sectionOrder: [
    'personal',
    'summary',
    'experience',
    'education',
    'skills',
    'languages',
    'projects',
    'certificates',
    'interests',
  ],
  sectionVisibility: {
    personal: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    languages: true,
    projects: false,
    certificates: false,
    publications: false,
    awards: false,
    volunteer: false,
    interests: false,
    references: false,
    custom: false,
  },
  paperSize: 'A4',
};

export const sampleState: PersistedState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  resume: sampleResume,
  coverLetter: sampleCoverLetter,
  settings: sampleSettings,
};
