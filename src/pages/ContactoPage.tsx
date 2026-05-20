import { SITE } from '../data/siteConfig'
function ContactoPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <h1 className="text-4xl font-light text-[#1A2E4A] mb-6">Contacto</h1>
        <div className="space-y-4">
          <p className="text-[#6A7E92] text-sm"><strong className="text-[#1A2E4A]">Teléfono:</strong> {SITE.phone}</p>
          <p className="text-[#6A7E92] text-sm"><strong className="text-[#1A2E4A]">Email:</strong> {SITE.email}</p>
          <p className="text-[#6A7E92] text-sm"><strong className="text-[#1A2E4A]">Tienda:</strong> {SITE.location}</p>
        </div>
      </div>
    </div>
  )
}
export default ContactoPage
