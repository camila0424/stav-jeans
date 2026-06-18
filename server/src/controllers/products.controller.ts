import { Request, Response } from 'express'
import pool from '../db/connection'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface RawVariant {
  id?: number
  size: string
  color: string
  color_hex: string
  stock: number
}

interface RawImage {
  url: string
  is_main: boolean
  display_order?: number
}

function toProduct(row: Record<string, unknown>) {
  const rawImages = (row.images as RawImage[] | null) ?? []
  const rawVariants = (row.variants as RawVariant[] | null) ?? []

  const images = rawImages
    .sort((a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0))
    .map((img) => img.url)

  const sizes = [...new Set(rawVariants.map((v) => v.size).filter(Boolean))]
  const colors = [...new Set(rawVariants.map((v) => v.color).filter(Boolean))]
  const stock = rawVariants.reduce((sum, v) => sum + (v.stock ?? 0), 0)

  const categoryName = (row.category as string) ?? ''

  return {
    id: row.id as string,
    name: row.name as string,
    slug: (row.slug as string) || slugify(row.name as string),
    description: (row.description as string) ?? '',
    price: parseFloat(row.price as string),
    salePrice: row.sale_price ? parseFloat(row.sale_price as string) : null,
    images,
    category: {
      id: 0,
      name: categoryName,
      slug: slugify(categoryName),
    },
    subcategory: (row.subcategory as string) ?? '',
    stock,
    sizes,
    colors,
    isActive: (row.is_active as boolean) ?? true,
    isFeatured: (row.is_featured as boolean) ?? false,
    variants: rawVariants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      colorHex: v.color_hex,
      stock: v.stock,
    })),
  }
}

const PRODUCT_QUERY = `
  SELECT p.*,
    (SELECT json_agg(img ORDER BY img.is_main DESC, img.display_order ASC)
     FROM (SELECT pi.url, pi.is_main, pi.display_order FROM product_images pi WHERE pi.product_id = p.id) img
    ) AS images,
    (SELECT json_agg(v)
     FROM (SELECT pv.id, pv.size, pv.color, pv.color_hex, pv.stock FROM product_variants pv WHERE pv.product_id = p.id) v
    ) AS variants
  FROM products p
`

