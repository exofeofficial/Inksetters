import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { listRates, getSales, addSaleOrder, deleteSale } from '../lib/db'
import { rs, today, thisMonth, monthLabel } from '../lib/format'
import {
  Plus, Trash2, ChevronDown, ChevronRight, User,
  FileText, Check, TrendingUp, ShoppingBag,
} from 'lucide-react'

// ── helpers ──────────────────────────────────────────────────────────────────
const blankItem = (rates) => ({
  product:   rates[0]?.name  || '',
  unitPrice: rates[0]?.price || 0,
  qty:       1,
  discount:  0,
})

function lineTotal(it) {
  return Math.max(0, Number(it.qty) * Number(it.unitPrice) - Number(it.discount))
}

// Group flat array of sale docs by date (newest date first)
function groupByDate(sales) {
  const map = {}
  for (const s of sales) {
    const d = s.date || '—'
    if (!map[d]) map[d] = []
    map[d].push(s)
  }
  return Object.entries(map).sort(([a], [b]) => (b > a ? 1 : -1))
}

// ── Sale Order Card ───────────────────────────────────────────────────────────
function SaleCard({ sale, onDelete }) {
  // Support both new grouped (type:'order' with items[]) and legacy single-item
  const items = sale.items || [{
    product: sale.product, qty: sale.qty,
    unitPrice: sale.unitPrice, discount: sale.discount,
    lineTotal: sale.total,
  }]
  const total = sale.total || items.reduce((s, i) => s + (i.lineTotal || 0), 0)

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
            <User size={14} className="text-brand-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{sale.customerName || 'Walk-in'}</p>
            {sale.note && <p className="text-[11px] text-slate-400">{sale.note}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-black text-brand-600">{rs(total)}</span>
          <button
            onClick={() => { if (confirm('Delete this sale?')) onDelete(sale.id) }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-slate-50">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center justify-between px-4 py-2.5 gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 font-medium truncate">{it.product}</p>
              <p className="text-[11px] text-slate-400">
                {it.qty} × {rs(it.unitPrice)}
                {it.discount > 0 && <span className="ml-1.5 text-amber-500">−{rs(it.discount)} disc</span>}
              </p>
            </div>
            <p className="text-sm font-bold text-slate-900 shrink-0">
              {rs(it.lineTotal ?? lineTotal(it))}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Date Accordion ────────────────────────────────────────────────────────────
function DateGroup({ date, sales, onDelete }) {
  const [open, setOpen] = useState(true)
  const dayTotal = sales.reduce((s, x) => s + (x.total || 0), 0)

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      {/* Date header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={16} className="text-slate-400" />
          </motion.div>
          <p className="text-sm font-black text-slate-800">
            {new Date(date + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">{sales.length} {sales.length === 1 ? 'sale' : 'sales'}</span>
        </div>
        <span className="text-base font-black text-brand-600">{rs(dayTotal)}</span>
      </button>

      {/* Sales */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3 bg-slate-50 border-t border-slate-100">
              {sales.map(s => (
                <SaleCard key={s.id} sale={s} onDelete={onDelete} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Sales() {
  const [rates, setRates]   = useState([])
  const [sales, setSales]   = useState([])
  const [month, setMonth]   = useState(thisMonth())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [date, setDate]               = useState(today())
  const [customerName, setCustomerName] = useState('')
  const [note, setNote]               = useState('')
  const [items, setItems]             = useState([])

  const loadSales = async (m) => {
    setLoading(true)
    setSales(await getSales(m))
    setLoading(false)
  }

  useEffect(() => {
    listRates().then(r => { setRates(r); setItems([blankItem(r)]) })
  }, [])
  useEffect(() => { loadSales(month) }, [month])

  // Item ops
  const setItemField = (idx, key, val) =>
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [key]: val } : it))

  const onProduct = (idx, name) => {
    const r = rates.find(x => x.name === name)
    setItemField(idx, 'product', name)
    if (r) setItemField(idx, 'unitPrice', r.price)
  }

  const addItem   = () => setItems(prev => [...prev, blankItem(rates)])
  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx))

  const grandTotal = useMemo(() => items.reduce((s, it) => s + lineTotal(it), 0), [items])
  const monthTotal = useMemo(() => sales.reduce((s, x) => s + (x.total || 0), 0), [sales])

  const resetForm = () => {
    setCustomerName(''); setNote(''); setDate(today())
    setItems([blankItem(rates)])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) return
    setSaving(true)
    await addSaleOrder({
      date,
      customerName: customerName.trim() || 'Walk-in',
      note: note.trim(),
      items: items.map(it => ({
        product:   it.product,
        qty:       Number(it.qty),
        unitPrice: Number(it.unitPrice),
        discount:  Number(it.discount),
        lineTotal: lineTotal(it),
      })),
      total: grandTotal,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    resetForm()
    setShowForm(false)
    if (date.slice(0, 7) === month) loadSales(month)
    else setMonth(date.slice(0, 7))
  }

  const onDelete = async (id) => {
    await deleteSale(id)
    loadSales(month)
  }

  const grouped = useMemo(() => groupByDate(sales), [sales])

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Sales</h2>
          <p className="text-sm text-slate-400 mt-0.5">Grouped by customer & date</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month" value={month}
            onChange={e => setMonth(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
          />
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <Plus size={15} /> New Sale
          </button>
        </div>
      </div>

      {/* Month summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-brand-500 rounded-2xl px-5 py-4 col-span-2 sm:col-span-1 flex items-center gap-4">
          <TrendingUp size={22} className="text-white/70 shrink-0" />
          <div>
            <p className="text-white/70 text-xs font-medium">{monthLabel(month)}</p>
            <p className="text-white text-2xl font-black">{rs(monthTotal)}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-4">
          <ShoppingBag size={20} className="text-slate-300 shrink-0" />
          <div>
            <p className="text-slate-400 text-xs font-medium">Total Sales</p>
            <p className="text-slate-900 text-xl font-black">{sales.length}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-4">
          <FileText size={20} className="text-slate-300 shrink-0" />
          <div>
            <p className="text-slate-400 text-xs font-medium">Days Active</p>
            <p className="text-slate-900 text-xl font-black">{grouped.length}</p>
          </div>
        </div>
      </div>

      {/* ── New Sale Form ── */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Form header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <p className="font-black text-slate-800 text-sm">New Sale Entry</p>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xs font-semibold">Cancel</button>
            </div>

            <div className="p-5 space-y-4">
              {/* Customer + Date + Note */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Customer Name</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:border-brand-400 focus-within:bg-white transition-colors">
                    <User size={13} className="text-slate-400 shrink-0" />
                    <input
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Ali Hassan"
                      className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    type="date" value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Note (optional)</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:border-brand-400 focus-within:bg-white transition-colors">
                    <FileText size={13} className="text-slate-400 shrink-0" />
                    <input
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Any notes…"
                      className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Items table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Items</p>
                  <button type="button" onClick={addItem}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-500 transition-colors">
                    <Plus size={12} /> Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                      {/* Product */}
                      <div className="col-span-12 sm:col-span-4">
                        <select
                          value={it.product}
                          onChange={e => onProduct(idx, e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400 bg-slate-50"
                        >
                          {rates.length === 0 && <option>— add rates first —</option>}
                          {rates.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                          <option value="__custom__">✏️ Custom item</option>
                        </select>
                        {it.product === '__custom__' && (
                          <input
                            autoFocus
                            placeholder="Item name"
                            className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
                            onChange={e => setItemField(idx, 'product', e.target.value)}
                          />
                        )}
                      </div>

                      {/* Qty */}
                      <div className="col-span-3 sm:col-span-2">
                        <input
                          type="number" min="1"
                          value={it.qty}
                          onChange={e => setItemField(idx, 'qty', e.target.value)}
                          placeholder="Qty"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400 bg-slate-50"
                        />
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-3 sm:col-span-2">
                        <input
                          type="number" min="0"
                          value={it.unitPrice}
                          onChange={e => setItemField(idx, 'unitPrice', e.target.value)}
                          placeholder="Price"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400 bg-slate-50"
                        />
                      </div>

                      {/* Discount */}
                      <div className="col-span-3 sm:col-span-2">
                        <input
                          type="number" min="0"
                          value={it.discount || ''}
                          onChange={e => setItemField(idx, 'discount', e.target.value)}
                          placeholder="Disc"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400 bg-slate-50"
                        />
                      </div>

                      {/* Line total + delete */}
                      <div className="col-span-3 sm:col-span-2 flex items-center justify-between gap-1">
                        <p className="text-sm font-black text-slate-900">{rs(lineTotal(it))}</p>
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(idx)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer — total + submit */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                  <p className="text-xl font-black text-slate-900">{rs(grandTotal)}</p>
                </div>
                <button
                  type="submit"
                  disabled={saving || saved || rates.length === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all duration-200
                    ${saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white hover:-translate-y-0.5'} disabled:opacity-50`}
                >
                  {saved ? <><Check size={15} /> Saved!</> : saving ? 'Saving…' : <><Check size={15} /> Save Sale</>}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ── Sales list grouped by date ── */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-[3px] border-brand-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : grouped.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <ShoppingBag size={28} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No sales for {monthLabel(month)}.</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-brand-500 text-sm font-bold hover:text-brand-400 transition-colors">
            + Add first sale
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {grouped.map(([date, daySales]) => (
            <DateGroup key={date} date={date} sales={daySales} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
