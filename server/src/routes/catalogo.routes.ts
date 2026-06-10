import { Router } from 'express'
import { getCatalogo, updateCatalogo } from '../controllers/catalogo.controller'
import { verifyToken } from '../middleware/auth.middleware'

const router = Router()
router.get('/', getCatalogo)
router.put('/', verifyToken, updateCatalogo)

export default router
