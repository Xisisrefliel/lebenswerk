import type { Locale, Skill, SkillChild } from '@cv/core';
import type { ComponentRenderProps } from '@cv/layout-engine';
import { getLabel } from './labels.js';
import { optNum, optStr } from './optionUtils.js';

const LEVEL_KEYS: { threshold: number; key: string }[] = [
  { threshold: 14, key: 'level_beginner' },
  { threshold: 28, key: 'level_elementary' },
  { threshold: 43, key: 'level_intermediate' },
  { threshold: 57, key: 'level_upper_intermediate' },
  { threshold: 71, key: 'level_advanced' },
  { threshold: 86, key: 'level_proficient' },
  { threshold: 100, key: 'level_expert' },
];

function levelToLabel(level: number, locale: Locale): string {
  for (const { threshold, key } of LEVEL_KEYS) {
    if (level <= threshold) return getLabel(locale, key as Parameters<typeof getLabel>[1]);
  }
  return getLabel(locale, 'level_expert' as Parameters<typeof getLabel>[1]);
}

function getValue(level: number | undefined): number {
  if (level == null) return 0.5;
  return level / 100;
}

/**
 * Returns filled count as whole number (e.g. 70 → 4).
 * Rounded to nearest integer for clean rendering in PDF/print.
 * @param level
 * @returns Star count from 0 to 5, whole values only
 */
function getStarCount(level: number | undefined): number {
  if (level == null) return 3;
  return Math.min(5, Math.round(level / 20)); // 70 → 4, 100 → 5, 40 → 2, 90 → 5
}

