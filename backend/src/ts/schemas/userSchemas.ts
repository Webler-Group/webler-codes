import { boolean, z } from "zod";
import { idSchema, nonNegativeIntegerSchema, usernameSchema } from "./typeSchemas";

export const followSchema = z.object({
    userId: idSchema,
    isFollow: z.boolean()
});

export const getUserSchema = z.object({
    username : usernameSchema
});

export const blockUserSchema = z.object({
    userId: idSchema,
    isBlock: z.boolean()
});

export const getFollowersSchema = z.object({
    userId : idSchema,
    offset : nonNegativeIntegerSchema,
    count : nonNegativeIntegerSchema
})

export const getFollowingsSchema = z.object({
    userId : idSchema,
    offset : nonNegativeIntegerSchema,
    count : nonNegativeIntegerSchema
})

export const updateProfileSchema = z.object({
    userId : idSchema,
    fullname : z.string().optional(),
    bio : z.string().optional(),
    location : z.string().optional(),
    workplace : z.string().optional(),
    education : z.string().optional(),
    websiteUrl : z.string().optional(),
    socialAccounts: z.string().array().optional()
});
