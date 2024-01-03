module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-void': ['off'], // 允许void类型，间接允许返回void类型时，不写return。由于存在对express next()等库方法的调用，为保证类型兼容，此项须关闭。
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, argsIgnorePattern: '^_' },
    ], // 忽略 rest 属性的兄弟属性，便于解构；忽略函数中下划线开头的参数。
    '@typescript-eslint/consistent-type-imports': ['off'], // Nest.js的依赖注入会被识别为type-imports，自动fix会在import添加type，导致注入失败，此项必须关闭。
    'dot-notation': ['off'], // 依赖库中的值可能使用`[key: string]: any`式的类型定义，我们调用时不可避免的需要使用`obj['key']`来访问某些成员，比如ConfigModule。
    '@typescript-eslint/no-inferrable-types': [
      'error',
      { ignoreProperties: true },
    ], // 允许类属性在设置默认值的同时设置类型，以兼容swagger对DTO中默认值的识别。
    // '@typescript-eslint/explicit-function-return-type': ['warn'], // 显式声明方法返回类型
    '@typescript-eslint/explicit-module-boundary-types': ['warn'], // 导出函数和类的公共类方法上显式返回和参数类型。
    '@typescript-eslint/no-require-imports': ['warn'], // 禁止require
  },
};
