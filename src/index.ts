import express,{Request,Response} from 'express'
import {json} from 'body-parser'
import authRoutes from './routes/authRoutes'
import conversationRoutes from './routes/conversationRoutes'
import messageRoutes from './routes/messagesRoutes'
import http from 'http'
import {Server} from 'socket.io'
import { saveMessage } from './controllers/messagesController'
const app = express()

const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: "*",
    }
})
app.use(json())

app.use('/api/auth',authRoutes)
app.use('/api/conversations',conversationRoutes)
app.use('/api/messages',messageRoutes)

io.on("connection", (socket) => {
    socket.on('joinConversation',(conversationId) => {
        socket.join(conversationId)
        console.log('User joined conversation: ',conversationId);
    })

    socket.on('sendMessage', async (message) => {
        const {conversationId,senderId,content} = message;

        try{
            const savedMessage = await saveMessage(conversationId,content,senderId)
            console.log("send message: ",savedMessage);
            io.to(conversationId).emit('newMessage', savedMessage)
            io.emit('conversationUpdated', { conversationId, lastMessage: savedMessage.content, lastMessageTime: savedMessage.created_at })
        }catch(e){
                console.error("Lỗi khi lưu tin nhắn: ", e)

        }
    })

    socket.on('disconnect',() => {
        console.log('User disconnected: ',socket.id);
    })
})



const PORT = process.env.PORT || 5000

server.listen(PORT,() => {
    console.log(`Máy chủ đang chạy tại PORT: ${PORT}`);
})