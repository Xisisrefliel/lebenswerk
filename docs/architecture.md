# Architecture

## Overview

This is a pnpm monorepo with an enforced one-way dependency graph (via `eslint-plugin-boundaries`):

```
@cv/app → @cv/renderer → @cv/layout-engine, @cv/components, @cv/layouts, @cv/presets → @cv/core
```

## Packages

| Package           | Purpose                                                                                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **core**          | Zod schemas (Extended JSON Resume), types, migrations, sample data                                                                                    |
| **layout-engine** | `renderDesignPage()` assembles layout + components + tokens into HTML + CSS; `tokensToCss()` converts design tokens to CSS custom properties          |
| **components**    | React CV components (Photo, PersonalInfo, SkillsList with 5 display modes, etc.). All use `.cv-` prefixed classes and `var(--cv-*)` custom properties |
| **layouts**       | Layout definitions: `sidebar-left`, `sidebar-right`, `full-width`, `top-header`. Each has `layout.ts`, `design.ts`, `styles.css`                      |
| **presets**       | Built-in design presets (classic, modern, minimal) combining layout + tokens                                                                          |
| **renderer**      | `PagedRenderer` class: renders HTML+CSS in isolated iframe with Paged.js polyfill, then `window.print()` for PDF                                      |
| **app**           | Vite 8 + React 19 editor UI. Zustand stores with localStorage persistence. i18next for UI strings. TipTap for rich text editing                       |

## Rendering Pipeline

```
Resume Data
  → renderDesignPage(resume, design, locale)
  → { html, css }
  → PagedRenderer.render(html, css)
  → Paged.js pagination in iframe
  → print()
  → PDF
```

The rendering pipeline is fully client-side. Resume data is passed through the layout engine which combines the selected layout definition, component renderers, and design tokens to produce a complete HTML document with CSS custom properties. This document is rendered inside an isolated iframe using the Paged.js polyfill for CSS paged media, producing paginated output ready for `window.print()`.

## Key Conventions

### Component CSS

- `.cv-` prefix for all class names
- Colors via `var(--cv-*)` custom properties
- Fonts via `var(--cv-font-*)` custom properties
- Print-safe units (`mm`, `pt` — not `px`)
- `break-inside: avoid` on logical groups

### Design Tokens

- Declared in `DesignDefinition`
- Resolved to a flat object
- Injected as CSS custom properties on the rendered document

### Localization

- `LocalizedString` type: `{ de: string; en: string }`
- Used throughout schemas for all user-facing resume content
- Locale passed to render functions to select the correct string

### TypeScript

- Strict mode with `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax`
- Internal deps use `workspace:*` protocol

## App Structure (`packages/app/src/`)

| Directory   | Purpose                                      |
| ----------- | -------------------------------------------- |
| `editor/`   | Resume data forms                            |
| `designer/` | Preset picker, token editor, slot reordering |
| `preview/`  | PreviewPane using PagedRenderer              |
| `settings/` | Locale switch, config drawer                 |
| `io/`       | JSON import/export                           |
| `stores/`   | Zustand persistent stores                    |

## Deployment

GitHub Pages at base path `/lebenslauf-anschreiben-creator/`. CI runs lint → format:check → typecheck → test → build on PRs and pushes to main.
