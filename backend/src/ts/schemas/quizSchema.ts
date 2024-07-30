import { z } from "zod";
import { idSchema } from "./typeSchemas";
import { prisma } from "../services/database";

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

const getQuizSchema = z.object({
  quizId: idSchema,
});

const updateQuizQuestionsSchema = z.object({
  questions: z.object({
    index: z.number().min(0),
    text: z.string(),
  }),
  quizId: idSchema,
});

const requestQuizDraftApprovalSchema = z.object({
  quizId: idSchema,
});

type createQuizSchemaType = z.infer<typeof createQuizSchema>;
type updateQuizSchemaType = z.infer<typeof updateQuizSchema>;
type deleteQuizSchemaType = z.infer<typeof deleteQuizSchema>;
type getQuizSchemaType = z.infer<typeof getQuizSchema>;


type requestQuizDraftApprovalSchemaType = z.infer<typeof requestQuizDraftApprovalSchema>;

export {
  createQuizSchema,
  createQuizSchemaType,
  updateQuizSchema,
  updateQuizSchemaType,
  deleteQuizSchema,
  deleteQuizSchemaType,
  getQuizSchema,
  getQuizSchemaType,
  requestQuizDraftApprovalSchema,
  requestQuizDraftApprovalSchemaType
};
