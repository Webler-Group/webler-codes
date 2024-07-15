import { Request, Response } from "express";
import { dbClient } from "../services/database";
import { getTemplateSchema , createCodeSchema , deleteCodeSchema , updateCodeSchema , getCodeSchema } from "../schemas/codeSchemas";
import { AuthRequest } from "../middleware/authMiddleware";
import { errorHandler } from "../middleware/errorMiddleware";
import { CodeLanguage , Code , User } from "@prisma/client";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import ForbiddenException from "../exceptions/ForbiddenException";
import NotFoundException from "../exceptions/NotFoundException";

export const getTemplate = errorHandler(async (req: AuthRequest, res: Response) => {
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
    const data = {
        codeLanguage: language, title, source, userId:req.user!.id
    }
    const code: Code = await dbClient.code.create({data});
    res.json({ success: true });
});

export const deleteCode = errorHandler(async (req: AuthRequest, res: Response) => {
    deleteCodeSchema.parse(req.body);
    const codeId: bigint = req.body.codeId ;
    await dbClient.code.delete({where:{id:codeId, userId: req.user!.id}});
    res.json({ success: true });
});


export const updateCode = errorHandler(async (req: AuthRequest, res: Response) => {
    updateCodeSchema.parse(req.body);
    if(req.body.title){
      const queryData = {
        where:{ id: req.body.codeId, userId:req.user!.id},
        data:{ title:req.body.title }
      }
      const code: Code = await dbClient.code.update(queryData);
    }
    if(req.body.source){
      const queryData = {
        where:{ id: req.body.codeId, userId:req.user!.id},
        data:{ source:req.body.source }
      }
      const code: Code = await dbClient.code.update(queryData);
    }
    if(req.body.isPublic){
      const queryData = {
        where:{ id: req.body.codeId, userId:req.user!.id},
        data:{ isPublic:req.body.isPublic }
      }
      const code: Code = await dbClient.code.update(queryData);
    }
    res.json({ success: true });
});

export const getCode = errorHandler(async (req: AuthRequest, res: Response) => {
    getCodeSchema.parse(req.body);
    const codeId: bigint = req.body.codeId ;
    const queryData = {
        where: {
           id: codeId
        }
    };
    const code: Code | null = await dbClient.code.findUnique(queryData);
    if(code){
          if(code!.isPublic || (req.user!.id == code!.userId)){
              res.json({
                  title: code!.title,
                  source: code!.source,
                  language: code!.codeLanguage,
              });
          }else{
              throw new ForbiddenException("Could not access. Not public. Forbidden.", ErrorCode.FORBIDDEN);
          }
    }else{
        throw new NotFoundException("Code not found", ErrorCode.ROUTE_NOT_FOUND);;
    }
});

