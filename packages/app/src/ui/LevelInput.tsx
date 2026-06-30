import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

/** Named labels for display in text mode and tooltips. */
const NAMED_LEVELS = [
  { value: 14, key: 'beginner' },
  { value: 28, key: 'elementary' },
  { value: 43, key: 'intermediate' },
  { value: 57, key: 'upper_intermediate' },
  { value: 71, key: 'advanced' },
  { value: 86, key: 'proficient' },
  { value: 100, key: 'expert' },
] as const;

function valueToLabel(value: number): string {
  const closest = NAMED_LEVELS.reduce((prev, curr) =>
    Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev,
  );
  return closest.key;
}

interface LevelInputProps {
  displayMode: string;
  value: number | undefined;
  onChange: (level: number) => void;
  i18nPrefix: string;
}

/**
 * Adaptive level input that matches the CV display mode.
 * Values are 0-100 (percentage). Visual modes use half-step precision
 * (10 positions on a 5-icon scale = steps of 10%).
 */
export function LevelInput({ displayMode, value, onChange, i18nPrefix }: LevelInputProps) {
  const { t } = useTranslation();
  const pct = value ?? 50;

  /** Convert 0-100 to how many icons out of 5 (supports halves: 0, 0.5, 1, 1.5, …, 5). */
  const filledCount = Math.round(pct / 10) / 2; // e.g. 70 → 3.5

  /** Click handler for star/dot: left half = N-0.5, right half = N. */
  function handleIconClick(position: number, e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    const stars = isLeftHalf ? position - 0.5 : position;
    onChange(Math.round(stars * 20)); // 3.5 stars → 70%
  }

  switch (displayMode) {
    case 'bar':
      return (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={10}
            max={100}
            step={10}
            value={pct}
            onChange={(e) => {
              onChange(Number(e.target.value));
            }}
            className="h-1.5 w-full cursor-pointer accent-accent"
          />
          <span className="w-8 text-right text-xs text-muted">{pct}%</span>
        </div>
      );

    case 'stars':
      return (
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => {
            const full = star <= filledCount;
            const half = !full && star - 0.5 <= filledCount;
            return (
              <button
                key={star}
                type="button"
                onClick={(e) => {
                  handleIconClick(star, e);
                }}
                className="relative text-lg leading-none px-0.5"
              >
                {full ? (
                  <span className="text-accent">{'\u2605'}</span>
                ) : half ? (
                  <span className="relative inline-block">
                    <span className="text-line-strong">{'\u2605'}</span>
                    <span
                      className="absolute inset-0 overflow-hidden text-accent"
                      style={{ width: '50%' }}
                    >
                      {'\u2605'}
                    </span>
                  </span>
                ) : (
                  <span className="text-line-strong">{'\u2606'}</span>
                )}
              </button>
            );
          })}
        </div>
      );

    case 'dots':
      return (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((dot) => {
            const full = dot <= filledCount;
            const half = !full && dot - 0.5 <= filledCount;
            return (
              <button
                key={dot}
                type="button"
                onClick={(e) => {
                  handleIconClick(dot, e);
                }}
                className="relative text-base leading-none px-0.5"
              >
                {full ? (
                  <span className="text-ink">{'\u25CF'}</span>
                ) : half ? (
                  <span className="relative inline-block">
                    <span className="text-line-strong">{'\u25CF'}</span>
                    <span
                      className="absolute inset-0 overflow-hidden text-ink"
                      style={{ width: '50%' }}
                    >
                      {'\u25CF'}
                    </span>
                  </span>
                ) : (
                  <span className="text-line-strong">{'\u25CB'}</span>
                )}
              </button>
            );
          })}
        </div>
      );

    // text (default)
    default:
      return (
        <select
          value={valueToLabel(pct)}
          onChange={(e) => {
            const match = NAMED_LEVELS.find((l) => l.key === e.target.value);
            if (match) onChange(match.value);
          }}
          className="border border-line-strong bg-surface px-2 py-1 text-sm text-ink focus:border-accent focus:outline-none"
        >
          {NAMED_LEVELS.map((l) => (
            <option key={l.key} value={l.key}>
              {t(`${i18nPrefix}_${l.key}`)}
            </option>
          ))}
        </select>
      );
  }
}
