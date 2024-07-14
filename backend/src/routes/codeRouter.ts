import { Router } from "express";
import { getTemplate , createCode , deleteCode } from "../controllers/codeController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";

const codeRouter = Router();

codeRouter.post('/getTemplate', getTemplate);
codeRouter.post('/createCode', [authMiddleware.bind(null, Role.USER)], createCode);
codeRouter.post('/deleteCode', [authMiddleware.bind(null, Role.USER)], deleteCode);

export default codeRouter;
