import { z } from 'zod';

export enum OrderBy {
    ASCENDING = "asc",
    DESCENDING = "desc"
}

export const usernameSchema = z.string().min(3).max(20);

export const passwordSchema = z.string().min(6);

export const emailSchema = z.string().email();

export const idSchema = z.number().min(1).max(Number.MAX_SAFE_INTEGER).transform((val) => BigInt(val));

export const orderDirectionSchema = z.nativeEnum(OrderBy);

export const nonNegativeIntegerSchema = z.number().int();