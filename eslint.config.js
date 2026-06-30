import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import boundaries from 'eslint-plugin-boundaries';
import jsdoc from 'eslint-plugin-jsdoc';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default tseslint.config(
  // ── Ignores ──────────────────────────────────────────────────────────
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.tsbuildinfo',
      '**/.turbo/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/public/vendor/**',
    ],
  },

  // ── Base: ESLint recommended ─────────────────────────────────────────
  js.configs.recommended,

  // ── TypeScript: strictTypeChecked ────────────────────────────────────
  ...tseslint.configs.strictTypeChecked,

  // ── Global language options & boundaries ──────────────────────────────
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      'boundaries/elements': [
        { type: 'core', pattern: 'packages/core/**' },
        { type: 'layout-engine', pattern: 'packages/layout-engine/**' },
        { type: 'components', pattern: 'packages/components/**' },
        { type: 'layouts', pattern: 'packages/layouts/**' },
        { type: 'presets', pattern: 'packages/presets/**' },
        { type: 'renderer', pattern: 'packages/renderer/**' },
        { type: 'app', pattern: 'packages/app/**' },
      ],
      'boundaries/include': ['packages/**/*'],
      react: { version: 'detect' },
    },
    plugins: {
      boundaries,
    },
    rules: {
      // ── Boundaries: enforce one-way dependency direction ──
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: { type: 'core' }, disallow: { to: { type: '*' } } },
            { from: { type: 'layout-engine' }, allow: { to: { type: 'core' } } },
            { from: { type: 'components' }, allow: { to: { type: ['core', 'layout-engine'] } } },
            { from: { type: 'layouts' }, allow: { to: { type: ['core', 'layout-engine'] } } },
            { from: { type: 'presets' }, allow: { to: { type: 'core' } } },
            { from: { type: 'renderer' }, allow: { to: { type: 'core' } } },
            {
              from: { type: 'app' },
              allow: {
                to: {
                  type: ['core', 'layout-engine', 'components', 'layouts', 'presets', 'renderer'],
                },
              },
            },
          ],
        },
      ],

      // ── TypeScript: strict any-prevention (explicit for visibility) ──
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',

      // ── TypeScript: additional strict rules ──
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],

      // ── TypeScript: selective relaxations ──
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-deprecated': 'warn',
    },
  },

  // ── Import sorting (perfectionist) ───────────────────────────────────
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          groups: [
            'type',
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'side-effect',
          ],
          internalPattern: ['^@cv/.*'],
          newlinesBetween: 0,
        },
      ],
      'perfectionist/sort-named-imports': ['error', { type: 'natural' }],
      'perfectionist/sort-named-exports': ['error', { type: 'natural' }],
    },
  },

  // ── JSDoc: required on exported APIs in library packages ─────────────
  {
    files: [
      'packages/core/src/**/*.ts',
      'packages/layout-engine/src/**/*.{ts,tsx}',
      'packages/renderer/src/**/*.{ts,tsx}',
      'packages/components/src/**/*.{ts,tsx}',
      'packages/layouts/src/**/*.{ts,tsx}',
      'packages/presets/src/**/*.{ts,tsx}',
      'packages/template-api/src/**/*.{ts,tsx}',
      'packages/templates/src/**/*.{ts,tsx}',
    ],
    plugins: { jsdoc },
    settings: {
      jsdoc: { mode: 'typescript' },
    },
    rules: {
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            MethodDefinition: true,
          },
          contexts: ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration'],
          checkConstructors: false,
        },
      ],
      'jsdoc/require-param': ['warn', { checkDestructured: false }],
      'jsdoc/require-returns': 'warn',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/check-param-names': ['error', { checkDestructured: false }],
      'jsdoc/check-tag-names': 'error',
      'jsdoc/no-defaults': 'off',
      'jsdoc/tag-lines': ['warn', 'any'],
    },
  },

  // ── React + accessibility ────────────────────────────────────────────
  {
    files: [
      'packages/app/**/*.{ts,tsx}',
      'packages/components/**/*.{ts,tsx}',
      'packages/templates/**/*.{ts,tsx}',
    ],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Relax for editor UI with legitimate non-standard interactions
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
    },
  },

  // ── Unicorn: selective modern JS rules ───────────────────────────────
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { unicorn },
    rules: {
      'unicorn/no-array-for-each': 'error',
      'unicorn/no-useless-spread': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-string-slice': 'error',
      'unicorn/prefer-at': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/no-array-push-push': 'error',
      'unicorn/throw-new-error': 'error',
    },
  },

  // ── Config files: disable boundaries + type-checked rules ────────────
  {
    files: ['**/*.config.{js,ts,mjs,cjs}', '**/vite.config.*', '**/vitest.config.*'],
    rules: {
      'boundaries/dependencies': 'off',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  // e2e tests and config files not covered by package tsconfigs
  {
    files: ['**/e2e/**/*.ts', '**/*.config.ts', '**/vite.config.*', '**/vitest.config.*'],
    ...tseslint.configs.disableTypeChecked,
  },
);
