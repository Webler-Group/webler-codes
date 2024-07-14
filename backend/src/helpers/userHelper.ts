import { Prisma, Role, User } from "@prisma/client";
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
export async function getRawUserByIdOrThrow(id: bigint)
{
    return findUserOrThrow({id});  
}

export async function getUserByIdOrThrow(id: bigint): Promise<User>
{
    const user = await getRawUserByIdOrThrow(id);    
    return  {
        id: user.id,
        username: user.username,
        email:user.email,
        password: user.password,
        isVerified: user.isVerified,
        registeredAt: user.registeredAt,
        lastTimeLoggedIn: user.lastTimeLoggedIn,
        level: user.level,
        xp: user.xp,
        failedLoginCount: user.failedLoginCount,
        roles: user.roles,
    };
}
export async function getUserOrThrow(user: User|bigint):Promise<User>{
    
    if(typeof(user)=== "bigint") return getUserByIdOrThrow(user);
    return user
    
}
export async function canAbanB(A: User|bigint, B: User|bigint|null):Promise<boolean>
{
    if(B==null) return true;
    const a = await getUserOrThrow(A);
    const b = await getUserOrThrow(B);
    return a.roles.includes(Role.MODERATOR) && (a.roles.includes(Role.ADMIN) || !b.roles.includes(Role.MODERATOR));
}

export const getUserInfo = (user: User) => {
    return {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp,
        isVerified: user.isVerified,
        registeredAt: user.registeredAt,
        roles: user.roles
    }
}