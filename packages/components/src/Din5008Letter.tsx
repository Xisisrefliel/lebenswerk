import type { CoverLetter, Locale } from '@cv/core';
import type { AnschreibenConfig } from '@cv/layout-engine';
import { toHtml } from './renderHtml.js';

/**
 *
 */
export interface Din5008LetterProps {
  coverLetter: CoverLetter;
  locale: Locale;
  config: AnschreibenConfig;
  headerHtml?: string;
  footerHtml?: string;
}

function formatFullDate(dateStr: string | undefined, locale: Locale): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const intl = locale === 'de' ? 'de-DE' : 'en-US';
  try {
    return new Date(dateStr).toLocaleDateString(intl, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function compactAddress(party: {
  name: string;
  location?:
    | { address?: string | undefined; postalCode?: string | undefined; city?: string | undefined }
    | undefined;
}): string {
  const parts = [party.name];
  if (party.location?.address) parts.push(party.location.address);
  if (party.location?.city) {
    const cityPart = party.location.postalCode
      ? `${party.location.postalCode} ${party.location.city}`
      : party.location.city;
    parts.push(cityPart);
  }
  return parts.join(' · ');
}

/**
 * Renders a DIN 5008 compliant cover letter (Anschreiben).
 * All positioning is enforced by CSS — this component only provides structure.
 * @param root0
 * @returns React element representing the DIN 5008 letter layout
 */
export function Din5008Letter({
  coverLetter,
  locale,
  config,
  headerHtml,
  footerHtml,
}: Din5008LetterProps) {
  const sender = coverLetter.sender;
  const recipient = coverLetter.recipient;
  const form = coverLetter.din5008Form;

  const headerStyle = config.headerBg ? { background: config.headerBg } : undefined;
  const footerStyle = config.footerBg ? { background: config.footerBg } : undefined;

  return (
    <div className={`cv-page cv-din5008 cv-din5008--form-${form.toLowerCase()}`}>
      {/* Header zone — only renders when components produce content */}
      {headerHtml ? (
        <div className="cv-din5008-header" style={headerStyle}>
          <div
            className="cv-din5008-header-content"
            dangerouslySetInnerHTML={{ __html: headerHtml }}
          />
        </div>
      ) : (
        <div className="cv-din5008-header" style={headerStyle} />
      )}

      {/* Fold and punch marks — top values are inline to avoid CSS variable
           scoping issues when Paged.js restructures the DOM during pagination. */}
      {coverLetter.showFoldMarks && (
        <>
          <div className="cv-din5008-fold1" style={{ top: '105mm' }} />
          <div className="cv-din5008-punch" style={{ top: '148.5mm' }} />
          <div className="cv-din5008-fold2" style={{ top: '210mm' }} />
        </>
      )}

      {/* Return address line (compact, inside address window) */}
      <div className="cv-din5008-return-addr">{compactAddress(sender)}</div>

      {/* Recipient address field */}
      <div className="cv-din5008-addr">
        {recipient.company && <div>{recipient.company}</div>}
        <div>{recipient.name}</div>
        {recipient.location?.address && <div>{recipient.location.address}</div>}
        {recipient.location?.city && (
          <div>
            {recipient.location.postalCode ? `${recipient.location.postalCode} ` : ''}
            {recipient.location.city}
          </div>
        )}
      </div>

      {/* Information block (right side) — postal sender + date */}
      <div className="cv-din5008-info">
        {coverLetter.showSenderInfo && (
          <>
            <div className="cv-din5008-info-name">{sender.name}</div>
            {sender.location?.address && <div>{sender.location.address}</div>}
            {sender.location?.city && (
              <div>
                {sender.location.postalCode ? `${sender.location.postalCode} ` : ''}
                {sender.location.city}
              </div>
            )}
            {sender.location?.countryCode && <div>{sender.location.countryCode}</div>}
          </>
        )}
        {(coverLetter.place || coverLetter.date) && (
          <div className="cv-din5008-info-date">
            {coverLetter.place && `${coverLetter.place}, `}
            {formatFullDate(coverLetter.date, locale)}
          </div>
        )}
      </div>

      {/* Letter body — flows for pagination */}
      <div className="cv-din5008-body">
        <div className="cv-din5008-subject">{coverLetter.subject}</div>
        {coverLetter.reference && (
          <div className="cv-din5008-reference">{coverLetter.reference}</div>
        )}

        {coverLetter.salutation && (
          <div className="cv-din5008-salutation">{coverLetter.salutation}</div>
        )}

        <div className="cv-din5008-text">
          {coverLetter.paragraphs.map((p, i) => (
            <div
              key={i}
              className="cv-din5008-paragraph"
              dangerouslySetInnerHTML={{ __html: toHtml(p) }}
            />
          ))}
        </div>

        {coverLetter.closing && <div className="cv-din5008-closing">{coverLetter.closing}</div>}

        <div className="cv-din5008-signature">
          {coverLetter.signatureImage && (
            <img src={coverLetter.signatureImage} alt="" className="cv-din5008-signature-img" />
          )}
          {coverLetter.signatureName && <div>{coverLetter.signatureName}</div>}
        </div>
      </div>

      {/* Footer — only renders when components produce content */}
      {footerHtml && (
        <div className="cv-din5008-footer" style={footerStyle}>
          <div
            className="cv-din5008-footer-content"
            dangerouslySetInnerHTML={{ __html: footerHtml }}
          />
        </div>
      )}
    </div>
  );
}
