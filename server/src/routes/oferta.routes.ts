import { Router } from 'express'
import { getOferta, updateOferta } from '../controllers/oferta.controller'
import { verifyToken } from '../middleware/auth.middleware'

const router = Router()
router.get('/', getOferta)
router.put('/', verifyToken, updateOferta)

export default router
