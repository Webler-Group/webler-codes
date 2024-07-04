import { Prisma } from "@prisma/client";
import NotFoundException from "../exceptions/NotFoundException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { dbClient } from "./database";

export const getUserById = async (userId: number, include: Prisma.UserInclude = {}) => {
    const user = await dbClient.user.findFirst({ where: { id: userId }, include });
    if (!user) {
        throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }
    return  user;
}

export const getUserByUsername = async (username: string, include: Prisma.UserInclude = {}) => {
    const user = await dbClient.user.findFirst({ where: { username }, include });
    if (!user) {
        throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }
    return  user;
}