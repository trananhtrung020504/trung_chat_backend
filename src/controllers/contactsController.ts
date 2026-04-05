import {Request, Response} from 'express'
import pool from '../models/db'

export const fetchContacts = async (req: Request, res: Response) => {
    let userId = null;

    if(req.user){
        userId = req.user.id
    }

    try{
        const result = await pool.query(
            `
            select u.id as contact_id , u.username , u.email
            from contacts c 
            join users u on u.id = c.contact_id
            where c.user_id = $1
            order by u.username asc;  
            `
        ,[userId]
        )
        return res.json(result.rows)
    } catch(e){
        console.error("Lỗi khi lấy danh bạ: ", e)
        return res.status(500).json({message: "Lỗi khi lấy danh bạ"})
    }
}

export const addContact = async(req: Request, res: Response) => {
    let userId = null;
    if(req.user){
        userId = req.user.id
    }

    const {contactEmail} = req.body

    console.log('ContactEmail: ',contactEmail);

    try{
        const contactExists = await pool.query(
        `
            select id from users where email = $1
        `,
        [contactEmail]
        )

        if(contactExists.rowCount === 0){
            return res.status(404).json({message: "Người dùng không tồn tại"})
        }

        const contactId = contactExists.rows[0].id;
        
         await pool.query(
            `insert into contacts (user_id, contact_id) values ($1, $2)`
        ,[userId, contactId])

        return res.status(201).json({message: "Đã thêm liên hệ"})
   
}  catch (e){
        console.error("Lỗi khi thêm liên hệ: ", e)
        return res.status(500).json({message: "Lỗi khi thêm liên hệ"})
    }
}