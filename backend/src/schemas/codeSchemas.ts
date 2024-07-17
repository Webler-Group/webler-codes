import { z } from 'zod';
import { CodeLanguage } from '@prisma/client';
import { idSchema, orderDirectionSchema, nonNegativeIntegerSchema } from './typeSchemas';

export const getTemplateSchema = z.object({
    language: z.nativeEnum(CodeLanguage),
});

export const deleteCodeSchema = z.object({
    codeId: idSchema,
});

export const getCodeSchema = z.object({
    codeUID: z.string().uuid(),
});

export const updateCodeSchema = z.object({
    codeId: idSchema,
    title: z.string().optional(),
    source: z.string().optional(),
    isPublic: z.boolean().optional(),
});

export const createCodeSchema = z.object({
    language: z.nativeEnum(CodeLanguage),
    title: z.string(),
    source: z.string(),
});

export const getCodesByFilterSchema = z.object({
    order: z.object({
        createdAt: orderDirectionSchema.optional(),
        title: orderDirectionSchema.optional()
    }),
    filter: z.object({
        language: z.nativeEnum(CodeLanguage).optional(),
        userId: idSchema.optional(),
        tags: z.string().array().optional(),
        title: z.string().optional()
    }),
    offset: nonNegativeIntegerSchema,
    count: nonNegativeIntegerSchema.min(1).max(100)
});
