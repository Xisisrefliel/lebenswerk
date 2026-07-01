import type { OptionDeclaration } from '@cv/layout-engine';
import {
  useActiveDesign,
  useDesignStore,
  useResolvedSlotOptions,
} from '../../state/designStore.js';
import { useSettingsStore } from '../../state/settingsStore.js';
import { ToggleGroup } from '../../ui/ToggleGroup.js';

interface SlotOptionsEditorProps {
  excludeOptionKeys?: readonly string[] | undefined;
  slotName: string;
}

export function SlotOptionsEditor({ excludeOptionKeys = [], slotName }: SlotOptionsEditorProps) {
  const design = useActiveDesign();
  const setSlotOption = useDesignStore((s) => s.setSlotOption);
  const resolvedOptions = useResolvedSlotOptions();
  const uiLocale = useSettingsStore((s) => s.settings.uiLocale);

  if (!design) return null;

  const slotDef = design.slots[slotName];
  if (!slotDef?.options || Object.keys(slotDef.options).length === 0) return null;
  const optionEntries = Object.entries(slotDef.options).filter(
    ([, decl]) => !excludeOptionKeys.includes(decl.key),
  );
  if (optionEntries.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 border-b border-line bg-white/[0.015] p-3">
      {optionEntries.map(([, decl]: [string, OptionDeclaration]) => {
        const resolvedKey = `${slotName}.${decl.key}`;
        const rawValue = resolvedOptions[resolvedKey];

        if (decl.type === 'enum') {
          const enumValue = typeof rawValue === 'string' ? rawValue : decl.default;
          const options = decl.values.map((v) => ({
            value: v.value,
            label: v.label[uiLocale],
          }));

          return (
            <div key={decl.key} className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted">{decl.label[uiLocale]}</span>
              <ToggleGroup
                options={options}
                value={enumValue}
                onChange={(value) => {
                  setSlotOption(slotName, decl.key, value);
                }}
              />
            </div>
          );
        }

        const rangeValue = typeof rawValue === 'number' ? rawValue : decl.default;
        return (
          <div key={decl.key} className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted">{decl.label[uiLocale]}</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={decl.min}
                max={decl.max}
                step={decl.step}
                value={rangeValue}
                onChange={(e) => {
                  setSlotOption(slotName, decl.key, Number(e.target.value));
                }}
                className="w-20 accent-blue"
              />
              <span className="w-10 text-right font-mono text-xs tabular-nums text-muted">
                {String(rangeValue)}
                {decl.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
