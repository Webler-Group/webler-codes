import { Request, Response } from "express";
import { dbClient } from "../services/database";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from "../utils/globals";
import BadRequestException from "../exceptions/BadRequestException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { loginSchema, registerSchema, resendEmailVerificationCodeSchema, verifyEmailSchema } from "../schemas/authSchemas";
import NotFoundException from "../exceptions/NotFoundException";
import { generateEmailVerificationCode, getAuthenticatedUser } from "../services/authHelper";
import { AuthRequest } from "../middleware/authMiddleware";
import { clearRefreshTokenCookie, generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "../utils/tokenUtils";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import ForbiddenException from "../exceptions/ForbiddenException";
import { errorHandler } from "../middleware/errorMiddleware";
import { Role } from "@prisma/client";
import { getUserById, getUserByUsername } from "../services/userHelper";



export const register = errorHandler(async (req: Request, res: Response) => {

    registerSchema.parse(req.body);

    const { username, email, password } = req.body;

    let user = await dbClient.user.findFirst({ where: { username } });
    if (user) {
        throw new BadRequestException('Username is already in use', ErrorCode.USERNAME_IS_USED);
    }
    user = await dbClient.user.findFirst({ where: { email } });
    if (user) {
        throw new BadRequestException('Email is already in use', ErrorCode.EMAIL_IS_USED);
    }
    user = await dbClient.user.create({
        data: {
            username,
            email,
            password: bcrypt.hashSync(password, 10),
            roles: [Role.USER]
        }
    });

    await generateEmailVerificationCode(user.id, username, email);

    res.json({
        user
    });
});

export const login = errorHandler(async (req: Request, res: Response) => {
    loginSchema.parse(req.body);

    const { username, password } = req.body;

    const user = await getUserByUsername(username);

    if (!bcrypt.compareSync(password, user.password)) {
        throw new BadRequestException('Password is not correct', ErrorCode.INCORRECT_PASSWORD);
    }

    if(!user.isVerified) {
        throw new ForbiddenException('User is not verified', ErrorCode.FORBIDDEN);
    }
    
    const { accessToken, info: accessTokenInfo } = generateAccessToken(user.id);
    const { refreshToken } = generateRefreshToken(user.id);

    await dbClient.user.update({
        where: { id: user.id },
        data: {
            lastTimeLoggedIn: new Date()
        }
    });

    setRefreshTokenCookie(res, { refreshToken });

    res.json({ accessToken, accessTokenInfo });
});

export const logout = errorHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if(refreshToken) {
        clearRefreshTokenCookie(res);
    }

    res.json({});
});

export const resendEmailVerificationCode = errorHandler(async (req: Request, res: Response) => {
    resendEmailVerificationCodeSchema.parse(req.body);

    const { userId } = req.body;

    const user = await getUserById(userId);

    if (user.isVerified) {
        throw new BadRequestException('User is already verified', ErrorCode.USER_ALREADY_VERIFIED);
    }

    await generateEmailVerificationCode(user.id, user.username, user.email);

    res.json({
        success: true
    });
});

export const verifyEmail = errorHandler(async (req: Request, res: Response) => {
    verifyEmailSchema.parse(req.body);

    const { userId, code } = req.body;

    const user = await getUserById(userId);

    const verificationCodeRecord = await dbClient.verficationCode.findFirst({ where: { userId, code } });
    if (!verificationCodeRecord) {
        throw new NotFoundException('Verification code not found', ErrorCode.VERIFICATION_CODE_NOT_FOUND);
    }
    if (Date.now() > verificationCodeRecord.validFrom.getTime() + verificationCodeRecord.expiresInMinutes * 60 * 1000) {
        throw new BadRequestException('Verification code is expired', ErrorCode.VERIFICATION_CODE_EXPIRED);
    }

    await dbClient.user.update({
        where: { id: userId },
        data: { isVerified: true }
    });

    await dbClient.verficationCode.delete({ where: { id: verificationCodeRecord.id } });

    res.json({
        success: true
    });
});

export const getMe = errorHandler(async (req: AuthRequest, res: Response) => {
    res.json(req.user);
});

export const refreshToken = errorHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if(!refreshToken) {
        throw new UnauthorizedException('Refresh token is not set', ErrorCode.UNAUTHORIZED);
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (errors: jwt.VerifyErrors | null, decoded: any) => {
        if(errors) {
            throw new UnauthorizedException('Refresh token is invalid', ErrorCode.UNAUTHORIZED)
        }

        const user = await getAuthenticatedUser(decoded.userId);

        const { accessToken, info: accessTokenInfo } = generateAccessToken(user.id);
        const { refreshToken } = generateRefreshToken(user.id);

        setRefreshTokenCookie(res, { refreshToken });

        res.json({ accessToken, accessTokenInfo });

    });
});
