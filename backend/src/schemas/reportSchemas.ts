import { ReportReason, ReportType } from "@prisma/client";
import {z} from "zod";
import { idSchema } from "./typeSchemas";

const reportTypeSchema = z.enum([ReportType.PROFILE ,...Object.keys(ReportType)]);
const reportReasonSchema = z.enum([ReportReason.INAPPROPRIATE_CONTENT ,...Object.keys(ReportReason)]);
const durationInDaysSchema = z.number().max(365.25*100).min(1);
const messageLength = 4096;
export const reportUserSchema = z.object({
    reason: reportReasonSchema,
    type: reportTypeSchema,
    message: z.undefined().or(z.string().max(messageLength)),
    reportedUserId: idSchema,
});

export const getReportSchema = z.object({
    reportId: idSchema,
});

export const banUserSchema = z.object({
    reason: reportReasonSchema,
    userId: idSchema,
    durationInDays: durationInDaysSchema,
});

export const setParentSchema = z.object({
    reportIds: idSchema.array(),
    parentId: idSchema
});

export const closeReportSchema = z.object({
    reportId: idSchema,
    note: z.string().max(messageLength).or(z.undefined()),
    bans: z.object({
        userId: idSchema,
        durationInDays: durationInDaysSchema,
        reason: reportReasonSchema,
        note: z.string().max(messageLength).or(z.undefined()),
    }).array(),
});
