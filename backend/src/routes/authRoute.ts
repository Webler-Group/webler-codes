import { Router } from "express";
import { getMe, login, register, resendEmailVerificationCode, verifyEmail } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/resendEmailVerificationCode', resendEmailVerificationCode);
authRouter.post('/verifyEmail', verifyEmail);
authRouter.get('/me', [authMiddleware], getMe);

export default authRouter;