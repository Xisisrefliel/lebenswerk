import type { Locale } from '@cv/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllDesigns } from '@cv/layout-engine';
import { useActiveDesign, useDesignStore } from '../../state/designStore.js';
import { useSettingsStore } from '../../state/settingsStore.js';
import { ToggleGroup } from '../../ui/ToggleGroup.js';
import { TokenEditor } from '../designer/TokenEditor.js';

/**
 * Top-level toolbar displayed above both editor and preview panes.
 * Contains design selector, document language, design customization button, and document type toggle.
 */
export function DocumentToolbar() {
  const { t } = useTranslation();
  const design = useActiveDesign();
  const activeDesignId = useDesignStore((s) => s.activeDesignId);
  const applyDesign = useDesignStore((s) => s.applyDesign);
  const activeDocumentType = useDesignStore((s) => s.activeDocumentType);
  const setActiveDocumentType = useDesignStore((s) => s.setActiveDocumentType);
  const uiLocale = useSettingsStore((s) => s.settings.uiLocale);
  const documentLocale = useSettingsStore((s) => s.settings.documentLocale);
  const setDocumentLocale = useSettingsStore((s) => s.setDocumentLocale);
  const [designEditorOpen, setDesignEditorOpen] = useState(false);

  const designs = getAllDesigns();

  if (!design) return null;

  const localeOptions = design.supportedLocales.map((loc) => ({
    value: loc,
    label: loc === 'de' ? 'Deutsch' : 'English',
  }));

  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center gap-2 overflow-x-auto border-b border-line-strong bg-canvas px-2 py-1 sm:gap-2">
        {/* Design selector with label */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            {t('toolbar.design')}
          </span>
          <div className="relative">
            <select
              value={activeDesignId}
              onChange={(e) => {
                applyDesign(e.target.value);
              }}
              className="appearance-none border border-line-strong bg-surface py-1 pl-2 pr-8 text-sm font-medium text-ink focus:border-accent focus:outline-none"
            >
              {designs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name[uiLocale]}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
        </div>

        {/* Document language with label */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            {t('toolbar.language')}
          </span>
          <div className="relative">
            <select
              value={documentLocale}
              onChange={(e) => {
                setDocumentLocale(e.target.value as Locale);
              }}
              className="appearance-none border border-line-strong bg-surface py-1 pl-2 pr-8 text-sm text-ink focus:border-accent focus:outline-none"
            >
              {localeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
        </div>

        {/* Design customization button */}
        <button
          type="button"
          onClick={() => {
            setDesignEditorOpen(true);
          }}
          className="flex items-center gap-1.5 border border-line-strong bg-surface px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-ink hover:border-accent"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <circle cx="8" cy="8" r="2.5" />
            <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4" />
          </svg>
          {t('toolbar.customize')}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Document type toggle */}
        {design.documentTypes.length > 1 && (
          <ToggleGroup
            options={design.documentTypes.map((dt) => ({
              value: dt,
              label: t(`documentTypes.${dt}`),
            }))}
            value={activeDocumentType}
            onChange={(v) => {
              setActiveDocumentType(v);
            }}
          />
        )}
      </div>

      {/* Design customization dialog */}
      {designEditorOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-20"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDesignEditorOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setDesignEditorOpen(false);
          }}
        >
          <div className="max-h-[70vh] w-full max-w-lg overflow-y-auto border-2 border-line-strong bg-surface p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
                {t('toolbar.customizeTitle')}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setDesignEditorOpen(false);
                }}
                className="p-1 text-muted hover:text-ink"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            <TokenEditor />
          </div>
        </div>
      )}
    </>
  );
}
