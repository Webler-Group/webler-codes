import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { prisma } from "../services/database";
import NotFoundException from "../exceptions/NotFoundException";
import { Prisma } from "@prisma/client";
import { defaultUserSelect } from "./userHelper";

export const defaultDiscussionSelect: Prisma.DiscussionSelect = {
  id: true,
  title: true,
  text: true,
  tags: { select: { name: true } },
  createdAt: true,
  updatedAt: true,
  user: {
    select: defaultUserSelect
  }
};

export const defaultAnswerSelect: Prisma.PostSelect = {
  id: true,
  text: true,
  createdAt: true,
  updatedAt: true,
  isAccepted: true,
  user: {
    select: defaultUserSelect
  }
};

export const findDiscussionOrThrow = async (
  where: Prisma.DiscussionWhereInput,
  select: Prisma.DiscussionSelect = {}
) => {
  const discussion = await prisma.discussion.findFirst({ 
    where,
    select: {
      ...select,
      ...defaultDiscussionSelect
    }
  });
  if (!discussion) {
    throw new NotFoundException('Discussion not found', ErrorCode.CODE_NOT_FOUND);
  }
  return discussion;
}

export const findAnswerOrThrow = async (
  where: Prisma.PostWhereInput,
  select: Prisma.PostSelect = {}
) => {
  const answer = await prisma.post.findFirst({ 
    where,
    select: {
      ...select,
      ...defaultAnswerSelect
    }
  });
  if (!answer) {
    throw new NotFoundException('Answer not found', ErrorCode.CODE_NOT_FOUND);
  }
  return answer;
}
