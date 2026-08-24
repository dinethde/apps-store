//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-classnames',
    'prettier-plugin-merge',
  ],
  tailwindStylesheet: './src/styles.css',
  customFunctions: ['cn', 'cva'],
  syntaxTransformation: true,
}

export default config
