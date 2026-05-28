import { Request, Response } from 'express'
import pool from '../db/connection'

export async function getAllProducts(_req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT p.*,
        json_agg(DISTINCT pi.*) FILTER (WHERE pi.id IS NOT NULL) AS images,
        json_agg(DISTINCT pv.*) FILTER (WHERE pv.id IS NOT NULL) AS variants
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id
      LEFT JOIN product_variants pv ON pv.product_id = p.id
      WHERE p.is_active = true
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT p.*,
        json_agg(DISTINCT pi.*) FILTER (WHERE pi.id IS NOT NULL) AS images,
        json_agg(DISTINCT pv.*) FILTER (WHERE pv.id IS NOT NULL) AS variants
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id
      LEFT JOIN product_variants pv ON pv.product_id = p.id
      WHERE p.id = $1 AND p.is_active = true
      GROUP BY p.id
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' })
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, price, category } = req.body

    const result = await pool.query(`
      INSERT INTO products (name, description, price, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, description, price, category])

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' })
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { name, description, price, category, is_active } = req.body

    const result = await pool.query(`
      UPDATE products
      SET name=$1, description=$2, price=$3, category=$4, is_active=$5, updated_at=NOW()
      WHERE id=$6
      RETURNING *
    `, [name, description, price, category, is_active, id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' })
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params
    await pool.query(
      'UPDATE products SET is_active=false WHERE id=$1', [id]
    )
    res.json({ message: 'Producto desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' })
  }
}

export async function addProductImage(req: Request, res: Response) {
  try {
    const { product_id, url, is_main, display_order } = req.body

    if (is_main) {
      await pool.query(
        'UPDATE product_images SET is_main=false WHERE product_id=$1', [product_id]
      )
    }

    const result = await pool.query(`
      INSERT INTO product_images (product_id, url, is_main, display_order)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [product_id, url, is_main, display_order])

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar imagen' })
  }
}

export async function addProductVariant(req: Request, res: Response) {
  try {
    const { product_id, size, color, color_hex, stock } = req.body

    const result = await pool.query(`
      INSERT INTO product_variants (product_id, size, color, color_hex, stock)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [product_id, size, color, color_hex, stock])

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar variante' })
  }
}
