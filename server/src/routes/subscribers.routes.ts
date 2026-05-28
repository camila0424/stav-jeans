import { Router } from 'express'
import { subscribe, getAllSubscribers, unsubscribe } from '../controllers/subscribers.controller'
import { verifyToken } from '../middleware/auth.middleware'

const router = Router()

router.post('/', subscribe)
router.get('/', verifyToken, getAllSubscribers)
router.patch('/:email/unsubscribe', unsubscribe)

export default router
