import { z } from 'zod';
import { CodeLanguage } from '@prisma/client';
import { idSchema, orderDirectionSchema, nonNegativeIntegerSchema } from './typeSchemas';

const getTemplateSchema = z.object({
    language: z.nativeEnum(CodeLanguage),
});

const deleteCodeSchema = z.object({
    codeId: idSchema,
});

const getCodeSchema = z.object({
    codeUID: z.string().uuid(),
});

const updateCodeSchema = z.object({
    codeId: idSchema,
    title: z.string().optional(),
    source: z.string().optional(),
    isPublic: z.boolean().optional(),
    tags: z.string().array().optional()
});

const createCodeSchema = z.object({
    language: z.nativeEnum(CodeLanguage),
    title: z.string(),
    source: z.string(),
    tags: z.string().array()
});

const getCodesByFilterSchema = z.object({
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

type getTemplateSchemaType = z.infer<typeof getTemplateSchema>;
type deleteCodeSchemaType = z.infer<typeof deleteCodeSchema>;
type getCodeSchemaType = z.infer<typeof getCodeSchema>;
type updateCodeSchemaType = z.infer<typeof updateCodeSchema>;
type createCodeSchemaType = z.infer<typeof createCodeSchema>;
type getCodesByFilterSchemaType = z.infer<typeof getCodesByFilterSchema>;

export {
    getCodeSchema,
    getCodeSchemaType,
    getTemplateSchema,
    getTemplateSchemaType,
    getCodesByFilterSchema,
    getCodesByFilterSchemaType,
    deleteCodeSchema,
    deleteCodeSchemaType,
    updateCodeSchema,
    updateCodeSchemaType,
    createCodeSchema,
    createCodeSchemaType
}
