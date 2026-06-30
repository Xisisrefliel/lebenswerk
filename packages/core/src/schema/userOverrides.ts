import { z } from 'zod';

export const slotAssignmentSchema = z.object({
  componentId: z.string(),
  options: z.record(z.string(), z.unknown()).default({}),
});
/**
 *
 */
export type SlotAssignment = z.infer<typeof slotAssignmentSchema>;

/**
 * User customizations against a design's defaults.
 * Only overridden values are stored — missing keys fall back to the design defaults.
 */
export const userOverridesSchema = z.object({
  colors: z.record(z.string(), z.string()).default({}),
  fonts: z.record(z.string(), z.string()).default({}),
  spacing: z.string().optional(),
  options: z.record(z.string(), z.unknown()).default({}),
  slotOptions: z.record(z.string(), z.unknown()).default({}),
  slotAssignments: z.record(z.string(), z.array(slotAssignmentSchema)).default({}),
});
/**
 *
 */
export type UserOverrides = z.infer<typeof userOverridesSchema>;

/** Empty overrides — everything uses design defaults. */
export const emptyOverrides: UserOverrides = {
  colors: {},
  fonts: {},
  options: {},
  slotOptions: {},
  slotAssignments: {},
};
