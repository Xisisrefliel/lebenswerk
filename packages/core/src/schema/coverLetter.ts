import { z } from 'zod';
import { isoDateLikeSchema } from './common.js';
import { locationSchema } from './resume.js';
import { slotAssignmentSchema } from './userOverrides.js';

/** Postal address party — used for both sender and recipient in DIN 5008 letters. */
export const coverLetterPartySchema = z.object({
  name: z.string(),
  company: z.string().optional(),
  location: locationSchema.optional(),
});
/**
 *
 */
export type CoverLetterParty = z.infer<typeof coverLetterPartySchema>;

export const coverLetterSchema = z.object({
  /** Postal sender (name + address only). Header/footer contact data lives in component options. */
  sender: coverLetterPartySchema.default({ name: '' }),
  recipient: coverLetterPartySchema,
  place: z.string().optional(),
  date: isoDateLikeSchema.optional(),
  subject: z.string(),
  /** Reference line below subject, e.g. job ID or "Ihre Stellenanzeige vom ...". */
  reference: z.string().default(''),
  salutation: z.string().default(''),
  paragraphs: z.array(z.string()).default([]),
  closing: z.string().default(''),
  signatureName: z.string().optional(),
  signatureImage: z.string().optional(),
  /** DIN 5008 letter form: A (27mm header) or B (45mm header). */
  din5008Form: z.enum(['A', 'B']).default('B'),
  /** Show fold marks and punch mark on the letter. */
  showFoldMarks: z.boolean().default(true),
  /** Show sender address in the right-side information block. */
  showSenderInfo: z.boolean().default(true),
  /** User overrides for header zone components (replaces design defaults when set). */
  headerComponentOverrides: z.array(slotAssignmentSchema).optional(),
  /** User overrides for footer zone components (replaces design defaults when set). */
  footerComponentOverrides: z.array(slotAssignmentSchema).optional(),
});
/**
 *
 */
export type CoverLetter = z.infer<typeof coverLetterSchema>;
