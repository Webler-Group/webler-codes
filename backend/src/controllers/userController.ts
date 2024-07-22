import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { followSchema, getUserSchema, blockUserSchema, getFollowersSchema, getFollowingsSchema, updateProfileSchema } from "../schemas/userSchemas";
import { prisma } from "../services/database";
import { Role } from "@prisma/client";
import { defaultUserSelect, findUserOrThrow , defaultProfileSelect } from "../helpers/userHelper";
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


export const blockUser = async (req: AuthRequest, res: Response) => {
    blockUserSchema.parse(req.body);
    const { userId } = req.body;
    if( userId == req.user!.id ){
        throw new BadRequestException("Bad request: you cannot block yourself", ErrorCode.BAD_REQUEST);
    }
    const blockingUser = await findUserOrThrow({
      id: userId,
      AND: [
        {NOT: {roles: {has: Role.ADMIN}}},
        {NOT: {roles: {has: Role.MODERATOR}}},
      ]
    });
    await prisma.userBlocks.upsert({
        where: {
            blockedById_blockingId: {
                blockedById: req.user!.id,
                blockingId: blockingUser.id,
            },
        },
        update: { },
        create: {
            blockedById: req.user!.id,
            blockingId: blockingUser.id,
        },
    })
    res.json({"success":true});
};

export const getFollowers = async(req: AuthRequest, res: Response) => {
  getFollowersSchema.parse(req.body);

  const { userId , offset , count } = req.body;
  const user = await findUserOrThrow( { id:userId } )
  const followers = await prisma.userFollows.findMany({
    skip:offset,
    take:count,

    orderBy:{
      createdAt : "desc"
    },

    where: {
      followingId: user.id
    },

    select:defaultUserSelect
  })

  res.json({
    followers:[followers]
  })

}

export const getFollowings = async(req: AuthRequest, res: Response) => {
  getFollowingsSchema.parse(req.body);

  const { userId , offset , count } = req.body;
  const user = await findUserOrThrow( { id:userId } )
  const followings = await prisma.userFollows.findMany({
    skip:offset,
    take:count,

    where: {
      followerId:user.id
    },

    select:defaultUserSelect,

    orderBy:{
      createdAt : "desc"
    },

  })

  res.json({
    followers:[followings]
  })

}

export const updateProfile = async(req: AuthRequest, res: Response) => {
  updateProfileSchema.parse(req.body);

  const {userId, fullname, bio, location, workplace, education, websiteUrl, socialAccounts } = req.body;

  let user = await findUserOrThrow({ id: userId });

  if(user.id != req.user!.id) {
    throw new ForbiddenException("Forbidden", ErrorCode.FORBIDDEN);
  }

  const profile = await prisma.profile.update({
    where:{ userId },
    data: {
      userId, fullname, bio, location, workplace, education, websiteUrl, socialAccounts
    },
    select: defaultProfileSelect
  });


  res.json({data: profile, success: true});
};

