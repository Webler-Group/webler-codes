import { z } from "zod";
import { idSchema, nonNegativeIntegerSchema, usernameSchema } from "./typeSchemas";

const followSchema = z.object({
    userId: idSchema,
    isFollow: z.boolean()
});

const getUserSchema = z.object({
    username : usernameSchema
});

const blockUserSchema = z.object({
    userId: idSchema,
    isBlock: z.boolean()
});

const getFollowersSchema = z.object({
    userId : idSchema,
    offset : nonNegativeIntegerSchema,
    count : nonNegativeIntegerSchema
})

const getFollowingsSchema = z.object({
    userId : idSchema,
    offset : nonNegativeIntegerSchema,
    count : nonNegativeIntegerSchema
})

const updateProfileSchema = z.object({
    userId : idSchema,
    fullname : z.string().optional(),
    bio : z.string().optional(),
    location : z.string().optional(),
    workplace : z.string().optional(),
    education : z.string().optional(),
    websiteUrl : z.string().optional(),
    socialAccounts: z.string().array().optional()
});

type followSchemaType = z.infer<typeof followSchema>;
type getUserSchemaType = z.infer<typeof getUserSchema>;
type blockUserSchemaType = z.infer<typeof blockUserSchema>;
type updateProfileSchemaType = z.infer<typeof updateProfileSchema>;
type getFollowingsSchemaType = z.infer<typeof getFollowingsSchema>;
type getFollowersSchemaType = z.infer<typeof getFollowersSchema>;

export {
    followSchema,
    followSchemaType,
    getUserSchema,
    getUserSchemaType,
    blockUserSchema,
    blockUserSchemaType,
    updateProfileSchema,
    updateProfileSchemaType,
    getFollowersSchema,
    getFollowersSchemaType,
    getFollowingsSchema,
    getFollowingsSchemaType
}
