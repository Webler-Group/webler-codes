import { Response } from "express";
import { prisma } from "../services/database";
import { createDiscussionSchema , deleteDiscussionSchema , updateDiscussionSchema , getDiscussionSchema , getDiscussionsByFilterSchema } from "../schemas/discussionSchemas";
import { createDiscussionSchemaType, deleteDiscussionSchemaType, updateDiscussionSchemaType, getDiscussionSchemaType, getDiscussionsByFilterSchemaType } from "../schemas/discussionSchemas";
import { createAnswerSchema, deleteAnswerSchema, updateAnswerSchema, getSortedAnswersSchema } from "../schemas/discussionSchemas";
import { createAnswerSchemaType, deleteAnswerSchemaType, updateAnswerSchemaType, getSortedAnswersSchemaType } from "../schemas/discussionSchemas";
import { AuthRequest } from "../middleware/authMiddleware";
import { defaultDiscussionSelect, findDiscussionOrThrow, defaultAnswerSelect, findAnswerOrThrow } from "../helpers/discussionHelper";
import { bigintToNumber } from "../utils/utils";
import ForbiddenException from "../exceptions/ForbiddenException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { Role, PostType } from "@prisma/client";

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
        connectOrCreate:
          tags.map((x:string)=>({where:{name:x},create:{name:x,authorId:currentUser.id}}))
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

  if(!currentUser.roles.includes(Role.ADMIN) && discussion.user.id != currentUser.id) {
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
  const { discussionId, title, text, tags } = req.body;
  const currentUser = req.user!;

  let discussion = await findDiscussionOrThrow({ id: discussionId }, { id: true, userId: true });

  if(discussion.user.id != currentUser.id) {
    throw new ForbiddenException("Forbidden", ErrorCode.FORBIDDEN);
  }

  discussion = await prisma.discussion.update({
    where:{ id: discussionId },
    data: {
      tags: tags ? { set: tags.map((x: string) => ({ name: x })) } : undefined,
      title,
      text
    },
    select: defaultDiscussionSelect
  });

  res.json({
    success: true,
    data: bigintToNumber(discussion)
  });
}

/**
 * Gets a Discussion by Id
 * @param req Request
 * @param res Response
 */
export const getDiscussion = async (req: AuthRequest<getDiscussionSchemaType>, res: Response) => {
  getDiscussionSchema.parse(req.body);
  const { discussionId } = req.body ;
  const discussion = await findDiscussionOrThrow({ id: discussionId });
  res.json(bigintToNumber(discussion));
}

/**
 * Gets Discussions by Filter
 * @param req Request
 * @param res Response
 */
export const getDiscussionsByFilter = async (req: AuthRequest<getDiscussionsByFilterSchemaType>, res: Response) => {
  getDiscussionsByFilterSchema.parse(req.body);
  const { order, filter, offset, count } = req.body;
  const currentUser = req.user!;
  const userId = filter.userId ?? currentUser.id;

  const discussions = await prisma.discussion.findMany({
    orderBy: order,
    where: {
      userId,
      tags: filter.tags ? { some: { name: { in: filter.tags } } } : undefined,
      title: filter.title,
    },
    select: defaultDiscussionSelect,
    skip: offset,
    take: count
  });

  res.json(discussions.map(x => bigintToNumber(x)));
}

export const createAnswer = async (req: AuthRequest<createAnswerSchemaType>, res: Response) => {
  createAnswerSchema.parse(req.body);
  const { text, discussionId } = req.body;
  const discussion = await findDiscussionOrThrow({ id: discussionId });
  const answer = await prisma.post.create({
    data: {
      text,
      postType: PostType.ANSWER,
      userId: req.user!.id,
      discussionId,
      isAccepted: false
    },
    select: defaultAnswerSelect
  });
  res.json({success:true, data:bigintToNumber(answer)});
}

export const deleteAnswer = async (req: AuthRequest<deleteAnswerSchemaType>, res: Response) => {
  deleteAnswerSchema.parse(req.body);
  const { answerId } = req.body;
  const answer = await findAnswerOrThrow( {id: answerId, postType: PostType.ANSWER} );
  const currentUser = req.user!;
  if(!currentUser.roles.includes(Role.ADMIN) && answer.user.id != currentUser.id) {
    throw new ForbiddenException("Forbidden", ErrorCode.FORBIDDEN);
  }
  await prisma.post.delete({where: {id: answer.id}});
  res.json({success: true});
}

export const updateAnswer = async (req: AuthRequest<updateAnswerSchemaType>, res: Response) => {
  updateAnswerSchema.parse(req.body);
  const { answerId, text } = req.body;
  let answer = await findAnswerOrThrow( {id: answerId, postType: PostType.ANSWER} );
  const currentUser = req.user!;
  if(!currentUser.roles.includes(Role.ADMIN) && answer.user.id != currentUser.id) {
    throw new ForbiddenException("Forbidden", ErrorCode.FORBIDDEN);
  }
  answer = await prisma.post.update({
    where: {id: answer.id},
    data: {text},
    select: defaultAnswerSelect
  });
  res.json({success:true, data: bigintToNumber(answer)});
}

export const getSortedAnswers = async (req: AuthRequest<getSortedAnswersSchemaType>, res: Response) => {
  getSortedAnswersSchema.parse(req.body);
  const { discussionId, order, offset, count } = req.body;
  const discussion = await findDiscussionOrThrow({id: discussionId});
  const answers = await prisma.post.findMany({
    where: {discussionId},
    orderBy: order,
    skip: offset,
    take: count,
    select:defaultAnswerSelect
  });
  res.json(answers.map(x=>bigintToNumber(x)));
}
