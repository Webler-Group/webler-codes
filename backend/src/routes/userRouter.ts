import { Router } from "express";
import { follow, getUser } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";
import { errorHandler } from "../middleware/errorMiddleware";

const userRouter = Router();

userRouter.post("/follow", [authMiddleware.bind(null, Role.USER)], errorHandler(follow));
userRouter.post("/getUser", [authMiddleware.bind(null, Role.USER)], errorHandler(getUser));
export default userRouter;
