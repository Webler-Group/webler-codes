import { z } from 'zod';

const username = z.string().min(3).max(20);
const password = z.string().min(6);
const email = z.string().email();

export const registerSchema = z.object({
    username,
    email,
    password 
});

export const loginSchema = z.object({
    username,
    password
});

export const resendEmailVerificationCodeSchema = z.object({
    userId: z.number()
});

export const verifyEmailSchema = z.object({
    userId: z.number(),
    code: z.string().length(6)
});