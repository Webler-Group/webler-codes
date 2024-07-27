import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { prisma } from "../services/database";
import { createQuizSchema, createQuizSchemaType, updateQuizSchema, updateQuizSchemaType } from "../schemas/quizSchema";
import { QuizStatus } from "@prisma/client";
import { Role } from "@prisma/client";
import { bigintToNumber } from "../utils/utils";
import ForbiddenException from "../exceptions/ForbiddenException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";

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
    data: bigintToNumber(Quiz),
  });
};

const updateQuiz = async (req: AuthRequest<updateQuizSchemaType>, res: Response) => {
  updateQuizSchema.parse(req.body);

  const { quizId, title, tags } = req.body;

  const getQuiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
  });

  if (!(getQuiz?.authorId == req.user?.id) || !req.user?.roles.includes(Role.MODERATOR)) {
    throw new ForbiddenException("access is forbidden", ErrorCode.FORBIDDEN);
  }

  const Quiz = await prisma.quiz.update({
    where: {
      id: quizId,
    },
    data: {
      title: title,
    },
  });

  res.json({
    success: true,
    data: bigintToNumber(Quiz),
  });
};
export { createQuiz , updateQuiz };
