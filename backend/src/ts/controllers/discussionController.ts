import { Response } from "express";
import { prisma } from "../services/database";
import { getTemplateSchema , createCodeSchema , deleteCodeSchema , updateCodeSchema , getCodeSchema , getCodesByFilterSchema, createCodeSchemaType, getTemplateSchemaType, deleteCodeSchemaType, updateCodeSchemaType, getCodeSchemaType, getCodesByFilterSchemaType } from "../schemas/codeSchemas";
import { AuthRequest } from "../middleware/authMiddleware";
import { defaultCodeSelect, findCodeOrThrow } from "../helpers/codeHelper";
import { bigintToNumber } from "../utils/utils";
import ForbiddenException from "../exceptions/ForbiddenException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { Role } from "@prisma/client";

/**
 * Creates a Discussion
 * @param req Request
 * @param res Response
 */
export const createDiscussion = async (req: AuthRequest<getTemplateSchemaType>, res: Response) => {
  res.json({});
}

/**
 * Deletes a Discussion
 * @param req Request
 * @param res Response
 */
export const deleteDiscussion = async (req: AuthRequest<createCodeSchemaType>, res: Response) => {
  res.json({});
}

/**
 * Updates a Discussion
 * @param req Request
 * @param res Response
 */
export const updateDiscussion = async (req: AuthRequest<deleteCodeSchemaType>, res: Response) => {
  res.json({});
}

/**
 * Gets a Discussion by Id
 * @param req Request
 * @param res Response
 */
export const getDiscussionById = async (req: AuthRequest<updateCodeSchemaType>, res: Response) => {
  res.json({});
}

/**
 * Gets Discussions by Filter
 * @param req Request
 * @param res Response
 */
export const getDiscussionsByFilter = async (req: AuthRequest<updateCodeSchemaType>, res: Response) => {
  res.json({});
}

