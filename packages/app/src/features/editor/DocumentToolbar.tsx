import type { Locale } from '@cv/core';
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
    <section className="border-b border-line">
      {titleSlot ?? (
        <div className="border-b border-line/70 bg-white/[0.025] px-4 py-2">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
            <span aria-hidden="true" className="h-3 w-0.5 bg-accent" />
            {title}
          </h2>
        </div>
      )}
      <div className="flex flex-col gap-3 px-4 py-4">{children}</div>
    </section>
  );
}

export function DocumentToolbar() {
  const { t } = useTranslation();
  const design = useActiveDesign();
  const activeDesignId = useDesignStore((s) => s.activeDesignId);
  const applyDesign = useDesignStore((s) => s.applyDesign);
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
  const rawSidebarPosition = resolvedSlotOptions['sidebar.position'];
  const sidebarPosition = rawSidebarPosition === 'right' ? 'right' : 'left';
  const hasSidebarPosition = Boolean(design.slots.sidebar?.options?.position);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto">
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
