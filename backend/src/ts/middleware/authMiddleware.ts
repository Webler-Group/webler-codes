import { NextFunction, Request, Response } from "express";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import * as jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../utils/globals";
import { Role, User } from "@prisma/client";
import { TokenPayload } from "../utils/tokenUtils";
import { getAuthenticatedUser } from "../helpers/authHelper";
import HttpException from "../exceptions/HttpException";
import ForbiddenException from "../exceptions/ForbiddenException";

export interface AuthRequest extends Request {
    user?: User
}

export const authMiddleware = async (role: Role, req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if(!accessToken) {
            throw new UnauthorizedException('Access token is missing', ErrorCode.UNAUTHORIZED);
        }

        const payload: TokenPayload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as any;

        const user = await getAuthenticatedUser(payload.userId);

        if(!user.roles.includes(role)) {
            throw new ForbiddenException('User does not have required role', ErrorCode.FORBIDDEN); 
        }

        req.user = user;

        next();

    } catch(error: any) {
        let exception;
        if(error instanceof HttpException) {
            exception = error;
        } else {
            exception = new UnauthorizedException(error.message, ErrorCode.UNAUTHORIZED);
        }
        next(exception);
    }
}