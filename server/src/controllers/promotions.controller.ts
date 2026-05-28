import { Request, Response } from 'express'
import pool from '../db/connection'
import { sendPromotion } from '../services/email.service'

export async function getAllPromotions(_req: Request, res: Response) {
  try {
    const result = await pool.query(
      'SELECT * FROM promotions ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener promociones' })
  }
}

export async function getActivePromotions(_req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT * FROM promotions
      WHERE is_active = true
      AND (start_date IS NULL OR start_date <= NOW())
      AND (end_date IS NULL OR end_date >= NOW())
      ORDER BY created_at DESC
    `)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener promociones activas' })
  }
}

export async function createPromotion(req: Request, res: Response) {
  try {
    const { title, description, discount_type, discount_value, image_url, start_date, end_date } = req.body

    const result = await pool.query(`
      INSERT INTO promotions (title, description, discount_type, discount_value, image_url, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, description, discount_type, discount_value, image_url, start_date, end_date])

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al crear promoción' })
  }
}

export async function updatePromotion(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { title, description, discount_type, discount_value, image_url, start_date, end_date, is_active } = req.body

    const result = await pool.query(`
      UPDATE promotions
      SET title=$1, description=$2, discount_type=$3, discount_value=$4,
          image_url=$5, start_date=$6, end_date=$7, is_active=$8
      WHERE id=$9
      RETURNING *
    `, [title, description, discount_type, discount_value, image_url, start_date, end_date, is_active, id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promoción no encontrada' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar promoción' })
  }
}

export async function deletePromotion(req: Request, res: Response) {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM promotions WHERE id=$1', [id])
    res.json({ message: 'Promoción eliminada' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar promoción' })
  }
}

export async function sendPromotionToAll(req: Request, res: Response) {
  try {
    const { id } = req.params

    const promotionResult = await pool.query(
      'SELECT * FROM promotions WHERE id=$1', [id]
    )

    if (promotionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Promoción no encontrada' })
    }

    const promotion = promotionResult.rows[0]

    const subscribersResult = await pool.query(
      'SELECT * FROM email_subscribers WHERE is_active=true'
    )

    const subscribers = subscribersResult.rows
    let sent = 0

    for (const subscriber of subscribers) {
      try {
        await sendPromotion(
          subscriber.email,
          subscriber.name,
          promotion.title,
          promotion.description,
          promotion.image_url
        )
        sent++
      } catch {
        continue
      }
    }

    res.json({ message: `Promoción enviada a ${sent} suscriptores` })
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar promoción' })
  }
}
