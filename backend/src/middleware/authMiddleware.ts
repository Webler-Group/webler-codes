import { NextFunction, Request, Response } from "express";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import * as jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../utils/globals";
import { User } from "@prisma/client";
import { TokenPayload } from "../utils/tokenUtils";
import { validateUser } from "../services/authHelper";
import HttpException from "../exceptions/HttpException";

export interface AuthRequest extends Request {
    user?: User
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    if(!accessToken) {
        return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }

    try {
        const payload: TokenPayload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as any;

        const user = await validateUser(payload.userId);

        req.user = user;

        return next();

    } catch(error) {
        let exception;
        if(error instanceof HttpException) {
            exception = error;
        } else {
            exception = new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED);
        }
        return next(exception);
    }
}