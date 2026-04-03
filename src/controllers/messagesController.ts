import { Request, Response } from 'express';
import pool from '../models/db';

export const fetchAllMessagesByConversationId = async (req: Request, res: Response) => {
  const {conversationId} = req.params;
  
  try{
    const result = await pool.query(
        `
        select n.id, n.content, n.sender_id, n.conversation_id, n.created_at
        from messages n
        where n.conversation_id = $1
        order by n.created_at asc
        `,
        [conversationId]
    )

    res.json(result.rows)
  }catch(e: any){
    res.status(500).json({error: "Lấy danh sách tin nhắn thất bại"})
  }
}

export const saveMessage = async (conversationId: string, content: string, senderId: string) => {
  try {
    const result = await pool.query(
      `
      insert into messages (conversation_id, content, sender_id)
      values ($1, $2, $3)
      returning *
      `,
      [conversationId, content, senderId]
    );
    return result.rows[0];
  } catch (e: any) {
    throw new Error("Lưu tin nhắn thất bại");
  }
};