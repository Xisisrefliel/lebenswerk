import { z } from 'zod';
import { localeSchema, paperSizeSchema, sectionIdSchema } from './common.js';

export const sectionVisibilitySchema = z.record(sectionIdSchema, z.boolean());
/**
 *
 */
export type SectionVisibility = z.infer<typeof sectionVisibilitySchema>;

export const settingsSchema = z.object({
  /** UI language of the editor */
  uiLocale: localeSchema.default('de'),
  /** Language of the rendered document (independent from UI language) */
  documentLocale: localeSchema.default('de'),
  selectedTemplateId: z.string().default('classic-de'),
  /** Template-specific options, opaque to the app. Each template validates its own shape. */
  templateOptions: z.record(z.string(), z.unknown()).default({}),
  sectionOrder: z
    .array(sectionIdSchema)
    .default([
      'personal',
      'summary',
      'experience',
      'education',
      'skills',
      'languages',
      'projects',
      'certificates',
      'interests',
    ]),
  sectionVisibility: sectionVisibilitySchema.default({
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
  }),
  paperSize: paperSizeSchema.default('A4'),
});
/**
 *
 */
export type Settings = z.infer<typeof settingsSchema>;
