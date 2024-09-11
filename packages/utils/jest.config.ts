/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  errorOnDeprecated: false,
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],

  roots: ['<rootDir>/src'],

  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};

export default config;
