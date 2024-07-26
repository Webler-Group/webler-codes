import { z } from 'zod';
import {  } from '@prisma/client';
import { idSchema, orderDirectionSchema, nonNegativeIntegerSchema } from './typeSchemas';

const deleteDiscussionSchema = z.object({
    discussionId: idSchema,
});

const getDiscussionSchema = z.object({
    discussionId: idSchema,
});

const updateDiscussionSchema = z.object({
    discussionId: idSchema,
    title: z.string().optional(),
    text: z.string().optional(),
    tags: z.string().array().optional()
});

const createDiscussionSchema = z.object({
    title: z.string(),
    text: z.string(),
    tags: z.string().array()
});

const getDiscussionsByFilterSchema = z.object({
    order: z.object({
        createdAt: orderDirectionSchema.optional(),
        title: orderDirectionSchema.optional()
    }),
    filter: z.object({
        userId: idSchema.optional(),
        tags: z.string().array().optional(),
        title: z.string().optional()
    }),
    offset: nonNegativeIntegerSchema,
    count: nonNegativeIntegerSchema.min(1).max(100)
});

const createAnswerSchema = z.object({
  text: z.string(),
  discussionId: idSchema
});

const deleteAnswerSchema = z.object({
  answerId: idSchema,
});


type deleteDiscussionSchemaType = z.infer<typeof deleteDiscussionSchema>;
type getDiscussionSchemaType = z.infer<typeof getDiscussionSchema>;
type updateDiscussionSchemaType = z.infer<typeof updateDiscussionSchema>;
type createDiscussionSchemaType = z.infer<typeof createDiscussionSchema>;
type getDiscussionsByFilterSchemaType = z.infer<typeof getDiscussionsByFilterSchema>;
type createAnswerSchemaType = z.infer<typeof createAnswerSchema>;
type deleteAnswerSchemaType = z.infer<typeof deleteAnswerSchema>;

export {
    getDiscussionSchema,
    getDiscussionsByFilterSchema,
    deleteDiscussionSchema,
    updateDiscussionSchema,
    createDiscussionSchema,
    createAnswerSchema,
    deleteAnswerSchema,

    getDiscussionSchemaType,
    getDiscussionsByFilterSchemaType,
    deleteDiscussionSchemaType,
    updateDiscussionSchemaType,
    createDiscussionSchemaType,
    createAnswerSchemaType,
    deleteAnswerSchemaType,
}
