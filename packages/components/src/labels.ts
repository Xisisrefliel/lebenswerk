import type { Locale } from '@cv/core';

export const labels = {
  de: {
    personal: 'Persönliche Daten',
    summary: 'Profil',
    experience: 'Berufserfahrung',
    education: 'Bildungsweg',
    skills: 'Kenntnisse',
    languages: 'Sprachen',
    projects: 'Projekte',
    certificates: 'Zertifikate',
    publications: 'Publikationen',
    awards: 'Auszeichnungen',
    volunteer: 'Ehrenamt',
    interests: 'Interessen',
    references: 'Referenzen',
    custom: 'Weitere',
    contact: 'Kontakt',
    birthDate: 'Geburtsdatum',
    birthPlace: 'Geburtsort',
    nationality: 'Nationalität',
    present: 'heute',
    level_beginner: 'Grundkenntnisse',
    level_elementary: 'Grundlegende Kenntnisse',
    level_intermediate: 'Gute Kenntnisse',
    level_upper_intermediate: 'Fortgeschritten',
    level_advanced: 'Sehr gute Kenntnisse',
    level_proficient: 'Verhandlungssicher',
    level_expert: 'Experte',
    fluency_a1: 'A1 – Grundkenntnisse',
    fluency_a2: 'A2 – Erweiterte Grundkenntnisse',
    fluency_b1: 'B1 – Gute Kenntnisse',
    fluency_b2: 'B2 – Fortgeschritten',
    fluency_c1: 'C1 – Fließend',
    fluency_c2: 'C2 – Muttersprachlich',
    fluency_native: 'Muttersprache',
  },
  en: {
    personal: 'Personal Details',
    summary: 'About Me',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    projects: 'Projects',
    certificates: 'Certificates',
    publications: 'Publications',
    awards: 'Awards',
    volunteer: 'Volunteering',
    interests: 'Interests',
    references: 'References',
    custom: 'Other',
    contact: 'Contact',
    birthDate: 'Date of birth',
    birthPlace: 'Place of birth',
    nationality: 'Nationality',
    present: 'present',
    level_beginner: 'Basic Knowledge',
    level_elementary: 'Elementary',
    level_intermediate: 'Intermediate',
    level_upper_intermediate: 'Upper Intermediate',
    level_advanced: 'Advanced',
    level_proficient: 'Proficient',
    level_expert: 'Expert',
    fluency_a1: 'A1 – Elementary',
    fluency_a2: 'A2 – Pre-Intermediate',
    fluency_b1: 'B1 – Intermediate',
    fluency_b2: 'B2 – Upper Intermediate',
    fluency_c1: 'C1 – Fluent',
    fluency_c2: 'C2 – Near-Native',
    fluency_native: 'Native',
  },
} as const satisfies Record<Locale, Record<string, string>>;

/**
 *
 */
export type LabelKey = keyof (typeof labels)['de'];

/**
 *
 * @param locale
 * @param key
 * @returns The localized label string
 */
export function getLabel(locale: Locale, key: LabelKey): string {
  return labels[locale][key];
}
