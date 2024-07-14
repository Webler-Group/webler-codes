import { Request, Response } from "express";
import { dbClient } from "../services/database";
import { getTemplateSchema , createCodeSchema , deleteCodeSchema , updateCodeSchema , getCodeSchema } from "../schemas/codeSchemas";
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

export const updateCode = errorHandler(async (req: AuthRequest, res: Response) => {
    updateCodeSchema.parse(req.body);
    const codeId: bigint = req.body.codeId ;
    const title: string = req.body.title ;
    const source: string = req.body.source ;
    if(!req.user){
        throw "Not authorized";
    }
    const queryData = {
        where:{
            id: codeId,
            userId:req.user!.id
        },
        data: {
            title,
            source,
        }
    }
    try{
        const code: Code = await dbClient.code.update(queryData);
        res.json({ success: !!code.id });
    }catch(e){
        throw "Could not update code";
    }
});

export const getCode = errorHandler(async (req: AuthRequest, res: Response) => {
    getCodeSchema.parse(req.body);
    const codeId: bigint = req.body.codeId ;
    if(!req.user){
        throw "Not authorized";
    }
    const queryData = {
        where: {
           id: codeId
        }
    };
    try{
        const code: Code | null = await dbClient.code.findUnique(queryData);
        if(code){
          if(code!.isPublic || (req.user!.id == code!.userId)){
              res.json({
                  title: code!.title,
                  source: code!.source,
                  language: code!.codeLanguage,
              });
          }else{
            throw "code is not public" ;
          }
        }else{
            throw "code not found";
        }
    }catch(e){
        throw e;
    }
});

