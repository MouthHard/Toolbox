module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', 'import'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prettier/prettier': 'error',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    // 导入顺序规则
    'import/order': [
      'error',
      {
        'groups': [
          'builtin', // Node.js内置模块（fs、path等）
          'external', // 第三方依赖（react、lodash等）
          'internal', // 内部模块（@/开头的别名导入）
          'parent', // 父级目录导入（../xxx）
          'sibling', // 同级目录导入（./xxx）
          'index', // 索引文件导入
          'object', // 对象导入
          'type' // 类型导入
        ],
        'pathGroups': [
          {
            'pattern': 'react',
            'group': 'external',
            'position': 'before' // react放在最前面
          },
          {
            'pattern': '@/**',
            'group': 'internal'
          }
        ],
        'pathGroupsExcludedImportTypes': ['react'],
        'newlines-between': 'always', // 不同组之间空一行
        'alphabetize': {
          'order': 'asc', // 按字母升序排序
          'caseInsensitive': true // 不区分大小写
        }
      }
    ]
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.app.json',
      },
    },
  },
}
