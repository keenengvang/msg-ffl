import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'
import boundariesPlugin from 'eslint-plugin-boundaries'
import importPlugin from 'eslint-plugin-import'
import checkFilePlugin from 'eslint-plugin-check-file'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage', 'src/test/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      boundaries: boundariesPlugin,
      import: importPlugin,
      'check-file': checkFilePlugin,
    },
    settings: {
      'boundaries/elements': [
        { type: 'core', pattern: 'src/core/**/*' },
        { type: 'shared', pattern: 'src/shared/**/*' },
        { type: 'features', pattern: 'src/features/**/*' },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // Enforce kebab-case for non-component .ts files
      'check-file/filename-naming-convention': [
        'error',
        {
          // All .ts files must be kebab-case (hooks, utilities, types, api, config, etc.)
          'src/**/*.ts': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true, // allows foo.test.ts, foo.api.ts, foo.types.ts
        },
      ],

      // No cross-feature imports — a file in features/X cannot import from features/Y
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/features/achievements',
              from: './src/features',
              except: ['./achievements'],
              message: 'Features cannot import from other features. Move shared logic to shared/.',
            },
            {
              target: './src/features/draft',
              from: './src/features',
              except: ['./draft'],
              message: 'Features cannot import from other features. Move shared logic to shared/.',
            },
            {
              target: './src/features/history',
              from: './src/features',
              except: ['./history'],
              message: 'Features cannot import from other features. Move shared logic to shared/.',
            },
            {
              target: './src/features/home',
              from: './src/features',
              except: ['./home'],
              message: 'Features cannot import from other features. Move shared logic to shared/.',
            },
            {
              target: './src/features/managers',
              from: './src/features',
              except: ['./managers'],
              message: 'Features cannot import from other features. Move shared logic to shared/.',
            },
            {
              target: './src/features/matchups',
              from: './src/features',
              except: ['./matchups'],
              message: 'Features cannot import from other features. Move shared logic to shared/.',
            },
            {
              target: './src/features/playoffs',
              from: './src/features',
              except: ['./playoffs'],
              message: 'Features cannot import from other features. Move shared logic to shared/.',
            },
            {
              target: './src/features/standings',
              from: './src/features',
              except: ['./standings'],
              message: 'Features cannot import from other features. Move shared logic to shared/.',
            },
            {
              target: './src/features/transactions',
              from: './src/features',
              except: ['./transactions'],
              message: 'Features cannot import from other features. Move shared logic to shared/.',
            },
          ],
        },
      ],
    },
  },
  prettier,
)
