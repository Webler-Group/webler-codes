import { Router } from "express";
import { banUser, closeReport, getReport, reportUser, setParent } from "../controllers/reportController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";
import { errorHandler } from "../middleware/errorMiddleware";


const reportRouter = Router();

reportRouter.post("/reportUser",[authMiddleware.bind(null,Role.USER)], errorHandler(reportUser));
reportRouter.post("/getReport",[authMiddleware.bind(null,Role.MODERATOR)], errorHandler(getReport));
reportRouter.post("/banUser",[authMiddleware.bind(null,Role.MODERATOR)], errorHandler(banUser));
reportRouter.post("/setParent",[authMiddleware.bind(null,Role.MODERATOR)], errorHandler(setParent));
reportRouter.post("/closeReport",[authMiddleware.bind(null,Role.MODERATOR)], errorHandler(closeReport));

export {reportRouter};