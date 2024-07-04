import { z } from "zod";

export const followSchema = z.object({
    userId: z.number(),
    isFollow: z.boolean()
});