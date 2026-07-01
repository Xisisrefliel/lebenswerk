import type { ExpandedSlotDefinition } from '@cv/layout-engine';
import {
  BriefcaseIcon,
  CaretRightIcon,
  CertificateIcon,
  FolderIcon,
  GlobeIcon,
  GraduationCapIcon,
  HeartIcon,
  IdentificationCardIcon,
  ImageIcon,
  SquaresFourIcon,
  StarIcon,
  TextAlignLeftIcon,
  UserIcon,
} from '@phosphor-icons/react';
import { createElement, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { getAllComponents } from '@cv/layout-engine';
import { useCoverLetterStore } from '../../state/coverLetterStore.js';
import {
  useActiveDesign,
  useDesignStore,
  useResolvedSlotAssignments,
  useResolvedSlotOptions,
} from '../../state/designStore.js';
import { useSettingsStore } from '../../state/settingsStore.js';
import { Collapsible } from '../../ui/Collapsible.js';
import { Toggle } from '../../ui/Toggle.js';
import { SlotOptionsEditor } from '../designer/SlotOptionsEditor.js';
import { CoverLetterEditor } from './CoverLetterEditor.js';
import { getForm } from './formRegistry.js';

export function EditorTabs() {
  const { t } = useTranslation();
  const design = useActiveDesign();
  const activeDocumentType = useDesignStore((s) => s.activeDocumentType);
  const resolvedSlotOptions = useResolvedSlotOptions();

  const slotNames = useMemo(() => (design ? Object.keys(design.slots) : []), [design]);
  const editorSlotNames = useMemo(() => getEditorSlotNames(slotNames), [slotNames]);
  const [activeSlotName, setActiveSlotName] = useState('sidebar');

  if (!design) return null;

  if (activeDocumentType === 'anschreiben') {
    const config = design.anschreibenConfig ?? {};

    return (
      <div className="flex flex-col gap-5 px-4 py-3">
        <RegionShell title={t('workspace.content', { defaultValue: 'Inhalt' })}>
          <CoverLetterEditor />
        </RegionShell>

        {config.headerComponents?.length && config.headerAccepts ? (
          <RegionShell title={t('workspace.regionHeader', { defaultValue: 'Kopfbereich' })}>
            <AnschreibenSlotPanel
              zone="header"
              accepts={config.headerAccepts}
              defaults={config.headerComponents ?? []}
            />
          </RegionShell>
        ) : null}

        {config.footerComponents?.length && config.footerAccepts ? (
          <RegionShell title={t('workspace.regionFooter', { defaultValue: 'Fußbereich' })}>
            <AnschreibenSlotPanel
              zone="footer"
              accepts={config.footerAccepts}
              defaults={config.footerComponents ?? []}
            />
          </RegionShell>
        ) : null}
      </div>
    );
  }

  const resolvedActiveSlot = editorSlotNames.includes(activeSlotName)
    ? activeSlotName
    : (editorSlotNames[0] ?? '');
  const activeSlotDef = resolvedActiveSlot ? design.slots[resolvedActiveSlot] : undefined;

  return (
    <div className="flex flex-col">
      {editorSlotNames.length > 1 ? (
        <EditorSlotTabs
          tabs={editorSlotNames}
          activeTab={resolvedActiveSlot}
          onTabChange={setActiveSlotName}
          t={t}
        />
      ) : null}

      {activeSlotDef ? (
        <div className="px-4 py-3">
          {editorSlotNames.length > 1 ? (
            <SlotPanelFrame>
              <SlotPanel slotName={resolvedActiveSlot} slotDef={activeSlotDef} />
            </SlotPanelFrame>
          ) : (
            <RegionShell title={getRegionCopy(resolvedActiveSlot, resolvedSlotOptions, t).title}>
              <SlotPanel slotName={resolvedActiveSlot} slotDef={activeSlotDef} />
            </RegionShell>
          )}
        </div>
      ) : null}
    </div>
  );
}

function getEditorSlotNames(slotNames: string[]) {
  const preferredSlots = ['sidebar', 'main'];
  const orderedPreferredSlots = preferredSlots.filter((slotName) => slotNames.includes(slotName));
  const remainingSlots = slotNames.filter((slotName) => !preferredSlots.includes(slotName));
  return [...orderedPreferredSlots, ...remainingSlots];
}

function getSlotTabLabel(slotName: string, t: ReturnType<typeof useTranslation>['t']) {
  if (slotName === 'sidebar') {
    return t('editor.sidebarTab', { defaultValue: 'Sidebar' });
  }

  if (slotName === 'main') {
    return t('editor.mainTab', { defaultValue: 'Hauptinhalt' });
  }

  return t(`slots.${slotName}`, { defaultValue: slotName });
}

function EditorSlotTabs({
  tabs,
  activeTab,
  onTabChange,
  t,
}: {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  return (
    <div
      role="tablist"
      aria-label={t('editor.slotTabs', { defaultValue: 'Bereiche' })}
      className="grid border-b border-line bg-canvas"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((slotName) => {
        const selected = activeTab === slotName;
        return (
          <button
            key={slotName}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => {
              onTabChange(slotName);
            }}
            className={`min-w-0 border-r border-line px-3 py-2 text-center text-[13px] font-medium leading-none transition-colors last:border-r-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/55 ${
              selected
                ? 'bg-white/[0.07] text-ink shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.7)]'
                : 'bg-canvas text-muted hover:bg-white/[0.045] hover:text-ink'
            }`}
          >
            <span className="block truncate">{getSlotTabLabel(slotName, t)}</span>
          </button>
        );
      })}
    </div>
  );
}

