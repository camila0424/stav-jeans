import { Router, Request, Response } from 'express'
import pool from '../db/connection'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    'SELECT id, name, slug FROM categories ORDER BY name ASC'
  )
  res.json(rows)
})

export default router
