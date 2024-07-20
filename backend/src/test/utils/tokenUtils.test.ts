import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import {
    generateAccessToken,
    generateRefreshToken,
    setRefreshTokenCookie,
    clearRefreshTokenCookie,
    TokenPayload
} from '../../ts/utils/tokenUtils';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../ts/utils/globals';

describe('Token Utilities', () => {
    const mockUserId = BigInt(1);

    describe('generateAccessToken', () => {
        it('should generate a valid access token', () => {
            const { accessToken, info } = generateAccessToken(mockUserId);

            expect(accessToken).toBeDefined();
            expect(info.expiresIn).toBe(30 * 60 * 1000); // 30 minutes in milliseconds

            const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as TokenPayload;
            expect(decoded.userId).toBe(Number(mockUserId));
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a valid refresh token', () => {
            const { refreshToken, info } = generateRefreshToken(mockUserId);

            expect(refreshToken).toBeDefined();
            expect(info.expiresIn).toBe(7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as TokenPayload;
            expect(decoded.userId).toBe(Number(mockUserId));
        });
    });

    describe('setRefreshTokenCookie', () => {
        it('should set the refresh token cookie', () => {
            const mockResponse = {
                cookie: jest.fn()
            } as unknown as Response;

            const mockToken = 'mockToken';
            setRefreshTokenCookie(mockResponse, { refreshToken: mockToken });

            expect(mockResponse.cookie).toHaveBeenCalledWith('refreshToken', mockToken, {
                secure: true,
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
            });
        });
    });

    describe('clearRefreshTokenCookie', () => {
        it('should clear the refresh token cookie', () => {
            const mockResponse = {
                clearCookie: jest.fn()
            } as unknown as Response;

            clearRefreshTokenCookie(mockResponse);

            expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', {
                secure: true,
                httpOnly: true,
                sameSite: 'strict'
            });
        });
    });
});
