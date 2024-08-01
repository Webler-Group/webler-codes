import { ReportReason, ReportType } from "@prisma/client";
import {z} from "zod";
import { idSchema, nonNegativeIntegerSchema } from "./typeSchemas";

const reportUserSchema = z.object({
    reason: z.nativeEnum(ReportReason),
    type: z.nativeEnum(ReportType),
    message: z.string().max(256).optional(),
    reportedUserId: idSchema,
});

const getReportSchema = z.object({
    reportId: idSchema,
});

const banUserSchema = z.object({
    reason: z.nativeEnum(ReportReason),
    userId: idSchema,
    durationInDays: nonNegativeIntegerSchema,
});

const setParentSchema = z.object({
    reportIds: idSchema.array(),
    parentId: idSchema
});

const closeReportSchema = z.object({
    reportId: idSchema,
    note: z.string().max(256).optional(),
    reason: z.nativeEnum(ReportReason),
    bans: z.object({
        userId: idSchema,
        durationInDays: nonNegativeIntegerSchema,
        reason: z.nativeEnum(ReportReason).optional(),
        note: z.string().max(256).optional()
    }).array(),
});

type reportUserSchemaType = z.infer<typeof reportUserSchema>;
type getReportSchemaType = z.infer<typeof getReportSchema>;
type banUserSchemaType = z.infer<typeof banUserSchema>;
type setParentSchemaType = z.infer<typeof setParentSchema>;
type closeReportSchemaType = z.infer<typeof closeReportSchema>;

export {
    reportUserSchema,
    reportUserSchemaType,
    getReportSchema,
    getReportSchemaType,
    banUserSchema,
    banUserSchemaType,
    setParentSchema,
    setParentSchemaType,
    closeReportSchema,
    closeReportSchemaType
}