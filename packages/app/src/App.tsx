import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentToolbar } from './features/editor/DocumentToolbar.js';
import { ResumeEditor } from './features/editor/ResumeEditor.js';
import { IoButtons } from './features/io/IoButtons.js';
import { triggerPreviewPrint } from './features/preview/previewController.js';
import { PreviewPane } from './features/preview/PreviewPane.js';
import { clearAllStores } from './state/clearAllStores.js';
import { useSettingsStore } from './state/settingsStore.js';

export function App() {
  const { t, i18n } = useTranslation();
  const uiLocale = useSettingsStore((s) => s.settings.uiLocale);
  const setUiLocale = useSettingsStore((s) => s.setUiLocale);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    void i18n.changeLanguage(uiLocale);
  }, [i18n, uiLocale]);

  const toggleLocale = () => {
    setUiLocale(uiLocale === 'de' ? 'en' : 'de');
  };

  const handleClearAll = () => {
    clearAllStores();
    setClearDialogOpen(false);
  };

  return (
    <div
      className="flex min-h-screen flex-col overflow-x-hidden lg:h-screen lg:min-h-0"
      data-cv-app-chrome
    >
      {/* Clear-all warning dialog */}
      {clearDialogOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-20"
          onClick={(e) => {
            if (e.target === e.currentTarget) setClearDialogOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setClearDialogOpen(false);
          }}
        >
          <div className="w-full max-w-sm border-2 border-line-strong bg-surface p-4">
            <div className="mb-3 flex items-center gap-2 text-red-500">
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-sm font-bold uppercase tracking-wider">
                {t('actions.clearAllTitle')}
              </h2>
            </div>
            <p className="mb-4 text-xs text-muted">{t('actions.clearAllConfirm')}</p>
            <div className="flex justify-end gap-1">
              <button
                type="button"
                onClick={() => {
                  setClearDialogOpen(false);
                }}
                className="border border-line-strong px-2 py-1 text-xs uppercase tracking-wider text-ink hover:border-accent"
              >
                {t('actions.clearAllCancel')}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="bg-red-500 px-2 py-1 text-xs font-bold uppercase tracking-wider text-black hover:bg-red-400"
              >
                {t('actions.clearAll')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App header */}
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-line-strong bg-canvas px-2 py-1 sm:gap-3">
        <h1 className="min-w-0 truncate text-xs font-bold uppercase tracking-wider text-ink sm:text-sm">
          {t('app.title')}
        </h1>

        <div className="flex shrink-0 items-center gap-1">
          {/* Desktop-only actions */}
          <div className="hidden md:flex md:items-center md:gap-1">
            <IoButtons />

            {/* Clear all data */}
            <button
              type="button"
              onClick={() => {
                setClearDialogOpen(true);
              }}
              className="border border-red-500 px-2 py-1 text-xs font-medium uppercase tracking-wider text-red-500 hover:bg-red-500 hover:text-black"
            >
              {t('actions.clearAll')}
            </button>

            {/* Language toggle — globe icon */}
            <button
              type="button"
              onClick={toggleLocale}
              className="flex items-center gap-1 border border-line-strong bg-surface px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted hover:border-accent hover:text-ink"
              title={t('settings.uiLocale')}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <circle cx="8" cy="8" r="6.5" />
                <ellipse cx="8" cy="8" rx="3" ry="6.5" />
                <line x1="1.5" y1="8" x2="14.5" y2="8" />
              </svg>
              {uiLocale.toUpperCase()}
            </button>
          </div>

          {/* Download PDF — always visible */}
          <button
            type="button"
            onClick={triggerPreviewPrint}
            className="bg-accent px-2 py-1 text-xs font-bold uppercase tracking-wider text-black hover:bg-accent/90"
          >
            {t('actions.downloadPdf')}
          </button>

          {/* Hamburger menu button — mobile only */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen((v) => !v);
            }}
            className="border border-line-strong p-1.5 text-muted hover:border-accent hover:text-ink md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 5h14M3 10h14M3 15h14" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="flex flex-col gap-1 border-b border-line-strong bg-canvas px-2 py-2 md:hidden">
          <div className="flex gap-1">
            <IoButtons />
          </div>
          <button
            type="button"
            onClick={() => {
              setClearDialogOpen(true);
              setMenuOpen(false);
            }}
            className="border border-red-500 px-2 py-1 text-xs font-medium uppercase tracking-wider text-red-500 hover:bg-red-500 hover:text-black"
          >
            {t('actions.clearAll')}
          </button>
          <button
            type="button"
            onClick={() => {
              toggleLocale();
              setMenuOpen(false);
            }}
            className="flex items-center justify-center gap-1.5 border border-line-strong bg-surface px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted hover:border-accent hover:text-ink"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <circle cx="8" cy="8" r="6.5" />
              <ellipse cx="8" cy="8" rx="3" ry="6.5" />
              <line x1="1.5" y1="8" x2="14.5" y2="8" />
            </svg>
            {uiLocale.toUpperCase()}
          </button>
        </div>
      )}

      {/* Document toolbar: design, language, settings, doc type toggle */}
      <DocumentToolbar />

      {/* Two-column layout: editor + preview */}
      <div className="flex flex-col p-0 lg:min-h-0 lg:flex-1 lg:flex-row lg:p-0">
        <section
          className={`min-w-0 p-2 lg:min-h-0 lg:basis-1/2 lg:overflow-y-auto lg:scrollbar-none lg:p-3 ${previewVisible ? 'hidden lg:block' : ''}`}
        >
          <div className="flex flex-col gap-3">
            <ResumeEditor />
          </div>
        </section>

        <section
          className={`min-w-0 overflow-hidden border border-line-strong bg-canvas lg:min-h-0 lg:basis-1/2 ${previewVisible ? '' : 'h-0 lg:h-auto'}`}
        >
          <PreviewPane />
        </section>
      </div>

      {/* Floating toggle button — mobile only */}
      <button
        type="button"
        onClick={() => {
          setPreviewVisible((v) => !v);
        }}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center bg-accent text-black hover:bg-accent/90 lg:hidden"
        title={previewVisible ? t('preview.showEditor') : t('preview.showPreview')}
      >
        {previewVisible ? (
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.793 8.793-3.536.707.707-3.536 8.794-8.792z" />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M10 4.5C5.5 4.5 2 10 2 10s3.5 5.5 8 5.5 8-5.5 8-5.5-3.5-5.5-8-5.5z" />
            <circle cx="10" cy="10" r="2.5" />
          </svg>
        )}
      </button>
    </div>
  );
}
