module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    roots: ['./src/test'],
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    setupFiles: ['./src/test/setup.ts'],
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        'src/ts/**/*.{ts,js}',
        '!src/ts/**/*.d.ts',
        '!src/ts/**/server.ts', // exclude server files
        '!src/ts/**/migrations/**/*', // exclude migration files
        '!src/ts/**/seed.ts', // exclude seed files
        '!src/ts/**/codeTemplateSeed.ts', // exclude code-seed files
    ],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};