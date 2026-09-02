import { useState } from 'react'
import { Check } from 'lucide-react'

const EMPTY = { name: '', email: '', phone: '', company: '', message: '' }

export default function EnquiryForm({ dark = false }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const labelClass = dark ? 'mb-1 block text-sm font-medium text-porcelain/80' : 'label'
  const fieldClass = dark
    ? 'w-full rounded-md border border-white/10 bg-midnight/60 px-3 py-2 text-sm text-porcelain outline-none transition placeholder:text-porcelain/35 focus:border-champagne focus:ring-2 focus:ring-champagne/30'
    : 'field'

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Please tell us your name'
    if (!form.email.trim()) e.email = 'An email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'That email looks off'
    if (!form.message.trim()) e.message = 'Add a short message'
    return e
  }

  function onSubmit(e) {
    e.preventDefault()
    const found = validate()
    if (Object.keys(found).length) {
      setErrors(found)
      return
    }
    // No public enquiry endpoint in scope — the trade portal is the backend.
    // We confirm receipt client-side (documented as an assumption in the README).
    setSent(true)
    setForm(EMPTY)
  }

  if (sent) {
    return (
      <div className={`flex flex-col items-center gap-3 rounded-2xl p-10 text-center shadow-soft ${dark ? 'border border-white/10 bg-white/[0.04]' : 'bg-white'}`}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check />
        </div>
        <h3 className={`font-display text-2xl ${dark ? 'text-porcelain' : 'text-midnight'}`}>Enquiry received</h3>
        <p className={`max-w-sm ${dark ? 'text-porcelain/60' : 'text-slate-600'}`}>
          Thank you. Our trade desk will be in touch within one business day.
        </p>
        <button className={`${dark ? 'btn-outline border-white/25 bg-transparent text-porcelain hover:bg-white/10' : 'btn-outline'} mt-2`} onClick={() => setSent(false)}>
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`rounded-2xl p-6 shadow-soft sm:p-8 ${dark ? 'border border-white/10 bg-white/[0.04]' : 'bg-white'}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">Name</label>
          <input id="name" className={fieldClass} value={form.name}
            onChange={(e) => update('name', e.target.value)} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input id="email" type="email" className={fieldClass} value={form.email}
            onChange={(e) => update('email', e.target.value)} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">Phone</label>
          <input id="phone" className={fieldClass} value={form.phone}
            onChange={(e) => update('phone', e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="company">Company</label>
          <input id="company" className={fieldClass} value={form.company}
            onChange={(e) => update('company', e.target.value)} />
        </div>
      </div>
      <div className="mt-4">
        <label className={labelClass} htmlFor="message">Message</label>
        <textarea id="message" rows={4} className={`${fieldClass} resize-none`} value={form.message}
          onChange={(e) => update('message', e.target.value)} />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>
      <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
        Send enquiry
      </button>
    </form>
  )
}
