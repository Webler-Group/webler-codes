import { NextFunction, Request, Response } from "express";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import * as jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../utils/globals";
import { dbClient } from "../services/database";
import { User } from "@prisma/client";

export interface AuthRequest extends Request {
    user?: User
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    if(!accessToken) {
        return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }

    try {
        const payload: { userId: number } = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as any;

        const user = await dbClient.user.findFirst({ where: { id: payload.userId } });

        if(!user || !user.isVerified) {
            return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
        }

        req.user = user;

        return next();

    } catch(error) {
        return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }
}