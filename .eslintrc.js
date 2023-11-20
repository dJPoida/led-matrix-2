module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:react-hooks/recommended',
  ],
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'node', 'prettier', 'react', 'react-hooks'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    eqeqeq: ['error', 'always'],
    indent: ['error', 2],
    'linebreak-style': ['off'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-multi-spaces': ['error'],
    'no-template-curly-in-string': ['error'],
    'no-useless-concat': ['error'],
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: ['modules'],
      },
    ],
    'node/no-missing-import': [
      'error',
      {
        allowModules: [],
        resolvePaths: [],
        tryExtensions: ['.ts', '.js', '.d.ts', '.tsx', '.scss'],
      },
    ],
    'prefer-template': ['error'],
    'prettier/prettier': ['error'],
    '@typescript-eslint/no-unused-vars': ['warn'],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', propElementValues: 'never' }],
  },
};
