import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftRight, Boxes, CircleAlert, PackageCheck, Search } from 'lucide-react'
import { api } from '../lib/api'
import { formatNumber } from '../lib/format'
import { useToast } from '../lib/toast'
import StockModal from '../components/app/StockModal'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All stock' },
  { value: 'low', label: 'Low stock' },
  { value: 'out', label: 'Out of stock' },
]

export default function InventoryManagement() {
  const toast = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [stockProduct, setStockProduct] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.getProducts({ page_size: 200 })
      setProducts(response.data)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load() }, [load])

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query)
      const matchesStatus = status === 'all'
        || (status === 'low' && product.is_low_stock)
        || (status === 'out' && product.current_stock === 0)
      return matchesSearch && matchesStatus
    })
  }, [products, search, status])

  const lowStockCount = products.filter((product) => product.is_low_stock).length
  const outOfStockCount = products.filter((product) => product.current_stock === 0).length
  const stockUnits = products.reduce((total, product) => total + product.current_stock, 0)

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-champagne-dark">Operations</p>
          <h1 className="mt-1 font-display text-3xl text-midnight">Inventory management</h1>
          <p className="mt-1 text-sm text-slate-500">Monitor availability and record stock movements from one place.</p>
        </div>
        <Link to="/app/history" className="btn-outline">View transaction history</Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard icon={Boxes} label="Units on hand" value={formatNumber(stockUnits)} tint="bg-blue-50 text-blue-600" />
        <SummaryCard icon={CircleAlert} label="Low-stock products" value={formatNumber(lowStockCount)} tint="bg-amber-50 text-amber-600" />
        <SummaryCard icon={PackageCheck} label="Out of stock" value={formatNumber(outOfStockCount)} tint="bg-red-50 text-red-600" />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="field pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product or SKU…" />
          </div>
          <div className="flex rounded-lg bg-slate-100 p-1">
            {STATUS_OPTIONS.map((option) => (
              <button key={option.value} onClick={() => setStatus(option.value)} className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${status === option.value ? 'bg-white text-midnight shadow-sm' : 'text-slate-500 hover:text-ink'}`}>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Product</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 text-right font-medium">On hand</th><th className="px-4 py-3 text-right font-medium">Reorder at</th><th className="px-4 py-3 text-center font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? Array.from({ length: 6 }).map((_, index) => <tr key={index}><td colSpan={6} className="px-4 py-4"><div className="h-5 animate-pulse rounded bg-slate-100" /></td></tr>) : visibleProducts.length === 0 ? <tr><td colSpan={6} className="px-4 py-16 text-center text-slate-500">No products match these inventory filters.</td></tr> : visibleProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/60"><td className="px-4 py-3"><p className="font-medium text-ink">{product.name}</p><p className="font-mono text-xs text-slate-400">{product.sku}</p></td><td className="px-4 py-3 text-slate-500">{product.category || '—'}</td><td className="px-4 py-3 text-right font-semibold text-ink">{formatNumber(product.current_stock)}</td><td className="px-4 py-3 text-right text-slate-500">{formatNumber(product.minimum_stock)}</td><td className="px-4 py-3 text-center"><StockStatus product={product} /></td><td className="px-4 py-3 text-right"><button className="btn-outline px-3 py-1.5" onClick={() => setStockProduct(product)}><ArrowLeftRight size={15} /> Manage</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500">Showing {formatNumber(visibleProducts.length)} of {formatNumber(products.length)} products</p>}
      </div>

      {stockProduct && <StockModal product={stockProduct} onClose={() => setStockProduct(null)} onDone={() => { setStockProduct(null); load() }} />}
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, tint }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft"><div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tint}`}><Icon size={20} /></div><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 font-display text-2xl text-midnight">{value}</p></div>
}

function StockStatus({ product }) {
  if (product.current_stock === 0) return <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">Out of stock</span>
  if (product.is_low_stock) return <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Low stock</span>
  return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">In stock</span>
}
