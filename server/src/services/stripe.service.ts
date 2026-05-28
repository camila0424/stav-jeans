import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function createPaymentIntent(amount: number, currency: string = 'eur') {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    payment_method_types: ['card', 'bizum'],
  })
  return paymentIntent
}

export async function confirmPayment(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  return paymentIntent
}

export async function constructWebhookEvent(payload: Buffer, signature: string) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET as string
  )
}
