import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default [
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: rootDir,
        projectService: {
          allowDefaultProject: ['bin.js', '*.config.ts'],
        },
      },
    },
  },
  {
    ignores: [
      'dist/**',
      '**/dist/**',
      'packages/**',
      'templates/**',
      'demo-a/**',
      '*.config.mjs',
      'eslint.config.mjs',
    ],
  },
];
