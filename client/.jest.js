module.exports = {
  setupFiles: [
    './test/setup.js',
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testRegex: '.*\\.test\\.js$',
  collectCoverage: false,
  collectCoverageFrom: [
    'src/components/**/*.{jsx}'
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/test/__mocks__/styleMock.js",
    "\\.module$": "identity-obj-proxy"
  },
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.jsx$": "babel-jest"
  },
};
