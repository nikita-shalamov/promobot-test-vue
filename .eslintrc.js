export default {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
