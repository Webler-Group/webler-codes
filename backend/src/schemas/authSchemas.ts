import { z } from 'zod';

const username = z.string().min(3).max(20);
const password = z.string().min(6);
const email = z.string().email();

export const registerSchema = z.object({
    username,
    email: email.regex(/.*(?<!weblercodes.com)$/i),
    password 
});

export const loginSchema = z.object({
    email,
    password
});

export const resendEmailVerificationCodeSchema = z.object({
    email
});

export const verifyEmailSchema = z.object({
    email,
    code: z.string().length(6)
});