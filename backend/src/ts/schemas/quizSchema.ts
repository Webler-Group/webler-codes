import { z } from "zod";

const createQuizSchema = z.object({
  title: z.string(),
  tags: z.string().array(),
});

type createQuizSchemaType = z.infer<typeof createQuizSchema>
export  {
    createQuizSchema,
    createQuizSchemaType
}