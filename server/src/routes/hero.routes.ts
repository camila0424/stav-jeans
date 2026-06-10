import { Router } from 'express'
import { getHero, updateHero } from '../controllers/hero.controller'
import { verifyToken } from '../middleware/auth.middleware'

const router = Router()
router.get('/', getHero)
router.put('/', verifyToken, updateHero)

export default router
