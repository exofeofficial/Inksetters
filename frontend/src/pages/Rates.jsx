import { useEffect, useState } from 'react'
import { listRates, addRate, updateRate, deleteRate, seedDefaultRates } from '../lib/db'
import { rs } from '../lib/format'

const empty = { name: '', detail: '', price: '', category: 'Card' }

export default function Rates() {
  const [rates, setRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(empty)

  const load = async () => {
    setLoading(true)
    setRates(await listRates())
    setLoading(false)
  }
  useEffect(() => {
    load()
  }, [])

  const onAdd = async (e) => {
    e.preventDefault()
    if (!form.name || form.price === '') return
    await addRate({ ...form, price: Number(form.price) })
    setForm(empty)
    load()
  }

  const onPriceChange = async (id, price) => {
    await updateRate(id, { price: Number(price) })
    setRates((rs) => rs.map((r) => (r.id === id ? { ...r, price: Number(price) } : r)))
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteRate(id)
    load()
  }

  const onSeed = async () => {
    if (!confirm('Load the default Inksetters rate list?')) return
    await seedDefaultRates()
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold text-slate-800">Rate List</h1>
        {rates.length === 0 && !loading && (
          <button
            onClick={onSeed}
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            Load default rate list
          </button>
        )}
      </div>

      <form onSubmit={onAdd} className="bg-white rounded-xl shadow-sm p-4 grid gap-3 sm:grid-cols-12">
        <div className="sm:col-span-4">
          <label className="block text-xs font-medium text-slate-500 mb-1">Product name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-xs font-medium text-slate-500 mb-1">Detail (gsm/size)</label>
          <input
            type="text"
            value={form.detail}
            onChange={(e) => setForm({ ...form, detail: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          >
            {['Card', 'Paper', 'Sticker', 'Other'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">Price (Rs)</label>
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="sm:col-span-1 flex items-end">
          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg py-1.5 text-sm"
          >
            Add
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Product</th>
              <th className="px-3 py-2 font-medium">Detail</th>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium text-right">Price (editable)</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="5" className="px-3 py-6 text-center text-slate-400">Loading…</td></tr>
            ) : rates.length === 0 ? (
              <tr><td colSpan="5" className="px-3 py-6 text-center text-slate-400">No products yet — load the default list above.</td></tr>
            ) : (
              rates.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-slate-800">{r.name}</td>
                  <td className="px-3 py-2 text-slate-500">{r.detail || '—'}</td>
                  <td className="px-3 py-2 text-slate-500">{r.category}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex items-center gap-1">
                      <span className="text-slate-400 text-xs">Rs.</span>
                      <input
                        type="number"
                        defaultValue={r.price}
                        onBlur={(e) => onPriceChange(r.id, e.target.value)}
                        className="w-20 rounded border border-slate-200 px-2 py-1 text-right text-sm"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => onDelete(r.id)}
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
      <p className="text-xs text-slate-400">Tip: edit a price and click away (it saves automatically).</p>
    </div>
  )
}
