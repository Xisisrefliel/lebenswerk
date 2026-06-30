import { describe, expect, it } from 'vitest';
import { CURRENT_SCHEMA_VERSION } from './migrations/index.js';
import { sampleState } from './sampleData.js';
import { deserialize, serialize } from './serialize.js';

describe('serialize / deserialize', () => {
  it('round-trips the sample state', () => {
    const json = serialize(sampleState);
    const restored = deserialize(json);
    expect(restored).toEqual(sampleState);
  });

  it('forces the current schema version on serialize', () => {
    const json = serialize({ ...sampleState, schemaVersion: 0 });
    const parsed = JSON.parse(json) as { schemaVersion: number };
    expect(parsed.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
  });

  it('rejects invalid JSON', () => {
    expect(() => deserialize('not json')).toThrow(/Invalid JSON/);
  });

  it('rejects data from a future schema version', () => {
    const future = JSON.stringify({ ...sampleState, schemaVersion: CURRENT_SCHEMA_VERSION + 1 });
    expect(() => deserialize(future)).toThrow(/future|schema version/i);
  });
});
