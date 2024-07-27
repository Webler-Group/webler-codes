import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";
import { errorHandler } from "../middleware/errorMiddleware";
import { createQuiz, updateQuiz } from "../controllers/quizController";

const quizRouter = Router();

quizRouter.post("/createQuiz", [authMiddleware.bind(null, Role.USER)], errorHandler(createQuiz));
quizRouter.post("/updateQuiz", [authMiddleware.bind(null, Role.USER)], errorHandler(updateQuiz));
export default quizRouter;
