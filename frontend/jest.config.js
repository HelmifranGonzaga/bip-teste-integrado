module.exports = {
  preset: 'jest-preset-angular',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@features/(.*)': '<rootDir>/src/app/features/$1',
    '@pages/(.*)': '<rootDir>/src/app/pages/$1'
  },
  collectCoverage: false,
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|@angular|primeng|primeicons|@primeuix|@prime-core))']
};
