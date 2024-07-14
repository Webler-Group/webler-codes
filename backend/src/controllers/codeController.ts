import { Request, Response } from "express";
import { dbClient } from "../services/database";
import { getTemplateSchema , createCodeSchema , deleteCodeSchema} from "../schemas/codeSchemas";
import { AuthRequest } from "../middleware/authMiddleware";
import { errorHandler } from "../middleware/errorMiddleware";
import { CodeLanguage , Code , User } from "@prisma/client";

export const getTemplate = errorHandler(async (req: Request, res: Response) => {
    getTemplateSchema.parse(req.body);
    const language: CodeLanguage = req.body.language;
    const template = await dbClient.codeTemplate.findFirst({
        where: {language}, select: {source: true}
    });
    res.json(template);
});

export const createCode = errorHandler(async (req: AuthRequest, res: Response) => {
    createCodeSchema.parse(req.body);
    const language: CodeLanguage = req.body.language ;
    const title: string = req.body.title ;
    const source: string = req.body.source ;
    if(!req.user){
        throw "Not authorized";
    }
    const data = {
        codeLanguage: language, title, source, userId:req.user!.id
    }
    try{
        const code: Code = await dbClient.code.create({data});
        res.json({ success: !!code.id });
    }catch(e){
        throw "Could not create code";
    }
});

export const deleteCode = errorHandler(async (req: AuthRequest, res: Response) => {
    deleteCodeSchema.parse(req.body);
    const codeId = req.body.codeId ;
    const user: User | undefined = req.user ;
    if(!req.user){
        throw "Not authorized";
    }
    if(!codeId){
        throw "Incorrect request";
    }
    try{
        await dbClient.code.delete({where:{id:codeId, userId: req.user!.id}});
        res.json({ success: true });
    }catch(e){
        throw "Delete failed";
    }
});
