import { z } from 'zod';
import { CURRENT_SCHEMA_VERSION, type PersistedState, runMigrations } from './migrations/index.js';
import { coverLetterSchema } from './schema/coverLetter.js';
import { resumeSchema } from './schema/resume.js';
import { settingsSchema } from './schema/settings.js';
import { userOverridesSchema } from './schema/userOverrides.js';

const persistedDesignSchema = z.object({
  activeDesignId: z.string(),
  overrides: userOverridesSchema,
});

export const persistedStateSchema = z.object({
  schemaVersion: z.number().int().positive(),
  resume: resumeSchema,
  coverLetter: coverLetterSchema,
  settings: settingsSchema,
  design: persistedDesignSchema.optional(),
});

/**
 * Produce a deterministic JSON string ready for file download.
 * @param state
 * @returns Deterministic JSON string of the validated state
 */
export function serialize(state: PersistedState): string {
  const validated = persistedStateSchema.parse({
    ...state,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  });
  return JSON.stringify(validated, null, 2);
}

/**
 * Parse a JSON string from user import, migrate, and validate. Throws on failure.
 * @param json
 * @returns The parsed, migrated, and validated persisted state
 */
export function deserialize(json: string): PersistedState {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch (error) {
    throw new Error(`Invalid JSON: ${(error as Error).message}`);
  }

  const migrated = runMigrations(raw);
  return persistedStateSchema.parse(migrated);
}
