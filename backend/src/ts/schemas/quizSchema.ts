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

const deleteQuizSchema = z.object({
  quizId: idSchema,
});



type createQuizSchemaType = z.infer<typeof createQuizSchema>;
type updateQuizSchemaType = z.infer<typeof updateQuizSchema>;
type deleteQuizSchemaType = z.infer<typeof deleteQuizSchema>;
export {
  createQuizSchema,
  createQuizSchemaType,
  updateQuizSchema,
  updateQuizSchemaType,
  deleteQuizSchema,
  deleteQuizSchemaType,
};
