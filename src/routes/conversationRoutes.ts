/// <reference path="../types/express/index.d.ts" />
import { Router, Request, Response } from "express";
import pool from "../models/db";
import { verifyToken } from "../middleware/authMiddleWare";
import { fetchAllConversationsByUserId } from "../controllers/conversationsController";

const router = Router();

router.get("/", verifyToken, fetchAllConversationsByUserId);

export default router;
