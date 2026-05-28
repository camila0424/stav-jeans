import { Request, Response } from 'express'
import { createPaymentIntent, constructWebhookEvent } from '../services/stripe.service'
import { sendOrderConfirmation, sendNewOrderNotification } from '../services/email.service'
import pool from '../db/connection'

export async function initiatePayment(req: Request, res: Response) {
  try {
    const { total } = req.body
    const paymentIntent = await createPaymentIntent(total)
    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar el pago' })
  }
}

export async function handleWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'] as string

  try {
    const event = await constructWebhookEvent(req.body, signature)

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as any

      const orderResult = await pool.query(
        'UPDATE orders SET payment_status=$1, status=$2, updated_at=NOW() WHERE stripe_payment_id=$3 RETURNING *',
        ['paid', 'confirmed', paymentIntent.id]
      )

      if (orderResult.rows.length > 0) {
        const order = orderResult.rows[0]
        const customerResult = await pool.query(
          'SELECT * FROM customers WHERE id=$1', [order.customer_id]
        )
        const itemsResult = await pool.query(
          `SELECT oi.*, p.name as product_name
           FROM order_items oi
           JOIN products p ON p.id = oi.product_id
           WHERE oi.order_id=$1`, [order.id]
        )

        const customer = customerResult.rows[0]
        const items = itemsResult.rows

        await sendOrderConfirmation(customer.email, customer.name, order.id, items, order.total)
        await sendNewOrderNotification(order.id, customer.name, order.total, items)
      }
    }

    res.json({ received: true })
  } catch (error) {
    res.status(400).json({ error: 'Webhook error' })
  }
}
