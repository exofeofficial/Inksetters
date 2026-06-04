import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getExpenses, addExpense, deleteExpense, EXPENSE_CATEGORIES } from '../lib/db'
import { rs, today, thisMonth, sum, monthLabel } from '../lib/format'
import {
  Plus, Trash2, TrendingDown, FileText, Calendar,
  Zap, Wifi, Home, Users, Droplets, Package, Wrench, MoreHorizontal, Check,
} from 'lucide-react'

// Category icon + color map
const CAT_META = {
  'Electricity Bill':   { Icon: Zap,          color: 'bg-amber-50 text-amber-600 border-amber-100'   },
  'Internet Bill':      { Icon: Wifi,          color: 'bg-sky-50 text-sky-600 border-sky-100'         },
  'Rent':               { Icon: Home,          color: 'bg-violet-50 text-violet-600 border-violet-100'},
  'Salary':             { Icon: Users,         color: 'bg-emerald-50 text-emerald-600 border-emerald-100'},
  'Ink':                { Icon: Droplets,      color: 'bg-brand-50 text-brand-600 border-brand-100'   },
  'Paper / Material':   { Icon: Package,       color: 'bg-orange-50 text-orange-600 border-orange-100'},
  'Maintenance':        { Icon: Wrench,        color: 'bg-rose-50 text-rose-600 border-rose-100'      },
  'Other':              { Icon: MoreHorizontal,color: 'bg-slate-50 text-slate-600 border-slate-200'   },
}
const getCat = (c) => CAT_META[c] || CAT_META['Other']

const empty = () => ({ date: today(), category: EXPENSE_CATEGORIES[0], description: '', amount: '' })

export default function Expenses() {
  const [rows, setRows]     = useState([])
  const [month, setMonth]   = useState(thisMonth())
  const [form, setForm]     = useState(empty())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [showForm, setShowForm] = useState(false)

  const load = async (m) => { setLoading(true); setRows(await getExpenses(m)); setLoading(false) }
  useEffect(() => { load(month) }, [month])

  const monthTotal = sum(rows, 'amount')

  // Group by category for summary
  const byCategory = useMemo(() => {
    const map = {}
    for (const r of rows) {
      map[r.category] = (map[r.category] || 0) + Number(r.amount || 0)
    }
    return Object.entries(map).sort(([, a], [, b]) => b - a)
  }, [rows])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount) return
    setSaving(true)
    await addExpense({ date: form.date, category: form.category, description: form.description.trim(), amount: Number(form.amount) })
    setForm((f) => ({ ...empty(), date: f.date, category: f.category }))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setShowForm(false)
    if (form.date.slice(0, 7) === month) load(month)
    else setMonth(form.date.slice(0, 7))
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this expense?')) return
    await deleteExpense(id)
    load(month)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Expenses</h2>
          <p className="text-sm text-slate-400 mt-0.5">Bills, costs &amp; overheads</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="month" value={month} onChange={e => setMonth(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-400" />
          <button onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
            <Plus size={15} /> Add Expense
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="col-span-2 sm:col-span-1 bg-rose-500 rounded-2xl px-4 py-4 flex items-center gap-3">
          <TrendingDown size={20} className="text-white/70 shrink-0" />
          <div>
            <p className="text-white/70 text-[11px] font-medium">{monthLabel(month)}</p>
            <p className="text-white text-xl font-black">{rs(monthTotal)}</p>
          </div>
        </div>
        {byCategory.slice(0, 3).map(([cat, amt]) => {
          const { Icon, color } = getCat(cat)
          return (
            <div key={cat} className="bg-white border border-slate-100 rounded-2xl px-4 py-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-slate-400 text-[11px] font-medium truncate">{cat}</p>
                <p className="text-slate-900 text-base font-black">{rs(amt)}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={onSubmit}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <p className="font-black text-slate-800 text-sm">New Expense</p>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xs font-semibold">Cancel</button>
            </div>
            <div className="p-5 grid sm:grid-cols-12 gap-3">
              {/* Date */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-slate-50" />
              </div>
              {/* Category */}
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-slate-50 appearance-none">
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Description */}
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:border-brand-400 focus-within:bg-white transition-colors">
                  <FileText size={13} className="text-slate-400 shrink-0" />
                  <input type="text" placeholder="e.g. June electricity meter #123" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-slate-400" />
                </div>
              </div>
              {/* Amount + Submit */}
              <div className="sm:col-span-2 flex flex-col justify-end gap-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount (Rs)</label>
                <input type="number" min="0" required placeholder="0"
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-slate-50 text-right" />
              </div>
              <div className="sm:col-span-12 flex justify-end pt-1">
                <button type="submit" disabled={saving || saved}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-200
                    ${saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'} disabled:opacity-50`}>
                  {saved ? <><Check size={14} /> Saved!</> : saving ? 'Saving…' : <><Check size={14} /> Save Expense</>}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Expense list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-[3px] border-rose-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <TrendingDown size={28} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No expenses for {monthLabel(month)}.</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-brand-500 text-sm font-bold hover:text-brand-400 transition-colors">
            + Add first expense
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Category</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-1 text-right">Amount</div>
            <div className="col-span-1" />
          </div>

          <div className="divide-y divide-slate-50">
            <AnimatePresence>
              {rows.map((x) => {
                const { Icon, color } = getCat(x.category)
                return (
                  <motion.div key={x.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-slate-50 transition-colors group">
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-slate-600">{x.date}</p>
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${color}`}>
                        <Icon size={13} />
                      </div>
                      <p className="text-sm font-semibold text-slate-700 truncate">{x.category}</p>
                    </div>
                    <div className="col-span-5">
                      <p className="text-sm text-slate-500 truncate">{x.description || '—'}</p>
                    </div>
                    <div className="col-span-1 text-right">
                      <p className="text-sm font-black text-rose-600">{rs(x.amount)}</p>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button onClick={() => onDelete(x.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Footer total */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">{rows.length} entries · {monthLabel(month)}</p>
            <p className="text-base font-black text-rose-600">{rs(monthTotal)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
