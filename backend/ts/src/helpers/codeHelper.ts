import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { prisma } from "../services/database";
import NotFoundException from "../exceptions/NotFoundException";
import { Prisma } from "@prisma/client";
import { defaultUserSelect } from "./userHelper";

export const defaultCodeSelect: Prisma.CodeSelect = {
    id: true,
    uid: true,
    title: true,
    tags: { select: { name: true } },
    createdAt: true,
    updatedAt: true,
    isPublic: true,
    codeLanguage: true,
    user: {
        select: defaultUserSelect
    }
};

export const findCodeOrThrow = async (
    where: Prisma.CodeWhereInput, 
    select: Prisma.CodeSelect = {}
) => {
    const code = await prisma.code.findFirst({ 
        where, 
        select: { 
            ...select,
            ...defaultCodeSelect
        }
    });
    if (!code) {
        throw new NotFoundException('Code not found', ErrorCode.CODE_NOT_FOUND);
    }
    return code;
}