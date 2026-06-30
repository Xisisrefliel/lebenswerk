import type { Locale, LocalizedString, Resume, SlotAssignment } from '@cv/core';
import type { ComponentType } from 'react';
import type { z } from 'zod';

// ---------------------------------------------------------------------------
// Data fields — what resume data a component reads
// ---------------------------------------------------------------------------

/**
 *
 */
export type DataField =
  | 'basics.name'
  | 'basics.label'
  | 'basics.image'
  | 'basics.summary'
  | 'basics.email'
  | 'basics.phone'
  | 'basics.url'
  | 'basics.location'
  | 'basics.profiles'
  | 'basics.birthDate'
  | 'basics.birthPlace'
  | 'basics.nationality'
  | 'work'
  | 'education'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'certificates'
  | 'publications'
  | 'awards'
  | 'volunteer'
  | 'interests'
  | 'references'
  | 'custom';

// ---------------------------------------------------------------------------
// Slot types — open-ended string so designs can define custom slots
// ---------------------------------------------------------------------------

/**
 *
 */
export type SlotType = string;

// ---------------------------------------------------------------------------
// Document types a design can support
// ---------------------------------------------------------------------------

/**
 *
 */
export type DocumentType = 'lebenslauf' | 'anschreiben';

// ---------------------------------------------------------------------------
// Resolved tokens — flat key-value map passed to components
// ---------------------------------------------------------------------------

/**
 * Resolved design tokens as a flat map. Components read values like
 * `tokens.colors.primary` or `tokens.options['sectionTitleStyle']`.
 * This is computed from DesignDefinition defaults + UserOverrides.
 */
export interface ResolvedTokens {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: string;
  options: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Component render props
// ---------------------------------------------------------------------------

/**
 *
 */
export interface ComponentRenderProps {
  resume: Resume;
  tokens: ResolvedTokens;
  options: Record<string, unknown>;
  locale: Locale;
  slot: string;
}

// ---------------------------------------------------------------------------
// Component definition
// ---------------------------------------------------------------------------

/**
 *
 */
export interface ComponentDefinition {
  id: string;
  name: LocalizedString;
  dataFields: readonly DataField[];
  allowedSlots: readonly SlotType[];
  optionsSchema: z.ZodType;
  defaultOptions: Record<string, unknown>;
  render: ComponentType<ComponentRenderProps>;
}

// ---------------------------------------------------------------------------
// Design token declarations — each design declares what it supports
// ---------------------------------------------------------------------------

/**
 *
 */
export interface ColorTokenDeclaration {
  key: string;
  label: LocalizedString;
  default: string;
  cssVar: string;
}

/**
 *
 */
export interface FontTokenDeclaration {
  key: string;
  label: LocalizedString;
  default: string;
  cssVar: string;
  options: Array<{ label: string; value: string }>;
}

/**
 *
 */
export interface SpacingDeclaration {
  options: string[];
  default: string;
  scale: Record<string, { section: string; entry: string; gap: string }>;
}

/**
 *
 */
export interface EnumOptionDeclaration {
  type: 'enum';
  key: string;
  label: LocalizedString;
  values: Array<{ value: string; label: LocalizedString }>;
  default: string;
  cssVar?: string;
}

/**
 *
 */
export interface RangeOptionDeclaration {
  type: 'range';
  key: string;
  label: LocalizedString;
  min: number;
  max: number;
  step: number;
  default: number;
  unit: string;
  cssVar?: string;
}

/**
 *
 */
export type OptionDeclaration = EnumOptionDeclaration | RangeOptionDeclaration;

// ---------------------------------------------------------------------------
// Expanded slot definition (used in DesignDefinition)
// ---------------------------------------------------------------------------

/**
 *
 */
export interface ExpandedSlotDefinition {
  accepts: readonly SlotType[];
  maxComponents?: number;
  defaultComponents: SlotAssignment[];
  options?: Record<string, OptionDeclaration>;
}

// ---------------------------------------------------------------------------
// Anschreiben (cover letter) configuration — DIN 5008
// ---------------------------------------------------------------------------

/**
 *
 */
export interface AnschreibenConfig {
  /** CSS value for header zone background, e.g. 'var(--cv-sidebar-bg)'. */
  headerBg?: string;
  /** Components to render in the header zone (DIN 5008 Briefkopf). */
  headerComponents?: SlotAssignment[];
  /** Slot types accepted in the header (for component compatibility filtering in the editor). */
  headerAccepts?: readonly string[];
  /** Show a footer strip. */
  showFooter?: boolean;
  /** CSS value for footer background. */
  footerBg?: string;
  /** Components to render in the footer zone. */
  footerComponents?: SlotAssignment[];
  /** Slot types accepted in the footer. */
  footerAccepts?: readonly string[];
}

// ---------------------------------------------------------------------------
// DesignDefinition — the single source of truth for a design
// ---------------------------------------------------------------------------

/**
 *
 */
export interface DesignDefinition {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  thumbnail: string;

  documentTypes: DocumentType[];
  supportedLocales: Locale[];

  colors: ColorTokenDeclaration[];
  fonts: FontTokenDeclaration[];
  spacing?: SpacingDeclaration;

  /** Global design options (borderStyle, sectionTitleStyle, etc.) */
  options?: Record<string, OptionDeclaration>;

  /** Slots with capabilities, default components, and per-slot options. */
  slots: Record<string, ExpandedSlotDefinition>;

  /** DIN 5008 cover letter configuration. Designs only control header/footer styling. */
  anschreibenConfig?: AnschreibenConfig;

  /** CSS — static string or function that receives resolved slot options. */
  css: string | ((resolved: Record<string, unknown>) => string);
}
