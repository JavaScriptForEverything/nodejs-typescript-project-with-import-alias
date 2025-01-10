import type { Config } from 'jest'

const config: Config = {
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1'
		// '^@/(.*)$': '<rootDir>/src/$1'
	},

  preset: 'ts-jest',
  testEnvironment: "jest-environment-node",
	verbose: true,
	testMatch: ["**/__tests__/**/*.test.ts"],
	// setupFilesAfterEnv: ['./src/jest.setup.ts'],
}

export default config