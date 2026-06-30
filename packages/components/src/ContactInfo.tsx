import type { ComponentRenderProps } from '@cv/layout-engine';
import { getContactIcon } from './contactIcons.js';
import { getLabel } from './labels.js';
import { optStr } from './optionUtils.js';

interface ContactItem {
  key: string;
  network: string;
  label: string;
  value: string | string[];
  href?: string | undefined;
}

function buildContactItems(
  basics: ComponentRenderProps['resume']['basics'],
  locale: string,
): ContactItem[] {
  const items: ContactItem[] = [];

  if (basics.email) {
    items.push({
      key: 'email',
      network: 'email',
      label: 'E-Mail',
      value: basics.email,
      href: `mailto:${basics.email}`,
    });
  }
  if (basics.phone) {
    items.push({
      key: 'phone',
      network: 'phone',
      label: locale === 'de' ? 'Telefon' : 'Phone',
      value: basics.phone,
      href: `tel:${basics.phone.replace(/\s+/g, '')}`,
    });
  }
  if (basics.url) {
    items.push({
      key: 'url',
      network: 'website',
      label: 'Web',
      value: basics.url,
      href: basics.url,
    });
  }
  if (basics.location?.city || basics.location?.address) {
    const lines: string[] = [];
    if (basics.location.address) lines.push(basics.location.address);
    const cityLine = [basics.location.postalCode, basics.location.city].filter(Boolean).join(' ');
    if (cityLine) lines.push(cityLine);
    if (basics.location.countryCode) lines.push(basics.location.countryCode);
    items.push({
      key: 'location',
      network: 'location',
      label: locale === 'de' ? 'Adresse' : 'Address',
      value: lines.length === 1 ? (lines[0] ?? '') : lines,
    });
  }
  for (const p of basics.profiles) {
    items.push({
      key: `profile-${p.network}`,
      network: p.network,
      label: p.network,
      value: p.username ?? p.url ?? '',
      href: p.url,
    });
  }

  return items;
}

function ContactIcon({ network }: { network: string }) {
  const icon = getContactIcon(network);
  if (!icon) return null;
  return icon({});
}

/**
 * Wraps text in an <a> if href is provided. Styled to look like normal text.
 * @param root0
 * @returns React element wrapping the value in a link or plain span
 */
function LinkedValue({ value, href }: { value: string | string[]; href?: string | undefined }) {
  if (Array.isArray(value)) {
    return (
      <span className="cv-contact-value cv-contact-value--multiline">
        {value.map((line, i) => (
          <span key={i} className="cv-contact-value-line">
            {line}
          </span>
        ))}
      </span>
    );
  }
  if (!href) {
    return <span className="cv-contact-value">{value}</span>;
  }
  return (
    <a href={href} className="cv-contact-value cv-contact-link">
      {value}
    </a>
  );
}

/**
 * Nur Icons: icon + value
 * @param root0
 * @returns React element with icon and value
 */
function RenderIconValue({ item }: { item: ContactItem }) {
  return (
    <div className="cv-contact-item">
      <span className="cv-contact-icon-wrap">
        <ContactIcon network={item.network} />
      </span>
      <LinkedValue value={item.value} href={item.href} />
    </div>
  );
}

/**
 * Nur Text: label + value
 * @param root0
 * @returns React element with label and value
 */
function RenderTextValue({ item }: { item: ContactItem }) {
  return (
    <div className="cv-contact-item">
      <span className="cv-contact-label">{item.label}</span>
      <LinkedValue value={item.value} href={item.href} />
    </div>
  );
}

/**
 * Beide: icon + label + value
 * @param root0
 * @returns React element with icon, label, and value
 */
function RenderBoth({ item }: { item: ContactItem }) {
  return (
    <div className="cv-contact-item">
      <span className="cv-contact-icon-wrap">
        <ContactIcon network={item.network} />
      </span>
      <span className="cv-contact-label">{item.label}</span>
      <LinkedValue value={item.value} href={item.href} />
    </div>
  );
}

/**
 *
 * @param root0
 * @returns React element displaying the contact info section, or null if empty
 */
export function ContactInfo({ resume, locale, tokens, options, slot }: ComponentRenderProps) {
  const displayStyle = optStr(options, 'displayStyle', 'both');
  const layout = optStr(options, 'layout', 'vertical');
  const { basics } = resume;

  const items = buildContactItems(basics, locale);
  if (items.length === 0) return null;

  const isHorizontal = layout === 'horizontal' || slot === 'header';

  const renderItem = (item: ContactItem) => {
    switch (displayStyle) {
      case 'icons':
        return <RenderIconValue key={item.key} item={item} />;
      case 'text':
        return <RenderTextValue key={item.key} item={item} />;
      default:
        return <RenderBoth key={item.key} item={item} />;
    }
  };

  if (isHorizontal) {
    return (
      <section className="cv-section">
        <div className="cv-contact-list cv-contact-list--horizontal">{items.map(renderItem)}</div>
      </section>
    );
  }

  return (
    <section className="cv-section">
      <h2
        className={`cv-section-title cv-section-title--${optStr(tokens.options, 'sectionTitleStyle', 'uppercase-spaced')}`}
      >
        {getLabel(locale, 'contact')}
      </h2>
      <div className="cv-contact-list cv-contact-list--vertical">{items.map(renderItem)}</div>
    </section>
  );
}
