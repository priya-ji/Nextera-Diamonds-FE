import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/collection', label: 'Collection' },
  { to: '/about', label: 'About' },
  { to: '/why-us', label: 'Why us' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-midnight/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-porcelain">
          <span className="font-display text-xl tracking-tight">Lumière</span>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-champagne-light">
            Diamonds
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-porcelain/80 transition-colors hover:text-porcelain"
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="btn-primary py-2 text-sm">
            Trade login
          </Link>
        </div>

        <button
          className="text-porcelain md:hidden focus-ring"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-midnight px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm text-porcelain/80"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/login" className="btn-primary text-sm">
              Trade login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
