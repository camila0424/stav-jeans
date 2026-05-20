const IG_TOKEN = import.meta.env.VITE_IG_TOKEN
const IG_BASE  = 'https://graph.instagram.com/me/media'

async function getLatestPosts(limit = 6) {
  const fields = 'id,media_url,permalink,media_type,timestamp,caption'
  const res = await fetch(`${IG_BASE}?fields=${fields}&limit=${limit}&access_token=${IG_TOKEN}`)
  if (!res.ok) throw new Error('Error al cargar Instagram')
  const data = await res.json()
  return data.data
}
export const instagramService = { getLatestPosts }
