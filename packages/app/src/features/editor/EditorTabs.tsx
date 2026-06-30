import type { ExpandedSlotDefinition } from '@cv/layout-engine';
import { createElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllComponents } from '@cv/layout-engine';
import { useCoverLetterStore } from '../../state/coverLetterStore.js';
import {
  useActiveDesign,
  useDesignStore,
  useResolvedSlotAssignments,
} from '../../state/designStore.js';
import { useSettingsStore } from '../../state/settingsStore.js';
import { Collapsible } from '../../ui/Collapsible.js';
import { Toggle } from '../../ui/Toggle.js';
import { ToggleGroup } from '../../ui/ToggleGroup.js';
import { SlotOptionsEditor } from '../designer/SlotOptionsEditor.js';
import { CoverLetterEditor } from './CoverLetterEditor.js';
import { getForm } from './formRegistry.js';

export function EditorTabs() {
  const { t } = useTranslation();
  const design = useActiveDesign();
  const activeDocumentType = useDesignStore((s) => s.activeDocumentType);

  const slotNames = design ? Object.keys(design.slots) : [];
  const [activeTab, setActiveTab] = useState(slotNames[0] ?? '');

  useEffect(() => {
    if (activeTab && !slotNames.includes(activeTab)) {
      setActiveTab(slotNames[0] ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design?.id, activeDocumentType]);

  if (!design) return null;

  if (activeDocumentType === 'anschreiben') {
    const config = design.anschreibenConfig ?? {};
    const CONTENT_TAB = '__content__';
    const anschreibenTabs: { value: string; label: string }[] = [
      { value: CONTENT_TAB, label: t('coverLetterEditor.title') },
    ];
    if (config.headerComponents?.length) {
      anschreibenTabs.push({ value: '__header__', label: t('slots.kopfzeile') });
    }
    if (config.footerComponents?.length) {
      anschreibenTabs.push({ value: '__footer__', label: t('slots.fusszeile') });
    }

    const currentAnschreibenTab = anschreibenTabs.some((tab) => tab.value === activeTab)
      ? activeTab
      : CONTENT_TAB;

    return (
      <div className="flex flex-col gap-3">
        {anschreibenTabs.length > 1 && (
          <ToggleGroup
            options={anschreibenTabs}
            value={currentAnschreibenTab}
            onChange={setActiveTab}
          />
        )}
        {currentAnschreibenTab === '__header__' && config.headerAccepts ? (
          <AnschreibenSlotPanel
            zone="header"
            accepts={config.headerAccepts}
            defaults={config.headerComponents ?? []}
          />
        ) : currentAnschreibenTab === '__footer__' && config.footerAccepts ? (
          <AnschreibenSlotPanel
            zone="footer"
            accepts={config.footerAccepts}
            defaults={config.footerComponents ?? []}
          />
        ) : (
          <CoverLetterEditor />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Slot tabs */}
      {slotNames.length > 1 && (
        <ToggleGroup
          options={slotNames.map((name) => ({
            value: name,
            label: t(`slots.${name}`, { defaultValue: name }),
          }))}
          value={activeTab || slotNames[0] || ''}
          onChange={setActiveTab}
        />
      )}
      {(() => {
        const currentSlot = activeTab || slotNames[0] || '';
        const slotDef = design.slots[currentSlot];
        return slotDef ? <SlotPanel slotName={currentSlot} slotDef={slotDef} /> : null;
      })()}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AnschreibenSlotPanel — component cards for DIN 5008 header/footer zones.
// Uses coverLetterStore for user overrides (independent from CV slot config).
// ---------------------------------------------------------------------------

interface AnschreibenSlotPanelProps {
  zone: 'header' | 'footer';
  accepts: readonly string[];
  defaults: { componentId: string; options: Record<string, unknown> }[];
}

function AnschreibenSlotPanel({ zone, accepts, defaults }: AnschreibenSlotPanelProps) {
  const { t } = useTranslation();
  const uiLocale = useSettingsStore((s) => s.settings.uiLocale);
  const cl = useCoverLetterStore((s) => s.coverLetter);
  const toggleZoneComponent = useCoverLetterStore((s) => s.toggleZoneComponent);
  const moveZoneComponent = useCoverLetterStore((s) => s.moveZoneComponent);
  const allComponents = getAllComponents();

  // Resolved assignments: user overrides take precedence over design defaults
  const overrideKey = zone === 'header' ? 'headerComponentOverrides' : 'footerComponentOverrides';
  const assignments = cl[overrideKey] ?? defaults;

  const compatibleComponents = allComponents.filter(
    (c) => c.id !== 'cover-letter-content' && c.allowedSlots.some((st) => accepts.includes(st)),
  );

  const assignmentMap = new Map(assignments.map((a) => [a.componentId, a]));
  const assignedIds = new Set(assignments.map((a) => a.componentId));

  const enabledItems = assignments
    .map((a) => compatibleComponents.find((c) => c.id === a.componentId))
    .filter((def) => def != null)
    .map((def) => {
      const assignment = assignmentMap.get(def.id) ?? { componentId: def.id, options: {} };
      return { def, assignment, enabled: true as const };
    });

  const disabledItems = compatibleComponents
    .filter((c) => !assignedIds.has(c.id))
    .map((def) => ({
      def,
      assignment: { componentId: def.id, options: {} },
      enabled: false as const,
    }));

  const allItems = [...enabledItems, ...disabledItems];

  const slotName = `anschreiben-${zone}`;

  return (
    <div className="flex flex-col gap-3">
      {allItems.map((item) => (
        <ComponentCard
          key={item.def.id}
          slotName={slotName}
          componentId={item.def.id}
          options={item.assignment.options}
          label={item.def.name[uiLocale]}
          enabled={item.enabled}
          assignments={assignments}
          onToggle={() => {
            toggleZoneComponent(zone, item.def.id, defaults);
          }}
          onMove={
            item.enabled
              ? (dir) => {
                  const idx = assignments.findIndex((a) => a.componentId === item.def.id);
                  if (idx < 0) return;
                  moveZoneComponent(zone, idx, idx + dir, defaults);
                }
              : undefined
          }
          t={t}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SlotPanel — shows ALL compatible components, each as its own card
// ---------------------------------------------------------------------------

interface SlotPanelProps {
  slotName: string;
  slotDef: ExpandedSlotDefinition;
}

function SlotPanel({ slotName, slotDef }: SlotPanelProps) {
  const { t } = useTranslation();
  const moveComponent = useDesignStore((s) => s.moveComponent);
  const toggleComponent = useDesignStore((s) => s.toggleComponent);
  const uiLocale = useSettingsStore((s) => s.settings.uiLocale);

  const allSlotAssignments = useResolvedSlotAssignments();
  const assignments = allSlotAssignments[slotName] ?? [];
  const allComponents = getAllComponents();

  // All components compatible with this slot type (exclude internal components)
  const compatibleComponents = allComponents.filter(
    (c) =>
      c.id !== 'cover-letter-content' && c.allowedSlots.some((st) => slotDef.accepts.includes(st)),
  );

  const assignmentMap = new Map(assignments.map((a) => [a.componentId, a]));
  const assignedIds = new Set(assignments.map((a) => a.componentId));

  // Enabled components in assignment order first, then disabled ones in registry order
  const enabledItems = assignments
    .map((a) => compatibleComponents.find((c) => c.id === a.componentId))
    .filter((def) => def != null)
    .map((def) => {
      const assignment = assignmentMap.get(def.id) ?? { componentId: def.id, options: {} };
      return { def, assignment, enabled: true as const };
    });

  const disabledItems = compatibleComponents
    .filter((c) => !assignedIds.has(c.id))
    .map((def) => ({
      def,
      assignment: { componentId: def.id, options: {} },
      enabled: false as const,
    }));

  const allItems = [...enabledItems, ...disabledItems];

  return (
    <div className="flex flex-col gap-3">
      <SlotOptionsEditor slotName={slotName} />

      {allItems.map((item) => (
        <ComponentCard
          key={item.def.id}
          slotName={slotName}
          componentId={item.def.id}
          options={item.assignment.options}
          label={item.def.name[uiLocale]}
          enabled={item.enabled}
          assignments={assignments}
          onToggle={() => {
            toggleComponent(slotName, item.def.id);
          }}
          onMove={
            item.enabled
              ? (dir) => {
                  const assignedIdx = assignments.findIndex((a) => a.componentId === item.def.id);
                  if (assignedIdx < 0) return;
                  moveComponent(slotName, assignedIdx, assignedIdx + dir);
                }
              : undefined
          }
          t={t}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ComponentCard — always visible, toggle controls assignment to slot
// ---------------------------------------------------------------------------

interface ComponentCardProps {
  slotName: string;
  componentId: string;
  options: Record<string, unknown>;
  label: string;
  enabled: boolean;
  assignments: { componentId: string; options: Record<string, unknown> }[];
  onToggle: () => void;
  onMove?: ((direction: -1 | 1) => void) | undefined;
  t: ReturnType<typeof useTranslation>['t'];
}

function ComponentCard({
  slotName,
  componentId,
  options,
  label,
  enabled,
  assignments,
  onToggle,
  onMove,
  t,
}: ComponentCardProps) {
  const [open, setOpen] = useState(true);
  const Form = getForm(componentId);
  const assignedIdx = assignments.findIndex((a) => a.componentId === componentId);
  const isFirst = assignedIdx === 0;
  const isLast = assignedIdx === assignments.length - 1;

  const header = (
    <div className={`flex items-center gap-2 px-3 py-2.5 ${!enabled ? 'opacity-50' : ''}`}>
      <svg
        className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${open && enabled ? 'rotate-90' : ''}`}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 4l4 4-4 4" />
      </svg>
      <span className="flex-1 text-sm font-medium text-ink">{label}</span>
      <div
        role="toolbar"
        className="flex items-center gap-1"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Reorder — only for enabled components */}
        {enabled && onMove && (
          <>
            <button
              type="button"
              disabled={isFirst}
              onClick={() => {
                onMove(-1);
              }}
              className="rounded p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink disabled:opacity-30"
              title={t('designer.moveUp')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 8.5l4-4 4 4" />
              </svg>
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => {
                onMove(1);
              }}
              className="rounded p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink disabled:opacity-30"
              title={t('designer.moveDown')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 5.5l4 4 4-4" />
              </svg>
            </button>
          </>
        )}
        {/* Toggle assignment */}
        <Toggle checked={enabled} onChange={onToggle} />
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-line-strong bg-surface transition-colors hover:border-white/20">
      <Collapsible
        open={open && enabled}
        onToggle={() => {
          if (enabled) setOpen(!open);
        }}
        header={header}
      >
        <div className="border-t border-line p-3">
          {Form ? (
            createElement(Form, { slotName, componentId, options })
          ) : (
            <p className="text-xs text-muted">
              {t('editor.noForm', {
                defaultValue: 'No editor available for this component.',
              })}
            </p>
          )}
        </div>
      </Collapsible>
    </div>
  );
}
