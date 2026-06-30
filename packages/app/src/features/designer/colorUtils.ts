export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export function hexToHsl(hex: string): HSL {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(color * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Relative luminance per WCAG 2.1 */
export function relativeLuminance(hex: string): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const r = toLinear(parseInt(hex.slice(1, 3), 16));
  const g = toLinear(parseInt(hex.slice(3, 5), 16));
  const b = toLinear(parseInt(hex.slice(5, 7), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Adjust lightness until the foreground meets minRatio against the background. */
export function clampContrast(fg: string, bg: string, minRatio: number): string {
  const { h, s } = hexToHsl(fg);
  let { l } = hexToHsl(fg);

  for (let i = 0; i < 30; i++) {
    const candidate = hslToHex(h, s, l);
    if (contrastRatio(candidate, bg) >= minRatio) return candidate;
    l = l > 50 ? l - 2 : l - 2; // darken toward 0
    if (l < 0) {
      l = 0;
      break;
    }
  }
  return hslToHex(h, s, l);
}

/** Derive neutral tokens tinted slightly toward the given hue. */
export function deriveNeutrals(primaryHue: number) {
  return {
    'sidebar-bg': hslToHex(primaryHue, 15, 96),
    text: hslToHex(primaryHue, 8, 13),
    muted: hslToHex(primaryHue, 6, 40),
    border: hslToHex(primaryHue, 8, 84),
  };
}
