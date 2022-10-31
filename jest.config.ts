import type { Config } from 'jest';

const config: Config = {
	verbose: true,
	setupFiles: ['<rootDir>/.jest/helpers.ts'],
};

export default config;