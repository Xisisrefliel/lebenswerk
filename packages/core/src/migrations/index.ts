import type { CoverLetter } from '../schema/coverLetter.js';
import type { Resume } from '../schema/resume.js';
import type { Settings } from '../schema/settings.js';
import type { UserOverrides } from '../schema/userOverrides.js';

/**
 * Schema version for persisted state. Bump whenever a breaking change to any
 * schema is merged, and add a migration step to `migrations` below.
 */
export const CURRENT_SCHEMA_VERSION = 1 as const;

/**
 * Design-related state persisted across export/import.
 */
export interface PersistedDesign {
  activeDesignId: string;
  overrides: UserOverrides;
}

/**
 *
 */
export interface PersistedState {
  schemaVersion: number;
  resume: Resume;
  coverLetter: CoverLetter;
  settings: Settings;
  design?: PersistedDesign | undefined;
}

type Migration = (data: unknown) => unknown;

/**
 * Ordered list of migrations. Index N migrates from version N to N+1.
 * v1 is the current version, so this is empty until v2 exists.
 */
const migrations: Migration[] = [];

/**
 *
 * @param rawData
 * @returns The migrated state object with the current schema version
 */
export function runMigrations(rawData: unknown): unknown {
  if (typeof rawData !== 'object' || rawData === null) {
    throw new Error('Persisted state must be an object.');
  }
  const state = rawData as { schemaVersion?: number };
  const fromVersion = state.schemaVersion ?? 1;

  if (fromVersion > CURRENT_SCHEMA_VERSION) {
    throw new Error(
      `Persisted state has schema version ${fromVersion}, but this build only understands up to ${CURRENT_SCHEMA_VERSION}. Please update the app.`,
    );
  }

  let migrated: unknown = rawData;
  for (let version = fromVersion; version < CURRENT_SCHEMA_VERSION; version++) {
    const migrate = migrations[version - 1];
    if (!migrate) {
      throw new Error(`Missing migration from v${version} to v${version + 1}.`);
    }
    migrated = migrate(migrated);
  }

  return {
    ...(migrated as object),
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
}
