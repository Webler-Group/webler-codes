import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { prisma } from "../services/database";
import { createQuizSchema, createQuizSchemaType } from "../schemas/quizSchema";
import { QuizStatus } from "@prisma/client";

const createQuiz = async (req: AuthRequest<createQuizSchemaType>, res: Response) => {
  createQuizSchema.parse(req.body);

  const { title, tags } = req.body;

  const Quiz = await prisma.quiz.create({
    data: {
      title: title,
      tags: {
        connectOrCreate: tags.map((tag) => {
          return {
            where: { name: tag },
            create: { name: tag },
          };
        }),
      },
      xp: 0,
      status: QuizStatus.DRAFT,
      authorId: req.user?.id,
    },
  });

  res.json({
    success: true,
    data: Quiz,
  });
};

export { createQuiz };
