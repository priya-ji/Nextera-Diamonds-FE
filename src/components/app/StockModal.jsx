import { useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, SlidersHorizontal } from 'lucide-react'
import { Modal } from './Modal'
import { api } from '../../lib/api'
import { useToast } from '../../lib/toast'
import { formatNumber } from '../../lib/format'

const TABS = [
  { key: 'IN', label: 'Stock In', icon: ArrowDownToLine },
  { key: 'OUT', label: 'Stock Out', icon: ArrowUpFromLine },
  { key: 'ADJUSTMENT', label: 'Adjust', icon: SlidersHorizontal },
]

export default function StockModal({ product, onClose, onDone }) {
  const toast = useToast()
  const [tab, setTab] = useState('IN')
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Live preview of the resulting stock so the user sees the outcome first.
  const qtyNum = Number(quantity)
  let projected = product.current_stock
  if (quantity !== '' && !Number.isNaN(qtyNum)) {
    if (tab === 'IN') projected = product.current_stock + Math.abs(qtyNum)
    else if (tab === 'OUT') projected = product.current_stock - Math.abs(qtyNum)
    else projected = product.current_stock + qtyNum
  }
  const wouldGoNegative = projected < 0

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (quantity === '' || Number.isNaN(qtyNum)) {
      setError('Enter a quantity')
      return
    }
    if (tab !== 'ADJUSTMENT' && Math.abs(qtyNum) < 1) {
      setError('Quantity must be at least 1')
      return
    }
    if (tab === 'ADJUSTMENT' && qtyNum === 0) {
      setError('Adjustment cannot be zero')
      return
    }
    setSaving(true)
    try {
      const base = { product_id: product.id, note: note.trim() || undefined }
      if (tab === 'IN') await api.stockIn({ ...base, quantity: Math.abs(qtyNum) })
      else if (tab === 'OUT') await api.stockOut({ ...base, quantity: Math.abs(qtyNum) })
      else await api.adjustment({ ...base, quantity: qtyNum })
      toast.success('Stock updated')
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={`Manage stock · ${product.name}`} onClose={onClose}>
      <div className="mb-5 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
        <span className="text-sm text-slate-500">Current stock</span>
        <span className="font-display text-2xl text-midnight">
          {formatNumber(product.current_stock)}
        </span>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2 rounded-lg bg-slate-100 p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setError('') }}
            className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors ${
              tab === key ? 'bg-white text-midnight shadow-sm' : 'text-slate-500 hover:text-ink'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <label className="label">
            {tab === 'ADJUSTMENT' ? 'Adjustment (use − to reduce)' : 'Quantity'}
          </label>
          <input
            type="number"
            className="field"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={tab === 'ADJUSTMENT' ? 'e.g. -3' : 'e.g. 25'}
            autoFocus
          />
        </div>
        <div>
          <label className="label">Note (optional)</label>
          <input className="field" value={note} onChange={(e) => setNote(e.target.value)}
            placeholder={tab === 'OUT' ? 'Sale, transfer…' : 'Reason for change'} />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
          <span className="text-sm text-slate-500">New stock will be</span>
          <span className={`font-display text-xl ${wouldGoNegative ? 'text-red-600' : 'text-emerald-600'}`}>
            {formatNumber(Math.max(projected, 0))}
            {wouldGoNegative && <span className="ml-2 text-xs">(not allowed)</span>}
          </span>
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="flex justify-end gap-3 pt-1">
          <button type="button" className="btn-outline" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving || wouldGoNegative}>
            {saving ? 'Saving…' : 'Apply'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
