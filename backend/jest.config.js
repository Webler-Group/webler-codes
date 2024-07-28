module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    roots: ['./src/test'],
    testMatch: ['**/*.test.src'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    setupFiles: ['./src/test/setup.src'],
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        'src/src/**/*.{src,js}',
        '!src/src/**/*.d.src',
        '!src/src/**/server.src', // exclude server files
        '!src/src/**/migrations/**/*', // exclude migration files
        '!src/src/**/seed.src', // exclude seed files
        '!src/src/**/codeTemplateSeed.src', // exclude code-seed files
    ],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    testTimeout: 30000
};