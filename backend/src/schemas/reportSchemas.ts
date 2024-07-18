import { ReportReason, ReportType } from "@prisma/client";
import {z} from "zod";
import { idSchema, nonNegativeIntegerSchema } from "./typeSchemas";

export const reportUserSchema = z.object({
    reason: z.nativeEnum(ReportReason),
    type: z.nativeEnum(ReportType),
    message: z.string().max(256).optional(),
    reportedUserId: idSchema,
});

export const getReportSchema = z.object({
    reportId: idSchema,
});

export const banUserSchema = z.object({
    reason: z.nativeEnum(ReportReason),
    userId: idSchema,
    durationInDays: nonNegativeIntegerSchema,
});

export const setParentSchema = z.object({
    reportIds: idSchema.array(),
    parentId: idSchema
});

export const closeReportSchema = z.object({
    reportId: idSchema,
    note: z.string().max(256).optional(),
    bans: z.object({
        userId: idSchema,
        durationInDays: nonNegativeIntegerSchema,
        reason: z.nativeEnum(ReportReason),
        note: z.string().max(256).optional()
    }).array(),
});
