import { errorHandler } from "../middleware/errorMiddleware";
import { Request, Response } from "express";
import { dbClient } from "../services/database";
import { Prisma, ReportReason, ReportStatus, ReportType} from "@prisma/client";
import { AuthRequest } from "../middleware/authMiddleware";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import NotFoundException from "../exceptions/NotFoundException";
import { reportUserSchema, getReportSchema, banUserSchema, setParentSchema, closeReportSchema } from "../schemas/reportSchemas";
import { canAbanB } from "../helpers/userHelper";

function calcDate(durationInDays: number){
    return new Date(Date.now()+(86400_000*durationInDays));
}

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

export const banUser = errorHandler(async (req: AuthRequest, res: Response)=>
{
    banUserSchema.parse(req.body);
    const durationInDays = req.body.durationInDays as number;
    const reason = req.body.reason as ReportReason;
    const userId = req.body.userId as bigint;
    const endDate = calcDate(durationInDays);
    await dbClient.ban.create({
        data:{
            banEnd:endDate,
            reason,
            userId,
            authorId:req.user?.id as bigint
        }
    });
    res.json({success:true})
});
export const closeReport = errorHandler(async (req: AuthRequest, res: Response)=>
{   
    closeReportSchema.parse(req.body);
    
    const reportId = req.body.reportId as number;
    const note = req.body.reason as string|undefined;
    const bans = req.body.bans as {userId:bigint, reason:ReportReason, durationInDays:number, note:string}[];
    // DON'T resort this function carelessly.
    await dbClient.ban.createMany({
        data:{
            ...bans.map(ban=>({
                banEnd: calcDate(ban.durationInDays),
                reason: ban.reason,
                note: ban.note,
                userId: ban.userId,
                authorId: req.user?.id as bigint,
            })).filter(async ban=> await canAbanB(ban.authorId,ban.userId))
        }
    });
    
    await dbClient.report.update({
        where:{
            id:reportId,    
        },
        data:{
            status:ReportStatus.CLOSED,
            note,
            children:{
                updateMany:{
                    where:{},
                    data:{
                        status:ReportStatus.CLOSED
                    }
                }
            }
        }
    })
    res.json({success:true})
});
    
export const setParent = errorHandler(async (req: AuthRequest, res: Response)=>
{
    setParentSchema.parse(req.body);
    const reportIds = req.body.reportIds as bigint[];
    const parentId = req.body.parentId as bigint;
    dbClient.report.updateMany({
        where:{
            id:{in:reportIds}
        },
        data:{
            parentId
        }
    });
    res.json({success:true})
});
