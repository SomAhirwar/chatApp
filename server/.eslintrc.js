module.exports = {
  env: {
    commonjs: true,
    es2017: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier', 'plugin:node/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'import/no-unresolved': 'warn',
    'node/no-missing-require': 'warn',
    'no-process-exit': 'warn',
    'no-underscore-dangle': ['warn', { allow: ['_id'] }],
    'prefer-destructuring': 'warn',
    'no-param-reassign': 'warn',
    'no-plusplus': 'warn',
  },
}
