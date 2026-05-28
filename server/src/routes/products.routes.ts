import { Router } from 'express'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  addProductVariant
} from '../controllers/products.controller'
import { verifyToken } from '../middleware/auth.middleware'

const router = Router()

router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/', verifyToken, createProduct)
router.put('/:id', verifyToken, updateProduct)
router.delete('/:id', verifyToken, deleteProduct)
router.post('/images', verifyToken, addProductImage)
router.post('/variants', verifyToken, addProductVariant)

export default router