function LevelIndicator({
  displayMode,
  level,
  locale,
}: {
  displayMode: string;
  level: number | undefined;
  locale: Locale;
}) {
  switch (displayMode) {
    case 'none':
      return null;
    case 'bar': {
      const pct = Math.round(getValue(level) * 100);
      return (
        <div className="cv-skill-bar-inline">
          <div className="cv-skill-bar-track">
            <div className="cv-skill-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      );
    }
    case 'stars':
    case 'dots': {
      const count = getStarCount(level);
      const filled = displayMode === 'stars' ? '\u2605' : '\u25CF';
      const empty = displayMode === 'stars' ? '\u2606' : '\u25CB';
      return (
        <span className="cv-skill-visual-icons">
          {Array.from({ length: 5 }, (_, i) => {
            const pos = i + 1;
            if (pos <= count) return <span key={i}>{filled}</span>;
            if (pos - 0.5 <= count)
              return (
                <span key={i} className="cv-icon-half">
                  <span className="cv-icon-half-filled">{filled}</span>
                  <span className="cv-icon-half-empty">{empty}</span>
                </span>
              );
            return (
              <span key={i} className="cv-empty">
                {empty}
              </span>
            );
          })}
        </span>
      );
    }
    default:
      return level != null ? (
        <span className="cv-skill-level">{levelToLabel(level, locale)}</span>
      ) : null;
  }
}

// ---------------------------------------------------------------------------
// Data normalization — handles all edge cases
// ---------------------------------------------------------------------------

interface NormalizedGroup {
  id: string;
  name: string;
  children: SkillChild[];
}

/**
 * Normalize skills into groups for rendering.
 *
 * Cases:
 * - All flat (no children) → no groups, return empty array (caller renders flat)
 * - All grouped → return groups as-is
 * - Mixed → grouped skills stay, ungrouped collected into a "Sonstiges"/"Other" group
 * @param skills
 * @param otherLabel
 * @returns Object with normalized groups and remaining flat items
 */
function normalizeGroups(
  skills: readonly Skill[],
  otherLabel: string,
): {
  groups: NormalizedGroup[];
  flatItems: Skill[];
} {
  const groups: NormalizedGroup[] = [];
  const ungrouped: Skill[] = [];

  for (const s of skills) {
    if (s.children.length > 0) {
      groups.push({ id: s.id, name: s.name, children: [...s.children] });
    } else {
      ungrouped.push(s);
    }
  }

  // All flat — no groups at all
  if (groups.length === 0) {
    return { groups: [], flatItems: ungrouped };
  }

  // Mixed — collect ungrouped into an "Other" group
  if (ungrouped.length > 0) {
    groups.push({
      id: '__other',
      name: otherLabel,
      children: ungrouped.map((s) => ({ id: s.id, name: s.name, level: s.level })),
    });
  }

  return { groups, flatItems: [] };
}

// ---------------------------------------------------------------------------
// Rendering: a single skill item (used in both flat and grouped contexts)
// ---------------------------------------------------------------------------

function SkillItem({
  name,
  level,
  displayMode,
  className,
  locale,
}: {
  name: string;
  level: number | undefined;
  displayMode: string;
  className: string;
  locale: Locale;
}) {
  return (
    <div className={className}>
      <span>{name}</span>
      <LevelIndicator displayMode={displayMode} level={level} locale={locale} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rendering: a group card
// ---------------------------------------------------------------------------

function GroupCard({
  group,
  displayMode,
  variant,
  locale,
}: {
  group: NormalizedGroup;
  displayMode: string;
  variant: 'sidebar' | 'main';
  locale: Locale;
}) {
  const cls = variant === 'main' ? 'cv-skill-group-main' : 'cv-skill-group';
  const childrenCls =
    variant === 'main' ? 'cv-skill-group-children-main' : 'cv-skill-group-children';
  const itemCls = variant === 'main' ? 'cv-skill-main' : 'cv-skill';

  return (
    <div className={cls}>
      <div className="cv-skill-group-heading">{group.name}</div>
      <div className={childrenCls}>
        {group.children.map((child) => (
          <SkillItem
            key={child.id}
            name={child.name}
            level={child.level}
            displayMode={displayMode}
            className={itemCls}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 *
 * @param root0
 * @returns React element displaying the skills section, or null if empty
 */
export function SkillsList({ resume, locale, tokens, options, slot }: ComponentRenderProps) {
  const displayMode = 'none';
  const explicitColumns = optNum(options, 'columns');

  if (resume.skills.length === 0) return null;

  const isMain = slot === 'main';
  const otherLabel = locale === 'de' ? 'Sonstiges' : 'Other';
  const { groups, flatItems } = normalizeGroups(resume.skills, otherLabel);

  // Determine column count
  let columns: number;
  if (!isMain) {
    columns = 1; // sidebar always 1
  } else if (explicitColumns) {
    columns = explicitColumns;
  } else if (groups.length > 0) {
    columns = Math.min(groups.length, 3); // auto-fit groups
  } else {
    // Flat items in main — use 2 cols for 4+, 3 cols for 7+
    columns = flatItems.length >= 7 ? 3 : flatItems.length >= 4 ? 2 : 1;
  }

  const gridCls = isMain
    ? `cv-skills-main cv-skills-main--${columns}`
    : `cv-skills-grid cv-skills-grid--${columns}`;

  return (
    <section className="cv-section">
      <h2
        className={`cv-section-title cv-section-title--${optStr(tokens.options, 'sectionTitleStyle', 'uppercase-spaced')}`}
      >
        {getLabel(locale, 'skills')}
      </h2>

      {groups.length > 0 ? (
        /* Grouped rendering */
        <div className={gridCls}>
          {groups.map((g) => (
            <GroupCard
              key={g.id}
              group={g}
              displayMode={displayMode}
              variant={isMain ? 'main' : 'sidebar'}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        /* Flat rendering — no group headings */
        <div className={gridCls}>
          {flatItems.map((s) => (
            <SkillItem
              key={s.id}
              name={s.name}
              level={s.level}
              displayMode={displayMode}
              className={isMain ? 'cv-skill-main' : 'cv-skill'}
              locale={locale}
            />
          ))}
        </div>
      )}
    </section>
  );
}
