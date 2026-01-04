export default {
    globalSetup: "<rootDir>/global-setup.ts",
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            useESM: true,
            tsconfig: {
                module: 'ES2020',
                moduleResolution: 'node'
            }
        }]
    },
    testMatch: ['**/*.spec.ts'],
    transformIgnorePatterns: []
}
