import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { followSchema, getUserSchema, blockUserSchema, getFollowersSchema, getFollowingsSchema, updateProfileSchema } from "../schemas/userSchemas";
import { prisma } from "../services/database";
import { Role, SocialAccount } from "@prisma/client";
import { defaultUserSelect, findUserOrThrow , defaultProfileSelect } from "../helpers/userHelper";
import BadRequestException from "../exceptions/BadRequestException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import ForbiddenException from "../exceptions/ForbiddenException";
import { bigintToNumber } from "../utils/utils";

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

  const user = await findUserOrThrow({ username: username }, { profile: true, 
    _count: { select: { followers: true, following: true } } 
  });

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
      user: bigintToNumber(user),
      followerCount: user._count.followers,
      followingCount: user._count.following,
    });
  } else {
    throw new ForbiddenException("User not found", ErrorCode.PROFILE_NOT_FOUND);
  }
};


export const blockUser = async (req: AuthRequest, res: Response) => {
    blockUserSchema.parse(req.body);
    const { userId , isBlock } = req.body;

    if( userId == req.user!.id ){
        throw new BadRequestException("Bad request: you cannot block yourself", ErrorCode.BAD_REQUEST);
    }



    const user = await findUserOrThrow({id:userId}, )

    let roles = user.roles

    if(roles.includes(Role.ADMIN) || roles.includes(Role.MODERATOR)){
      throw new ForbiddenException("You cannot block a Moderator or Admin" , ErrorCode.FORBIDDEN)
    }
    const blockingUser = await findUserOrThrow({
      id: userId,
      AND: [
        {NOT: {roles: {has: Role.ADMIN}}},
        {NOT: {roles: {has: Role.MODERATOR}}},
      ]
    });


    if(isBlock){
     await prisma.userBlocks.delete({
      where: {
        blockedById_blockingId: {
            blockedById: req.user!.id,
            blockingId: blockingUser.id,
        },
       },
     })
    }else{
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
    }
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
      followingId: user.id,
      
      
    },
    
    select: { follower: {select:defaultUserSelect} }
    

  })

  res.json({
    followers:bigintToNumber(followers.map(x=>x.follower)),
    
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

    orderBy:{
      createdAt : "desc"
    },
    select:{following:{select:defaultUserSelect}}
  

  })

  res.json({
    followings:bigintToNumber(followings.map(x=>x.following)),
    
  })

}

export const updateProfile = async(req: AuthRequest, res: Response) => {
  updateProfileSchema.parse(req.body);

  const {userId, fullname, bio, location, workplace, education, websiteUrl, socialAccounts } = req.body;
  const currentUser = req.user!;

  const user = await findUserOrThrow({ id: userId });

  if(!currentUser.roles.includes(Role.ADMIN) && user.id != currentUser.id) {
    throw new ForbiddenException("Forbidden", ErrorCode.FORBIDDEN);
  }

  const profile = await prisma.profile.findUnique({
    where:{ userId },
    select: defaultProfileSelect
  });

  let profileData;
  if(!profile) {
    profileData = await prisma.profile.create({
      data: {
        userId,
        fullname, 
        bio, 
        location, 
        workplace, 
        education, 
        websiteUrl,
        socialAccounts: socialAccounts ? {
          createMany: { data: socialAccounts.map((url: string) => ({ url })) }
        } : undefined
      },
      select: defaultProfileSelect
    });

  } else {
    profileData = await prisma.profile.update({
      where: { userId },
      data: {
        fullname, 
        bio, 
        location, 
        workplace, 
        education, 
        websiteUrl,
        socialAccounts: socialAccounts ? {
          deleteMany: profile.socialAccounts,
          createMany: { data: socialAccounts.map((url: string) => ({ url })) }
        } : undefined
      },
      select: defaultProfileSelect
    });
  }
  
  res.json({data: bigintToNumber(profileData), success: true});
};
