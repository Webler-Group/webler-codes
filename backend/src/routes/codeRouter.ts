import { Router } from "express";
import { getTemplate , createCode , deleteCode , getCode , updateCode } from "../controllers/codeController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";

const codeRouter = Router();

codeRouter.post('/getTemplate', getTemplate);
codeRouter.post('/createCode', [authMiddleware.bind(null, Role.USER)], createCode);
codeRouter.post('/deleteCode', [authMiddleware.bind(null, Role.USER)], deleteCode);
codeRouter.post('/getCode', [authMiddleware.bind(null, Role.USER)], getCode);
codeRouter.post('/updateCode', [authMiddleware.bind(null, Role.USER)], updateCode);

export default codeRouter;
