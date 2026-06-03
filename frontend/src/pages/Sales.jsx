import { useEffect, useMemo, useState } from 'react'
import { listRates, getSales, addSale, deleteSale } from '../lib/db'
import { rs, today, thisMonth, sum, monthLabel } from '../lib/format'

const empty = (rates) => ({
  date: today(),
  product: rates[0]?.name || '',
  qty: 1,
  unitPrice: rates[0]?.price || 0,
  discount: 0,
  note: '',
})

export default function Sales() {
  const [rates, setRates] = useState([])
  const [sales, setSales] = useState([])
  const [month, setMonth] = useState(thisMonth())
  const [form, setForm] = useState(empty([]))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadSales = async (m) => {
    setLoading(true)
    setSales(await getSales(m))
    setLoading(false)
  }

  useEffect(() => {
    listRates().then((r) => {
      setRates(r)
      setForm(empty(r))
    })
  }, [])
  useEffect(() => {
    loadSales(month)
  }, [month])

  const lineTotal = useMemo(
    () => Math.max(0, form.qty * form.unitPrice - form.discount),
    [form]
  )
  const monthTotal = sum(sales, 'total')

  // When product changes, auto-fill its unit price.
  const onProduct = (name) => {
    const r = rates.find((x) => x.name === name)
    setForm((f) => ({ ...f, product: name, unitPrice: r ? r.price : f.unitPrice }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await addSale({
      date: form.date,
      product: form.product,
      qty: Number(form.qty),
      unitPrice: Number(form.unitPrice),
      discount: Number(form.discount),
      total: lineTotal,
      note: form.note.trim(),
    })
    setForm((f) => ({ ...empty(rates), date: f.date }))
    setSaving(false)
    if (form.date.slice(0, 7) === month) loadSales(month)
    else setMonth(form.date.slice(0, 7))
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this sale entry?')) return
    await deleteSale(id)
    loadSales(month)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold text-slate-800">Sales — Daily Print Record</h1>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        />
      </div>

      {/* Entry form */}
      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm p-4 grid gap-3 sm:grid-cols-12">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-xs font-medium text-slate-500 mb-1">Product</label>
          <select
            value={form.product}
            onChange={(e) => onProduct(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          >
            {rates.length === 0 && <option>— add rates first —</option>}
            {rates.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">Qty</label>
          <input
            type="number"
            min="0"
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">Unit Price</label>
          <input
            type="number"
            min="0"
            value={form.unitPrice}
            onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">Discount (Rs)</label>
          <input
            type="number"
            min="0"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="sm:col-span-2 flex items-end">
          <div className="text-sm text-slate-600">
            Total: <span className="font-bold text-slate-900">{rs(lineTotal)}</span>
          </div>
        </div>
        <div className="sm:col-span-10">
          <input
            type="text"
            placeholder="Note / customer (optional)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="sm:col-span-2 flex items-end">
          <button
            type="submit"
            disabled={saving || rates.length === 0}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold rounded-lg py-1.5 text-sm"
          >
            {saving ? 'Saving…' : 'Add Sale'}
          </button>
        </div>
      </form>

      {/* Month summary */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl px-4 py-3 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-600">
          {monthLabel(month)} — {sales.length} entries
        </span>
        <span className="text-lg font-bold text-brand-700">{rs(monthTotal)}</span>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Product</th>
              <th className="px-3 py-2 font-medium text-right">Qty</th>
              <th className="px-3 py-2 font-medium text-right">Price</th>
              <th className="px-3 py-2 font-medium text-right">Disc.</th>
              <th className="px-3 py-2 font-medium text-right">Total</th>
              <th className="px-3 py-2 font-medium">Note</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="8" className="px-3 py-6 text-center text-slate-400">Loading…</td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan="8" className="px-3 py-6 text-center text-slate-400">No sales this month.</td></tr>
            ) : (
              sales.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 whitespace-nowrap">{s.date}</td>
                  <td className="px-3 py-2">{s.product}</td>
                  <td className="px-3 py-2 text-right">{s.qty}</td>
                  <td className="px-3 py-2 text-right">{rs(s.unitPrice)}</td>
                  <td className="px-3 py-2 text-right">{s.discount ? rs(s.discount) : '—'}</td>
                  <td className="px-3 py-2 text-right font-semibold">{rs(s.total)}</td>
                  <td className="px-3 py-2 text-slate-500">{s.note}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => onDelete(s.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
