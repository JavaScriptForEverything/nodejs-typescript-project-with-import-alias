import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest', 						// to use ts-jest instead of jest
  testEnvironment: "node", 			// for nodejs language
  roots: ['<rootDir>/src'], 		// Set the root directory to 'src'

	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},

	verbose: true,
	testMatch: ["**/__tests__/**/*.test.ts"],
	setupFilesAfterEnv: ['./jest.setup.ts'],
}

export default config
