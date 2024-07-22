import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema } from './typeSchemas';

const registerSchema = z.object({
    username: usernameSchema,
    email: emailSchema.regex(/.*(?<!weblercodes.com)$/i),
    password: passwordSchema
});

const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
});

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