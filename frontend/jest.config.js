module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: [String.raw`node_modules/(?!.*\.mjs$)`],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: String.raw`\.(html|svg)$`,
        diagnostics: false,
      },
    ],
  },
};
