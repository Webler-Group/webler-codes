import { Router } from "express";
import { getMe, login, logout, refreshToken, register, resendEmailVerificationCode, verifyEmail } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";
import { errorHandler } from "../middleware/errorMiddleware";

const authRouter = Router();

authRouter.post('/register', errorHandler(register));
authRouter.post('/login', errorHandler(login));
authRouter.post('/resendEmailVerificationCode', errorHandler(resendEmailVerificationCode));
authRouter.post('/verifyEmail', errorHandler(verifyEmail));
authRouter.post('/logout', [authMiddleware.bind(null, Role.USER)], errorHandler(logout));
authRouter.post('/refreshToken', errorHandler(refreshToken));
authRouter.get('/me', [authMiddleware.bind(null, Role.USER)], errorHandler(getMe));

export default authRouter;