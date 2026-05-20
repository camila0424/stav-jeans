// Feed de Instagram con efecto hover y caption visible
import useInstagram from '../../hooks/useInstagram'
import useScrollAnimation from '../../hooks/useScrollAnimation'
import { SITE } from '../../data/siteConfig'

function InstagramFeed() {
  const { posts, loading, error } = useInstagram(6)
  const { ref, visible } = useScrollAnimation()

  return (
    <section className="bg-[#1A2E4A] px-6 py-20" ref={ref}>
      <div className="max-w-7xl mx-auto">

        <div className={`flex items-end justify-between mb-12 transition-all duration-700 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
          <div>
            <p className="text-[10px] tracking-[0.25em] text-[#A0B4C8]/60 uppercase mb-2">Síguenos</p>
            <h2 className="text-4xl font-light text-white">@stavjeans</h2>
          </div>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"
            className="group text-xs text-[#A0B4C8]/60 tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors">
            Seguir en Instagram
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        {loading && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-[#2E4A6A] animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-[#A0B4C8]/40 py-10 text-sm">No se pudo cargar Instagram en este momento</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {posts.map((post, i) => (
              <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer"
                className={`group relative aspect-square overflow-hidden transition-all duration-700 ${visible ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.08}s` }}>

                {post.media_type !== 'VIDEO' && (
                  <img src={post.media_url} alt="@stavjeans"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                )}

                {/* Overlay con icono */}
                <div className="absolute inset-0 bg-[#0E1E30]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-2xl">+</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default InstagramFeed