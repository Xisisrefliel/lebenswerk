import { useEffect, useState } from 'react';
import { Agentation } from 'agentation';
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
    <>
    <div
      className="flex min-h-screen flex-col overflow-x-hidden lg:h-screen lg:min-h-0"
      data-cv-app-chrome
    >
      {/* Clear-all warning dialog */}
      {clearDialogOpen && (
        <div
          role="presentation"
          className="cv-overlay fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24"
          onClick={(e) => {
            if (e.target === e.currentTarget) setClearDialogOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setClearDialogOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-xl border border-line-strong bg-surface-2 p-5 shadow-lg">
            <div className="mb-3 flex items-center gap-2.5 text-red">
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-sm font-semibold text-ink">
                {t('actions.clearAllTitle')}
              </h2>
            </div>
            <p className="mb-5 text-sm text-muted">{t('actions.clearAllConfirm')}</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setClearDialogOpen(false);
                }}
                className="rounded-md border border-line-strong px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-white/[0.05]"
              >
                {t('actions.clearAllCancel')}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-md bg-red px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red/90"
              >
                {t('actions.clearAll')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App header */}
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-line bg-canvas/80 px-3 py-2 backdrop-blur-md sm:gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.06]">
            <svg className="h-3.5 w-3.5 text-ink" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2h5.5v5.5H2V2zm6.5 0H14v5.5H8.5V2zM2 8.5h5.5V14H2V8.5zm6.5 0H14V14H8.5V8.5z" />
            </svg>
          </div>
          <h1 className="min-w-0 truncate text-sm font-semibold text-ink">
            {t('app.title')}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {/* Desktop-only actions */}
          <div className="hidden items-center gap-1.5 md:flex">
            <IoButtons />

            {/* Clear all data */}
            <button
              type="button"
              onClick={() => {
                setClearDialogOpen(true);
              }}
              className="rounded-md border border-red/40 px-2.5 py-1.5 text-xs font-medium text-red transition-colors hover:bg-red hover:text-white hover:border-red"
            >
              {t('actions.clearAll')}
            </button>

            {/* Language toggle — globe icon */}
            <button
              type="button"
              onClick={toggleLocale}
              className="flex items-center gap-1.5 rounded-md border border-line-strong bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-white/25 hover:text-ink"
              title={t('settings.uiLocale')}
            >
              <svg
                className="h-3.5 w-3.5"
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
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-black shadow-sm transition-all hover:bg-white/90 active:bg-white/80"
          >
            {t('actions.downloadPdf')}
          </button>

          {/* Hamburger menu button — mobile only */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen((v) => !v);
            }}
            className="rounded-md border border-line-strong p-2 text-muted transition-colors hover:bg-white/[0.05] hover:text-ink md:hidden"
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
        <div className="flex flex-col gap-1.5 border-b border-line bg-canvas/95 px-3 py-2.5 backdrop-blur-md md:hidden">
          <div className="flex flex-wrap gap-1.5">
            <IoButtons />
          </div>
          <button
            type="button"
            onClick={() => {
              setClearDialogOpen(true);
              setMenuOpen(false);
            }}
            className="rounded-md border border-red/40 px-2.5 py-1.5 text-xs font-medium text-red transition-colors hover:bg-red hover:text-white hover:border-red"
          >
            {t('actions.clearAll')}
          </button>
          <button
            type="button"
            onClick={() => {
              toggleLocale();
              setMenuOpen(false);
            }}
            className="flex items-center justify-center gap-1.5 rounded-md border border-line-strong bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-white/25 hover:text-ink"
          >
            <svg
              className="h-3.5 w-3.5"
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
          className={`min-w-0 p-3 lg:min-h-0 lg:basis-1/2 lg:overflow-y-auto lg:scrollbar-none lg:p-4 ${previewVisible ? 'hidden lg:block' : ''}`}
        >
          <div className="flex flex-col gap-3">
            <ResumeEditor />
          </div>
        </section>

        <section
          className={`min-w-0 overflow-hidden border-t border-line bg-canvas lg:min-h-0 lg:basis-1/2 lg:border-t-0 lg:border-l ${previewVisible ? '' : 'h-0 lg:h-auto'}`}
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
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-black shadow-lg transition-all hover:bg-white/90 active:scale-95 lg:hidden"
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
    {process.env.NODE_ENV === 'development' && <Agentation />}
    </>
  );
}
