import { useEffect, useState } from 'react'
import { getExpenses, addExpense, deleteExpense, EXPENSE_CATEGORIES } from '../lib/db'
import { rs, today, thisMonth, sum, monthLabel } from '../lib/format'

const empty = () => ({
  date: today(),
  category: EXPENSE_CATEGORIES[0],
  description: '',
  amount: '',
})

export default function Expenses() {
  const [rows, setRows] = useState([])
  const [month, setMonth] = useState(thisMonth())
  const [form, setForm] = useState(empty())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async (m) => {
    setLoading(true)
    setRows(await getExpenses(m))
    setLoading(false)
  }
  useEffect(() => {
    load(month)
  }, [month])

  const monthTotal = sum(rows, 'amount')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount) return
    setSaving(true)
    await addExpense({
      date: form.date,
      category: form.category,
      description: form.description.trim(),
      amount: Number(form.amount),
    })
    setForm((f) => ({ ...empty(), date: f.date, category: f.category }))
    setSaving(false)
    if (form.date.slice(0, 7) === month) load(month)
    else setMonth(form.date.slice(0, 7))
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this expense?')) return
    await deleteExpense(id)
    load(month)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold text-slate-800">Expenses — Bills & Costs</h1>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        />
      </div>

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
          <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-4">
          <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
          <input
            type="text"
            placeholder="e.g. June electricity meter #123"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">Amount (Rs)</label>
          <input
            type="number"
            min="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="sm:col-span-1 flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold rounded-lg py-1.5 text-sm"
          >
            Add
          </button>
        </div>
      </form>

      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-600">
          {monthLabel(month)} — {rows.length} entries
        </span>
        <span className="text-lg font-bold text-red-700">{rs(monthTotal)}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 font-medium text-right">Amount</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="5" className="px-3 py-6 text-center text-slate-400">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan="5" className="px-3 py-6 text-center text-slate-400">No expenses this month.</td></tr>
            ) : (
              rows.map((x) => (
                <tr key={x.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 whitespace-nowrap">{x.date}</td>
                  <td className="px-3 py-2">{x.category}</td>
                  <td className="px-3 py-2 text-slate-500">{x.description}</td>
                  <td className="px-3 py-2 text-right font-semibold">{rs(x.amount)}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => onDelete(x.id)}
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
