import { Response } from "express";
import { prisma } from "../services/database";
import { getTemplateSchema , createCodeSchema , deleteCodeSchema , updateCodeSchema , getCodeSchema , getCodesByFilterSchema } from "../schemas/codeSchemas";
import { AuthRequest } from "../middleware/authMiddleware";
import { defaultCodeSelect, findCodeOrThrow } from "../helpers/codeHelper";
import { bigintToNumber } from "../utils/utils";
import ForbiddenException from "../exceptions/ForbiddenException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";

export const getTemplate = async (req: AuthRequest, res: Response) => {
    getTemplateSchema.parse(req.body);

    const { language } = req.body;

    const template = await prisma.codeTemplate.findFirst({
        where: { language }
    });

    res.json({ source: template ? template.source : "" });
}

export const createCode = async (req: AuthRequest, res: Response) => {
    createCodeSchema.parse(req.body);

    const { title, tags, language, source } = req.body;
    const currentUser = req.user!;

    const code = await prisma.code.create({
        data: {
            codeLanguage: language,
            title,
            source, 
            userId: currentUser.id,
            tags: {
                connect: tags.map((x: string) => ({ name: x }))
            }
        },
        select: defaultCodeSelect
    });

    res.json({ 
        success: true, 
        data: bigintToNumber(code)
    });
}

export const deleteCode = async (req: AuthRequest, res: Response) => {
    deleteCodeSchema.parse(req.body);

    const { codeId } = req.body;
    const currentUser = req.user!;

    let code = await findCodeOrThrow({ id: codeId }, { id: true, userId: true });

    if(code.userId != currentUser.id) {
        throw new ForbiddenException("Forbidden", ErrorCode.FORBIDDEN);
    }

    await prisma.code.delete({where:{id:codeId}});

    res.json({ success: true });
}


export const updateCode = async (req: AuthRequest, res: Response) => {
    updateCodeSchema.parse(req.body);

    const { codeId, title, isPublic, tags, source } = req.body;
    const currentUser = req.user!;

    let code = await findCodeOrThrow({ id: codeId }, { id: true, userId: true });

    if(code.userId != currentUser.id) {
        throw new ForbiddenException("Forbidden", ErrorCode.FORBIDDEN);
    }

    code = await prisma.code.update({
        where:{ id: codeId },
        data: {
            tags: { set: tags.map((x: string) => ({ name: x })) },
            title,
            isPublic,
            source
        },
        select: defaultCodeSelect
    });

    res.json({ 
        success: true,
        data: bigintToNumber(code)
    });
}

export const getCode = async (req: AuthRequest, res: Response) => {
    getCodeSchema.parse(req.body);

    const codeUID = req.body.codeUID;
    
    const code = await findCodeOrThrow(
        { uid: codeUID },
        { source: true, codeVersions: { select: { name: true, createdAt: true } } }
    );

    res.json(bigintToNumber(code));
}

export const getCodesByFilter = async (req: AuthRequest, res: Response) => {
    getCodesByFilterSchema.parse(req.body);
    
    const { filter, order, offset, count } = req.body;
    const currentUser = req.user!;

    const codes = await prisma.code.findMany({
        orderBy: order,
        where: {
            codeLanguage: filter.language,
            userId: filter.userId,
            tags: filter.tags ? { some: { name: { in: filter.tags } } } : undefined,
            title: filter.title,
            isPublic: currentUser.id == filter.userId ? undefined : true
        },
        select: defaultCodeSelect,
        skip: offset,
        take: count
    });

    res.json(codes.map(x => bigintToNumber(x)));
}
