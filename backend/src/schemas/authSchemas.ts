import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema } from './typeSchemas';

export const registerSchema = z.object({
    username: usernameSchema,
    email: emailSchema.regex(/.*(?<!weblercodes.com)$/i),
    password: passwordSchema
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
});

export const resendEmailVerificationCodeSchema = z.object({
    email: emailSchema
});

export const verifyEmailSchema = z.object({
    email: emailSchema,
    code: z.string().length(6)
});