import { z } from "zod";
import { idSchema, usernameSchema } from "./typeSchemas";

export const followSchema = z.object({
    userId: idSchema,
    isFollow: z.boolean()
});

export const getUserSchema = z.object({
    username : usernameSchema
})nod