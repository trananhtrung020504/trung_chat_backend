import express,{Request,Response} from 'express'
import {json} from 'body-parser'
import authRoutes from './routes/authRoutes'
import conversationRoutes from './routes/conversationRoutes'
import messageRoutes from './routes/messagesRoutes'
const app = express()
app.use(json())

app.use('/api/auth',authRoutes)
app.use('/api/conversations',conversationRoutes)
app.use('/api/messages',messageRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT,() => {
    console.log(`Máy chủ đang chạy tại PORT: ${PORT}`);
})