import { Request, Response } from 'express'
import pool from '../db/connection'

export async function getColeccion(_req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`SELECT * FROM coleccion_config WHERE id = 1`)
    res.json(rows[0] ?? { name: '', start_date: '', end_date: '', prendas: [] })
  } catch {
    res.status(500).json({ error: 'Error al obtener colección' })
  }
}

export async function updateColeccion(req: Request, res: Response) {
  try {
    const { name, start_date, end_date, prendas } = req.body
    const { rows } = await pool.query(`
      INSERT INTO coleccion_config (id, name, start_date, end_date, prendas)
      VALUES (1, $1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        prendas = EXCLUDED.prendas,
        updated_at = NOW()
      RETURNING *
    `, [name, start_date, end_date, JSON.stringify(prendas ?? [])])
    res.json(rows[0])
  } catch {
    res.status(500).json({ error: 'Error al actualizar colección' })
  }
}
