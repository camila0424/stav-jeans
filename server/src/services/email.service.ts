import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendOrderConfirmation(
  customerEmail: string,
  customerName: string,
  orderId: string,
  items: any[],
  total: number
) {
  await getResend().emails.send({
    from: 'Stav Jeans <pedidos@stavjeans.com>',
    to: customerEmail,
    subject: `Confirmación de pedido #${orderId.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0D1F3C;">¡Gracias por tu pedido, ${customerName}!</h1>
        <p style="color: #3D5A7A;">Tu pedido ha sido confirmado. Aquí tienes el resumen:</p>
        <div style="border: 1px solid #E8EEF4; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="font-size: 12px; color: #3D5A7A;">Número de pedido</p>
          <p style="font-weight: bold; color: #0D1F3C;">#${orderId.slice(0, 8).toUpperCase()}</p>
          ${items.map(item => `
            <div style="padding: 8px 0; border-bottom: 1px solid #E8EEF4;">
              <span style="color: #0D1F3C;">${item.product_name} x${item.quantity}</span>
              <span style="color: #0D1F3C; font-weight: bold; float: right;">€${(item.unit_price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
          <div style="padding: 12px 0; margin-top: 8px;">
            <span style="font-weight: bold; color: #0D1F3C;">Total</span>
            <span style="font-weight: bold; color: #0D1F3C; font-size: 18px; float: right;">€${total.toFixed(2)}</span>
          </div>
        </div>
        <p style="color: #3D5A7A;">Nos pondremos en contacto contigo pronto para coordinar el envío.</p>
        <p style="color: #3D5A7A;">¿Tienes dudas? Escríbenos por
          <a href="https://wa.me/34663577485" style="color: #0b70a8;">WhatsApp</a>
        </p>
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #E8EEF4;">
          <p style="color: #9AAAB8; font-size: 12px;">Stav Jeans · Galerías Ítaca · Vitoria-Gasteiz</p>
        </div>
      </div>
    `
  })
}

export async function sendNewOrderNotification(
  orderId: string,
  customerName: string,
  total: number,
  items: any[]
) {
  await getResend().emails.send({
    from: 'Stav Jeans <notificaciones@stavjeans.com>',
    to: 'stavjeans@gmail.com',
    subject: `Nueva venta #${orderId.slice(0, 8).toUpperCase()} · €${total.toFixed(2)}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0D1F3C;">Nueva venta recibida</h1>
        <p style="color: #3D5A7A;">Cliente: <strong>${customerName}</strong></p>
        ${items.map(item => `
          <p style="color: #0D1F3C;">${item.product_name} x${item.quantity} · €${(item.unit_price * item.quantity).toFixed(2)}</p>
        `).join('')}
        <p style="font-size: 20px; font-weight: bold; color: #0D1F3C;">Total: €${total.toFixed(2)}</p>
        <a href="${process.env.CLIENT_URL}/admin/orders/${orderId}"
           style="background: #F5C518; color: #0D1F3C; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">
          Ver pedido
        </a>
      </div>
    `
  })
}

export async function sendPromotion(
  subscriberEmail: string,
  subscriberName: string,
  promotionTitle: string,
  promotionDescription: string,
  imageUrl: string
) {
  await getResend().emails.send({
    from: 'Stav Jeans <promociones@stavjeans.com>',
    to: subscriberEmail,
    subject: `${promotionTitle} · Stav Jeans`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        ${imageUrl ? `<img src="${imageUrl}" style="width: 100%; border-radius: 8px;" />` : ''}
        <h1 style="color: #0D1F3C; margin-top: 24px;">${promotionTitle}</h1>
        <p style="color: #3D5A7A;">${promotionDescription}</p>
        <a href="${process.env.CLIENT_URL}"
           style="display: inline-block; background: #F5C518; color: #0D1F3C; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 16px;">
          Ver colección
        </a>
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #E8EEF4;">
          <p style="color: #9AAAB8; font-size: 12px;">
            Stav Jeans · Vitoria-Gasteiz ·
            <a href="${process.env.CLIENT_URL}/unsubscribe?email=${subscriberEmail}" style="color: #9AAAB8;">Cancelar suscripción</a>
          </p>
        </div>
      </div>
    `
  })
}
