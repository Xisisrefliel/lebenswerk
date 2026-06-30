import type { ExpandedSlotDefinition } from '@cv/layout-engine';
import { createElement, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const dragRef = useRef<ComponentDragState | null>(null);
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
          dragRef={dragRef}
          onToggle={() => {
            toggleZoneComponent(zone, item.def.id, defaults);
          }}
          onReorder={
            item.enabled
              ? (from, to) => {
                  moveZoneComponent(zone, from, to, defaults);
                }
              : undefined
          }
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
  const dragRef = useRef<ComponentDragState | null>(null);
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
          dragRef={dragRef}
          onToggle={() => {
            toggleComponent(slotName, item.def.id);
          }}
          onReorder={
            item.enabled
              ? (from, to) => {
                  moveComponent(slotName, from, to);
                }
              : undefined
          }
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

type ComponentDragState = { from: number; componentId: string };
type MutableRef<T> = { current: T };
type DragPreviewState = {
  height: number;
  html: string;
  left: number;
  top: number;
  width: number;
};

type PendingComponentDrag = {
  offsetY: number;
  pointerId: number;
  rect: DOMRect;
  startX: number;
  startY: number;
};

function getSortableComponentHeaders(scope: string): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-component-sort-scope]')).filter(
    (element) =>
      element.dataset.componentSortScope === scope &&
      !element.closest('[data-component-drag-preview]'),
  );
}

