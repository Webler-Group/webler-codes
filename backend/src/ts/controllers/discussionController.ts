import { Response } from "express";
import { prisma } from "../services/database";
import { createDiscussionSchema , deleteDiscussionSchema , updateDiscussionSchema , getDiscussionSchema , getDiscussionsByFilterSchema } from "../schemas/discussionSchemas";
import { createDiscussionSchemaType, deleteDiscussionSchemaType, updateDiscussionSchemaType, getDiscussionSchemaType, getDiscussionsByFilterSchemaType } from "../schemas/discussionSchemas";
import { AuthRequest } from "../middleware/authMiddleware";
import { defaultDiscussionSelect, findDiscussionOrThrow } from "../helpers/discussionHelper";
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
  const { title, text, tags } = req.body;
  const currentUser = req.user!;

  const discussion = await prisma.discussion.create({
    data: {
      text,
      title,
      userId: currentUser.id,
        tags: {
          connect: tags!.map((x: string) => ({ name: x }))
        }
      },
      select: defaultDiscussionSelect
    });

    res.json({
        success: true,
        data: bigintToNumber(discussion)
    });
}

/**
 * Deletes a Discussion
 * @param req Request
 * @param res Response
 */
export const deleteDiscussion = async (req: AuthRequest<deleteDiscussionSchemaType>, res: Response) => {
  deleteDiscussionSchema.parse(req.body);
  const { discussionId } = req.body;
  const currentUser = req.user!;

  let discussion = await findDiscussionOrThrow({ id: discussionId }, { id: true, userId: true });

  if(!currentUser.roles.includes(Role.ADMIN) && discussion.userId != currentUser.id) {
    throw new ForbiddenException("Forbidden", ErrorCode.FORBIDDEN);
  }

  await prisma.discussion.delete({where:{id:discussionId}});

  res.json({ success: true });
}

/**
 * Updates a Discussion
 * @param req Request
 * @param res Response
 */
export const updateDiscussion = async (req: AuthRequest<updateDiscussionSchemaType>, res: Response) => {
  updateDiscussionSchema.parse(req.body);
  const { title, text, tags } = req.body;
  res.json({});
}

/**
 * Gets a Discussion by Id
 * @param req Request
 * @param res Response
 */
export const getDiscussion = async (req: AuthRequest<getDiscussionSchemaType>, res: Response) => {
  getDiscussionSchema.parse(req.body);
  const { discussionId } = req.body ;
  res.json({});
}

/**
 * Gets Discussions by Filter
 * @param req Request
 * @param res Response
 */
export const getDiscussionsByFilter = async (req: AuthRequest<getDiscussionsByFilterSchemaType>, res: Response) => {
  getDiscussionsByFilterSchema.parse(req.body);
  const { order, filter, offset, count } = req.body;
  res.json({});
}

