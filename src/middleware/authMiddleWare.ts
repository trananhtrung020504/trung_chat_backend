import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken';
export const verifyToken = (req: Request, res: Response, next: NextFunction) => { 
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        res.status(403).json({error: "Không có token, truy cập bị từ chối"})
        return;
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_TOKEN || "anhtrung02052004")

        req.user = decoded as {id: string};
        next()

    } catch(e){
        res.status(401).json({error:"Token không hợp lệ"})
    }

}