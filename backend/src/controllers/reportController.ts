import { errorHandler } from "../middleware/errorMiddleware";
import { Request, Response } from "express";
import { dbClient } from "../services/database";
import { ReportReason, ReportStatus, ReportType } from "@prisma/client";
import { AuthRequest } from "../middleware/authMiddleware";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import NotFoundException from "../exceptions/NotFoundException";
import { reportUserSchema, getReportSchema } from "../schemas/reportSchemas";

export const reportUser = errorHandler(async (req: AuthRequest, res: Response)=>
{
    reportUserSchema.parse(req.body);

    const reportType = req.body.type as ReportType;
    const reportReason = req.body.reason as ReportReason;
    const message = req.body.message as string | undefined;
    const reportedUserId = req.body.reportedUserId as bigint;

    await dbClient.report.create({
        data:{
            //user.id actually alaways exist in an AuthRequest after AuthMiddleware got executed
            authorId:req.user?.id as bigint,
            status:ReportStatus.OPENED,
            type:reportType,
            message,
            reportedUserId,
            reason:reportReason,
        }
    })
    res.json({success:true})
});


export const getReport = errorHandler(async (req: AuthRequest, res: Response)=>
{
    getReportSchema.parse(req.body);

    const reportId = req.body.reportId as bigint;

    const report = await dbClient.report.findUnique({
        where:{
            id: reportId
        }
    })
    if(report===null) throw new NotFoundException("There is no error with id: "+reportId,ErrorCode.REPORT_NOT_FOUND);
    res.json({success:true, report})
});

