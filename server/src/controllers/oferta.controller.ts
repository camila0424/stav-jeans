import { Request, Response } from 'express'
import pool from '../db/connection'

export async function getOferta(_req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`SELECT * FROM oferta_config WHERE id = 1`)
    res.json(rows[0] ?? { title: '', description: '', start_date: '', end_date: '', hero_image_url: '', products: [] })
  } catch {
    res.status(500).json({ error: 'Error al obtener oferta' })
  }
}

export async function updateOferta(req: Request, res: Response) {
  try {
    const { title, description, start_date, end_date, hero_image_url, products } = req.body
    const { rows } = await pool.query(`
      INSERT INTO oferta_config (id, title, description, start_date, end_date, hero_image_url, products)
      VALUES (1, $1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        hero_image_url = EXCLUDED.hero_image_url,
        products = EXCLUDED.products,
        updated_at = NOW()
      RETURNING *
    `, [title, description, start_date, end_date, hero_image_url, JSON.stringify(products ?? [])])
    res.json(rows[0])
  } catch {
    res.status(500).json({ error: 'Error al actualizar oferta' })
  }
}
