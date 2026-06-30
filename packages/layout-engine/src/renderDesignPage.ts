import type { UserOverrides } from './resolveDesign.js';
import type {
  AnschreibenConfig,
  ComponentRenderProps,
  DesignDefinition,
  DocumentType,
  ResolvedTokens,
} from './types.js';
import type { CoverLetter, Locale, Resume } from '@cv/core';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getComponent } from './registry.js';
import { resolveAllSlotOptions, resolveSlotAssignments, resolveTokens } from './resolveDesign.js';
import { designTokensToCss } from './tokensToCss.js';

/**
 * Render a resume (Lebenslauf) page with slot-based layout.
 * @param resume
 * @param design
 * @param tokens
 * @param overrides
 * @param locale
 * @param layoutCss
 * @param tokenCss
 * @returns Object containing the rendered HTML and CSS strings
 */
function renderSlotPage(
  resume: Resume,
  design: DesignDefinition,
  tokens: ResolvedTokens,
  overrides: UserOverrides,
  locale: Locale,
  layoutCss: string,
  tokenCss: string,
): { html: string; css: string } {
  const css = `${layoutCss}\n${tokenCss}`;
  const slotAssignments = resolveSlotAssignments(design, overrides);
  const slotHtmlParts: string[] = [];

  for (const slotName of Object.keys(design.slots)) {
    const assignments = slotAssignments[slotName] ?? [];
    const componentHtmlParts: string[] = [];

    for (const assignment of assignments) {
      const compDef = getComponent(assignment.componentId);
      if (!compDef) {
        console.warn(
          `[layout-engine] Component "${assignment.componentId}" not found in registry — skipping slot "${slotName}"`,
        );
        continue;
      }

      const mergedOptions = { ...compDef.defaultOptions, ...assignment.options };
      const props: ComponentRenderProps = {
        resume,
        tokens,
        options: mergedOptions,
        locale,
        slot: slotName,
      };

      const html = renderToStaticMarkup(createElement(compDef.render, props));
      componentHtmlParts.push(html);
    }

    slotHtmlParts.push(`<div class="cv-slot-${slotName}">${componentHtmlParts.join('')}</div>`);
  }

  const html = `<div class="cv-page">${slotHtmlParts.join('')}</div>`;
  return { html, css };
}

/**
 * Render a cover letter (anschreiben) page — fallback for designs without renderDin5008.
 * Uses a simple single-column layout with design tokens.
 * @param coverLetter
 * @param tokenCss
 * @returns Object containing the rendered HTML and CSS strings
 */
function renderCoverLetterFallback(
  coverLetter: CoverLetter,
  tokenCss: string,
): { html: string; css: string } {
  const css = tokenCss;

  // Simple text-based cover letter
  const paragraphsHtml = coverLetter.paragraphs
    .map((p) => `<p class="cv-cl-paragraph">${p}</p>`)
    .join('');

  const html = `<div class="cv-page cv-cover-letter">
    <div class="cv-cl-subject">${coverLetter.subject}</div>
    ${coverLetter.salutation ? `<div class="cv-cl-salutation">${coverLetter.salutation}</div>` : ''}
    <div class="cv-cl-body">${paragraphsHtml}</div>
    ${coverLetter.closing ? `<div class="cv-cl-closing">${coverLetter.closing}</div>` : ''}
  </div>`;

  return { html, css };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 *
 */
export interface RenderDesignPageOptions {
  resume: Resume;
  coverLetter?: CoverLetter | undefined;
  design: DesignDefinition;
  overrides: UserOverrides;
  locale: Locale;
  documentType?: DocumentType | undefined;
  /** DIN 5008 letter renderer. Called when documentType is 'anschreiben'. */
  renderDin5008?:
    | ((props: {
        coverLetter: CoverLetter;
        resume: Resume;
        tokens: ResolvedTokens;
        locale: Locale;
        config: AnschreibenConfig;
        headerHtml?: string | undefined;
        footerHtml?: string | undefined;
      }) => string)
    | undefined;
}

/**
 *
 * @param opts
 * @returns Object containing the rendered HTML and CSS strings
 */
export function renderDesignPage(opts: RenderDesignPageOptions): { html: string; css: string } {
  const {
    resume,
    design,
    overrides,
    locale,
    documentType = 'lebenslauf',
    coverLetter,
    renderDin5008,
  } = opts;

  const tokens = resolveTokens(design, overrides);
  const slotOptions = resolveAllSlotOptions(design, overrides);
  const layoutCss = typeof design.css === 'function' ? design.css(slotOptions) : design.css;
  const tokenCss = designTokensToCss(design, tokens);

  if (documentType === 'anschreiben' && coverLetter) {
    if (renderDin5008) {
      const config = design.anschreibenConfig ?? {};
      const html = renderDin5008({ coverLetter, resume, tokens, locale, config });
      return { html, css: tokenCss };
    }
    return renderCoverLetterFallback(coverLetter, tokenCss);
  }

  return renderSlotPage(resume, design, tokens, overrides, locale, layoutCss, tokenCss);
}
