import { Router } from 'express'
import { getColeccion, updateColeccion } from '../controllers/coleccion.controller'
import { verifyToken } from '../middleware/auth.middleware'

const router = Router()
router.get('/', getColeccion)
router.put('/', verifyToken, updateColeccion)

export default router
