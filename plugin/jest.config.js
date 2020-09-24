const tsjest = require('ts-jest/presets').defaults

module.exports = {
  preset: 'ts-jest',
  "setupFiles": ["jest-canvas-mock", "./test/setup.ts"],
  rootDir: '.',
  transform: {
    ...tsjest.transform,
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
  },
  // 文件后缀
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx"
  ],
  // 模块路径别名
  moduleNameMapper: {
    // 所以～/Hetu路径, 默认使用mock
    '^~/Hetu$': '<rootDir>/src/__mocks__/Hetu',
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
    "monaco-editor": "<rootDir>/node_modules/react-monaco-editor",
  },
  // 匹配测试文件
  testMatch: ["<rootDir>/src/**/*.test.[jt]s?(x)"],
  // 如果想单独测试某个组件, 将上面的配置替换为下面的
  // testMatch: ["<rootDir>/src/components/Form/**/*.test.[jt]s?(x)"],
  // 忽略测试
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/", "<rootDir>/lib/"],
  collectCoverage: false,
  // 测试覆盖率
  coverageThreshold: {
    "global": {
      // 分支覆盖率, 是否测试用例的每个if代码块都执行了
      "branches": 50,
      // 函数覆盖率, 是否测试用例的每一个函数都调用了
      "functions": 50,
      // 行覆盖率, 是否测试用例都每一行都执行了
      "lines": 50,
      // 语句覆盖率, 是否测试用例都每个语句都执行了
      "statements": 50
    },
    "./src/components": {
      "branches": 80,
      "statements": 80
    },
    "./src/utils": {
      "branches": 90,
      "statements": 90
    }
  },
  // 覆盖率来源
  collectCoverageFrom: [
    "**/src/**",
    "!**/src/**/*/__editor__/**/*",
    "!**/src/components/_EditableTable/**",
    "!**/src/components/_Chart/**",
    "!**/src/**/*.d.ts",
    "!**/src/**/*.less",
    "!**/src/**/*.snap",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/lib/**",
    "!**/gulpfile.js/**",
    "!**/scripts/**",
    "!**/site/**",
    "!**/_site/**",
    "!**/.history/**",
    "!**/coverage/**",
  ],
}
