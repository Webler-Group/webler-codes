import { Request, Response } from "express";
import { prisma } from "../services/database";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from "../utils/globals";
import BadRequestException from "../exceptions/BadRequestException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { loginSchema, registerSchema, resendEmailVerificationCodeSchema, verifyEmailSchema } from "../schemas/authSchemas";
import NotFoundException from "../exceptions/NotFoundException";
import { generateEmailVerificationCode, getAuthenticatedUser } from "../helpers/authHelper";
import { AuthRequest } from "../middleware/authMiddleware";
import { clearRefreshTokenCookie, generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "../utils/tokenUtils";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import ForbiddenException from "../exceptions/ForbiddenException";
import { Role } from "@prisma/client";
import { defaultUserSelect, findUserOrThrow } from "../helpers/userHelper";
import { bigintToNumber } from "../utils/utils";
import {z} from "zod";



export const register = async (req: Request, res: Response) => {

    registerSchema.parse(req.body);

    const { username, email, password } = req.body;

    let user = await prisma.user.findFirst({ where: { username } });
    if (user) {
        throw new BadRequestException('Username is already in use', ErrorCode.USERNAME_IS_USED);
    }
    user = await prisma.user.findFirst({ where: { email } });
    if (user) {
        throw new BadRequestException('Email is already in use', ErrorCode.EMAIL_IS_USED);
    }
    user = await prisma.user.create({
        data: {
            username,
            email,
            password: bcrypt.hashSync(password, 10),
            roles: [Role.USER]
        },
        select: { ...defaultUserSelect, email: true }
    });

    await generateEmailVerificationCode(user.id, username, email);

    res.json({
        success: true,
        userInfo: bigintToNumber(user)
    });
}

export const login = async (req: Request, res: Response) => {
    try {
        loginSchema.parse(req.body);
    } catch(e) {
        if (e instanceof z.ZodError) {
            throw new BadRequestException('A registered email or username is required', ErrorCode.FORBIDDEN);
        }
    }

    const { username, email, password } = req.body;

    let user = username ?
        await findUserOrThrow({ username },{ password: true, username: true }):
        await findUserOrThrow({ email },{ password: true, email: true });

    if(!user.isVerified) {
        throw new ForbiddenException('User is not verified', ErrorCode.FORBIDDEN);
    }

    if (!bcrypt.compareSync(password, user.password)) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                failedLoginCount: { increment: 1 }
            }
        });

        throw new BadRequestException('Password is incorrect', ErrorCode.INCORRECT_PASSWORD);
    }
    
    const { accessToken, info: accessTokenInfo } = generateAccessToken(user.id);
    const { refreshToken } = generateRefreshToken(user.id);

    user = await prisma.user.update({
        where: { id: user.id },
        data: {
            lastTimeLoggedIn: new Date(),
            failedLoginCount: 0,
            profile: {
                connectOrCreate: {
                    where: { userId: user.id },
                    create: {}
                }
            }
        },
        select: defaultUserSelect
    });

    setRefreshTokenCookie(res, { refreshToken });

    res.json({ accessToken, accessTokenInfo, userInfo: bigintToNumber(user) });
}

export const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if(refreshToken) {
        clearRefreshTokenCookie(res);
    }

    res.json({});
}

export const resendEmailVerificationCode = async (req: Request, res: Response) => {
    resendEmailVerificationCodeSchema.parse(req.body);

    const { email } = req.body;

    const user = await findUserOrThrow({ email });

    if (user.isVerified) {
        throw new BadRequestException('User is already verified', ErrorCode.USER_ALREADY_VERIFIED);
    }

    await generateEmailVerificationCode(user.id, user.username, user.email);

    res.json({
        success: true
    });
}

export const verifyEmail = async (req: Request, res: Response) => {
    verifyEmailSchema.parse(req.body);

    const { email, code } = req.body;

    const user = await findUserOrThrow({ email });

    const verificationCodeRecord = await prisma.verficationCode.findFirst({ where: { userId: user.id, code } });
    if (!verificationCodeRecord) {
        throw new NotFoundException('Verification code not found', ErrorCode.VERIFICATION_CODE_NOT_FOUND);
    }
    if (Date.now() > verificationCodeRecord.validFrom.getTime() + verificationCodeRecord.expiresInMinutes * 60 * 1000) {
        throw new BadRequestException('Verification code is expired', ErrorCode.VERIFICATION_CODE_EXPIRED);
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true }
    });

    await prisma.verficationCode.delete({ where: { id: verificationCodeRecord.id } });

    res.json({
        success: true
    });
}

export const getMe = async (req: AuthRequest, res: Response) => {
    res.json(bigintToNumber(req.user!));
}

export const refreshToken = async (req: Request, res: Response) => {
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
}
