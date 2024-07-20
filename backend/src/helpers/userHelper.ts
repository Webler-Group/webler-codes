import { Prisma, Role, User } from "@prisma/client";
import NotFoundException from "../exceptions/NotFoundException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { prisma } from "../services/database";

export const defaultUserSelect: Prisma.UserSelect = {
    id: true,
    username: true,
    registeredAt: true,
    level: true,
    xp: true,
    roles: true,
    isVerified: true
};

export const findUserOrThrow = async (where: Prisma.UserWhereInput, select: Prisma.UserSelect = {}) => {
    const user = await prisma.user.findFirst({ 
        where, 
        select: {
            ...select,
            ...defaultUserSelect
        } 
    });
    if (!user) {
        throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }
    return  user;
}