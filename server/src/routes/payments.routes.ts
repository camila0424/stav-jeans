import { Router } from 'express'
import express from 'express'
import { initiatePayment, handleWebhook } from '../controllers/payments.controller'
import { verifyToken } from '../middleware/auth.middleware'

const router = Router()

router.post('/create-intent', verifyToken, initiatePayment)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook)

export default router
