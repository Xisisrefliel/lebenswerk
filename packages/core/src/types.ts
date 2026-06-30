/**
 * Re-exports of inferred types for convenience.
 * The actual zod schemas are exported from their respective files.
 */

export type {
  IsoDateLike,
  Locale,
  LocalizedString,
  PaperSize,
  SectionId,
} from './schema/common.js';
export type {
  Basics,
  Certificate,
  CustomSection,
  Education,
  Interest,
  Language,
  Location,
  Profile,
  Project,
  Resume,
  Skill,
  Work,
} from './schema/resume.js';
export type { CoverLetter, CoverLetterParty } from './schema/coverLetter.js';
export type { SectionVisibility, Settings } from './schema/settings.js';
