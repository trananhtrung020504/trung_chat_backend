import {Router} from 'express'

import { verifyToken } from '../middleware/authMiddleWare'
import { addContact, fetchContacts } from '../controllers/contactsController';

const router = Router();

router.get('/',verifyToken,fetchContacts)
router.post('/',verifyToken,addContact)

export default router;