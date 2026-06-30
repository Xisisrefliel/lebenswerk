import type { CoverLetter, Locale, Resume, SlotAssignment, UserOverrides } from '@cv/core';
import type { ComponentRenderProps, ResolvedTokens } from '@cv/layout-engine';
import type { DesignDefinition, DocumentType } from '@cv/layout-engine';
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BASE_CSS, Din5008Letter } from '@cv/components';
import { getComponent, renderDesignPage } from '@cv/layout-engine';
import { PagedRenderer } from '@cv/renderer';
import { registerPreviewPrint } from './previewController.js';

const pagedPolyfillUrl = `${import.meta.env.BASE_URL}vendor/paged.polyfill.js`;

/** Render a list of slot assignments to an HTML string using the component registry. */
function renderSlotComponents(
  assignments: SlotAssignment[] | undefined,
  resume: Resume,
  tokens: ResolvedTokens,
  locale: Locale,
  slotName: string,
): string {
  if (!assignments?.length) return '';
  return assignments
    .map((a) => {
      const def = getComponent(a.componentId);
      if (!def) return '';
      const props: ComponentRenderProps = {
        resume,
        tokens,
        options: { ...def.defaultOptions, ...a.options },
        locale,
        slot: slotName,
      };
      return renderToStaticMarkup(createElement(def.render, props));
    })
    .join('');
}

export interface PagedPreviewInput {
  resume: Resume;
  coverLetter?: CoverLetter;
  design: DesignDefinition | null | undefined;
  overrides: UserOverrides;
  locale: Locale;
  documentType: DocumentType;
}

export interface PagedPreviewResult {
  hostRef: RefObject<HTMLDivElement | null>;
  pageCount: number;
  generating: boolean;
}

/**
 * Manages the Paged.js renderer lifecycle, debounced rendering, and print
 * registration. Returns a ref to attach to the preview container and
 * reactive status values.
 */
export function usePagedPreview(input: PagedPreviewInput): PagedPreviewResult {
  const { resume, coverLetter, design, overrides, locale, documentType } = input;

  const hostRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<PagedRenderer | null>(null);
  const seqRef = useRef(0);

  const [pageCount, setPageCount] = useState(0);
  const [generating, setGenerating] = useState(false);

  // Renderer lifecycle
  useEffect(() => {
    if (!hostRef.current) return;
    const renderer = new PagedRenderer(hostRef.current, { pagedPolyfillUrl });
    rendererRef.current = renderer;
    return () => {
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  // Print registration
  useEffect(() => {
    registerPreviewPrint(() => {
      rendererRef.current?.print();
    });
    return () => {
      registerPreviewPrint(null);
    };
  }, []);

  // Debounced render
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer || !design) return;

    const seq = ++seqRef.current;
    setGenerating(true);

    const handle = window.setTimeout(() => {
      void (async () => {
        try {
          const { html, css } = renderDesignPage({
            resume,
            coverLetter,
            design,
            overrides,
            locale,
            documentType,
            renderDin5008: (props) => {
              // User overrides from cover letter store take precedence over design defaults
              const headerComps =
                props.coverLetter.headerComponentOverrides ?? props.config.headerComponents;
              const footerComps =
                props.coverLetter.footerComponentOverrides ?? props.config.footerComponents;
              const headerHtml = renderSlotComponents(
                headerComps,
                props.resume,
                props.tokens,
                props.locale,
                'header',
              );
              const footerHtml = renderSlotComponents(
                footerComps,
                props.resume,
                props.tokens,
                props.locale,
                'footer',
              );
              return renderToStaticMarkup(
                createElement(Din5008Letter, { ...props, headerHtml, footerHtml }),
              );
            },
          });
          const fullCss = `${BASE_CSS}\n${css}`;
          const result = await renderer.render(html, fullCss);

          if (seq !== seqRef.current) return;
          setPageCount(result.pageCount);
        } catch (err) {
          console.error('[usePagedPreview] render failed:', err);
        } finally {
          if (seq === seqRef.current) setGenerating(false);
        }
      })();
    }, 800);

    return () => {
      window.clearTimeout(handle);
    };
  }, [resume, coverLetter, design, overrides, locale, documentType]);

  return { hostRef, pageCount, generating };
}
