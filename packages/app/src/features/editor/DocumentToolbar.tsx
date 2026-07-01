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

function InspectorSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-line px-4 py-4">
      <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
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
  const rawSidebarPosition = resolvedSlotOptions['sidebar.position'];
  const sidebarPosition = rawSidebarPosition === 'right' ? 'right' : 'left';
  const hasSidebarPosition = Boolean(design.slots.sidebar?.options?.position);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-line px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          {t('workspace.settings', { defaultValue: 'Format' })}
        </p>
        <h2 className="mt-1 text-sm font-medium text-ink">
          {t('workspace.documentSetup', { defaultValue: 'Dokument einrichten' })}
        </h2>
      </div>

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto">
        <InspectorSection title={t('workspace.format', { defaultValue: 'Format' })}>
          {design.documentTypes.length > 1 && (
            <ToggleGroup
              options={design.documentTypes.map((dt) => ({
                value: dt,
                label: t(`documentTypes.${dt}`),
              }))}
              value={activeDocumentType}
              onChange={(value) => {
                setActiveDocumentType(value);
              }}
            />
          )}

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
              <p className="text-xs leading-5 text-muted">
                {t('workspace.positionHint', {
                  defaultValue:
                    'Kompakte Angaben bleiben als Dokumentbereich erhalten; nur die Seite wechselt.',
                })}
              </p>
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
