import { Router } from "express";
import { createDiscussion , deleteDiscussion , updateDiscussion , getDiscussionById , getDiscussionsByFilter } from "../controllers/discussionController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";
import { errorHandler } from "../middleware/errorMiddleware";

const discussionRouter = Router();

discussionRouter.post('/createDiscussion', [authMiddleware.bind(null, Role.USER)], errorHandler(createDiscussion));
discussionRouter.post('/deleteDiscussion', [authMiddleware.bind(null, Role.USER)], errorHandler(deleteDiscussion));
discussionRouter.post('/updateDiscussion', [authMiddleware.bind(null, Role.USER)], errorHandler(updateDiscussion));
discussionRouter.post('/getDiscussionById', [authMiddleware.bind(null, Role.USER)], errorHandler(getDiscussionById));
discussionRouter.post('/getDiscussionsByFilter', [authMiddleware.bind(null, Role.USER)], errorHandler(getDiscussionsByFilter));

export default discussionRouter;