export async function getAllProducts(req: Request, res: Response) {
  try {
    const { featured } = req.query
    const conditions = ['p.is_active = true']
    if (featured === 'true') conditions.push('p.is_featured = true')

    const result = await pool.query(
      `${PRODUCT_QUERY} WHERE ${conditions.join(' AND ')} ORDER BY p.created_at DESC`
    )
    console.log('[getAllProducts] ids devueltos:', result.rows.map(r => `${JSON.stringify(r.id)} (${typeof r.id})`))
    res.json(result.rows.map(toProduct))
  } catch (error) {
    console.error('getAllProducts error:', error)
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const isUUID = UUID_REGEX.test(id)
    const condition = isUUID ? 'p.id = $1' : 'p.slug = $1'

    const result = await pool.query(
      `${PRODUCT_QUERY} WHERE ${condition}`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(toProduct(result.rows[0]))
  } catch (error) {
    console.error('getProductById error:', error)
    res.status(500).json({ error: 'Error al obtener producto' })
  }
}

export async function createProduct(req: Request, res: Response) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const { name, description, price, sale_price, category, subcategory, is_active, is_featured, images, variants } = req.body
    const slug = slugify(name as string)

    const { rows } = await client.query(
      `INSERT INTO products (name, slug, description, price, sale_price, category, subcategory, is_active, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, slug, description, price, sale_price ?? null, category, subcategory ?? null, is_active ?? true, is_featured ?? false]
    )
    const product = rows[0]

    if (Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        await client.query(
          `INSERT INTO product_images (product_id, url, is_main, display_order) VALUES ($1, $2, $3, $4)`,
          [product.id, images[i], i === 0, i]
        )
      }
    }

    if (Array.isArray(variants)) {
      for (const v of variants as RawVariant[]) {
        await client.query(
          `INSERT INTO product_variants (product_id, size, color, color_hex, stock) VALUES ($1, $2, $3, $4, $5)`,
          [product.id, v.size, v.color, v.color_hex, v.stock]
        )
      }
    }

    await client.query('COMMIT')

    const full = await pool.query(`${PRODUCT_QUERY} WHERE p.id = $1`, [product.id])
    res.status(201).json(toProduct(full.rows[0]))
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('createProduct error:', error)
    res.status(500).json({ error: 'Error al crear producto' })
  } finally {
    client.release()
  }
}

export async function updateProduct(req: Request, res: Response) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const { id } = req.params
    const { name, description, price, sale_price, category, subcategory, is_active, is_featured, images, variants } = req.body

    const { rowCount } = await client.query(
      `UPDATE products
       SET name=$1, slug=$2, description=$3, price=$4, sale_price=$5, category=$6,
           subcategory=$7, is_active=$8, is_featured=$9, updated_at=NOW()
       WHERE id=$10`,
      [name, slugify(name as string), description, price, sale_price ?? null, category, subcategory ?? null, is_active ?? true, is_featured ?? false, id]
    )

    if (!rowCount) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    if (Array.isArray(images)) {
      await client.query('DELETE FROM product_images WHERE product_id = $1', [id])
      for (let i = 0; i < images.length; i++) {
        await client.query(
          `INSERT INTO product_images (product_id, url, is_main, display_order) VALUES ($1, $2, $3, $4)`,
          [id, images[i], i === 0, i]
        )
      }
    }

    if (Array.isArray(variants)) {
      // Load current variants from DB to diff against incoming ones
      const { rows: currentVariants } = await client.query<{ id: number; size: string; color: string }>(
        `SELECT id, size, color FROM product_variants WHERE product_id = $1`,
        [id]
      )

      const incomingVariants = variants as RawVariant[]
      const existingByKey = new Map(currentVariants.map(v => [`${v.size}::${v.color}`, v]))
      const retainedIds = new Set<number>()

      for (const v of incomingVariants) {
        const key = `${v.size}::${v.color}`
        const existing = existingByKey.get(key)
        if (existing) {
          // UPDATE in place — preserves the variant id, avoids FK violations
          await client.query(
            `UPDATE product_variants SET stock=$1, color_hex=$2 WHERE id=$3`,
            [v.stock, v.color_hex, existing.id]
          )
          retainedIds.add(existing.id)
        } else {
          const { rows: inserted } = await client.query(
            `INSERT INTO product_variants (product_id, size, color, color_hex, stock) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [id, v.size, v.color, v.color_hex, v.stock]
          )
          retainedIds.add(inserted[0].id as number)
        }
      }

      // Variants the user removed: delete only if they have no associated orders
      const removedVariants = currentVariants.filter(v => !retainedIds.has(v.id))
      const blockedVariants: Array<{ size: string; color: string }> = []

      for (const v of removedVariants) {
        const { rows } = await client.query(
          `SELECT EXISTS(SELECT 1 FROM order_items WHERE variant_id = $1) AS has_orders`,
          [v.id]
        )
        if ((rows[0] as { has_orders: boolean }).has_orders) {
          blockedVariants.push({ size: v.size, color: v.color })
        } else {
          await client.query(`DELETE FROM product_variants WHERE id = $1`, [v.id])
        }
      }

      if (blockedVariants.length > 0) {
        await client.query('ROLLBACK')
        const details = blockedVariants
          .map(v => `talla ${v.size} / color ${v.color}`)
          .join(', ')
        return res.status(409).json({
          error: `No se pueden eliminar las siguientes variantes porque tienen pedidos asociados: ${details}. Edita el stock a 0 si quieres ocultarlas.`,
        })
      }
    }

    await client.query('COMMIT')

    const full = await pool.query(`${PRODUCT_QUERY} WHERE p.id = $1`, [id])
    res.json(toProduct(full.rows[0]))
  } catch (error) {
    await client.query('ROLLBACK')
    const e = error as Record<string, unknown>
    console.error('updateProduct error:', { message: e?.message, code: e?.code, detail: e?.detail, constraint: e?.constraint })
    res.status(500).json({ error: 'Error al actualizar producto' })
  } finally {
    client.release()
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params
    await pool.query('UPDATE products SET is_active=false WHERE id=$1', [id])
    res.json({ message: 'Producto desactivado correctamente' })
  } catch (error) {
    console.error('deleteProduct error:', error)
    res.status(500).json({ error: 'Error al eliminar producto' })
  }
}

export async function addProductImage(req: Request, res: Response) {
  try {
    const { product_id, url, is_main, display_order } = req.body

    if (is_main) {
      await pool.query('UPDATE product_images SET is_main=false WHERE product_id=$1', [product_id])
    }

    const result = await pool.query(
      `INSERT INTO product_images (product_id, url, is_main, display_order) VALUES ($1, $2, $3, $4) RETURNING *`,
      [product_id, url, is_main, display_order]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar imagen' })
  }
}

export async function addProductVariant(req: Request, res: Response) {
  try {
    const { product_id, size, color, color_hex, stock } = req.body

    const result = await pool.query(
      `INSERT INTO product_variants (product_id, size, color, color_hex, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [product_id, size, color, color_hex, stock]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar variante' })
  }
}
