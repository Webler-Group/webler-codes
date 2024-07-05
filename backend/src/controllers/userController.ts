import { Response } from "express";
import { errorHandler } from "../middleware/errorMiddleware";
import { AuthRequest } from "../middleware/authMiddleware";
import { followSchema } from "../schemas/userSchema";
import { dbClient } from "../services/database";
import { getUserById } from "../services/userHelper";
import BadRequestException from "../exceptions/BadRequestException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";

export const follow = errorHandler(async (req: AuthRequest, res: Response) => {
    followSchema.parse(req.body);

    const { userId, isFollow } = req.body;
    
    const loggedUser = req.user!;

    if(loggedUser.id == userId) {
        throw new BadRequestException('Bad request', ErrorCode.BAD_REQUEST);
    }

    const user = await getUserById(userId, { followers: { where: { followerId: loggedUser.id } } });

    if(isFollow && user.followers.length == 0) {
        await dbClient.user.update({
            where: { id: user.id },
            data: { followers: { create: { followerId: loggedUser.id } } }
        });
    } else if(!isFollow && user.followers.length != 0) {
        await dbClient.user.update({
            where: { id: user.id },
            data: { followers: { delete: { followerId_followingId: { followerId: loggedUser.id, followingId: user.id } } } }
        });
    }

    res.json({
        success: true
    });

});