import { Router } from "express";
import { follow } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";

const userRouter = Router();

userRouter.post('/follow', [authMiddleware.bind(null, Role.USER)], follow);

export default userRouter;