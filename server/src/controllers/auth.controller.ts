import { Request, Response } from 'express'
import pool from '../db/connection'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    const result = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1', [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const admin = result.rows[0]
    const validPassword = await bcrypt.compare(password, admin.password_hash)

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    )

    res.json({ token, email: admin.email })
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

export async function createAdmin(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    const exists = await pool.query(
      'SELECT id FROM admin_users WHERE email = $1', [email]
    )

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'Este correo ya está registrado' })
    }

    const password_hash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      'INSERT INTO admin_users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, password_hash]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al crear administrador' })
  }
}
