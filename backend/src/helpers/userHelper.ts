import { Prisma, User } from "@prisma/client";
import NotFoundException from "../exceptions/NotFoundException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { dbClient } from "../services/database";

export const findUserOrThrow = async (where: Prisma.UserWhereInput, include: Prisma.UserInclude = {}) => {
    const user = await dbClient.user.findFirst({ where, include });
    if (!user) {
        throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }
    return  user;
}

export const getUserInfo = (user: User) => {
    return {
        id: Number(user.id),
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp,
        isVerified: user.isVerified,
        registeredAt: user.registeredAt,
        roles: user.roles
    }
}