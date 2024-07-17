import fs from "fs";
import path from "path"

import * as jwt from 'jsonwebtoken';
import { Response } from 'express';

<<<<<<< HEAD:backend/src/utils/tests/tokenUtils.test.ts
import { generateRandomFileName } from "../fileUtils";
import { clearRefreshTokenCookie, generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "../tokenUtils";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../globals";
=======
import { generateRandomFileName } from "./utils";
import { clearRefreshTokenCookie, generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "./tokenUtils";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./globals";
>>>>>>> origin:backend/src/utils/utils.test.ts

const ENV_PATH = path.join('..', 'backend', '.env.development');

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('token')
}));

const mockJwt = jwt as jest.Mocked<typeof jwt>;

/***
 * This section test the major functions from the tokenUtils.ts files
 */
describe('tokenUtils test cases', () => {

    describe('generateAccessToken', () => {
        test('should generate an access token with correct payload and options', () => {

            const userId = BigInt(123456789);
            const result = generateAccessToken(userId);
            expect(mockJwt.sign).toHaveBeenCalledWith({ userId: 123456789 }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

<<<<<<< HEAD:backend/src/utils/tests/tokenUtils.test.ts
            expect(mockJwt.sign).toHaveBeenCalledWith(
                { userId: userId },
                ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );

            expect(result).toEqual({ accessToken: 'accessToken', info: { expiresIn: 30 * 60 * 1000 } });
=======
            expect(result).toEqual({ accessToken: 'token', info: { expiresIn: 30 * 60 * 1000 } });
>>>>>>> origin:backend/src/utils/utils.test.ts
        });
    });

    describe('generateRefreshToken', () => {
        test('should generate a refresh token with correct payload and options', () => {

            const userId = BigInt(123456789);
            const result = generateRefreshToken(userId);
            expect(mockJwt.sign).toHaveBeenCalledWith({ userId: 123456789 }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

<<<<<<< HEAD:backend/src/utils/tests/tokenUtils.test.ts
            expect(mockJwt.sign).toHaveBeenCalledWith(
                { userId: userId },
                REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            );
            expect(result).toEqual({ refreshToken: 'refreshToken', info: { expiresIn: 7 * 24 * 60 * 60 * 1000 } });
=======
            expect(result).toEqual({ refreshToken: 'token', info: { expiresIn: 7 * 24 * 60 * 60 * 1000 } });
>>>>>>> origin:backend/src/utils/utils.test.ts
        });
    });

    describe('setRefreshTokenCookie', () => {
        test('should set refresh token cookie with correct options', () => {
            const res = {
                cookie: jest.fn()
            } as unknown as Response;

            setRefreshTokenCookie(res, { refreshToken: 'refreshToken' });

            expect(res.cookie).toHaveBeenCalledWith(
                'refreshToken',
                'refreshToken',
                {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                }
            );
        });
    });

    describe('clearRefreshTokenCookie', () => {
        test('should clear refresh token cookie with correct options', () => {
            const res = {
                clearCookie: jest.fn()
            } as unknown as Response;

            clearRefreshTokenCookie(res);

            expect(res.clearCookie).toHaveBeenCalledWith(
                'refreshToken',
                {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'strict'
                }
            );
        });
    });
<<<<<<< HEAD:backend/src/utils/tests/tokenUtils.test.ts
=======
});




describe("Return A random string that can be used to name a file", () => {
    const fixedDate = new Date("2024-07-14T00:00:00Z");

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(fixedDate);
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    test("returns a filename containing the date", () => {
        const fileName = generateRandomFileName();
        expect(fileName).toMatch(/^2024-07-14-[a-z0-9]+/);
    });

    test("returns a random fileName each time", () => {
        const fileName1 = generateRandomFileName();
        const fileName2 = generateRandomFileName();
        expect(fileName1).not.toBe(fileName2);
    });

    test("returns unique file name on multiple calls", () => {
        const generatedNames = new Set();
        for (let i = 0; i < 100; i++) {
            generatedNames.add(generateRandomFileName());
        };

        expect(generatedNames.size).toBe(100);
    });
});



describe("Ensure that .env file is configured", () => {

    let envFileExist = true;
    const envVar: {[key: string]: any} = {};

    try {
        const fileContent = fs.readFileSync(ENV_PATH, "utf-8");
        fileContent.split("\n")
            .map(i => i.trim())
            .filter(i => i !== "")
            .forEach(it => {
                const [key, value] = it.split("=");
                envVar[key] = value;
            });
    } catch {
        envFileExist = false;
    }

    test(".env file exists", () => {
        expect(envFileExist).toBe(true);
    });

    test(".env config variable types", () => {
        expect(envVar["SERVER_NAME"]).toBeDefined();
        expect(envVar["DATABASE_URL"]).toBeDefined();
        expect(envVar["EMAIL_USER"]).toMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        expect(envVar["EMAIL_PASSWORD"]).toBeDefined();
        expect(envVar["BACKEND_PORT"]).toMatch(/[0-9]+/);
        expect(envVar["EMAIL_PORT"]).toMatch(/[0-9]+/);
        expect(envVar["ACCESS_TOKEN_SECRET"]).toBeDefined();
        expect(envVar["REFRESH_TOKEN_SECRET"]).toBeDefined();
        expect(envVar["EMAIL_SECURE"]).toMatch(/true|false/);
    });

>>>>>>> origin:backend/src/utils/utils.test.ts
});