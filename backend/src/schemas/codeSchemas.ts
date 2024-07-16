import { z } from 'zod';
import { CodeLanguage } from '@prisma/client';
import { idSchema } from './typeSchemas';

export const getTemplateSchema = z.object({
    language: z.nativeEnum(CodeLanguage),
});

export const deleteCodeSchema = z.object({
    codeId: idSchema,
});

export const getCodeSchema = z.object({
    codeId: idSchema,
});

export const updateCodeSchema = z.object({
    codeId: idSchema,
    title: z.optional(z.string()),
    source: z.optional(z.string()),
    isPublic: z.optional(z.boolean()),
});

export const createCodeSchema = z.object({
    language: z.nativeEnum(CodeLanguage),
    title: z.string(),
    source: z.string(),
});

enum Order {
  ASCENDING = "asc",
  DESCENDING = "desc"
}

export const getCodesByFilterSchema = z.object({
    order: z.optional(z.nativeEnum(Order)),
    userId: z.optional(idSchema),
    language: z.optional(z.nativeEnum(CodeLanguage)),
});
