import { Router } from 'express'
import {
  getAllPromotions,
  getActivePromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  sendPromotionToAll,
  validatePromoCode
} from '../controllers/promotions.controller'
import { verifyToken } from '../middleware/auth.middleware'

const router = Router()

router.get('/active', getActivePromotions)
router.post('/validate', validatePromoCode)
router.get('/', verifyToken, getAllPromotions)
router.post('/', verifyToken, createPromotion)
router.put('/:id', verifyToken, updatePromotion)
router.delete('/:id', verifyToken, deletePromotion)
router.post('/:id/send', verifyToken, sendPromotionToAll)

export default router
