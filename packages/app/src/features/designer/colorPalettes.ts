import { clampContrast, deriveNeutrals, hexToHsl, hslToHex } from './colorUtils.js';

type ColorPalette = Record<string, string>;

export interface NamedPalette {
  id: string;
  colors: ColorPalette;
}

/**
 * Curated palettes sourced from professional resume platforms (Canva, Zety,
 * Novoresume, Resume.io, Enhancv, Kickresume), design systems (IBM Carbon,
 * Material Design 3, Ant Design), and Figma/Dribbble resume template trends.
 *
 * All palettes pass WCAG AA contrast (4.5:1 for text, 3:1 for primary on white).
 * Neutral tokens are tinted toward the primary hue for visual cohesion.
 */
export const RECOMMENDED_PALETTES: NamedPalette[] = [
  // ── Blues (trust, corporate, universal) ──
  {
    id: 'navy',
    colors: {
      primary: '#1e3a8a',
      secondary: '#3b82f6',
      'sidebar-bg': '#f1f3f9',
      text: '#1b1f23',
      muted: '#55606b',
      border: '#d0d7de',
    },
  },
  {
    id: 'ocean',
    colors: {
      primary: '#0c4a6e',
      secondary: '#0ea5e9',
      'sidebar-bg': '#f0f9ff',
      text: '#1a2023',
      muted: '#556068',
      border: '#c8d5de',
    },
  },
  {
    id: 'cobalt',
    colors: {
      primary: '#1e40af',
      secondary: '#60a5fa',
      'sidebar-bg': '#eff3ff',
      text: '#1c1f2b',
      muted: '#525b72',
      border: '#c9d0e0',
    },
  },
  {
    id: 'steel',
    colors: {
      primary: '#3b4f6b',
      secondary: '#6889a8',
      'sidebar-bg': '#f2f5f8',
      text: '#1a1e23',
      muted: '#556068',
      border: '#d0d5dc',
    },
  },
  {
    id: 'midnight',
    colors: {
      primary: '#1a1a4e',
      secondary: '#4848a8',
      'sidebar-bg': '#f2f2fa',
      text: '#1b1b23',
      muted: '#555568',
      border: '#d0d0de',
    },
  },

  // ── Neutrals (minimal, Swiss typographic tradition) ──
  {
    id: 'slate',
    colors: {
      primary: '#1e293b',
      secondary: '#64748b',
      'sidebar-bg': '#f8fafc',
      text: '#1b1f23',
      muted: '#55606b',
      border: '#d0d7de',
    },
  },
  {
    id: 'charcoal',
    colors: {
      primary: '#292524',
      secondary: '#78716c',
      'sidebar-bg': '#fafaf9',
      text: '#1c1b1a',
      muted: '#6b6560',
      border: '#d6d3d0',
    },
  },
  {
    id: 'graphite',
    colors: {
      primary: '#2d3436',
      secondary: '#636e72',
      'sidebar-bg': '#f5f6f7',
      text: '#1c1d1e',
      muted: '#5c6062',
      border: '#d3d5d7',
    },
  },

  // ── Greens (fresh, trustworthy) ──
  {
    id: 'teal',
    colors: {
      primary: '#134e4a',
      secondary: '#2dd4bf',
      'sidebar-bg': '#f0fdfa',
      text: '#1a2321',
      muted: '#4d5e5a',
      border: '#c8d8d4',
    },
  },
  {
    id: 'forest',
    colors: {
      primary: '#14532d',
      secondary: '#16a34a',
      'sidebar-bg': '#f0fdf4',
      text: '#1a231b',
      muted: '#556b58',
      border: '#d0dec2',
    },
  },
  {
    id: 'emerald',
    colors: {
      primary: '#1a5e3a',
      secondary: '#34a065',
      'sidebar-bg': '#f0f9f3',
      text: '#1a221e',
      muted: '#50665a',
      border: '#c8d8d0',
    },
  },
  {
    id: 'sage',
    colors: {
      primary: '#3d5a47',
      secondary: '#6b9e7d',
      'sidebar-bg': '#f4f8f5',
      text: '#1e2620',
      muted: '#586b5d',
      border: '#c8d5cc',
    },
  },
  {
    id: 'olive',
    colors: {
      primary: '#4a5520',
      secondary: '#7a8b3c',
      'sidebar-bg': '#f6f7f1',
      text: '#1f201a',
      muted: '#5e6152',
      border: '#d5d7cb',
    },
  },

  // ── Warm tones (approachable, executive) ──
  {
    id: 'burgundy',
    colors: {
      primary: '#7f1d1d',
      secondary: '#b91c1c',
      'sidebar-bg': '#fef2f2',
      text: '#231a1a',
      muted: '#6b5555',
      border: '#ded0d0',
    },
  },
  {
    id: 'terracotta',
    colors: {
      primary: '#7c2d12',
      secondary: '#c2410c',
      'sidebar-bg': '#fff7ed',
      text: '#231d1a',
      muted: '#6b5d55',
      border: '#ded5d0',
    },
  },
  {
    id: 'copper',
    colors: {
      primary: '#7c4a1e',
      secondary: '#b87333',
      'sidebar-bg': '#faf6f1',
      text: '#231e1a',
      muted: '#6b5e52',
      border: '#ddd5cb',
    },
  },
  {
    id: 'sienna',
    colors: {
      primary: '#6b3320',
      secondary: '#a0553a',
      'sidebar-bg': '#faf4f1',
      text: '#221c1a',
      muted: '#685852',
      border: '#dbd3cb',
    },
  },
  {
    id: 'coral',
    colors: {
      primary: '#8b3a2a',
      secondary: '#d4644e',
      'sidebar-bg': '#fdf3f1',
      text: '#231b1a',
      muted: '#6b5855',
      border: '#ded3d0',
    },
  },
  {
    id: 'espresso',
    colors: {
      primary: '#3e2723',
      secondary: '#6d4c41',
      'sidebar-bg': '#f9f6f5',
      text: '#1e1b1a',
      muted: '#655c58',
      border: '#d8d3d0',
    },
  },

  // ── Purples & pinks (creative, distinctive) ──
  {
    id: 'purple',
    colors: {
      primary: '#4c1d95',
      secondary: '#8b5cf6',
      'sidebar-bg': '#f5f3ff',
      text: '#1f1a23',
      muted: '#5e556b',
      border: '#d6d0de',
    },
  },
  {
    id: 'indigo',
    colors: {
      primary: '#312e81',
      secondary: '#6366f1',
      'sidebar-bg': '#eef2ff',
      text: '#1d1c25',
      muted: '#585568',
      border: '#d2d0de',
    },
  },
  {
    id: 'mauve',
    colors: {
      primary: '#5e3a6e',
      secondary: '#9b6bb0',
      'sidebar-bg': '#f7f2fa',
      text: '#211a23',
      muted: '#63556b',
      border: '#d8d0de',
    },
  },
  {
    id: 'plum',
    colors: {
      primary: '#6b2052',
      secondary: '#a8467e',
      'sidebar-bg': '#faf1f7',
      text: '#221a20',
      muted: '#685562',
      border: '#dbd0d8',
    },
  },
  {
    id: 'rose',
    colors: {
      primary: '#862750',
      secondary: '#d4638a',
      'sidebar-bg': '#fdf2f6',
      text: '#231a1e',
      muted: '#6b5560',
      border: '#ded0d6',
    },
  },

  // ── Corporate (company brand palettes) ──
  {
    id: 'airbus',
    colors: {
      primary: '#00205b',
      secondary: '#0077c8',
      'sidebar-bg': '#f0f3f8',
      text: '#1a1d23',
      muted: '#4e5a6b',
      border: '#c8d0de',
    },
  },
];

