import { Router } from "express";
import { getMe, login, logout, refreshToken, register, resendEmailVerificationCode, verifyEmail } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/resendEmailVerificationCode', resendEmailVerificationCode);
authRouter.post('/verifyEmail', verifyEmail);
authRouter.post('/logout', logout);
authRouter.post('/refreshToken', refreshToken);
authRouter.get('/me', [authMiddleware], getMe);

export default authRouter;