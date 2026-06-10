import { Request, Response } from 'express'
import pool from '../db/connection'

export async function getCatalogo(_req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`SELECT * FROM catalogo_config WHERE id = 1`)
    res.json(rows[0] ?? { sections: [] })
  } catch {
    res.status(500).json({ error: 'Error al obtener catálogo' })
  }
}

export async function updateCatalogo(req: Request, res: Response) {
  try {
    const { sections } = req.body
    const { rows } = await pool.query(`
      INSERT INTO catalogo_config (id, sections)
      VALUES (1, $1)
      ON CONFLICT (id) DO UPDATE SET
        sections = EXCLUDED.sections,
        updated_at = NOW()
      RETURNING *
    `, [JSON.stringify(sections ?? [])])
    res.json(rows[0])
  } catch {
    res.status(500).json({ error: 'Error al actualizar catálogo' })
  }
}
