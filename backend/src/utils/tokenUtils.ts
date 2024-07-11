import * as jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./globals";
import { Response } from 'express';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

export interface TokenPayload {
    userId: string;
}

export const generateAccessToken = (userId: bigint) => {
    const payload = { userId: userId.toString() };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

    return { accessToken, info: { expiresIn: 30 * 60 * 1000 } };
}

export const generateRefreshToken = (userId: bigint) => {
    const payload = { userId: userId.toString() };

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return { refreshToken, info: { expiresIn: 7 * 24 * 60 * 60 * 1000 } };
}

export const setRefreshTokenCookie = (res: Response, data: { refreshToken: string }) => {
    res.cookie(REFRESH_TOKEN_COOKIE, data.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

export const clearRefreshTokenCookie = (res: Response) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}