import { z } from 'zod';

export const localeSchema = z.enum(['de', 'en']);
/**
 *
 */
export type Locale = z.infer<typeof localeSchema>;

export const paperSizeSchema = z.enum(['A4', 'Letter']);
/**
 *
 */
export type PaperSize = z.infer<typeof paperSizeSchema>;

/** All known section identifiers. Templates declare which they support. */
export const sectionIdSchema = z.enum([
  'personal',
  'summary',
  'experience',
  'education',
  'skills',
  'languages',
  'projects',
  'certificates',
  'publications',
  'awards',
  'volunteer',
  'interests',
  'references',
  'custom',
]);
/**
 *
 */
export type SectionId = z.infer<typeof sectionIdSchema>;

export const localizedStringSchema = z.object({
  de: z.string(),
  en: z.string(),
});
/**
 *
 */
export type LocalizedString = z.infer<typeof localizedStringSchema>;

/** An ISO date string (YYYY-MM-DD) or partial (YYYY-MM, YYYY). Kept as string to preserve partials. */
export const isoDateLikeSchema = z
  .string()
  .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'Must be YYYY, YYYY-MM, or YYYY-MM-DD')
  .or(z.literal(''));
/**
 *
 */
export type IsoDateLike = z.infer<typeof isoDateLikeSchema>;
