import { Router } from "express";
import { login, register, resendEmailVerificationCode, verifyEmail } from "../controllers/authController";

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/resendEmailVerificationCode', resendEmailVerificationCode);
authRouter.post('/verifyEmail', verifyEmail);

export default authRouter;