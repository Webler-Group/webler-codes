import { Response } from "express";
import { prisma } from "../services/database";
import { Prisma, ReportReason, ReportStatus, ReportType} from "@prisma/client";
import { AuthRequest } from "../middleware/authMiddleware";
import { reportUserSchema, getReportSchema, banUserSchema, setParentSchema, closeReportSchema, reportUserSchemaType, getReportSchemaType, setParentSchemaType, closeReportSchemaType, banUserSchemaType } from "../schemas/reportSchemas";
import { calcDate, canBanUser, defaultBanSelect, defaultReportSelect, findReportOrThrow } from "../helpers/reportHelper";
import { bigintToNumber } from "../utils/utils";
import { findUserOrThrow } from "../helpers/userHelper";

/**
 * Create new report
 * @param req Request
 * @param res Response
 */
export const reportUser = async (req: AuthRequest<reportUserSchemaType>, res: Response) => {
    reportUserSchema.parse(req.body);

    const reportType = req.body.type as ReportType;
    const reportReason = req.body.reason as ReportReason;
    const message = req.body.message as string | undefined;
    const reportedUserId = req.body.reportedUserId;
    const currentUser = req.user!;

    const report = await prisma.report.create({
        data:{
            //user.id actually alaways exist in an Request after AuthMiddleware got executed
            authorId: currentUser.id,
            status:ReportStatus.OPENED,
            type:reportType,
            message,
            reportedUserId,
            reason:reportReason,
        },
        select: defaultReportSelect
    });

    res.json({
        success:true, 
        data: bigintToNumber(report)
    });
}

/**
 * Get report
 * @param req Request
 * @param res Response
 */
export const getReport = async (req: AuthRequest<getReportSchemaType>, res: Response)=>{
    getReportSchema.parse(req.body);

    const reportId = req.body.reportId;

    const report = await findReportOrThrow(
        { id: reportId },
        { children: { select: defaultReportSelect }, bans: { select: defaultBanSelect } }
    );
    
    res.json(bigintToNumber(report));
};

/**
 * Get report
 * @param req Request
 * @param res Response
 */
export const banUser = async (req: AuthRequest<banUserSchemaType>, res: Response)=> {
    banUserSchema.parse(req.body);

    const durationInDays = req.body.durationInDays as number;
    const reason = req.body.reason as ReportReason;
    const userId =req.body.userId;
    const endDate = calcDate(durationInDays);
    const currentUser = req.user!;

    await findUserOrThrow({ id: userId });

    const ban = await prisma.ban.create({
        data:{
            banEnd:endDate,
            reason,
            userId,
            authorId:currentUser.id
        },
        select: defaultBanSelect
    });

    res.json({
        success:true,
        date: bigintToNumber(ban)
    });
}

/**
 * Get report
 * @param req Request
 * @param res Response
 */
export const closeReport = async (req: AuthRequest<closeReportSchemaType>, res: Response)=>{   
    closeReportSchema.parse(req.body);
    
    const reportId = req.body.reportId;
    const note = req.body.reason;
    const bans = req.body.bans;
    const currentUser = req.user!;

    const report = await findReportOrThrow({ id: reportId });

    const bansData: Prisma.BanCreateManyInput[] = [];
    for(let ban of bans) {
        const userToBan = await prisma.user.findFirst({ where: { id: ban.userId } });
        
        if(userToBan && canBanUser(currentUser, userToBan)) {
            bansData.push({
                userId: ban.userId,
                reason: ban.reason ?? report.reason,
                authorId: currentUser.id,
                banEnd: calcDate(ban.durationInDays),
                note: ban.note,
                relatedReportId: reportId,
            });
        }
    }

    const updateReport = prisma.report.update({
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
            },
            bans: {
                createMany: {
                    data: bansData
                }
            }
        },
        select: defaultReportSelect
    });

    const createBans = prisma.ban.createMany({
        data: bansData
    });

    const [updatedReport] = await prisma.$transaction([
        updateReport,
        createBans
    ]);
    
    res.json({
        success: true,
        data: updatedReport
    });
}
    
/**
 * Get report
 * @param req Request
 * @param res Response
 */
export const setParent = async (req: AuthRequest<setParentSchemaType>, res: Response)=>{
    setParentSchema.parse(req.body);

    const reportIds = req.body.reportIds;
    const parentId = req.body.parentId;

    const parentReport = await findReportOrThrow({ id: parentId });

    await prisma.report.updateMany({
        where:{
            id:{in:reportIds}
        },
        data:{
            parentId,
            status: parentReport.status
        }
    });

    res.json({success:true})
}
