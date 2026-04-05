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

export const checkOrCreateConversation = async (req: Request, res: Response) => {

  let userId = null;
  if (req.user) {
    userId = req.user.id;
  }

  const {contactId} = req.body;
  try{
    const existingConversation = await pool.query(
      `
      select id from conversations 
      where (participant_one = $1 and participant_two = $2) 
         or (participant_one = $2 and participant_two = $1)
      `,
      [userId, contactId]
    )

    if(existingConversation.rowCount != null && existingConversation.rowCount > 0){
      return res.json({conversationId: existingConversation.rows[0].id})
    }

    const newConversation = await pool.query(
      `insert into conversations (participant_one, participant_two) values ($1, $2) returning id`,
      [userId, contactId]
    )
    return res.json({conversationId: newConversation.rows[0].id})

  }catch(e){
    console.error("Lỗi khi kiểm tra hoặc tạo cuộc trò chuyện: ", e)
    return res.status(500).json({message: "Lỗi khi kiểm tra hoặc tạo cuộc trò chuyện"})
  }
}