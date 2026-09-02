import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowLeftRight,
  Download,
  PackageOpen,
} from 'lucide-react'
import { api } from '../lib/api'
import { formatCurrency, formatNumber } from '../lib/format'
import { useToast } from '../lib/toast'
import ProductFormModal from '../components/app/ProductFormModal'
import StockModal from '../components/app/StockModal'
import { ConfirmDialog } from '../components/app/Modal'

const PAGE_SIZE = 8

export default function ProductsPage() {
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [lowOnly, setLowOnly] = useState(searchParams.get('low_stock') === 'true')
  const [page, setPage] = useState(1)

  const [formProduct, setFormProduct] = useState(undefined) // undefined=closed, null=add, obj=edit
  const [stockProduct, setStockProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.getProducts({
        search,
        category_id: categoryId,
        low_stock: lowOnly ? 'true' : '',
        page,
        page_size: PAGE_SIZE,
      })
      setProducts(res.data)
      setPagination(res.pagination)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, categoryId, lowOnly, page]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {})
  }, [])

  // Debounce search + reload when filters change.
  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  // Keep the low_stock filter reflected in the URL for shareable links.
  useEffect(() => {
    setSearchParams(lowOnly ? { low_stock: 'true' } : {}, { replace: true })
  }, [lowOnly]) // eslint-disable-line react-hooks/exhaustive-deps

  function resetToFirstPage(setter) {
    return (v) => {
      setPage(1)
      setter(v)
    }
  }

  async function confirmDelete() {
    setDeleting(true)
    try {
      await api.deleteProduct(deleteTarget.id)
      toast.success('Product deleted')
      setDeleteTarget(null)
      // If we just emptied the last page, step back one.
      if (products.length === 1 && page > 1) setPage((p) => p - 1)
      else load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setDeleting(false)
    }
  }

  function exportCsv() {
    const header = ['SKU', 'Name', 'Category', 'Purchase Price', 'Selling Price', 'Current Stock', 'Minimum Stock']
    const rows = products.map((p) => [
      p.sku, p.name, p.category || '', p.purchase_price, p.selling_price, p.current_stock, p.minimum_stock,
    ])
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'products.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-midnight">Products</h1>
          <p className="mt-1 text-sm text-slate-500">{formatNumber(pagination.total)} items in catalogue</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={exportCsv}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn-primary" onClick={() => setFormProduct(null)}>
            <Plus size={16} /> Add product
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="field pl-9"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => resetToFirstPage(setSearch)(e.target.value)}
          />
        </div>
        <select
          className="field w-auto"
          value={categoryId}
          onChange={(e) => resetToFirstPage(setCategoryId)(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={lowOnly}
            onChange={(e) => resetToFirstPage(setLowOnly)(e.target.checked)}
            className="accent-champagne"
          />
          Low stock only
        </label>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Purchase</th>
                <th className="px-4 py-3 text-right font-medium">Selling</th>
                <th className="px-4 py-3 text-right font-medium">Stock</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-4 py-4">
                      <div className="h-5 animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <PackageOpen className="mx-auto mb-3 text-slate-300" size={32} />
                    <p className="text-slate-500">No products match your filters.</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.sku}</td>
                    <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                    <td className="px-4 py-3 text-slate-500">{p.category || '—'}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(p.purchase_price)}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(p.selling_price)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink">{formatNumber(p.current_stock)}</td>
                    <td className="px-4 py-3 text-center">
                      {p.is_low_stock ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          Low stock
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <IconBtn title="Manage stock" onClick={() => setStockProduct(p)}>
                          <ArrowLeftRight size={16} />
                        </IconBtn>
                        <IconBtn title="Edit" onClick={() => setFormProduct(p)}>
                          <Pencil size={16} />
                        </IconBtn>
                        <IconBtn title="Delete" danger onClick={() => setDeleteTarget(p)}>
                          <Trash2 size={16} />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm">
            <span className="text-slate-500">
              Page {pagination.page} of {pagination.total_pages}
            </span>
            <div className="flex gap-2">
              <button
                className="btn-outline px-3 py-1.5"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn-outline px-3 py-1.5"
                disabled={page >= pagination.total_pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {formProduct !== undefined && (
        <ProductFormModal
          product={formProduct}
          categories={categories}
          onClose={() => setFormProduct(undefined)}
          onSaved={() => {
            setFormProduct(undefined)
            load()
            api.getCategories().then(setCategories).catch(() => {})
          }}
        />
      )}

      {stockProduct && (
        <StockModal
          product={stockProduct}
          onClose={() => setStockProduct(null)}
          onDone={() => {
            setStockProduct(null)
            load()
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete product"
          message={`Delete "${deleteTarget.name}"? This also removes its inventory history and cannot be undone.`}
          confirmLabel="Delete"
          loading={deleting}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

function IconBtn({ children, title, onClick, danger }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`rounded-md p-2 transition-colors focus-ring ${
        danger ? 'text-slate-400 hover:bg-red-50 hover:text-red-600' : 'text-slate-400 hover:bg-slate-100 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
