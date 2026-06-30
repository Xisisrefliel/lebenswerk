import { z } from 'zod';
import { isoDateLikeSchema } from './common.js';

/**
 * Extended JSON Resume schema (https://jsonresume.org/schema/).
 * Optional fields mirror the canonical schema; we add a `custom` section array
 * for free-form content that doesn't fit the standard sections.
 */

export const locationSchema = z
  .object({
    address: z.string().optional(),
    postalCode: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    countryCode: z
      .string()
      .optional()
      .refine((v) => v === undefined || v === '' || v.length === 2, {
        message: 'countryCode must be empty or exactly 2 characters',
      }),
  })
  .partial();
/**
 *
 */
export type Location = z.infer<typeof locationSchema>;

export const profileSchema = z.object({
  network: z.string(),
  username: z.string().optional(),
  url: z.url().optional(),
});
/**
 *
 */
export type Profile = z.infer<typeof profileSchema>;

export const basicsSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  image: z.string().optional(),
  email: z.email().optional().or(z.literal('')),
  phone: z.string().optional(),
  url: z.url().optional().or(z.literal('')),
  summary: z.string().optional(),
  birthDate: isoDateLikeSchema.optional(),
  birthPlace: z.string().optional(),
  nationality: z.string().optional(),
  location: locationSchema.optional(),
  profiles: z.array(profileSchema).default([]),
});
/**
 *
 */
export type Basics = z.infer<typeof basicsSchema>;

export const workSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string().optional(),
  url: z.url().optional().or(z.literal('')),
  startDate: isoDateLikeSchema.optional(),
  endDate: isoDateLikeSchema.optional(),
  currentlyWorking: z.boolean().default(false),
  summary: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  location: z.string().optional(),
});
/**
 *
 */
export type Work = z.infer<typeof workSchema>;

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  url: z.url().optional().or(z.literal('')),
  area: z.string().optional(),
  studyType: z.string().optional(),
  startDate: isoDateLikeSchema.optional(),
  endDate: isoDateLikeSchema.optional(),
  score: z.string().optional(),
  courses: z.array(z.string()).default([]),
  location: z.string().optional(),
  description: z.string().optional(),
});
/**
 *
 */
export type Education = z.infer<typeof educationSchema>;

/** Map legacy string levels to numeric 0-100 values. */
const LEGACY_SKILL_LEVELS: Record<string, number> = {
  beginner: 14,
  elementary: 28,
  intermediate: 43,
  upper_intermediate: 57,
  advanced: 71,
  proficient: 86,
  expert: 100,
};

/** Accepts a number 0-100 or a legacy string level name; always outputs a number. */
export const skillLevelSchema = z.preprocess(
  (v) => (typeof v === 'string' ? (LEGACY_SKILL_LEVELS[v] ?? 50) : v),
  z.number().min(0).max(100),
);

export const fluencyLevelSchema = z.enum(['a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'native']);

export const skillChildSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: skillLevelSchema.optional(),
});
/**
 *
 */
export type SkillChild = z.infer<typeof skillChildSchema>;

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: skillLevelSchema.optional(),
  keywords: z.array(z.string()).default([]),
  children: z.array(skillChildSchema).default([]),
});
/**
 *
 */
export type Skill = z.infer<typeof skillSchema>;

export const languageSchema = z.object({
  id: z.string(),
  language: z.string(),
  fluency: fluencyLevelSchema.optional(),
});
/**
 *
 */
export type Language = z.infer<typeof languageSchema>;

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  url: z.url().optional().or(z.literal('')),
  startDate: isoDateLikeSchema.optional(),
  endDate: isoDateLikeSchema.optional(),
  highlights: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
});
/**
 *
 */
export type Project = z.infer<typeof projectSchema>;

export const certificateSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: isoDateLikeSchema.optional(),
  issuer: z.string().optional(),
  url: z.url().optional().or(z.literal('')),
});
/**
 *
 */
export type Certificate = z.infer<typeof certificateSchema>;

export const publicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  publisher: z.string().optional(),
  releaseDate: isoDateLikeSchema.optional(),
  url: z.url().optional().or(z.literal('')),
  summary: z.string().optional(),
});
/**
 *
 */
export type Publication = z.infer<typeof publicationSchema>;

export const awardSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: isoDateLikeSchema.optional(),
  awarder: z.string().optional(),
  summary: z.string().optional(),
});
/**
 *
 */
export type Award = z.infer<typeof awardSchema>;

export const volunteerSchema = z.object({
  id: z.string(),
  organization: z.string(),
  position: z.string().optional(),
  url: z.url().optional().or(z.literal('')),
  startDate: isoDateLikeSchema.optional(),
  endDate: isoDateLikeSchema.optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});
/**
 *
 */
export type Volunteer = z.infer<typeof volunteerSchema>;

export const interestSchema = z.object({
  id: z.string(),
  name: z.string(),
  keywords: z.array(z.string()).default([]),
});
/**
 *
 */
export type Interest = z.infer<typeof interestSchema>;

export const referenceSchema = z.object({
  id: z.string(),
  name: z.string(),
  reference: z.string().optional(),
});
/**
 *
 */
export type Reference = z.infer<typeof referenceSchema>;

export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z
    .array(
      z.object({
        id: z.string(),
        heading: z.string().optional(),
        body: z.string(),
      }),
    )
    .default([]),
});
/**
 *
 */
export type CustomSection = z.infer<typeof customSectionSchema>;

export const resumeSchema = z.object({
  basics: basicsSchema,
  work: z.array(workSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  languages: z.array(languageSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certificates: z.array(certificateSchema).default([]),
  publications: z.array(publicationSchema).default([]),
  awards: z.array(awardSchema).default([]),
  volunteer: z.array(volunteerSchema).default([]),
  interests: z.array(interestSchema).default([]),
  references: z.array(referenceSchema).default([]),
  custom: z.array(customSectionSchema).default([]),
});
/**
 *
 */
export type Resume = z.infer<typeof resumeSchema>;
