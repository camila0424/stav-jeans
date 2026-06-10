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
      ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100);
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)

    const seedCategories = [
      { name: 'Vaqueros',  slug: 'vaqueros'  },
      { name: 'Vestidos',  slug: 'vestidos'  },
      { name: 'Faldas',    slug: 'faldas'    },
      { name: 'Enterizos', slug: 'enterizos' },
    ]
    for (const cat of seedCategories) {
      await pool.query(
        `INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING`,
        [cat.name, cat.slug]
      )
    }

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
