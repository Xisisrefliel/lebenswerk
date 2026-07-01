import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveDesign, useDesignStore, useResolvedTokens } from '../../state/designStore.js';
import { useSettingsStore } from '../../state/settingsStore.js';
import { Select } from '../../ui/Select.js';
import { ToggleGroup } from '../../ui/ToggleGroup.js';
import { RECOMMENDED_PALETTES, shufflePalette } from './colorPalettes.js';
import { ColorPickerPopover } from './ColorPickerPopover.js';

function SettingsSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-line pt-4 first:border-t-0 first:pt-0">
      {title && (
        <h4 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}

function OptionRadioList({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="radiogroup" className="flex flex-col border border-line">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => {
              onChange(option.value);
            }}
            className={`flex min-h-9 w-full items-center gap-2 border-b border-line px-2.5 text-left text-xs transition-colors last:border-b-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/60 ${
              selected
                ? 'bg-white/[0.065] text-ink'
                : 'bg-white/[0.018] text-muted hover:bg-white/[0.045] hover:text-ink'
            }`}
          >
            <span
              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                selected ? 'border-ink' : 'border-muted/60'
              }`}
            >
              {selected && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function TokenEditor() {
  const { t } = useTranslation();
  const design = useActiveDesign();
  const tokens = useResolvedTokens();
  const setColor = useDesignStore((s) => s.setColor);
  const setFont = useDesignStore((s) => s.setFont);
  const setSpacing = useDesignStore((s) => s.setSpacing);
  const setOption = useDesignStore((s) => s.setOption);
  const uiLocale = useSettingsStore((s) => s.settings.uiLocale);

  if (!design || !tokens) return null;

  const applyPalette = (colors: Record<string, string>) => {
    for (const [key, value] of Object.entries(colors)) {
      setColor(key, value);
    }
  };

  const handleShuffle = () => {
    const current: Record<string, string> = {};
    for (const decl of design.colors) {
      current[decl.key] = tokens.colors[decl.key] ?? decl.default;
    }
    applyPalette(shufflePalette(current));
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Colors */}
      {design.colors.length > 0 && (
        <SettingsSection title={t('designer.colors')}>
          <div className="grid grid-cols-4 gap-px overflow-hidden border border-line bg-line">
            {RECOMMENDED_PALETTES.map((palette) => {
              const swatches = [
                palette.colors.primary,
                palette.colors.secondary,
                palette.colors['sidebar-bg'],
                palette.colors.text,
              ].filter(Boolean);

              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => {
                    applyPalette(palette.colors);
                  }}
                  className="group flex h-8 bg-canvas p-1 transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/60"
                  title={t(`designer.palette_${palette.id}`, { defaultValue: palette.id })}
                >
                  {swatches.map((color, index) => (
                    <span
                      key={`${palette.id}-${color}-${index}`}
                      className="h-full flex-1 border-r border-black/20 last:border-r-0"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleShuffle}
            className="flex h-8 w-full items-center justify-between border border-line bg-white/[0.025] px-2.5 text-xs font-medium text-muted transition-colors hover:border-white/25 hover:bg-white/[0.05] hover:text-ink"
          >
            <span>{t('designer.shuffleColors')}</span>
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            >
              <path d="M2 4h2.2c1.1 0 1.9.4 2.5 1.3l2.6 3.4c.6.9 1.4 1.3 2.5 1.3H14" />
              <path d="M11.5 2.5 14 5l-2.5 2.5M2 12h2.2c1.1 0 1.9-.4 2.5-1.3l.5-.7M11.5 8.5 14 11l-2.5 2.5" />
            </svg>
          </button>

          <div className="flex flex-col border border-line">
            {design.colors.map((decl) => (
              <ColorPickerPopover
                key={decl.key}
                label={decl.label[uiLocale]}
                value={tokens.colors[decl.key] ?? decl.default}
                onChange={(hex) => {
                  setColor(decl.key, hex);
                }}
              />
            ))}
          </div>
        </SettingsSection>
      )}

      {/* Typography */}
      {design.fonts.length > 0 && (
        <SettingsSection title={t('designer.fonts')}>
          <div className="grid grid-cols-2 gap-1.5">
            {design.fonts.map((decl) => (
              <Select
                key={decl.key}
                label={decl.label[uiLocale]}
                value={tokens.fonts[decl.key] ?? decl.default}
                onChange={(e) => {
                  setFont(decl.key, e.target.value);
                }}
                options={decl.options.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                }))}
              />
            ))}
          </div>
        </SettingsSection>
      )}

      {/* Layout */}
      {(design.spacing || (design.options && Object.keys(design.options).length > 0)) && (
        <SettingsSection title={t('workspace.layout', { defaultValue: 'Layout' })}>
          {design.spacing && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-muted">{t('designer.spacing')}</span>
              <ToggleGroup
                options={design.spacing.options.map((opt) => ({
                  value: opt,
                  label: t(`designer.spacing_${opt}`, { defaultValue: opt }),
                }))}
                value={tokens.spacing}
                onChange={setSpacing}
              />
            </div>
          )}

          {design.options &&
            Object.entries(design.options).map(([, decl]) => {
              if (decl.type === 'enum') {
                const currentValue =
                  (tokens.options[decl.key] as string | undefined) ?? decl.default;
                return (
                  <div
                    key={decl.key}
                    className="flex flex-col gap-2 border-t border-line/70 pt-3 first:border-t-0 first:pt-0"
                  >
                    <span className="text-xs font-medium text-muted">{decl.label[uiLocale]}</span>
                    <OptionRadioList
                      options={decl.values.map((v) => ({
                        value: v.value,
                        label: v.label[uiLocale],
                      }))}
                      value={currentValue}
                      onChange={(val) => {
                        setOption(decl.key, val);
                      }}
                    />
                  </div>
                );
              }
              return null;
            })}
        </SettingsSection>
      )}
    </div>
  );
}
