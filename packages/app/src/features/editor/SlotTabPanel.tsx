import type { ExpandedSlotDefinition } from '@cv/layout-engine';
import { CaretDownIcon, CaretUpIcon, XIcon } from '@phosphor-icons/react';
import { createElement } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllComponents, getCompatibleComponents } from '@cv/layout-engine';
import { useDesignStore, useResolvedSlotAssignments } from '../../state/designStore.js';
import { useSettingsStore } from '../../state/settingsStore.js';
import { SlotOptionsEditor } from '../designer/SlotOptionsEditor.js';
import { getForm } from './formRegistry.js';

interface SlotTabPanelProps {
  slotName: string;
  slotDef: ExpandedSlotDefinition;
}

export function SlotTabPanel({ slotName, slotDef }: SlotTabPanelProps) {
  const { t } = useTranslation();
  const moveComponent = useDesignStore((s) => s.moveComponent);
  const toggleComponent = useDesignStore((s) => s.toggleComponent);
  const uiLocale = useSettingsStore((s) => s.settings.uiLocale);

  const allSlotAssignments = useResolvedSlotAssignments();
  const assignments = allSlotAssignments[slotName] ?? [];
  const allComponents = getAllComponents();
  const addableComponents = getCompatibleComponents(slotDef, allComponents, assignments);

  return (
    <div className="flex flex-col gap-3">
      {/* Slot-level options (position, width, etc.) */}
      <SlotOptionsEditor slotName={slotName} />

      {assignments.length === 0 && (
        <div className="rounded-lg border border-dashed border-line-strong p-6 text-center text-sm text-muted/70">
          {t('editor.emptySlot')}
        </div>
      )}

      {assignments.map((assignment, idx) => {
        const compDef = allComponents.find((c) => c.id === assignment.componentId);
        const Form = getForm(assignment.componentId);
        const label = compDef?.name[uiLocale] ?? assignment.componentId;

        return (
          <div
            key={`${assignment.componentId}-${idx}`}
            className="overflow-hidden rounded-lg border border-line-strong bg-surface transition-colors hover:border-white/20"
          >
            <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
              <span className="text-sm font-medium text-ink">{label}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => {
                    moveComponent(slotName, idx, idx - 1);
                  }}
                  className="rounded p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink disabled:opacity-30"
                  title={t('designer.moveUp')}
                >
                  <CaretUpIcon className="h-3.5 w-3.5" weight="bold" />
                </button>
                <button
                  type="button"
                  disabled={idx === assignments.length - 1}
                  onClick={() => {
                    moveComponent(slotName, idx, idx + 1);
                  }}
                  className="rounded p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink disabled:opacity-30"
                  title={t('designer.moveDown')}
                >
                  <CaretDownIcon className="h-3.5 w-3.5" weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleComponent(slotName, assignment.componentId);
                  }}
                  className="rounded p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-red"
                  title={t('designer.remove')}
                >
                  <XIcon className="h-3.5 w-3.5" weight="bold" />
                </button>
              </div>
            </div>

            <div className="p-3">
              {Form ? (
                createElement(Form, {
                  slotName,
                  componentId: assignment.componentId,
                  options: assignment.options,
                })
              ) : (
                <p className="text-xs text-muted">
                  {t('editor.noForm', { defaultValue: 'No editor available for this component.' })}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {addableComponents.length > 0 && (
        <select
          className="w-full appearance-none border border-dashed border-line-strong bg-white/[0.02] px-3 py-2 text-sm text-muted transition-colors hover:border-white/25 hover:text-ink focus:border-blue focus:outline-none"
          value=""
          onChange={(e) => {
            if (e.target.value) toggleComponent(slotName, e.target.value);
          }}
        >
          <option value="">{t('editor.addComponent')}</option>
          {addableComponents.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name[uiLocale]}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
