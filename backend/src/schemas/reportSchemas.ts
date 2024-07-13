import { ReportReason, ReportType } from "@prisma/client";
import {z} from "zod";

const reportTypeSchema = z.enum([ReportType.PROFILE ,...Object.keys(ReportType)]);
const reportReasonSchema = z.enum([ReportReason.INAPPROPRIATE_CONTENT ,...Object.keys(ReportReason)]);

export const reportUserSchema = z.object({
    reason: reportReasonSchema,
    type: reportTypeSchema,
    message: z.undefined().or(z.string().max(1024)),
    reportedUserId: z.bigint(),
});

export const getReportSchema = z.object({
    reportId: z.bigint(),
});

