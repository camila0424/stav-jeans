import { Router } from 'express'
import { login, createAdmin } from '../controllers/auth.controller'
import { verifyToken } from '../middleware/auth.middleware'

const router = Router()

router.post('/login', login)
router.post('/create', verifyToken, createAdmin)

export default router
