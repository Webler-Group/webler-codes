import { z } from "zod";
import { idSchema, nonNegativeIntegerSchema } from "./typeSchemas";
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
    index: nonNegativeIntegerSchema,
    text: z.string(),
    options: z
      .object({
        id: idSchema,
        question: z.string(),
        questionId: idSchema,
        correctAnswer: z.string(),
        text: z.string(),
        isCorrect: z.boolean(),
        correctIndex: nonNegativeIntegerSchema,
        answers: z.string().array(),
      })
      .array(),
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
type updateQuizQuestionsType = z.infer<typeof updateQuizQuestionsSchema>
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
  updateQuizQuestionsSchema,
  updateQuizQuestionsType,
  requestQuizDraftApprovalSchema,
  requestQuizDraftApprovalSchemaType,
};
