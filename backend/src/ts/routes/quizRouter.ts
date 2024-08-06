import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";
import { errorHandler } from "../middleware/errorMiddleware";
import { createQuiz, deleteQuiz, getQuiz, requestQuizDraftApproval, updateQuiz, updateQuizQuestions } from "../controllers/quizController";

const quizRouter = Router();

quizRouter.post("/createQuiz", [authMiddleware.bind(null, Role.USER)], errorHandler(createQuiz));
quizRouter.post("/updateQuiz", [authMiddleware.bind(null, Role.USER)], errorHandler(updateQuiz));
quizRouter.post("/deleteQuiz", [authMiddleware.bind(null, Role.USER)], errorHandler(deleteQuiz));
quizRouter.post("/getQuiz", [authMiddleware.bind(null, Role.USER)], errorHandler(getQuiz));
quizRouter.post("/updateQuizQuestions", [authMiddleware.bind(null , Role.USER)],errorHandler(updateQuizQuestions))
quizRouter.post("/requestQuizDraftApproval", [authMiddleware.bind(null, Role.USER)], errorHandler(requestQuizDraftApproval));
export default quizRouter;