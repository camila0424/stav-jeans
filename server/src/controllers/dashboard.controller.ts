import { Request, Response } from 'express'
import pool from '../db/connection'

export async function getDashboardStats(_req: Request, res: Response) {
  try {
    const [productsRes, ordersRes, recentRes] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS total FROM products`),
      pool.query(`SELECT COUNT(*)::int AS total, COALESCE(SUM(total), 0)::float AS revenue FROM orders`),
      pool.query(`
        SELECT o.id, COALESCE(c.name, 'Sin nombre') AS customer_name,
               o.created_at, o.total, o.status
        FROM orders o
        LEFT JOIN customers c ON c.id = o.customer_id
        ORDER BY o.created_at DESC
        LIMIT 5
      `),
    ])
    res.json({
      total_products: productsRes.rows[0].total,
      total_orders: ordersRes.rows[0].total,
      total_revenue: ordersRes.rows[0].revenue,
      recent_orders: recentRes.rows,
    })
  } catch {
    res.status(500).json({ error: 'Error al obtener estadísticas' })
  }
}
