import { Response } from "express";
import { prisma } from "../services/database";
import { createDiscussionSchema , deleteDiscussionSchema , updateDiscussionSchema , getDiscussionSchema , getDiscussionsByFilterSchema } from "../schemas/discussionSchemas";
import { createDiscussionSchemaType, deleteDiscussionSchemaType, updateDiscussionSchemaType, getDiscussionSchemaType, getDiscussionsByFilterSchemaType } from "../schemas/discussionSchemas";
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
export const createDiscussion = async (req: AuthRequest<createDiscussionSchemaType>, res: Response) => {
  createDiscussionSchema.parse(req.body);
  const { title, text } = req.body;
  res.json({});
}

/**
 * Deletes a Discussion
 * @param req Request
 * @param res Response
 */
export const deleteDiscussion = async (req: AuthRequest<deleteDiscussionSchemaType>, res: Response) => {
  deleteDiscussionSchema.parse(req.body);
  res.json({});
}

/**
 * Updates a Discussion
 * @param req Request
 * @param res Response
 */
export const updateDiscussion = async (req: AuthRequest<updateDiscussionSchemaType>, res: Response) => {
  updateDiscussionSchema.parse(req.body);
  res.json({});
}

/**
 * Gets a Discussion by Id
 * @param req Request
 * @param res Response
 */
export const getDiscussion = async (req: AuthRequest<getDiscussionSchemaType>, res: Response) => {
  getDiscussionSchema.parse(req.body);
  res.json({});
}

/**
 * Gets Discussions by Filter
 * @param req Request
 * @param res Response
 */
export const getDiscussionsByFilter = async (req: AuthRequest<getDiscussionsByFilterSchemaType>, res: Response) => {
  getDiscussionsByFilterSchema.parse(req.body);
  res.json({});
}

