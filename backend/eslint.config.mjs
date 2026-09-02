//  @ts-check

import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'eslint.config.mjs', 'prettier.config.mjs'] },
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        // The seed runs under bun and sits outside the build's tsconfig.
        projectService: { allowDefaultProject: ['prisma/seed.ts'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // A leading underscore marks a parameter kept for a signature.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
)
