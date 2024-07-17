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

import { generateRandomFileName } from "../fileUtils";
import { clearRefreshTokenCookie, generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "../tokenUtils";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../globals";


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
                { userId: userId },
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
                { userId: userId },
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