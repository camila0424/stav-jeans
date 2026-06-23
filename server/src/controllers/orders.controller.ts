import { Request, Response } from 'express'
import pool from '../db/connection'

export async function trackOrder(req: Request, res: Response) {
  try {
    const { code, email } = req.query as { code?: string; email?: string }

    if (!code || !email) {
      return res.status(400).json({ error: 'Parámetros requeridos: code, email' })
    }

    const result = await pool.query(`
      SELECT
        o.id,
        o.status,
        o.created_at,
        o.subtotal,
        o.shipping,
        o.total,
        json_agg(
          json_build_object(
            'product_name', p.name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'size', pv.size,
            'color', pv.color
          )
        ) as items
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      LEFT JOIN product_variants pv ON pv.id = oi.variant_id
      WHERE LOWER(LEFT(o.id::text, 8)) = LOWER($1)
        AND LOWER(c.email) = LOWER($2)
      GROUP BY o.id
    `, [code.trim(), email.trim()])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    const o = result.rows[0]
    res.json({
      id: o.id,
      short_code: (o.id as string).slice(0, 8).toUpperCase(),
      status: o.status,
      created_at: o.created_at,
      items: o.items,
      subtotal: o.subtotal,
      shipping: o.shipping,
      total: o.total,
    })
  } catch {
    res.status(500).json({ error: 'Error al buscar el pedido' })
  }
}

export async function getAllOrders(_req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT o.*,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'variant_id', oi.variant_id,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'product_name', p.name,
            'size', pv.size,
            'color', pv.color
          )
        ) as items
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      LEFT JOIN product_variants pv ON pv.id = oi.variant_id
      GROUP BY o.id, c.name, c.email, c.phone
      ORDER BY o.created_at DESC
    `)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener órdenes' })
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT o.*,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        c.address as customer_address,
        c.city as customer_city,
        c.postal_code as customer_postal_code,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'variant_id', oi.variant_id,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'product_name', p.name
          )
        ) as items
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      WHERE o.id = $1
      GROUP BY o.id, c.name, c.email, c.phone, c.address, c.city, c.postal_code
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener orden' })
  }
}

export async function createOrder(req: Request, res: Response) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const { customer, items, payment_method, notes } = req.body

    let customerResult = await client.query(
      'SELECT id FROM customers WHERE email = $1', [customer.email]
    )

    if (customerResult.rows.length === 0) {
      customerResult = await client.query(`
        INSERT INTO customers (name, email, phone, address, city, postal_code)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
      `, [customer.name, customer.email, customer.phone, customer.address, customer.city, customer.postal_code])
    }

    const customerId = customerResult.rows[0].id

    const subtotal = items.reduce((sum: number, item: any) => sum + (item.unit_price * item.quantity), 0)
    const shipping = subtotal >= 80 ? 0 : 4.99
    const total = subtotal + shipping

    const orderResult = await client.query(`
      INSERT INTO orders (customer_id, payment_method, subtotal, shipping, total, notes)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [customerId, payment_method, subtotal, shipping, total, notes])

    const orderId = orderResult.rows[0].id

    for (const item of items) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, variant_id, quantity, unit_price)
        VALUES ($1, $2, $3, $4, $5)
      `, [orderId, item.product_id, item.variant_id, item.quantity, item.unit_price])

      await client.query(`
        UPDATE product_variants SET stock = stock - $1 WHERE id = $2
      `, [item.quantity, item.variant_id])
    }

    await client.query('COMMIT')
    res.status(201).json(orderResult.rows[0])
  } catch (error) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: 'Error al crear orden' })
  } finally {
    client.release()
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const { id } = req.params
    const { status } = req.body

    const currentResult = await client.query(
      'SELECT status FROM orders WHERE id = $1 FOR UPDATE', [id]
    )

    if (currentResult.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Orden no encontrada' })
    }

    const currentStatus: string = currentResult.rows[0].status

    if (currentStatus !== status) {
      if (status === 'cancelled' && currentStatus !== 'cancelled') {
        // Restore stock when cancelling
        await client.query(`
          UPDATE product_variants pv
          SET stock = pv.stock + oi.quantity
          FROM order_items oi
          WHERE oi.order_id = $1 AND pv.id = oi.variant_id
        `, [id])
      } else if (currentStatus === 'cancelled' && status !== 'cancelled') {
        // Deduct stock when un-cancelling
        await client.query(`
          UPDATE product_variants pv
          SET stock = pv.stock - oi.quantity
          FROM order_items oi
          WHERE oi.order_id = $1 AND pv.id = oi.variant_id
        `, [id])
      }
    }

    const result = await client.query(`
      UPDATE orders SET status = $1, updated_at = NOW()
      WHERE id = $2 RETURNING *
    `, [status, id])

    await client.query('COMMIT')
    res.json(result.rows[0])
  } catch (error) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: 'Error al actualizar orden' })
  } finally {
    client.release()
  }
}
