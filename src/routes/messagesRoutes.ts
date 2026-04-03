import {Router} from 'express';
import { verifyToken } from '../middleware/authMiddleWare';
import { fetchAllMessagesByConversationId } from '../controllers/messagesController';

const router = Router()

router.get('/:conversationId',verifyToken,fetchAllMessagesByConversationId)

export default router;