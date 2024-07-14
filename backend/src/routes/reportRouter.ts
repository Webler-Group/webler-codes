import { Router } from "express";
import { banUser, closeReport, getReport, reportUser, setParent } from "../controllers/reportController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";


const reportRouter = Router();

reportRouter.post("/reportUser",[authMiddleware.bind(null,Role.USER)], reportUser);
reportRouter.post("/getReport",[authMiddleware.bind(null,Role.MODERATOR)], getReport);
reportRouter.post("/banUser",[authMiddleware.bind(null,Role.MODERATOR)], banUser);
reportRouter.post("/setParent",[authMiddleware.bind(null,Role.MODERATOR)], setParent);
reportRouter.post("/closeReport",[authMiddleware.bind(null,Role.MODERATOR)], closeReport);

export {reportRouter};