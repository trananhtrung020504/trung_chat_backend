import {Request,Response} from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../models/db'
const SALT_ROUNDS = 10
const JWT_SECRET = process.env.JWT_SECRET || "anhtrung02052004"

export const register = async (req: Request , res: Response) => {
    const {username,email,password} = req.body
    try{
        const hashedPassword = await bcrypt.hash(password,SALT_ROUNDS);
        const result = await pool.query(
            "INSERT INTO users (username,email,password) VALUES ($1, $2, $3) RETURNING *",
            [username,email,hashedPassword]
        )

        const user = result.rows[0]

        res.status(201).json({message: "Đăng ký thành công", user})
    } catch (e: any){
        res.status(500).json({message: "Đăng ký thất bại", error: e.message})
    }
}

export const login = async (req: Request, res: Response) => {
    const {email,password} = req.body

    try{
        // Nếu cần truyền 2 tham số:  ( SELECT * FROM users WHERE email = $1 AND username = $2 ) 
        const result = await pool.query('select * from users where email=$1' ,[email])

        // console.log('email: ',email);
        // console.log('result: ',result);

        const user = result.rows[0]

        if(!user){
            return res.status(404).json({message: "Không tìm thấy người dùng"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({message: "Mật khẩu không đúng"})
        }

        const token = jwt.sign({id: user.id} , JWT_SECRET, {expiresIn: '10h'})

        let finalResult = {...user, token}

        res.json({user: finalResult})
    }catch(e: any){
        res.status(500).json({message: "Đăng nhập thất bại", error: e.message})
    }
    
}