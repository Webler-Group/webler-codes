import { Request, Response } from "express";
import { prisma } from "../services/database";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from "../utils/globals";
import BadRequestException from "../exceptions/BadRequestException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { loginSchema, loginSchemaType, registerSchema, registerSchemaType, resendEmailVerificationCodeSchema, resendEmailVerificationCodeSchemaType, verifyEmailSchema, verifyEmailSchemaType } from "../schemas/authSchemas";
import NotFoundException from "../exceptions/NotFoundException";
import { generateEmailVerificationCode, getAuthenticatedUser } from "../helpers/authHelper";
import { clearRefreshTokenCookie, generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "../utils/tokenUtils";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import ForbiddenException from "../exceptions/ForbiddenException";
import { Role } from "@prisma/client";
import { defaultUserSelect, findUserOrThrow } from "../helpers/userHelper";
import { bigintToNumber } from "../utils/utils";
import { AuthRequest } from "../middleware/authMiddleware";

/**
 * Create new user
 * @param req Request
 * @param res Response
 */
export const register = async (req: AuthRequest<registerSchemaType>, res: Response) => {

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

/**
 * Authorize user and generate tokens
 * @param req Request
 * @param res Response
 */
export const login = async (req: AuthRequest<loginSchemaType>, res: Response) => {
    loginSchema.parse(req.body);

    const { email, password } = req.body;

    let user = await findUserOrThrow({ email },{ password: true, email: true });

    if (!bcrypt.compareSync(password, user.password)) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                failedLoginCount: { increment: 1 }
            }
        });

        throw new BadRequestException('Password is not correct', ErrorCode.INCORRECT_PASSWORD);
    }

    if(!user.isVerified) {
        throw new ForbiddenException('User is not verified', ErrorCode.FORBIDDEN);
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

/**
 * Delete token cookie
 * @param req Request
 * @param res Response
 */
export const logout = async (req: AuthRequest<{}>, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if(refreshToken) {
        clearRefreshTokenCookie(res);
    }

    res.json({});
}

/**
 * Create email verifiction code
 * @param req Request
 * @param res Response
 */
export const resendEmailVerificationCode = async (req: AuthRequest<resendEmailVerificationCodeSchemaType>, res: Response) => {
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

/**
 * Compare verification code
 * @param req Request
 * @param res Response
 */
export const verifyEmail = async (req: AuthRequest<verifyEmailSchemaType>, res: Response) => {
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

/**
 * Get logged user
 * @param req Request
 * @param res Response
 */
export const getMe = async (req: AuthRequest<any>, res: Response) => {
    res.json(bigintToNumber(req.user));
}

export const refreshToken = async (req: Request<any>, res: Response) => {
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
