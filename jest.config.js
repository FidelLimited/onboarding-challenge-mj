module.exports = {
  collectCoverage: false,
  collectCoverageFrom: [
    '!**/node_modules/**',
    '!src/common/types/*.d.ts',
    'src/**/*.{ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 99,
      functions: 99,
      lines: 99,
      statements: 99,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  preset: 'ts-jest',
  rootDir: '.',
  testMatch: ['**/__tests__/unit/**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    '/out/',
    '/node_modules/',
    '(/__tests__/.*|(\\.|/)(test|spec))\\.d.ts$',
  ],
  verbose: true,
};
