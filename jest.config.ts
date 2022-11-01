import type { Config } from 'jest';

const config: Config = {
	verbose: true,
	testMatch: ['<rootDir>/src/**/*.test.{ts,js}', '<rootDir>/test/**/*.test.{ts,js}'],
	setupFiles: ['<rootDir>/.jest/helpers.ts'],
};

export default config;