import { Prisma } from "@prisma/client";

export const defaultQuizSelect: Prisma.QuizSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  xp: true,
  status: true,
  tags: true,
  author: true,
  authorId: true,
  approvedBy: true,
  approvedById: true,
  questions: true,
  quizPorgress: true,
};
