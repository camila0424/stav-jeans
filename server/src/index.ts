import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productsRoutes from './routes/products.routes'
import authRoutes from './routes/auth.routes'
import ordersRoutes from './routes/orders.routes'
import subscribersRoutes from './routes/subscribers.routes'
import paymentsRoutes from './routes/payments.routes'
import promotionsRoutes from './routes/promotions.routes'
import adminRoutes from './routes/admin.routes'
import { errorHandler } from './middleware/error.middleware'
import { initDB } from './db/init'

dotenv.config()

const app = express()
const PORT = process.env.PORT

const allowedOrigins = [
  process.env.CLIENT_URL || '',
  'http://localhost:5173',
  'http://localhost:4173'
].filter(origin => origin !== '')

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json({ limit: '10mb' }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', project: 'stavjeans' })
})

app.use('/api/products', productsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/subscribers', subscribersRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/promotions', promotionsRoutes)
app.use('/api/admin', adminRoutes)
app.use(errorHandler)

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
  })
})

export default app
