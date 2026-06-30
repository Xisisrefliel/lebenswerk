import type { ComponentRenderProps } from '@cv/layout-engine';
import { getContactIcon } from './contactIcons.js';
import { optArray, optStr } from './optionUtils.js';

interface LetterProfile {
  network: string;
  username?: string | undefined;
  url?: string | undefined;
}

/**
 * Minimal contact strip for DIN 5008 letter header/footer.
 * Reads from component options — independent of resume data.
 * Shows all populated fields with icons.
 * @param root0
 * @returns React element displaying the letter contact strip, or null if empty
 */
export function LetterContact({ options, slot }: ComponentRenderProps) {
  const email = optStr(options, 'email', '');
  const phone = optStr(options, 'phone', '');
  const url = optStr(options, 'url', '');
  const city = optStr(options, 'city', '');
  const profiles = optArray<LetterProfile>(options, 'profiles', []);

  const items: { key: string; network: string; value: string; href?: string | undefined }[] = [];

  if (email) {
    items.push({ key: 'email', network: 'email', value: email, href: `mailto:${email}` });
  }
  if (phone) {
    items.push({
      key: 'phone',
      network: 'phone',
      value: phone,
      href: `tel:${phone.replace(/\s+/g, '')}`,
    });
  }
  if (url) {
    items.push({ key: 'url', network: 'website', value: url, href: url });
  }
  if (city) {
    items.push({ key: 'location', network: 'location', value: city });
  }

  for (const profile of profiles) {
    if (profile.network) {
      items.push({
        key: `profile-${profile.network}`,
        network: profile.network,
        value: profile.username ?? profile.url ?? '',
        href: profile.url,
      });
    }
  }

  if (items.length === 0) return null;

  const isFooter = slot === 'footer' || slot === 'letter-footer';
  const layoutClass = isFooter ? 'cv-lh-contact cv-lh-contact--horizontal' : 'cv-lh-contact';

  return (
    <div className={layoutClass}>
      {items.map((item) => {
        const Icon = getContactIcon(item.network);
        return (
          <div key={item.key} className="cv-lh-contact-item">
            {Icon && (
              <span className="cv-lh-contact-icon">
                <Icon />
              </span>
            )}
            {item.href ? <a href={item.href}>{item.value}</a> : <span>{item.value}</span>}
          </div>
        );
      })}
    </div>
  );
}
