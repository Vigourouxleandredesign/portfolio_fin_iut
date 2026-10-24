/**
 * @file ESLint flat config
 * @description Static checks run by `npm run ci` (pre-commit hook and GitHub Actions).
 *   Encodes the XSS rule of AGENTS.md: no HTML string injection in front-end code.
 * @see docs/TESTING.md
 */
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const XSS_MESSAGE = 'XSS: build DOM nodes / use textContent instead (AGENTS.md, SECURITY.md).';

export default defineConfig([
  globalIgnores([
    'dist/',
    'node_modules/',
    'public/',
    'coverage/',
    'test-results/',
    'playwright-report/',
    'blob-report/',
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-restricted-properties': [
        'error',
        { property: 'innerHTML', message: XSS_MESSAGE },
        { property: 'outerHTML', message: XSS_MESSAGE },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
          message: XSS_MESSAGE,
        },
        {
          selector: "CallExpression[callee.object.name='document'][callee.property.name='write']",
          message: XSS_MESSAGE,
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{js,mjs,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    // page.evaluate() callbacks run in the browser
    files: ['scripts/capture-project-shots.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    files: ['tests/**/*.ts'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
]);
