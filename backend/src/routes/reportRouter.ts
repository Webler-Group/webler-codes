import { Router } from "express";
import { getReport, reportUser } from "../controllers/reportController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Role } from "@prisma/client";


const reportRouter = Router();

reportRouter.post("/reportUser",[authMiddleware.bind(null,Role.USER)], reportUser);
reportRouter.post("/getReport",[authMiddleware.bind(null,Role.MODERATOR)], getReport);

export {reportRouter};