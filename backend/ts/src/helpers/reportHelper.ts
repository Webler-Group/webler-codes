import { Prisma, Role, User } from "@prisma/client";
import { defaultUserSelect } from "./userHelper";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { prisma } from "../services/database";
import NotFoundException from "../exceptions/NotFoundException";


export const defaultReportSelect: Prisma.ReportSelect = {
    id: true,
    reason: true,
    reportedUser: {
        select: defaultUserSelect
    },
    status: true,
    createdAt: true,
    assignee: {
        select: defaultUserSelect
    },
    message: true,
    parentId: true,
    note: true,
    type: true
};

export const defaultBanSelect: Prisma.BanSelect = {
    id: true,
    reason: true,
    banStart: true,
    banEnd: true,
    user: { select: defaultUserSelect },
    author: { select: defaultUserSelect },
    note: true
};

export const findReportOrThrow = async (where: Prisma.ReportWhereInput, select: Prisma.ReportSelect = {}) => {
    const report = await prisma.report.findFirst({
        where,
        select: {
            ...defaultReportSelect,
            ...select
        }
    })
    if(!report) {
        throw new NotFoundException('Report not found',ErrorCode.REPORT_NOT_FOUND);
    }
    return report;
}

export const canBanUser = (user: User, userToBan: User) => {
    if(user.roles.includes(Role.ADMIN)) {
        return !userToBan.roles.includes(Role.ADMIN);
    }
    if(user.roles.includes(Role.MODERATOR)) {
        return !(userToBan.roles.includes(Role.ADMIN) || userToBan.roles.includes(Role.ADMIN));
    }
    return false;
}

export const calcDate = (durationInDays: number) => {
    return new Date(Date.now()+(86400_000*durationInDays));
}