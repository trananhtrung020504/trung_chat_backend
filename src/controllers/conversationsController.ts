import {Request, Response} from 'express'
import pool from '../models/db';

export const fetchAllConversationsByUserId = async (req: Request, res: Response) => {
let userId = null;
  if (req.user) {
    userId = req.user.id;
  }
  try {
    const result = await pool.query(
      `
      select c.id as conversation_id,
      case
        when u1.id = $1 then u2.username
        else u1.username
      end as participant_name,
      m.content as last_message,
      m.created_at as last_message_time
      from conversations c
      join users u1 on u1.id = c.participant_one
      join users u2 on u2.id = c.participant_two
      left join lateral (
        select content, created_at
        from messages
        where conversation_id = c.id
        order by created_at desc
        limit 1
      ) m on true
       where c.participant_one = $1 or c.participant_two = $1
        order by m.created_at desc;
      `, // để ý dấu ","
      [userId],
    );

    res.json(result.rows)
  } catch (e: any) {
    res.status(500).json({error: "Lấy danh sách cuộc trò chuyện thất bại"})
  }
}