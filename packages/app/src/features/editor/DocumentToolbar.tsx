import type { Locale } from '@cv/core';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const customizeButtonRef = useRef<HTMLButtonElement | null>(null);
  const customizerRef = useRef<HTMLDivElement | null>(null);

  const designs = getAllDesigns();

  useEffect(() => {
    if (!designEditorOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (customizerRef.current?.contains(target) || customizeButtonRef.current?.contains(target)) {
        return;
      }
      setDesignEditorOpen(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDesignEditorOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [designEditorOpen]);

  if (!design) return null;

  const localeOptions = design.supportedLocales.map((loc) => ({
    value: loc,
    label: loc === 'de' ? 'Deutsch' : 'English',
  }));

  return (
    <div className="relative z-30 shrink-0 border-b border-line bg-canvas/60 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto px-3 py-2 sm:gap-2.5">
        {/* Design selector with label */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted">{t('toolbar.design')}</span>
          <div className="relative">
            <select
              value={activeDesignId}
              onChange={(e) => {
                applyDesign(e.target.value);
              }}
              className="appearance-none rounded-md border border-line-strong bg-white/[0.03] py-1.5 pl-2.5 pr-8 text-sm font-medium text-ink transition-colors hover:border-white/25 focus:border-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
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
          <span className="text-xs font-medium text-muted">{t('toolbar.language')}</span>
          <div className="relative">
            <select
              value={documentLocale}
              onChange={(e) => {
                setDocumentLocale(e.target.value as Locale);
              }}
              className="appearance-none rounded-md border border-line-strong bg-white/[0.03] py-1.5 pl-2.5 pr-8 text-sm text-ink transition-colors hover:border-white/25 focus:border-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
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
          ref={customizeButtonRef}
          type="button"
          aria-controls="design-customizer-popover"
          aria-expanded={designEditorOpen}
          onClick={() => {
            setDesignEditorOpen((v) => !v);
          }}
          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-white/25 hover:bg-white/[0.06] ${
            designEditorOpen ? 'border-blue bg-blue/10' : 'border-line-strong bg-white/[0.03]'
          }`}
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

      {/* Design customization popover */}
      {designEditorOpen &&
        createPortal(
          <div
            ref={customizerRef}
            id="design-customizer-popover"
            role="dialog"
            aria-label={t('toolbar.customizeTitle')}
            className="fixed left-3 right-3 top-[6.5rem] z-[80] max-h-[70vh] overflow-y-auto rounded-lg border border-line-strong bg-surface-2 p-3 shadow-2xl shadow-black/50 sm:left-1/2 sm:right-auto sm:w-[30rem] sm:-translate-x-1/2"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-xs font-semibold text-ink">{t('toolbar.customizeTitle')}</h2>
              <button
                type="button"
                onClick={() => {
                  setDesignEditorOpen(false);
                }}
                className="rounded-md p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
                title={t('actions.close', { defaultValue: 'Close' })}
              >
                <svg
                  width="16"
                  height="16"
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
          </div>,
          document.body,
        )}
    </div>
  );
}