// ---------------------------------------------------------------------------
// Random palette generation
// ---------------------------------------------------------------------------

const CURATED_PALETTES = RECOMMENDED_PALETTES.map((p) => p.colors);

type HarmonyType = 'monochromatic' | 'analogous' | 'complementary' | 'split-complementary';

const HARMONY_TYPES: HarmonyType[] = [
  'monochromatic',
  'analogous',
  'complementary',
  'split-complementary',
];

/** Safe hue ranges for professional CVs: [min, max] */
const SAFE_HUE_RANGES: [number, number][] = [
  [200, 245], // blues + steel
  [170, 195], // teals
  [135, 165], // greens + emerald
  [65, 85], // olive / yellow-green
  [260, 300], // purples + mauve
  [310, 345], // plum + rose + dusty pink
  [340, 360], // burgundy / wine
  [0, 20], // warm reds + coral
  [20, 40], // copper + sienna + amber
];

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function generateSecondaryHue(primaryHue: number, harmony: HarmonyType): number {
  switch (harmony) {
    case 'monochromatic':
      return primaryHue;
    case 'analogous':
      return primaryHue + (Math.random() > 0.5 ? 30 : -30);
    case 'complementary':
      return primaryHue + 180;
    case 'split-complementary':
      return primaryHue + (Math.random() > 0.5 ? 150 : 210);
  }
}

export function generateRandomPalette(): ColorPalette {
  const hueRange = pickRandom(SAFE_HUE_RANGES);
  const baseHue = randomInRange(hueRange[0], hueRange[1]);
  const harmony = pickRandom(HARMONY_TYPES);

  const primaryS = randomInRange(55, 85);
  const primaryL = randomInRange(22, 40);
  let primary = hslToHex(baseHue, primaryS, primaryL);

  const secHue = generateSecondaryHue(baseHue, harmony);
  const secS = harmony === 'monochromatic' ? primaryS * 0.7 : randomInRange(45, 80);
  const secL = harmony === 'monochromatic' ? primaryL + 20 : randomInRange(40, 60);
  let secondary = hslToHex(secHue, secS, secL);

  const bg = '#ffffff';
  primary = clampContrast(primary, bg, 3);
  secondary = clampContrast(secondary, bg, 3);

  const neutrals = deriveNeutrals(baseHue);

  return {
    primary,
    secondary,
    ...neutrals,
  };
}

export function shufflePalette(current: ColorPalette): ColorPalette {
  const maxAttempts = 10;
  for (let i = 0; i < maxAttempts; i++) {
    const useCurated = Math.random() < 0.5;
    const candidate = useCurated ? pickRandom(CURATED_PALETTES) : generateRandomPalette();

    // Ensure we don't return the same primary
    if (
      candidate['primary'] &&
      current['primary'] &&
      hexToHsl(candidate['primary']).h !== hexToHsl(current['primary']).h
    ) {
      return candidate;
    }
  }
  return generateRandomPalette();
}
