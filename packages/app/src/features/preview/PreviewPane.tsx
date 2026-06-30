import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoverLetterStore } from '../../state/coverLetterStore.js';
import { useActiveDesign, useDesignStore } from '../../state/designStore.js';
import { useResumeStore } from '../../state/resumeStore.js';
import { useSettingsStore } from '../../state/settingsStore.js';
import { usePagedPreview } from './usePagedPreview.js';

const ZOOM_STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2] as const;
/** 210mm in px at 96 dpi */
const A4_WIDTH_PX = 793.7;
/** 297mm in px at 96 dpi */
const A4_HEIGHT_PX = 1122.5;
const PADDING_PX = 32;

export function PreviewPane() {
  const { t } = useTranslation();

  const resume = useResumeStore((s) => s.resume);
  const coverLetter = useCoverLetterStore((s) => s.coverLetter);
  const documentLocale = useSettingsStore((s) => s.settings.documentLocale);
  const design = useActiveDesign();
  const overrides = useDesignStore((s) => s.overrides);
  const activeDocumentType = useDesignStore((s) => s.activeDocumentType);

  const { hostRef, pageCount, generating } = usePagedPreview({
    resume,
    coverLetter,
    design,
    overrides,
    locale: documentLocale,
    documentType: activeDocumentType,
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [fitZoom, setFitZoom] = useState(1);
  const [pageHeight, setPageHeight] = useState(A4_HEIGHT_PX);
  const [zoom, setZoom] = useState<number | null>(null); // null = fit-to-width

  // Observe container width and compute fit-to-width scale
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const available = el.clientWidth - PADDING_PX;
      setFitZoom(Math.min(available / A4_WIDTH_PX, 1));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, []);

  const activeZoom = zoom ?? fitZoom;
  const scaledPageWidth = A4_WIDTH_PX * activeZoom;
  const scaledPageHeight = pageHeight * activeZoom;

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const update = () => {
      const height = el.offsetHeight;
      if (height > 0) setPageHeight(height);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, [hostRef]);

  const zoomIn = useCallback(() => {
    setZoom((z) => {
      const current = z ?? fitZoom;
      const next = ZOOM_STEPS.find((s) => s > current);
      return next ?? current;
    });
  }, [fitZoom]);

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const current = z ?? fitZoom;
      const prev = [...ZOOM_STEPS].reverse().find((s) => s < current);
      return prev ?? current;
    });
  }, [fitZoom]);

  const zoomReset = useCallback(() => {
    setZoom(null);
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar: page count + zoom controls + rendering status */}
      <div className="flex shrink-0 items-center justify-between border-b border-line-strong bg-canvas px-2 py-1">
        <span className="text-xs uppercase tracking-wider text-muted">
          {pageCount > 0 &&
            `${pageCount} ${pageCount === 1 ? t('preview.page') : t('preview.pages')}`}
        </span>

        <div className="flex items-center gap-1">
          {generating && (
            <span className="mr-2 flex items-center gap-1.5 text-xs text-muted">
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <path
                  d="M14 8a6 6 0 00-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {t('preview.rendering')}
            </span>
          )}

          <button
            type="button"
            onClick={zoomOut}
            disabled={activeZoom <= ZOOM_STEPS[0]}
            className="p-1 text-muted hover:bg-surface hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
            title={t('preview.zoomOut')}
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="8" x2="13" y2="8" />
            </svg>
          </button>

          <button
            type="button"
            onClick={zoomReset}
            className="min-w-12 px-1 py-0.5 text-center text-xs uppercase tracking-wider text-muted hover:bg-surface"
            title={t('preview.zoomReset')}
          >
            {Math.round(activeZoom * 100)}%
          </button>

          <button
            type="button"
            onClick={zoomIn}
            disabled={activeZoom >= (ZOOM_STEPS.at(-1) ?? activeZoom)}
            className="p-1 text-muted hover:bg-surface hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
            title={t('preview.zoomIn')}
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="8" x2="13" y2="8" />
              <line x1="8" y1="3" x2="8" y2="13" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview — Paged.js iframe, scaled via CSS transform for zoom */}
      <div
        ref={scrollRef}
        className="scrollbar-none relative min-h-0 flex-1 overflow-auto bg-canvas py-4"
      >
        <div
          style={{
            height: `${scaledPageHeight}px`,
            margin: '0 auto',
            position: 'relative',
            width: `${scaledPageWidth}px`,
          }}
        >
          <div
            ref={hostRef}
            style={{
              left: '50%',
              position: 'absolute',
              top: 0,
              transform: `translateX(-50%) scale(${activeZoom})`,
              transformOrigin: 'top center',
              width: '210mm',
            }}
          />
        </div>
      </div>
    </div>
  );
}
