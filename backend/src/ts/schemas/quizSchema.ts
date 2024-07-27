import { z } from "zod";
import { idSchema } from "./typeSchemas";

const createQuizSchema = z.object({
  title: z.string(),
  tags: z.string().array(),
});

const updateQuizSchema = z.object({
  quizId: idSchema,
  title: z.string(),
  tags: z.string().array(),
});

type createQuizSchemaType = z.infer<typeof createQuizSchema>;
type updateQuizSchemaType = z.infer<typeof updateQuizSchema>;
export { createQuizSchema, createQuizSchemaType, updateQuizSchema, updateQuizSchemaType };
