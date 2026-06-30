import { PRINT_ROOT_ATTRIBUTE } from './print.js';

/**
 *
 */
export interface PagedRendererOptions {
  pagedPolyfillUrl: string;
}

/**
 *
 */
export interface RenderResult {
  pageCount: number;
}

/**
 * Renders HTML+CSS inside a fully-isolated iframe using Paged.js for
 * pagination. The iframe is displayed directly as the preview and can
 * be printed via the browser's native print dialog for vector PDF output.
 */
export class PagedRenderer {
  private readonly host: HTMLElement;
  private readonly options: PagedRendererOptions;
  private iframe: HTMLIFrameElement | null = null;
  private renderSeq = 0;

  constructor(host: HTMLElement, options: PagedRendererOptions) {
    this.host = host;
    this.host.setAttribute(PRINT_ROOT_ATTRIBUTE, '');
    this.options = options;
  }

  /**
   *
   * @param html
   * @param css
   * @returns Render result with page count
   */
  async render(html: string, css: string): Promise<RenderResult> {
    const seq = ++this.renderSeq;
    const doc = this.buildDocument(css, html);

    const iframe = document.createElement('iframe');
    iframe.title = 'CV render';
    Object.assign(iframe.style, {
      display: 'block',
      width: '210mm',
      height: '500mm', // tall enough for Paged.js layout computation
      border: '0',
      overflow: 'hidden',
    } satisfies Partial<CSSStyleDeclaration>);
    iframe.srcdoc = doc;

    this.host.replaceChildren(iframe);
    this.iframe = iframe;

    // Wait for Paged.js to finish. The load event fires after all scripts
    // (including the Paged.js polyfill) have run.
    await new Promise<void>((resolve) => {
      iframe.addEventListener(
        'load',
        () => {
          resolve();
        },
        { once: true },
      );
    });

    if (seq !== this.renderSeq) return { pageCount: 0 };

    const iframeDocument = iframe.contentDocument;
    if (!iframeDocument) return { pageCount: 0 };

    await this.waitForPagination(iframeDocument);

    if (seq !== this.renderSeq) return { pageCount: 0 };

    const pageCount = iframeDocument.querySelectorAll('.pagedjs_page').length;

    // Resize to Paged.js' rendered pages, not the temporary 500mm iframe viewport.
    const contentHeight = this.measureContentHeight(iframeDocument);
    if (contentHeight) {
      iframe.style.height = `${contentHeight}px`;
    }

    return { pageCount };
  }

  /**
   *
   */
  print(): void {
    const win = this.iframe?.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
  }

  /**
   *
   */
  dispose(): void {
    this.host.replaceChildren();
    this.iframe = null;
  }

  private measureContentHeight(document: Document | null): number | null {
    if (!document) return null;

    const pageHeights = [...document.querySelectorAll<HTMLElement>('.pagedjs_page')]
      .map((page) => page.getBoundingClientRect().height)
      .filter((height) => height > 0);

    if (pageHeights.length > 0) {
      const pages = document.querySelector<HTMLElement>('.pagedjs_pages');
      const styles = pages ? document.defaultView?.getComputedStyle(pages) : null;
      const paddingTop = styles ? Number.parseFloat(styles.paddingTop) || 0 : 0;
      const paddingBottom = styles ? Number.parseFloat(styles.paddingBottom) || 0 : 0;
      const gap = styles
        ? Number.parseFloat(styles.rowGap) || Number.parseFloat(styles.gap) || 0
        : 0;
      const pagesHeight = pageHeights.reduce((total, height) => total + height, 0);
      return Math.ceil(paddingTop + pagesHeight + gap * (pageHeights.length - 1) + paddingBottom);
    }

    const { body, documentElement } = document;
    const fallbackHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      documentElement.scrollHeight,
      documentElement.offsetHeight,
    );

    return fallbackHeight > 0 ? fallbackHeight : null;
  }

  private async waitForPagination(document: Document | null): Promise<void> {
    if (!document) return;

    await document.fonts.ready.catch(() => undefined);

    if (document.querySelector('.pagedjs_page')) return;

    await new Promise<void>((resolve) => {
      const timeout = window.setTimeout(() => {
        observer.disconnect();
        resolve();
      }, 3000);

      const observer = new MutationObserver(() => {
        if (!document.querySelector('.pagedjs_page')) return;
        window.clearTimeout(timeout);
        observer.disconnect();
        resolve();
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  private buildDocument(stylesheet: string, bodyHTML: string): string {
    const baseHref = `${window.location.origin}${window.location.pathname}`;
    return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <base href="${baseHref}" />
    <title>CV render</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap" />
    <style>${stylesheet}</style>
    <style>${PAGEDJS_INTERFACE_CSS}</style>
    <script src="${this.options.pagedPolyfillUrl}"></script>
  </head>
  <body>${bodyHTML}</body>
</html>`;
  }
}

const PAGEDJS_INTERFACE_CSS = `
  :root { color-scheme: light; }
  html, body {
    background: transparent;
    margin: 0;
    padding: 0;
  }
  .pagedjs_pages {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 0;
  }
  .pagedjs_page {
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
  }
  @media print {
    html, body {
      background: transparent;
    }
    .pagedjs_pages {
      gap: 0;
      padding: 0;
    }
    .pagedjs_page {
      box-shadow: none;
    }
  }
`;
