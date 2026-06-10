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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hero_config (
        id INT PRIMARY KEY,
        title TEXT NOT NULL DEFAULT '',
        subtitle TEXT NOT NULL DEFAULT '',
        cta_text TEXT NOT NULL DEFAULT '',
        image_url TEXT NOT NULL DEFAULT '',
        position_x INT NOT NULL DEFAULT 50,
        position_y INT NOT NULL DEFAULT 30,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS oferta_config (
        id INT PRIMARY KEY,
        title TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        start_date TEXT NOT NULL DEFAULT '',
        end_date TEXT NOT NULL DEFAULT '',
        hero_image_url TEXT NOT NULL DEFAULT '',
        products JSONB NOT NULL DEFAULT '[]',
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS coleccion_config (
        id INT PRIMARY KEY,
        name TEXT NOT NULL DEFAULT '',
        start_date TEXT NOT NULL DEFAULT '',
        end_date TEXT NOT NULL DEFAULT '',
        prendas JSONB NOT NULL DEFAULT '[]',
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS catalogo_config (
        id INT PRIMARY KEY,
        sections JSONB NOT NULL DEFAULT '[]',
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)
  } catch (err) {
    console.error('DB init error:', err)
  }
}
