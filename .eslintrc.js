/**
 *
 * 规则说明见 https://cn.eslint.org/docs/rules/
 *
 * "off" 或 0 - 关闭规则
 * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
 * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
 *
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'linebreak-style': 'off', // 关闭换行风格检测
    'max-len': ['warn', { code: 160 }], // 一行最大长度，单位为字符
    '@typescript-eslint/interface-name-prefix': 'off', // 可让接口名称使用I作为前缀
    '@typescript-eslint/no-explicit-any': 'off', // 可申明any类型
    '@typescript-eslint/explicit-module-boun':'off',
    'import/no-unresolved': 'off'
  },
};
