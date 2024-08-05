import { NextFunction, Request, Response } from "express";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import * as jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../utils/globals";
import { Role, User } from "@prisma/client";
import { TokenPayload } from "../utils/tokenUtils";
import HttpException from "../exceptions/HttpException";
import ForbiddenException from "../exceptions/ForbiddenException";
import R from "../utils/resourceManager";
import {prisma} from "../services/database";

export interface AuthRequest<T> extends Request {
    body: T;
    user?: User;
}

export const authMiddleware = async <T>(role: Role, req: AuthRequest<T>, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if(!accessToken) {
            throw new UnauthorizedException(R.strings.access_token_not_set, ErrorCode.UNAUTHORIZED);
        }

        const payload: TokenPayload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as any;

        const user = await prisma.user.findFirst({ where: { id: payload.userId } });

        if(!user || !user.isVerified || !user.roles.includes(role)) {
            throw new ForbiddenException(R.strings.unathorized_role_msg, ErrorCode.FORBIDDEN);
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