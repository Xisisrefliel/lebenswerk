import type { Locale } from '@cv/core';
import type { DocumentType } from '@cv/layout-engine';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllDesigns } from '@cv/layout-engine';
import {
  useActiveDesign,
  useDesignStore,
  useResolvedSlotOptions,
} from '../../state/designStore.js';
import { useSettingsStore } from '../../state/settingsStore.js';
import { Select } from '../../ui/Select.js';
import { ToggleGroup } from '../../ui/ToggleGroup.js';
import { TokenEditor } from '../designer/TokenEditor.js';

function InspectorSection({
  title,
  titleSlot,
  children,
}: {
  title?: string;
  titleSlot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-line px-4 py-4">
      {titleSlot ?? (
        <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          {title}
        </h2>
      )}
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function DocumentTypeTabs({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  options: readonly { value: DocumentType; label: string }[];
  value: DocumentType;
  onChange: (value: DocumentType) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="grid border-b border-line bg-canvas"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => {
              onChange(option.value);
            }}
            className={`min-w-0 border-r border-line px-3 py-2 text-center text-[13px] font-medium leading-none transition-colors last:border-r-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/55 ${
              selected
                ? 'bg-white/[0.07] text-ink shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.7)]'
                : 'bg-canvas text-muted hover:bg-white/[0.045] hover:text-ink'
            }`}
          >
            <span className="block truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function DocumentToolbar() {
  const { t } = useTranslation();
  const design = useActiveDesign();
  const activeDesignId = useDesignStore((s) => s.activeDesignId);
  const applyDesign = useDesignStore((s) => s.applyDesign);
  const activeDocumentType = useDesignStore((s) => s.activeDocumentType);
  const setActiveDocumentType = useDesignStore((s) => s.setActiveDocumentType);
  const setSlotOption = useDesignStore((s) => s.setSlotOption);
  const resolvedSlotOptions = useResolvedSlotOptions();
  const uiLocale = useSettingsStore((s) => s.settings.uiLocale);
  const documentLocale = useSettingsStore((s) => s.settings.documentLocale);
  const setDocumentLocale = useSettingsStore((s) => s.setDocumentLocale);

  if (!design) return null;

  const designs = getAllDesigns();
  const localeOptions = design.supportedLocales.map((loc) => ({
    value: loc,
    label: loc === 'de' ? 'Deutsch' : 'English',
  }));
  const documentTypeOptions = design.documentTypes.map((dt) => ({
    value: dt,
    label: t(`documentTypes.${dt}`),
  }));
  const rawSidebarPosition = resolvedSlotOptions['sidebar.position'];
  const sidebarPosition = rawSidebarPosition === 'right' ? 'right' : 'left';
  const hasSidebarPosition = Boolean(design.slots.sidebar?.options?.position);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto">
        {design.documentTypes.length > 1 && (
          <DocumentTypeTabs
            ariaLabel={t('workspace.documentType', { defaultValue: 'Dokumenttyp' })}
            options={documentTypeOptions}
            value={activeDocumentType}
            onChange={(value) => {
              setActiveDocumentType(value);
            }}
          />
        )}

        <InspectorSection title={t('workspace.format', { defaultValue: 'Format' })}>
          <Select
            label={t('toolbar.design')}
            value={activeDesignId}
            onChange={(e) => {
              applyDesign(e.target.value);
            }}
            options={designs.map((d) => ({
              value: d.id,
              label: d.name[uiLocale],
            }))}
          />

          <Select
            label={t('toolbar.language')}
            value={documentLocale}
            onChange={(e) => {
              setDocumentLocale(e.target.value as Locale);
            }}
            options={localeOptions}
          />
        </InspectorSection>

        {hasSidebarPosition && (
          <InspectorSection title={t('workspace.layout', { defaultValue: 'Layout' })}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-muted">
                  {t('designer.position', { defaultValue: 'Position' })}
                </span>
                <ToggleGroup
                  options={[
                    { value: 'left', label: t('workspace.left', { defaultValue: 'Links' }) },
                    { value: 'right', label: t('workspace.right', { defaultValue: 'Rechts' }) },
                  ]}
                  value={sidebarPosition === 'right' ? 'right' : 'left'}
                  onChange={(value) => {
                    setSlotOption('sidebar', 'position', value);
                  }}
                />
              </div>
            </div>
          </InspectorSection>
        )}

        <InspectorSection title={t('workspace.design', { defaultValue: 'Design' })}>
          <TokenEditor />
        </InspectorSection>
      </div>
    </div>
  );
}