interface ComponentCardProps {
  slotName: string;
  componentId: string;
  options: Record<string, unknown>;
  label: string;
  enabled: boolean;
  assignments: { componentId: string; options: Record<string, unknown> }[];
  dragRef: MutableRef<ComponentDragState | null>;
  onToggle: () => void;
  onReorder?: ((from: number, to: number) => void) | undefined;
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
  dragRef,
  onToggle,
  onReorder,
  onMove,
  t,
}: ComponentCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const pendingDragRef = useRef<PendingComponentDrag | null>(null);
  const draggingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const previousUserSelectRef = useRef<string | null>(null);
  const [open, setOpen] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [dragPreview, setDragPreview] = useState<DragPreviewState | null>(null);
  const Form = getForm(componentId);
  const assignedIdx = assignments.findIndex((a) => a.componentId === componentId);
  const isFirst = assignedIdx === 0;
  const isLast = assignedIdx === assignments.length - 1;
  const canDrag = enabled && assignedIdx >= 0 && Boolean(onReorder);
  const sortScope = slotName;

  const finishPointerDrag = (pointerId?: number) => {
    const header = headerRef.current;
    if (header && pointerId != null && header.hasPointerCapture(pointerId)) {
      header.releasePointerCapture(pointerId);
    }

    if (previousUserSelectRef.current != null) {
      document.body.style.userSelect = previousUserSelectRef.current;
      previousUserSelectRef.current = null;
    }

    pendingDragRef.current = null;
    draggingRef.current = false;
    dragRef.current = null;
    setDragging(false);
    setDragPreview(null);
  };

  useEffect(() => {
    if (!dragging && !pendingDragRef.current) return;

    const finish = () => {
      finishPointerDrag(pendingDragRef.current?.pointerId);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') finish();
    };

    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    window.addEventListener('mouseup', finish);
    window.addEventListener('blur', finish);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      window.removeEventListener('mouseup', finish);
      window.removeEventListener('blur', finish);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // We intentionally attach these listeners while a pointer interaction is active.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const updateReorderTarget = (clientY: number) => {
    if (!onReorder) return;
    const data = dragRef.current;
    if (!data) return;

    let target = data.from;
    for (const header of getSortableComponentHeaders(sortScope)) {
      const index = Number(header.dataset.componentIndex);
      if (!Number.isFinite(index) || index === data.from) continue;

      const rect = header.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      if (index > data.from && clientY > midpoint) {
        target = index;
      } else if (index < data.from && clientY < midpoint) {
        target = index;
        break;
      }
    }

    if (target !== data.from) {
      onReorder(data.from, target);
      dragRef.current = { ...data, from: target };
    }
  };

  const updatePointerDrag = (clientX: number, clientY: number, pointerId: number) => {
    const pendingDrag = pendingDragRef.current;
    if (!pendingDrag || pendingDrag.pointerId !== pointerId) return false;

    if (!draggingRef.current) {
      const deltaX = clientX - pendingDrag.startX;
      const deltaY = clientY - pendingDrag.startY;
      if (Math.hypot(deltaX, deltaY) < 5) return false;

      previousUserSelectRef.current = document.body.style.userSelect;
      document.body.style.userSelect = 'none';
      draggingRef.current = true;
      suppressClickRef.current = true;
      dragRef.current = { from: assignedIdx, componentId };
      setDragging(true);
      setDragPreview({
        height: pendingDrag.rect.height,
        html: cardRef.current?.innerHTML ?? '',
        left: pendingDrag.rect.left,
        top: pendingDrag.rect.top,
        width: pendingDrag.rect.width,
      });
    }

    setDragPreview((current) =>
      current ? { ...current, top: clientY - pendingDrag.offsetY } : current,
    );
    updateReorderTarget(clientY);
    return true;
  };

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (updatePointerDrag(event.clientX, event.clientY, event.pointerId)) {
        event.preventDefault();
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
    // Keep window-level movement alive while the dragged row is being reordered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, assignedIdx]);

  const header = (
    <div
      ref={headerRef}
      data-component-index={canDrag ? assignedIdx : undefined}
      data-component-sort-scope={canDrag ? sortScope : undefined}
      onClickCapture={(e) => {
        if (!suppressClickRef.current) return;
        suppressClickRef.current = false;
        e.preventDefault();
        e.stopPropagation();
      }}
      onPointerDown={(e) => {
        if (!canDrag || e.button !== 0) return;
        const previewRect = cardRef.current?.getBoundingClientRect();
        if (!previewRect) return;

        pendingDragRef.current = {
          offsetY: e.clientY - previewRect.top,
          pointerId: e.pointerId,
          rect: previewRect,
          startX: e.clientX,
          startY: e.clientY,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (updatePointerDrag(e.clientX, e.clientY, e.pointerId)) e.preventDefault();
      }}
      onPointerUp={(e) => {
        const pendingDrag = pendingDragRef.current;
        if (!pendingDrag || pendingDrag.pointerId !== e.pointerId) return;
        finishPointerDrag(e.pointerId);
      }}
      onPointerCancel={(e) => {
        const pendingDrag = pendingDragRef.current;
        if (!pendingDrag || pendingDrag.pointerId !== e.pointerId) return;
        finishPointerDrag(e.pointerId);
      }}
      className={`flex items-center gap-2 px-3 py-2.5 ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''} ${!enabled ? 'opacity-50' : ''}`}
    >
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
        onPointerDown={(e) => {
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
    <div
      ref={cardRef}
      className={`overflow-hidden rounded-lg border border-line-strong bg-surface transition-all hover:border-white/20 ${dragging ? 'border-blue/60 opacity-60 shadow-lg shadow-black/20' : ''}`}
      style={{ viewTransitionName: `component-card-${slotName}-${componentId}` }}
    >
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
      {dragPreview &&
        createPortal(
        <div
          data-component-drag-preview
          className="pointer-events-none fixed z-50 overflow-hidden rounded-lg border border-blue/60 bg-surface text-ink opacity-95 shadow-xl shadow-black/30"
          style={{
            height: dragPreview.height,
            left: dragPreview.left,
            top: dragPreview.top,
            width: dragPreview.width,
          }}
          dangerouslySetInnerHTML={{ __html: dragPreview.html }}
        />,
          document.body,
        )}
    </div>
  );
}
