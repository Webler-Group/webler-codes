import { Request, Response } from "express";
import { dbClient } from "../services/database";
import { getTemplateSchema , createCodeSchema , deleteCodeSchema , updateCodeSchema , getCodeSchema , getCodesByFilterSchema } from "../schemas/codeSchemas";
import { AuthRequest } from "../middleware/authMiddleware";
import { errorHandler } from "../middleware/errorMiddleware";
import { defaultCodeSelect, findCodeOrThrow } from "../helpers/codeHelper";
import { bigintToNumber } from "../utils/utils";

export const getTemplate = errorHandler(async (req: AuthRequest, res: Response) => {
    getTemplateSchema.parse(req.body);

    const { language } = req.body;

    const template = await dbClient.codeTemplate.findFirst({
        where: { language }
    });

    res.json({ source: template ? template.source : "" });
});

export const createCode = errorHandler(async (req: AuthRequest, res: Response) => {
    createCodeSchema.parse(req.body);

    const { title, tags, codeLanguage, source } = req.body;

    const code = await dbClient.code.create({
        data: {
            codeLanguage,
            title,
            source, 
            userId: req.user!.id,
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
});

export const deleteCode = errorHandler(async (req: AuthRequest, res: Response) => {
    deleteCodeSchema.parse(req.body);

    const codeId: bigint = req.body.codeId;

    await dbClient.code.delete({where:{id:codeId}});

    res.json({ success: true });
});


export const updateCode = errorHandler(async (req: AuthRequest, res: Response) => {
    updateCodeSchema.parse(req.body);

    const { codeId, title, isPublic, tags, source } = req.body;

    const code = await dbClient.code.update({
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
});

export const getCode = errorHandler(async (req: AuthRequest, res: Response) => {
    getCodeSchema.parse(req.body);

    const codeUID = req.body.codeUID;
    
    const code = await findCodeOrThrow(
        { uid: codeUID },
        { source: true, codeVersions: { select: { name: true, createdAt: true } } }
    );

    res.json(bigintToNumber(code));
});

export const getCodesByFilter = errorHandler(async (req: AuthRequest, res: Response) => {
    getCodesByFilterSchema.parse(req.body);
    
    const { filter, order, offset, count } = req.body;

    const codes = await dbClient.code.findMany({
        orderBy: order,
        where: {
            codeLanguage: filter.language,
            userId: filter.userId,
            tags: filter.tags ? { some: { name: { in: filter.tags } } } : undefined,
            title: filter.title
        },
        select: defaultCodeSelect,
        skip: offset,
        take: count
    });

    res.json(codes.map(x => bigintToNumber(x)));
});
