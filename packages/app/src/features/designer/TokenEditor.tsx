import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveDesign, useDesignStore, useResolvedTokens } from '../../state/designStore.js';
import { useSettingsStore } from '../../state/settingsStore.js';
import { Button } from '../../ui/Button.js';
import { Select } from '../../ui/Select.js';
import { ToggleGroup } from '../../ui/ToggleGroup.js';
import { RECOMMENDED_PALETTES, shufflePalette } from './colorPalettes.js';
import { ColorPickerPopover } from './ColorPickerPopover.js';

function SettingsSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 border border-line-strong bg-surface p-3">
      {title && (
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h4>
      )}
      {children}
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
    <div className="flex flex-col gap-3">
      {/* Colors */}
      {design.colors.length > 0 && (
        <SettingsSection title={t('designer.colors')}>
          <div className="flex flex-wrap items-center gap-1.5">
            {RECOMMENDED_PALETTES.map((palette) => (
              <button
                key={palette.id}
                type="button"
                onClick={() => {
                  applyPalette(palette.colors);
                }}
                className="flex h-6 w-6 overflow-hidden border border-line-strong transition-transform hover:scale-110 hover:border-accent"
                title={t(`designer.palette_${palette.id}`, { defaultValue: palette.id })}
              >
                <span
                  className="h-full w-1/2"
                  style={{ backgroundColor: palette.colors.primary }}
                />
                <span
                  className="h-full w-1/2"
                  style={{ backgroundColor: palette.colors.secondary }}
                />
              </button>
            ))}
            <Button variant="ghost" size="sm" onClick={handleShuffle}>
              {t('designer.shuffleColors')}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
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
          <div className="grid grid-cols-2 gap-2">
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
        <SettingsSection title="Layout">
          {design.spacing && (
            <div className="flex items-center justify-between">
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
                  <div key={decl.key} className="flex items-center justify-between">
                    <span className="text-xs text-muted">{decl.label[uiLocale]}</span>
                    <ToggleGroup
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
