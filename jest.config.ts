import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest', 						// to use ts-jest instead of jest
  testEnvironment: "node", 			// for nodejs language
  roots: ['<rootDir>/src'], 		// Set the root directory to 'src'

	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},

  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }), // Map import aliases
  // transform: {
  //   '^.+\\.ts$': 'ts-jest',
  // },
  // moduleFileExtensions: ['ts', 'js', 'json'],

	verbose: true,
	testMatch: ["**/__tests__/**/*.test.ts"],
	setupFilesAfterEnv: ['./jest.setup.ts'],
}

export default config
