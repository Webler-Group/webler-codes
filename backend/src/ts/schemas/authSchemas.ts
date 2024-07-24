import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema } from './typeSchemas';

export const registerSchema = z.object({
    username: usernameSchema,
    email: emailSchema.regex(/.*(?<!weblercodes.com)$/i),
    password: passwordSchema
});

// Base schema for login
const baseLoginSchema = z.object({
    password: passwordSchema,
})

const usernameLoginSchema = baseLoginSchema.extend({
    username: usernameSchema,
    email: z.undefined()
})

const emailLoginSchema = baseLoginSchema.extend({
    email: emailSchema,
    username: z.undefined()
})

export const loginSchema = z.union([usernameLoginSchema, emailLoginSchema]);

export const resendEmailVerificationCodeSchema = z.object({
    email: emailSchema
});

export const verifyEmailSchema = z.object({
    email: emailSchema,
    code: z.string().length(6)
});