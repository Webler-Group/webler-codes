import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema } from './typeSchemas';

const registerSchema = z.object({
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
});

const loginSchema = z.union([usernameLoginSchema, emailLoginSchema]);

const resendEmailVerificationCodeSchema = z.object({
    email: emailSchema
});

const verifyEmailSchema = z.object({
    email: emailSchema,
    code: z.string().length(6)
});

type verifyEmailSchemaType = z.infer<typeof verifyEmailSchema>;
type resendEmailVerificationCodeSchemaType = z.infer<typeof resendEmailVerificationCodeSchema>;
type loginSchemaType = z.infer<typeof loginSchema>;
type registerSchemaType = z.infer<typeof registerSchema>;

export {
    registerSchema,
    loginSchema,
    resendEmailVerificationCodeSchema,
    verifyEmailSchema,
    verifyEmailSchemaType,
    registerSchemaType,
    resendEmailVerificationCodeSchemaType,
    loginSchemaType
}