import { useCallback, useEffect, useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, SlidersHorizontal, History as HistoryIcon } from 'lucide-react'
import { api } from '../lib/api'
import { formatDate, formatNumber } from '../lib/format'
import { useToast } from '../lib/toast'

const PAGE_SIZE = 15

const TYPE_META = {
  IN: { label: 'Stock In', icon: ArrowDownToLine, cls: 'bg-emerald-50 text-emerald-700' },
  OUT: { label: 'Stock Out', icon: ArrowUpFromLine, cls: 'bg-red-50 text-red-700' },
  ADJUSTMENT: { label: 'Adjustment', icon: SlidersHorizontal, cls: 'bg-blue-50 text-blue-700' },
}

export default function InventoryHistory() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 })
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.getHistory({ type, page, page_size: PAGE_SIZE })
      setRows(res.data)
      setPagination(res.pagination)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [type, page]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load() }, [load])

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-midnight">Inventory history</h1>
          <p className="mt-1 text-sm text-slate-500">{formatNumber(pagination.total)} transactions recorded</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {[['', 'All'], ['IN', 'In'], ['OUT', 'Out'], ['ADJUSTMENT', 'Adjust']].map(([val, label]) => (
            <button
              key={label}
              onClick={() => { setType(val); setPage(1) }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                type === val ? 'bg-white text-midnight shadow-sm' : 'text-slate-500 hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 text-right font-medium">Quantity</th>
                <th className="px-4 py-3 text-right font-medium">Balance</th>
                <th className="px-4 py-3 font-medium">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-5 animate-pulse rounded bg-slate-100" /></td></tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <HistoryIcon className="mx-auto mb-3 text-slate-300" size={32} />
                    <p className="text-slate-500">No transactions yet.</p>
                  </td>
                </tr>
              ) : (
                rows.map((t) => {
                  const meta = TYPE_META[t.type]
                  const Icon = meta.icon
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatDate(t.created_at)}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{t.product}</p>
                        <p className="font-mono text-xs text-slate-400">{t.sku}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.cls}`}>
                          <Icon size={13} /> {meta.label}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${t.quantity >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {t.quantity >= 0 ? '+' : ''}{formatNumber(t.quantity)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-ink">{formatNumber(t.balance)}</td>
                      <td className="px-4 py-3 text-slate-500">{t.note || '—'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination.total_pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm">
            <span className="text-slate-500">Page {pagination.page} of {pagination.total_pages}</span>
            <div className="flex gap-2">
              <button className="btn-outline px-3 py-1.5" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <button className="btn-outline px-3 py-1.5" disabled={page >= pagination.total_pages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
