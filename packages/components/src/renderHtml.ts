import DOMPurify from 'dompurify';

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'ul',
    'ol',
    'li',
    'a',
    'span',
    'sub',
    'sup',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'code',
    'pre',
    'hr',
    'div',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  RETURN_TRUSTED_TYPE: false as const,
};

/**
 * Sanitizes and normalizes a string for dangerouslySetInnerHTML rendering.
 * Wraps plain text (non-HTML) in <p> tags so line breaks work correctly.
 * All HTML is sanitized via DOMPurify to prevent XSS.
 * @param value
 * @returns Sanitized HTML string
 */
export function toHtml(value: string | undefined): string {
  if (!value) return '';
  const raw = value.trimStart().startsWith('<') ? value : `<p>${value}</p>`;
  return DOMPurify.sanitize(raw, PURIFY_CONFIG);
}
