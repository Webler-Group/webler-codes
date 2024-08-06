import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { prisma } from "../services/database";
import {
  createQuizSchema,
  createQuizSchemaType,
  deleteQuizSchema,
  deleteQuizSchemaType,
  getQuizSchema,
  getQuizSchemaType,
  requestQuizDraftApprovalSchema,
  requestQuizDraftApprovalSchemaType,
  updateQuizQuestionsSchema,
  updateQuizQuestionsType,
  updateQuizSchema,
  updateQuizSchemaType,
} from "../schemas/quizSchema";
import { QuizStatus } from "@prisma/client";
import { Role } from "@prisma/client";
import { bigintToNumber } from "../utils/utils";
import ForbiddenException from "../exceptions/ForbiddenException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { defaultQuizQuestionSelect, defaultQuizSelect } from "../helpers/quizHelper";
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
  } else {
    throw new NotFoundException("quiz not found", ErrorCode.QUIZ_NOT_FOUND);
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
  const Quiz = await prisma.quiz.findUnique({
    select: defaultQuizSelect,
    where: {
      id: quizId,
    },
  });

  if (!Quiz) {
    throw new NotFoundException("quiz not found", ErrorCode.QUIZ_NOT_FOUND);
  }

  await prisma.quiz.delete({
    select: defaultQuizSelect,
    where: {
      id: quizId,
    },
  });

  res.json({
    success: true,
  });
};

const getQuiz = async (req: AuthRequest<getQuizSchemaType>, res: Response) => {
  getQuizSchema.parse(req.body);
  const { quizId } = req.body;

  const Quiz = await prisma.quiz.findUnique({
    select: defaultQuizSelect,
    where: {
      id: quizId,
    },
  });

  if (Quiz) {
    if (!(Quiz.authorId == req.user?.id) || !req.user?.roles.includes(Role.MODERATOR)) {
      throw new ForbiddenException("access is forbidden", ErrorCode.FORBIDDEN);
    }
  } else {
    throw new NotFoundException("quiz not found", ErrorCode.QUIZ_NOT_FOUND);
  }

  res.json({
    data: bigintToNumber(Quiz),
    questions: {
      select: defaultQuizQuestionSelect,
    },
  });
};
const updateQuizQuestions = async (req:AuthRequest<updateQuizQuestionsType> , res : Response) =>{
  updateQuizQuestionsSchema.parse(req.body);
  const { questions , quizId} = req.body;
}

const requestQuizDraftApproval = async (req: AuthRequest<requestQuizDraftApprovalSchemaType>, res: Response) => {
  requestQuizDraftApprovalSchema.parse(req.body);

  const { quizId } = req.body;

  const Quiz = await prisma.quiz.update({
    where: {
      id: quizId,
    },
    data: {
      status: QuizStatus.WAITING_FOR_APPROVAL,
    },
  });

  if (!(Quiz.authorId == req.user?.id)) {
    throw new ForbiddenException("access is forbidden", ErrorCode.FORBIDDEN);
  }

  res.json({
    success: true,
  });
};

export { createQuiz, updateQuiz, deleteQuiz, getQuiz, updateQuizQuestions,requestQuizDraftApproval };
