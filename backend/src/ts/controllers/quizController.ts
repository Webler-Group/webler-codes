import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { prisma } from "../services/database";
import {
  createQuizSchema,
  createQuizSchemaType,
  deleteQuizSchema,
  deleteQuizSchemaType,
  updateQuizSchema,
  updateQuizSchemaType,
} from "../schemas/quizSchema";
import { QuizStatus } from "@prisma/client";
import { Role } from "@prisma/client";
import { bigintToNumber } from "../utils/utils";
import ForbiddenException from "../exceptions/ForbiddenException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { defaultQuizSelect } from "../helpers/quizHelper";
import NotFoundException from "../exceptions/NotFoundException";

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
    select: defaultQuizSelect,
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
    select: defaultQuizSelect,
  });
  if (getQuiz) {
    if (!(getQuiz?.authorId == req.user?.id) || !req.user?.roles.includes(Role.MODERATOR)) {
      throw new ForbiddenException("access is forbidden", ErrorCode.FORBIDDEN);
    }
  }else{
    throw new NotFoundException("quiz not found", ErrorCode.QUIZ_NOT_FOUND)
  }
  const Quiz = await prisma.quiz.update({
    where: {
      id: quizId,
    },
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
    },
  });

  res.json({
    success: true,
    data: bigintToNumber(Quiz),
  });
};

const deleteQuiz = async (req: AuthRequest<deleteQuizSchemaType>, res: Response) => {
  deleteQuizSchema.parse(req.body);

  const { quizId } = req.body;

  await prisma.quiz.delete({
    where: {
      id: quizId,
    },
  });

  res.json({
    success: true,
  });
};


export { createQuiz, updateQuiz, deleteQuiz };
