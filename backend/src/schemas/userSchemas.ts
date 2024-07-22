import { z } from "zod";
import { idSchema, usernameSchema } from "./typeSchemas";

export const followSchema = z.object({
    userId: idSchema,
    isFollow: z.boolean()
});

export const getUserSchema = z.object({
    username : usernameSchema
});

export const blockUserSchema = z.object({
    userId: idSchema
});

export const getFollowersSchema = z.object({
    userId : idSchema,
    offset : z.number(),
    count : z.number()
})

export const getFollowingsSchema = z.object({
    userId : idSchema,
    offset : z.number(),
    count : z.number()
})

export const updateProfileSchema = z.object({
    userId : idSchema,
    fullname : z.string().optional(),
    bio : z.string().optional(),
    location : z.string().optional(),
    workplace : z.string().optional(),
    education : z.string().optional(),
    websiteUrl : z.string().optional()
//    connectedAccounts: [{ url },]
});
