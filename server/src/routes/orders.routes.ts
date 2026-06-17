import { Router } from 'express'
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  trackOrder
} from '../controllers/orders.controller'
import { verifyToken } from '../middleware/auth.middleware'

const router = Router()

router.get('/track', trackOrder)
router.get('/', verifyToken, getAllOrders)
router.get('/:id', verifyToken, getOrderById)
router.post('/', createOrder)
router.patch('/:id/status', verifyToken, updateOrderStatus)

export default router
