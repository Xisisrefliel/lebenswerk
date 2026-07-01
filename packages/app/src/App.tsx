import { Agentation } from 'agentation';
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
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'content' | 'preview' | 'settings'>('content');
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia('(min-width: 1024px)').matches,
  );

  useEffect(() => {
    void i18n.changeLanguage(uiLocale);
  }, [i18n, uiLocale]);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const update = () => {
      setIsDesktop(query.matches);
    };
    update();
    query.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
    };
  }, []);

  const handleClearAll = () => {
    clearAllStores();
    setClearDialogOpen(false);
  };
  const showPreviewPane = isDesktop || mobilePanel === 'preview';

  return (
    <>
      <div
        className="flex min-h-screen flex-col overflow-x-hidden bg-canvas lg:h-screen lg:min-h-0"
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
                <h2 className="text-sm font-semibold text-ink">{t('actions.clearAllTitle')}</h2>
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

        <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-line bg-canvas px-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center border border-line-strong bg-white/[0.04]">
              <svg className="h-3 w-3 text-ink" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2h5.5v5.5H2V2zm6.5 0H14v5.5H8.5V2zM2 8.5h5.5V14H2V8.5zm6.5 0H14V14H8.5V8.5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-medium tracking-[-0.01em] text-ink">
                Lebenswerk
              </h1>
              <p className="hidden text-[11px] leading-none text-muted sm:block">
                {t('app.title')}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <div className="hidden items-center gap-1.5 md:flex">
              <IoButtons />

              <button
                type="button"
                onClick={() => {
                  setClearDialogOpen(true);
                }}
                className="border border-red/40 px-2.5 py-1.5 text-xs font-medium text-red transition-colors hover:bg-red hover:text-white hover:border-red"
              >
                {t('actions.clearAll')}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v);
              }}
              className="h-8 w-8 rounded-[5px] border border-line-strong text-muted transition-colors hover:bg-white/[0.05] hover:text-ink md:hidden"
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
          </div>
        )}

        <div className="grid h-11 shrink-0 grid-cols-3 border-b border-line bg-surface/60 lg:hidden">
          {[
            { key: 'content', label: t('workspace.content', { defaultValue: 'Inhalt' }) },
            { key: 'preview', label: t('workspace.preview', { defaultValue: 'Vorschau' }) },
            { key: 'settings', label: t('workspace.settings', { defaultValue: 'Format' }) },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setMobilePanel(item.key as typeof mobilePanel);
              }}
              className={`border-r border-line text-xs font-medium last:border-r-0 ${
                mobilePanel === item.key ? 'bg-white/[0.06] text-ink' : 'text-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(24rem,28rem)_minmax(34rem,1fr)_minmax(18rem,21rem)]">
          <aside
            className={`min-h-0 border-r border-line bg-surface/35 lg:block ${
              mobilePanel === 'content' ? 'block' : 'hidden'
            }`}
          >
            <div className="flex h-full min-h-0 flex-col">
              <div className="shrink-0 border-b border-line px-4 py-3">
                <h2 className="text-sm font-medium text-ink">
                  {t('workspace.sections', { defaultValue: 'Abschnitte bearbeiten' })}
                </h2>
              </div>
              <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-4 py-3">
                <ResumeEditor />
              </div>
              <button
                type="button"
                onClick={triggerPreviewPrint}
                className="h-10 w-full shrink-0 border-t border-white/20 bg-accent text-xs font-semibold tracking-[0.08em] text-black shadow-lg shadow-black/30 transition-colors hover:bg-white active:bg-white/85"
              >
                PDF EXPORT
              </button>
            </div>
          </aside>

          <main
            className={`min-w-0 overflow-hidden bg-canvas lg:block ${
              mobilePanel === 'preview' ? 'block' : 'hidden'
            }`}
          >
            {showPreviewPane ? <PreviewPane /> : null}
          </main>

          <aside
            className={`min-h-0 border-l border-line bg-surface/35 lg:block ${
              mobilePanel === 'settings' ? 'block' : 'hidden'
            }`}
          >
            <DocumentToolbar />
          </aside>
        </div>
      </div>
      {process.env.NODE_ENV === 'development' && <Agentation />}
    </>
  );
}
