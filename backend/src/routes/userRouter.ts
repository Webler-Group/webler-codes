import { Router } from "express";
import { follow, getUser, blockUser, getFollowers, getFollowings, updateProfile } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";
import { errorHandler } from "../middleware/errorMiddleware";

const userRouter = Router();

userRouter.post("/follow", [authMiddleware.bind(null, Role.USER)], errorHandler(follow));
userRouter.post("/getUser", [authMiddleware.bind(null, Role.USER)], errorHandler(getUser));
userRouter.post("/blockUser", [authMiddleware.bind(null, Role.USER)], errorHandler(blockUser));
userRouter.post("/getFollowers", [authMiddleware.bind(null, Role.USER)], errorHandler(getFollowers));
userRouter.post("/getFollowings", [authMiddleware.bind(null, Role.USER)], errorHandler(getFollowings));
userRouter.post("/updateProfile", [authMiddleware.bind(null, Role.USER)], errorHandler(updateProfile));
export default userRouter;
