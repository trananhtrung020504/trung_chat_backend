/// <reference path="../types/express/index.d.ts" />
import { Router, Request, Response } from "express";
import pool from "../models/db";
import { verifyToken } from "../middleware/authMiddleWare";

const router = Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  let userId = null;
  if (req.user) {
    userId = req.user.id;
  }
  try {
    const result = await pool.query(
      "SELECT c.id AS conversation_id, u.username as participant_name, m.content as last_message, m.created_at as last_message_time from conversations c join users u on (u.id = c.participant_two and u.id != $1) Left join lateral (select content,created_at from messages where conversation_id = c.id order by created_at desc limit 1) m on true where c.participant_one = $1 OR c.participant_two = $1 order by m.created_at desc",
      [userId],
    );

    res.json(result.rows)
  } catch (e: any) {
    res.status(500).json({error: "Lấy danh sách cuộc trò chuyện thất bại"})
  }
});

export default router;
