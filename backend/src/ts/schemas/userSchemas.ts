import { z } from "zod";
import { idSchema } from "./typeSchemas";

export const followSchema = z.object({
    userId: idSchema,
    isFollow: z.boolean()
});