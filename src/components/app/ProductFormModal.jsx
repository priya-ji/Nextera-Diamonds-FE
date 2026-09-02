import { useEffect, useState } from 'react'
import { Modal } from './Modal'
import { api } from '../../lib/api'
import { useToast } from '../../lib/toast'

const BLANK = {
  sku: '',
  name: '',
  category: '',
  purchase_price: '',
  selling_price: '',
  current_stock: '',
  minimum_stock: '',
}

export default function ProductFormModal({ product, categories, onClose, onSaved }) {
  const toast = useToast()
  const editing = Boolean(product)
  const [form, setForm] = useState(BLANK)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        sku: product.sku,
        name: product.name,
        category: product.category || '',
        purchase_price: product.purchase_price,
        selling_price: product.selling_price,
        current_stock: product.current_stock,
        minimum_stock: product.minimum_stock,
      })
    } else {
      setForm(BLANK)
    }
  }, [product])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.sku.trim()) e.sku = 'SKU is required'
    if (!form.name.trim()) e.name = 'Name is required'
    const nums = ['purchase_price', 'selling_price', 'minimum_stock']
    if (!editing) nums.push('current_stock')
    for (const key of nums) {
      const v = form[key]
      if (v === '' || v == null) e[key] = 'Required'
      else if (Number(v) < 0) e[key] = 'Must be ≥ 0'
    }
    return e
  }

  async function onSubmit(e) {
    e.preventDefault()
    const found = validate()
    if (Object.keys(found).length) {
      setErrors(found)
      return
    }
    setSaving(true)
    try {
      const payload = {
        sku: form.sku.trim(),
        name: form.name.trim(),
        category: form.category.trim() || null,
        purchase_price: Number(form.purchase_price),
        selling_price: Number(form.selling_price),
        minimum_stock: Number(form.minimum_stock),
      }
      if (!editing) payload.current_stock = Number(form.current_stock)

      if (editing) {
        await api.updateProduct(product.id, payload)
        toast.success('Product updated')
      } else {
        await api.createProduct(payload)
        toast.success('Product added')
      }
      onSaved()
    } catch (err) {
      toast.error(err.message)
      if (err.data?.field) setErrors({ [err.data.field]: err.message })
    } finally {
      setSaving(false)
    }
  }

  const catList = categories.map((c) => c.name)

  return (
    <Modal title={editing ? 'Edit product' : 'Add product'} onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="SKU" error={errors.sku}>
            <input className="field" value={form.sku} onChange={(e) => update('sku', e.target.value)} />
          </Field>
          <Field label="Product name" error={errors.name}>
            <input className="field" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </Field>
          <Field label="Category" error={errors.category}>
            <input className="field" list="category-list" value={form.category}
              onChange={(e) => update('category', e.target.value)} placeholder="e.g. Rings" />
            <datalist id="category-list">
              {catList.map((c) => <option key={c} value={c} />)}
            </datalist>
          </Field>
          <Field label={editing ? 'Current stock (locked)' : 'Opening stock'} error={errors.current_stock}>
            <input type="number" className="field disabled:bg-slate-100" value={editing ? product.current_stock : form.current_stock}
              onChange={(e) => update('current_stock', e.target.value)} disabled={editing} min={0} />
          </Field>
          <Field label="Purchase price (₹)" error={errors.purchase_price}>
            <input type="number" className="field" value={form.purchase_price}
              onChange={(e) => update('purchase_price', e.target.value)} min={0} step="0.01" />
          </Field>
          <Field label="Selling price (₹)" error={errors.selling_price}>
            <input type="number" className="field" value={form.selling_price}
              onChange={(e) => update('selling_price', e.target.value)} min={0} step="0.01" />
          </Field>
          <Field label="Minimum stock level" error={errors.minimum_stock}>
            <input type="number" className="field" value={form.minimum_stock}
              onChange={(e) => update('minimum_stock', e.target.value)} min={0} />
          </Field>
        </div>

        {editing && (
          <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
            Stock isn&apos;t edited here — use Stock In / Stock Out so every change is recorded in the ledger.
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-outline" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
