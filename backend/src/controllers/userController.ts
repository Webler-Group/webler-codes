import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { followSchema, getUserSchema } from "../schemas/userSchemas";
import { prisma } from "../services/database";
import { findUserOrThrow } from "../helpers/userHelper";
import BadRequestException from "../exceptions/BadRequestException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import ForbiddenException from "../exceptions/ForbiddenException";

export const follow = async (req: AuthRequest, res: Response) => {
  followSchema.parse(req.body);

  const { userId, isFollow } = req.body;

  const loggedUser = req.user!;

  if (loggedUser.id == userId) {
    throw new BadRequestException("Bad request", ErrorCode.BAD_REQUEST);
  }

  const user = await findUserOrThrow({ id: userId }, { followers: { where: { followerId: loggedUser.id } } });

  if (isFollow && user.followers.length == 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: { followers: { create: { followerId: loggedUser.id } } },
    });
  } else if (!isFollow && user.followers.length != 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: { followers: { delete: { followerId_followingId: { followerId: loggedUser.id, followingId: user.id } } } },
    });
  }

  res.json({
    success: true,
  });
};

export const getUser = async (req: AuthRequest, res: Response) => {
  getUserSchema.parse(req.body);
  const { username } = req.body;

  const user = await findUserOrThrow({ username: username });

  const isBan = await prisma.ban.count({
    where: {
      userId: user.id,
    },
  });

  const isBlocked = await prisma.userBlocks.count({
    where: {
      OR: [
        { blockedById: user.id, blockingId: req.user?.id },
        { blockedById: req.user?.id, blockingId: user.id },
      ],
    },
  });

  if (!isBan && !isBlocked) {
    res.json({
      user: user.profile,
      followerCount: user._count.followers,
      followingCount: user._count.following,
    });
  } else {
    throw new ForbiddenException("User not found", ErrorCode.PROFILE_NOT_FOUND);
  }
};
