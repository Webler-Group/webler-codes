import { z } from 'zod';
import { CodeLanguage } from '@prisma/client';
import { idSchema } from './typeSchemas';

export const getTemplateSchema = z.object({
    language: z.nativeEnum(CodeLanguage),
});

export const deleteCodeSchema = z.object({
    codeId: idSchema,
});

export const createCodeSchema = z.object({
    language: z.nativeEnum(CodeLanguage),
    title: z.string(),
    source: z.string(),
});
