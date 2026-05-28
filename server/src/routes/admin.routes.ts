import { Router } from 'express'
import { uploadProductImage, removeImage } from '../controllers/admin.controller'
import { verifyToken } from '../middleware/auth.middleware'

const router = Router()

router.post('/upload', verifyToken, uploadProductImage)
router.delete('/image', verifyToken, removeImage)

export default router
