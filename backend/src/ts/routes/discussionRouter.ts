import { Router } from "express";
import { createDiscussion , deleteDiscussion , updateDiscussion , getDiscussion , getDiscussionsByFilter } from "../controllers/discussionController";
import { createAnswer , deleteAnswer , updateAnswer , getSortedAnswers } from "../controllers/discussionController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";
import { errorHandler } from "../middleware/errorMiddleware";

const discussionRouter = Router();

discussionRouter.post('/createDiscussion', [authMiddleware.bind(null, Role.USER)], errorHandler(createDiscussion));
discussionRouter.post('/deleteDiscussion', [authMiddleware.bind(null, Role.USER)], errorHandler(deleteDiscussion));
discussionRouter.post('/updateDiscussion', [authMiddleware.bind(null, Role.USER)], errorHandler(updateDiscussion));
discussionRouter.post('/getDiscussion', [authMiddleware.bind(null, Role.USER)], errorHandler(getDiscussion));
discussionRouter.post('/getDiscussionsByFilter', [authMiddleware.bind(null, Role.USER)], errorHandler(getDiscussionsByFilter));

discussionRouter.post('/createAnswer', [authMiddleware.bind(null, Role.USER)], errorHandler(createAnswer));
discussionRouter.post('/deleteAnswer', [authMiddleware.bind(null, Role.USER)], errorHandler(deleteAnswer));
discussionRouter.post('/updateAnswer', [authMiddleware.bind(null, Role.USER)], errorHandler(updateAnswer));
discussionRouter.post('/getSortedAnswers', [authMiddleware.bind(null, Role.USER)], errorHandler(getSortedAnswers));

export default discussionRouter;
