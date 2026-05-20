import type { VercelRequest, VercelResponse } from '@vercel/node'

const WC_BASE   = process.env.VITE_WC_URL
const WC_KEY    = process.env.VITE_WC_KEY
const WC_SECRET = process.env.VITE_WC_SECRET

const ALLOWED_RESOURCES = ['products', 'products/reviews', 'products/categories'] as const
type AllowedResource = typeof ALLOWED_RESOURCES[number]

function buildWcUrl(resource: AllowedResource, params: Record<string, string>): string {
  const url = new URL(`${WC_BASE}/${resource}`)
  url.searchParams.set('consumer_key', WC_KEY!)
  url.searchParams.set('consumer_secret', WC_SECRET!)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return url.toString()
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!WC_BASE || !WC_KEY || !WC_SECRET) {
    return res.status(500).json({ error: 'WooCommerce credentials not configured' })
  }

  const { resource = 'products', ...params } = req.query as Record<string, string>

  if (!ALLOWED_RESOURCES.includes(resource as AllowedResource)) {
    return res.status(400).json({ error: 'Invalid resource' })
  }

  try {
    const wcUrl = buildWcUrl(resource as AllowedResource, params)
    const wcRes = await fetch(wcUrl)

    if (!wcRes.ok) {
      return res.status(wcRes.status).json({ error: 'WooCommerce request failed' })
    }

    const data = await wcRes.json()

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res.status(200).json(data)
  } catch {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
