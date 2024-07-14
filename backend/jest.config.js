/**
 * @file jest.config.ts
 * @date 14th july, 2024
 *
 * This source file includes the configuration for jest. Yo! dev, I know what you are thinking !
 * Don't try to mess with this source file, otherwise:
 *  ---- i will hunt you,
 *  ---- i will find you, and
 *  ---- i will eat spaghetti
 *
 *  BUt if youre a lady, i'd ask for a "pull" request and it's not even that type of pull on github
 */

module.exports = {

    preset: 'ts-jest',

    testEnvironment: "node",//'./tests/prisma-test-environment.ts',

    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ],

    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
    ],
};
