import { z } from 'zod';

export const usernameSchema = z.string().min(3).max(20);

export const passwordSchema = z.string().min(6);

export const emailSchema = z.string().email();

export const idSchema = z.string().regex(/^[0-9]{1,18}$/); // string representation of bigint