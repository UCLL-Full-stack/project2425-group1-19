import type { Config } from 'jest';

const config: Config = {
  
  clearMocks: true,
  testEnvironment: 'jest-environment-jsdom', // Use jsdom for testing React components
  transform: {
    '^.+\\.tsx?$': 'babel-jest', // Use babel-jest to transform TypeScript and JavaScript files
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'], // Add setupTests.ts for jest-dom
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1', // Map @ alias to the src directory
  // },
  transformIgnorePatterns: [
    'node_modules/(?!(module-to-transform)/)', // Transform node_modules if necessary
  ],
};

export default config;
