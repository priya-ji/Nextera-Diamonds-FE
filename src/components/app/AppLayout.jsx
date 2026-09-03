import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Boxes,
  History,
  LogOut,
  Gem,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../../lib/auth'

const NAV = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/inventory', label: 'Inventory', icon: Boxes },
  { to: '/app/products', label: 'Products', icon: Package },
  { to: '/app/history', label: 'Inventory history', icon: History },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function onLogout() {
    logout()
    navigate('/login')
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-5 text-porcelain">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-champagne/20 text-champagne-light">
          <Gem size={18} />
        </span>
        <div className="leading-tight">
          <p className="font-display text-lg">Lumière</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-porcelain/50">Inventory</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-champagne/15 text-champagne-light'
                  : 'text-porcelain/70 hover:bg-white/5 hover:text-porcelain'
              }`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-porcelain">{user?.name}</p>
          <p className="text-xs text-porcelain/50">{user?.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-porcelain/70 transition-colors hover:bg-white/5 hover:text-porcelain"
        >
          <LogOut size={18} /> Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-midnight lg:block">{sidebar}</aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-midnight px-4 py-3 text-porcelain lg:hidden">
        <div className="flex items-center gap-2">
          <Gem size={18} className="text-champagne-light" />
          <span className="font-display text-lg">Lumière Inventory</span>
        </div>
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-midnight">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 text-porcelain/70"
              aria-label="Close menu"
            >
              <X />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
