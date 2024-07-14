import { ReportReason, ReportType } from "@prisma/client";
import {z} from "zod";

const reportTypeSchema = z.enum([ReportType.PROFILE ,...Object.keys(ReportType)]);
const reportReasonSchema = z.enum([ReportReason.INAPPROPRIATE_CONTENT ,...Object.keys(ReportReason)]);
const durationInDaysSchema = z.number().max(365.25*100).min(1);
const messageLength = 4096;
export const reportUserSchema = z.object({
    reason: reportReasonSchema,
    type: reportTypeSchema,
    message: z.undefined().or(z.string().max(messageLength)),
    reportedUserId: z.bigint(),
});

export const getReportSchema = z.object({
    reportId: z.bigint(),
});

export const banUserSchema = z.object({
    reason: reportReasonSchema,
    userId: z.bigint(),
    durationInDays: durationInDaysSchema,
});

export const setParentSchema = z.object({
    reportIds: z.bigint().array(),
    parentId: z.bigint(),
});

export const closeReportSchema = z.object({
    reportId: z.bigint(),
    note: z.string().max(messageLength).or(z.undefined()),
    bans: z.object({
        userId: z.bigint(),
        durationInDays: durationInDaysSchema,
        reason: reportReasonSchema,
        note: z.string().max(messageLength).or(z.undefined()),
    }).array(),
});
