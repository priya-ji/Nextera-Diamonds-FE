import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  Layers,
  AlertTriangle,
  IndianRupee,
  Wallet,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import { api } from '../lib/api'
import { formatCurrency, formatNumber } from '../lib/format'
import { useToast } from '../lib/toast'

const STAT_META = [
  { key: 'total_products', label: 'Total products', icon: Package, fmt: formatNumber, tint: 'bg-blue-50 text-blue-600' },
  { key: 'total_stock', label: 'Total stock', icon: Layers, fmt: formatNumber, tint: 'bg-violet-50 text-violet-600' },
  { key: 'low_stock', label: 'Low stock', icon: AlertTriangle, fmt: formatNumber, tint: 'bg-amber-50 text-amber-600' },
  { key: 'total_sales', label: 'Total sales', icon: IndianRupee, fmt: formatCurrency, tint: 'bg-emerald-50 text-emerald-600' },
]

export default function Dashboard() {
  const toast = useToast()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getDashboard()
      .then(setData)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <PageSkeleton />
  if (!data) return null

  const { metrics, low_stock_products, charts } = data

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl text-midnight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Your inventory at a glance.</p>
      </header>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_META.map(({ key, label, icon: Icon, fmt, tint }) => (
          <div key={key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tint}`}>
              <Icon size={20} />
            </div>
            <p className="mt-4 text-sm text-slate-500">{label}</p>
            <p className="mt-1 font-display text-2xl text-midnight">{fmt(metrics[key])}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Wallet size={20} />
        </div>
        <div>
          <p className="text-sm text-slate-500">Stock value on hand (at purchase price)</p>
          <p className="font-display text-xl text-midnight">{formatCurrency(metrics.stock_value)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft lg:col-span-3">
          <h2 className="font-display text-lg text-midnight">Stock on hand — top products</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.stock_by_product} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => (v.length > 12 ? v.slice(0, 11) + '…' : v)}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                  {charts.stock_by_product.map((_, i) => (
                    <Cell key={i} fill="#b08d57" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low stock panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-midnight">Low stock</h2>
            <Link to="/app/products?low_stock=true" className="text-sm font-medium text-champagne-dark hover:underline">
              View all
            </Link>
          </div>
          {low_stock_products.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">Nothing low — you&apos;re well stocked.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {low_stock_products.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.sku}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {p.current_stock} / {p.minimum_stock}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-slate-200" />
        ))}
      </div>
      <div className="h-80 rounded-xl bg-slate-200" />
    </div>
  )
}
