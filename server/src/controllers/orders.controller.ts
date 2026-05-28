import { Request, Response } from 'express'
import pool from '../db/connection'

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
            'product_name', p.name
          )
        ) as items
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
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
  try {
    const { id } = req.params
    const { status } = req.body

    const result = await pool.query(`
      UPDATE orders SET status = $1, updated_at = NOW()
      WHERE id = $2 RETURNING *
    `, [status, id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar orden' })
  }
}
