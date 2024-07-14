/***
 * @file utils.test.ts
 * @date 14th July, 2024
 * 
 * ..............Kamikazeee, dayuuuumn.
 */
import fs from "fs";
import path from "path"

import * as jwt from 'jsonwebtoken';
import { Response } from 'express';

import { generateRandomFileName } from "./fileUtils";
import { clearRefreshTokenCookie, generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "./tokenUtils";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./globals";


const PARENT_DIR = path.resolve("../");

const ENV_PATH = path.join(PARENT_DIR, "backend/.env");

// mock the entire json web token
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(), }));

const mockJwt = jwt as jest.Mocked<typeof jwt>;

const mockSign = jest.fn();


/***
 * This section test the major functions from the tokenUtils.ts files
 */
describe('tokenUtils test cases', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateAccessToken', () => {
        it('should generate an access token with correct payload and options', () => {
            mockSign.mockReturnValue('accessToken');

            const userId = BigInt(123456789);
            const result = generateAccessToken(userId);

            expect(mockJwt.sign).toHaveBeenCalledWith(
                { userId: '123456789' },
                ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );
            expect(result).toEqual({ accessToken: 'accessToken', info: { expiresIn: 30 * 60 * 1000 } });
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a refresh token with correct payload and options', () => {
            mockSign.mockReturnValue('refreshToken');

            const userId = BigInt(123456789);
            const result = generateRefreshToken(userId);

            expect(mockJwt.sign).toHaveBeenCalledWith(
                { userId: '123456789' },
                REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            );
            expect(result).toEqual({ refreshToken: 'refreshToken', info: { expiresIn: 7 * 24 * 60 * 60 * 1000 } });
        });
    });

    describe('setRefreshTokenCookie', () => {
        it('should set refresh token cookie with correct options', () => {
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
        it('should clear refresh token cookie with correct options', () => {
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
        for (let i = 0; i < 1000; i++) {
            generatedNames.add(generateRandomFileName());
        };

        expect(generatedNames.size).toBe(1000);
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

    test(".env config for development", () => {
        expect(envVar["SERVER_NAME"]).toBe("localhost");
        expect(envVar["BACKEND_PORT"]).toBe("1234");
        expect(envVar["DATABASE_URL"]).toMatch("postgresql://webler_user:secret@postgres:5432/webler_codes_localhost_db?schema");
        expect(envVar["EMAIL_USER"]).toMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        expect(envVar["EMAIL_PASSWORD"]).toMatch(/^[a-zA-Z0-9]{4} [a-zA-Z0-9]{4} [a-zA-Z0-9]{4} [a-zA-Z0-9]{4}$/);
        expect(envVar["EMAIL_SECURE"]).toBe("false");
        expect(envVar["EMAIL_PORT"]).toBe("587");
        expect(envVar["ACCESS_TOKEN_SECRET"]).toBe("secret1");
        expect(envVar["REFRESH_TOKEN_SECRET"]).toBe("secret2");
        expect(envVar["LOG_DIR"]).toBe("logs");
    });

    test(".env config variable types", () => {
        expect(envVar["BACKEND_PORT"]).toMatch(/[0-9]+/);
        expect(envVar["EMAIL_PORT"]).toMatch(/[0-9]+/);
    });

});