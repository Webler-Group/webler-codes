import { Router } from "express";
import { getTemplate , createCode , deleteCode , getCode , updateCode , getCodesByFilter } from "../controllers/codeController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";
import { errorHandler } from "../middleware/errorMiddleware";

const codeRouter = Router();

codeRouter.post('/getTemplate', [authMiddleware.bind(null, Role.USER)], errorHandler(getTemplate));
codeRouter.post('/createCode', [authMiddleware.bind(null, Role.USER)], errorHandler(createCode));
codeRouter.post('/deleteCode', [authMiddleware.bind(null, Role.USER)], errorHandler(deleteCode));
codeRouter.post('/getCode', [authMiddleware.bind(null, Role.USER)], errorHandler(getCode));
codeRouter.post('/updateCode', [authMiddleware.bind(null, Role.USER)], errorHandler(updateCode));
codeRouter.post('/getCodesByFilter', [authMiddleware.bind(null, Role.USER)], errorHandler(getCodesByFilter));

export default codeRouter;
