import { Request, Response } from 'express'
import pool from '../db/connection'

const DEFAULT_HERO = {
  title: 'Jeans colombianos que abrazan tu cuerpo',
  subtitle: 'Denim de calidad premium diseñado para cada curva',
  cta_text: 'Ver colección',
  image_url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1600&q=80',
  position_x: 50,
  position_y: 30,
}

export async function getHero(_req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`SELECT * FROM hero_config WHERE id = 1`)
    res.json(rows[0] ?? DEFAULT_HERO)
  } catch {
    res.status(500).json({ error: 'Error al obtener hero' })
  }
}

export async function updateHero(req: Request, res: Response) {
  try {
    const { title, subtitle, cta_text, image_url, position_x, position_y } = req.body
    const { rows } = await pool.query(`
      INSERT INTO hero_config (id, title, subtitle, cta_text, image_url, position_x, position_y)
      VALUES (1, $1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        cta_text = EXCLUDED.cta_text,
        image_url = EXCLUDED.image_url,
        position_x = EXCLUDED.position_x,
        position_y = EXCLUDED.position_y,
        updated_at = NOW()
      RETURNING *
    `, [title, subtitle, cta_text, image_url, position_x, position_y])
    res.json(rows[0])
  } catch {
    res.status(500).json({ error: 'Error al actualizar hero' })
  }
}
