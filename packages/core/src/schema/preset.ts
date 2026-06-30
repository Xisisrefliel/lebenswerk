import { z } from 'zod';
import { localizedStringSchema } from './common.js';
import { slotAssignmentSchema, userOverridesSchema } from './userOverrides.js';

export { slotAssignmentSchema };
export type { SlotAssignment } from './userOverrides.js';

export const presetSchema = z.object({
  id: z.string(),
  name: localizedStringSchema,
  description: localizedStringSchema,
  thumbnail: z.string().default(''),
  designId: z.string(),
  overrides: userOverridesSchema,
});
/**
 *
 */
export type Preset = z.infer<typeof presetSchema>;
