// Reseñas con entrada escalonada al hacer scroll
import useScrollAnimation from '../../hooks/useScrollAnimation'

const REVIEWS = [
  { name: 'Mafer C.', rating: 5, text: 'Me sorprendió cómo se adaptó el vaquero a mi cuerpo. Definitivamente volveré a comprar.' },
  { name: 'Laura P.', rating: 5, text: 'La calidad es increíble. La entrega fue rapidísima y la atención excelente.' },
  { name: 'Sofía M.', rating: 4, text: 'El ajuste es perfecto. Los colombianos son otra categoría. Muy recomendable.' },
]

function ReviewsSection() {
  const { ref, visible } = useScrollAnimation()

  return (
    <section className="px-6 py-20 max-w-7xl mx-auto" ref={ref}>
      <div className={`mb-12 transition-all duration-700 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
        <p className="text-[10px] tracking-[0.25em] text-[#A0B4C8] uppercase mb-2">Opiniones</p>
        <h2 className="text-4xl font-light text-[#1A2E4A]">Lo que dicen nuestras clientas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((review, i) => (
          <div key={i}
            className={`bg-white p-7 border border-[#D0DDE8] card-hover transition-all duration-700
              ${visible ? 'animate-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: `${0.1 + i * 0.15}s` }}>

            {/* Estrellas animadas */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <span key={j}
                  className={`text-base transition-all duration-300 ${j < review.rating ? 'text-[#D4A843]' : 'text-[#E0E8F0]'}`}
                  style={{ transitionDelay: `${j * 0.05}s` }}>
                  ★
                </span>
              ))}
            </div>

            <p className="text-[#2A3E54] text-sm leading-relaxed mb-5 italic">
              "{review.text}"
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-[#EBF1F8]">
              <div className="w-8 h-8 rounded-full bg-[#EBF1F8] flex items-center justify-center text-[#2E4A6A] text-xs font-bold">
                {review.name[0]}
              </div>
              <p className="text-[#6A7E92] text-xs tracking-wider">
                {review.name} · Compra verificada
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ReviewsSection