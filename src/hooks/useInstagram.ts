import { useState, useEffect } from 'react'
import { instagramService } from '../services/instagram'
import type { InstagramPost } from '../types'

function useInstagram(limit = 6) {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    instagramService.getLatestPosts(limit)
      .then(setPosts)
      .catch(() => setError('No se pudo cargar Instagram'))
      .finally(() => setLoading(false))
  }, [limit])

  return { posts, loading, error }
}

export default useInstagram
