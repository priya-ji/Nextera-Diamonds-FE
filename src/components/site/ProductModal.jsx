import { useEffect } from 'react'
import { X } from 'lucide-react'
import DiamondArt from './DiamondArt'

export default function ProductModal({ product, onClose }) {
  useEffect(() => {
    if (!product) return undefined

    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-midnight/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-porcelain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-ink focus-ring hover:bg-white"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div className="grid md:grid-cols-2">
          <DiamondArt tone={product.tone} className="aspect-square w-full" />
          <div className="flex flex-col justify-center gap-4 p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-champagne-dark">
              {product.category}
            </p>
            <h3 className="font-display text-3xl text-midnight">{product.name}</h3>
            <p className="leading-relaxed text-slate-600">{product.description}</p>
            <dl className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 text-sm">
              <div>
                <dt className="text-slate-500">Carat</dt>
                <dd className="font-medium text-ink">{product.carat}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Cut</dt>
                <dd className="font-medium text-ink">{product.cut}</dd>
              </div>
            </dl>
            <a href="#contact" onClick={onClose} className="btn-dark mt-2 self-start">
              Enquire about this piece
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
