import { Request, Response } from 'express'
import pool from '../db/connection'

export async function subscribe(req: Request, res: Response) {
  try {
    const { email, name } = req.body

    const exists = await pool.query(
      'SELECT id FROM email_subscribers WHERE email = $1', [email]
    )

    if (exists.rows.length > 0) {
      await pool.query(
        'UPDATE email_subscribers SET is_active = true WHERE email = $1', [email]
      )
      return res.json({ message: 'Suscripción reactivada' })
    }

    await pool.query(
      'INSERT INTO email_subscribers (email, name) VALUES ($1, $2)',
      [email, name]
    )

    res.status(201).json({ message: 'Suscripción exitosa' })
  } catch (error) {
    res.status(500).json({ error: 'Error al suscribirse' })
  }
}

export async function getAllSubscribers(_req: Request, res: Response) {
  try {
    const result = await pool.query(
      'SELECT * FROM email_subscribers WHERE is_active = true ORDER BY subscribed_at DESC'
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener suscriptores' })
  }
}

export async function unsubscribe(req: Request, res: Response) {
  try {
    const { email } = req.params
    await pool.query(
      'UPDATE email_subscribers SET is_active = false WHERE email = $1', [email]
    )
    res.json({ message: 'Suscripción cancelada' })
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar suscripción' })
  }
}
