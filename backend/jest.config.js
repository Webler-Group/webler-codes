module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    roots: ['./ts/test'],
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    setupFiles: ['./ts/test/setup.ts'],
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        'ts/src/**/*.{src,js}',
        '!ts/src/**/server.ts', // exclude server files
        '!ts/src/**/seed.ts', // exclude seed files
        '!ts/src/**/codeTemplateSeed.ts', // exclude code-seed files
    ],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    testTimeout: 30000
};