import { Request, Response } from "express";
import { dbClient } from "../services/database";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from "../utils/globals";
import BadRequestException from "../exceptions/BadRequestException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { errorHandler } from "../utils/errorHandler";
import { loginSchema, registerSchema, resendEmailVerificationCodeSchema, verifyEmailSchema } from "../schemas/authSchemas";
import NotFoundException from "../exceptions/NotFoundException";
import { generateEmailVerificationCode } from "../services/authHelper";

const register = errorHandler(async (req: Request, res: Response) => {

    registerSchema.parse(req.body);

    const { username, email, password } = req.body;

    let user = await dbClient.user.findFirst({ where: { username } });
    if(user) {
        throw new BadRequestException('Username is already in use', ErrorCode.USER_ALREADY_EXISTS);
    }
    user = await dbClient.user.findFirst({ where: { email } });
    if(user) {
        throw new BadRequestException('Email is already in use', ErrorCode.USER_ALREADY_EXISTS);
    }
    user = await dbClient.user.create({
        data: {
            username,
            email,
            password: bcrypt.hashSync(password, 10)
        }
    });
    
    await generateEmailVerificationCode(user.id, username, email);

    res.json({
        success: true
    });
});

const login = errorHandler(async (req: Request, res: Response) => {
    loginSchema.parse(req.body);

    const { username, password } = req.body;

    let user = await dbClient.user.findFirst({ where: { username } });
    if(!user) {
        throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }
    
    if(!bcrypt.compareSync(password, user.password)) {
        throw new BadRequestException('Password is not correct', ErrorCode.INCORRECT_PASSWORD);
    }

    const accessToken = jwt.sign({
        userId: user.id.toString()
    }, ACCESS_TOKEN_SECRET, { expiresIn: '10min' });

    res.json({ username, accessToken });
});

const resendEmailVerificationCode = errorHandler(async (req: Request, res: Response) => {
    resendEmailVerificationCodeSchema.parse(req.body);

    const { userId } = req.body;

    const user = await dbClient.user.findFirst({ where: { id: userId } });

    if(!user) {
        throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }

    if(user.isVerified) {
        throw new BadRequestException('User is already verified', ErrorCode.USER_ALREADY_VERIFIED);
    }

    await generateEmailVerificationCode(user.id, user.username, user.email);

    res.json({
        success: true
    });
});

const verifyEmail = errorHandler(async (req: Request, res: Response) => {
    verifyEmailSchema.parse(req.body);

    const { userId, code } = req.body;

    const user = await dbClient.user.findFirst({ where: { id: userId } });

    if(!user) {
        throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }

    const verificationCodeRecord = await dbClient.verficationCode.findFirst({ where: { userId, code } });
    if(!verificationCodeRecord) {
        throw new NotFoundException('Verification code not found', ErrorCode.VERIFICATION_CODE_NOT_FOUND);
    }
    if(Date.now() > verificationCodeRecord.validFrom.getTime() + verificationCodeRecord.expiresInMinutes * 60 * 1000) {
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

export {
    register,
    login,
    resendEmailVerificationCode,
    verifyEmail
}
