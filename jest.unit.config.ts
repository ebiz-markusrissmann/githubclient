// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  testMatch: ['**/test/*.ts?(x)', '**/test/auth/*.ts?(x)', '**/test/converters/*.ts?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  watchPathIgnorePatterns: ['/node_modules/'],
  clearMocks: true,
  collectCoverage: true,
  reporters: ['default', ['jest-junit', { outputDirectory: 'test-reports/unit-test-reports' }]],
  preset: 'ts-jest',
  moduleNameMapper: {
    '^jose/(.*)$': '<rootDir>/node_modules/jose/dist/node/cjs/$1',
  },
  transformIgnorePatterns: []

};
export default config;
