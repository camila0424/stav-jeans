import pool from './connection'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function initDB(): Promise<void> {
  try {
    await pool.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
    `)

    const { rows } = await pool.query<{ id: number; name: string }>(
      "SELECT id, name FROM products WHERE slug IS NULL OR slug = ''"
    )
    for (const row of rows) {
      await pool.query('UPDATE products SET slug = $1 WHERE id = $2', [
        slugify(row.name),
        row.id,
      ])
    }
  } catch (err) {
    console.error('DB init error:', err)
  }
}