function SlotPanelFrame({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden border border-line bg-black/15">{children}</div>;
}

function getRegionCopy(
  slotName: string,
  slotOptions: Record<string, unknown>,
  t: ReturnType<typeof useTranslation>['t'],
) {
  if (slotName === 'sidebar') {
    const position = slotOptions['sidebar.position'] === 'right' ? 'right' : 'left';
    return {
      title:
        position === 'right'
          ? t('workspace.regionSideRight', { defaultValue: 'Rechte Dokumentseite' })
          : t('workspace.regionSideLeft', { defaultValue: 'Linke Dokumentseite' }),
    };
  }

  if (slotName === 'header') {
    return {
      title: t('workspace.regionHeader', { defaultValue: 'Kopfbereich' }),
    };
  }

  if (slotName === 'footer') {
    return {
      title: t('workspace.regionFooter', { defaultValue: 'Fußbereich' }),
    };
  }

  return {
    title: t('workspace.regionMain', { defaultValue: 'Hauptinhalt' }),
  };
}

function RegionShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-4 first:border-t-0 first:pt-0">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-ink">{title}</h3>
      </div>
      <div className="overflow-hidden border border-line bg-black/15">{children}</div>
    </section>
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
    <div>
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
    <div>
      <SlotOptionsEditor
        slotName={slotName}
        excludeOptionKeys={slotName === 'sidebar' ? ['position'] : undefined}
      />

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
  t: ReturnType<typeof useTranslation>['t'];
}

function ComponentIcon({ componentId }: { componentId: string }) {
  switch (componentId) {
    case 'photo':
    case 'letter-photo':
      return <ImageIcon className="h-[18px] w-[18px]" weight="regular" />;
    case 'personal-info':
    case 'letter-title':
      return <UserIcon className="h-[18px] w-[18px]" weight="regular" />;
    case 'contact-info':
    case 'letter-contact':
      return <IdentificationCardIcon className="h-[18px] w-[18px]" weight="regular" />;
    case 'summary':
      return <TextAlignLeftIcon className="h-[18px] w-[18px]" weight="regular" />;
    case 'experience-list':
      return <BriefcaseIcon className="h-[18px] w-[18px]" weight="regular" />;
    case 'education-list':
      return <GraduationCapIcon className="h-[18px] w-[18px]" weight="regular" />;
    case 'skills-list':
      return <StarIcon className="h-[18px] w-[18px]" weight="regular" />;
    case 'languages-list':
      return <GlobeIcon className="h-[18px] w-[18px]" weight="regular" />;
    case 'projects-list':
      return <FolderIcon className="h-[18px] w-[18px]" weight="regular" />;
    case 'certificates-list':
      return <CertificateIcon className="h-[18px] w-[18px]" weight="regular" />;
    case 'interests-list':
      return <HeartIcon className="h-[18px] w-[18px]" weight="regular" />;
    default:
      return <SquaresFourIcon className="h-[18px] w-[18px]" weight="regular" />;
  }
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
  t,
}: ComponentCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const pendingDragRef = useRef<PendingComponentDrag | null>(null);
  const draggingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const previousUserSelectRef = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragPreview, setDragPreview] = useState<DragPreviewState | null>(null);
  const Form = getForm(componentId);
  const assignedIdx = assignments.findIndex((a) => a.componentId === componentId);
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
      className={`flex min-h-12 items-center gap-2.5 px-3 py-2.5 ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''} ${!enabled ? 'opacity-45' : ''}`}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-ink">
        <ComponentIcon componentId={componentId} />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{label}</span>
      <CaretRightIcon
        aria-hidden="true"
        className={`h-3.5 w-3.5 shrink-0 text-muted transition-transform duration-200 ${open && enabled ? 'rotate-90' : ''}`}
        weight="bold"
      />
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
        <Toggle checked={enabled} onChange={onToggle} />
      </div>
    </div>
  );

  return (
    <div
      ref={cardRef}
      className={`overflow-hidden border-b border-line bg-surface/20 transition-colors last:border-b-0 hover:bg-white/[0.026] ${dragging ? 'bg-blue/10 opacity-60 shadow-lg shadow-black/20' : ''}`}
      style={{ viewTransitionName: `component-card-${slotName}-${componentId}` }}
    >
      <Collapsible
        open={open && enabled}
        onToggle={() => {
          if (enabled) setOpen(!open);
        }}
        header={header}
      >
        <div className="border-t border-line bg-canvas/80 p-4">
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
            className="pointer-events-none fixed z-50 overflow-hidden border border-blue/60 bg-surface text-ink opacity-95 shadow-xl shadow-black/30"
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
