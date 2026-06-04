import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  addPhysicalOrder, getPhysicalOrders,
  updatePhysicalOrderStatus, deletePhysicalOrder,
  convertPhysicalOrderToSales, listRates, seedDefaultRates,
} from '../lib/db'
import { rs, today } from '../lib/format'
import { Link } from 'react-router-dom'
import {
  Plus, Minus, Trash2, CheckCircle, ChevronDown, X,
  Phone, User, FileText, ShoppingBag, ClipboardList,
  Scissors, Layers, PenLine, Check, Clock, AlertCircle, XCircle,
  Zap, Package, ArrowRight, ShoppingCart, Banknote, Smartphone, Calendar,
} from 'lucide-react'

// ── Category colours ──────────────────────────────────────────────────────────
const CAT_CONFIG = {
  Card:    { bg: 'from-amber-400/90 to-orange-400/90',    light: 'from-amber-50 to-orange-50',    border: 'border-amber-200', dot: 'bg-amber-400',   text: 'text-amber-700',   shine: 'from-white/40' },
  Paper:   { bg: 'from-sky-400/90 to-blue-500/90',        light: 'from-sky-50 to-blue-50',        border: 'border-sky-200',   dot: 'bg-sky-400',     text: 'text-sky-700',     shine: 'from-white/40' },
  Sticker: { bg: 'from-fuchsia-400/90 to-purple-500/90',  light: 'from-fuchsia-50 to-purple-50',  border: 'border-fuchsia-200', dot: 'bg-fuchsia-400', text: 'text-fuchsia-700', shine: 'from-white/40' },
  Other:   { bg: 'from-slate-500/90 to-slate-600/90',     light: 'from-slate-50 to-gray-100',     border: 'border-slate-200', dot: 'bg-slate-400',   text: 'text-slate-700',   shine: 'from-white/30' },
}
const getCfg = (c) => CAT_CONFIG[c] || CAT_CONFIG.Other

// ── Addon config ──────────────────────────────────────────────────────────────
const LAMINATION_OPTS = [
  { id: 'none',  label: 'None' },
  { id: 'matte', label: 'Matte' },
  { id: 'shine', label: 'Shine' },
]
const PLOTTER_OPTS = [
  { id: 'none',      label: 'None' },
  { id: 'full_cut',  label: 'Full Cut' },
  { id: 'half_cut',  label: 'Half Cut' },
]

const STATUS_META = {
  pending:       { label: 'Pending',     cls: 'bg-amber-100 text-amber-700 border-amber-200',       Icon: Clock },
  'in-progress': { label: 'In Progress', cls: 'bg-blue-100 text-blue-700 border-blue-200',           Icon: AlertCircle },
  completed:     { label: 'Completed',   cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', Icon: CheckCircle },
  cancelled:     { label: 'Cancelled',   cls: 'bg-red-100 text-red-600 border-red-200',             Icon: XCircle },
}

// ── Glossy Product Card ───────────────────────────────────────────────────────
function ProductCard({ rate, onAdd }) {
  const cfg = getCfg(rate.category)
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onAdd(rate)}
      className={`relative w-full text-left bg-gradient-to-br ${cfg.light} border ${cfg.border}
                  rounded-2xl p-3.5 shadow-sm hover:shadow-lg transition-all duration-200 group overflow-hidden`}
    >
      {/* Glossy shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/10 to-transparent pointer-events-none rounded-2xl" />
      <div className="absolute top-0 left-0 right-0 h-px bg-white/90 rounded-t-2xl" />
      <div className={`absolute top-0 left-0 bottom-0 w-[3px] rounded-l-2xl bg-gradient-to-b ${cfg.bg}`} />

      <div className="relative pl-1">
        <p className="font-black text-slate-800 text-sm leading-tight">{rate.name}</p>
        {rate.detail && <p className="text-[11px] text-slate-400 mt-0.5">{rate.detail}</p>}
        <p className={`font-black text-lg mt-2 ${cfg.text}`}>{rs(rate.price)}<span className="text-xs font-semibold text-slate-400 ml-0.5">/sheet</span></p>
      </div>

      <div className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-gradient-to-br ${cfg.bg}
                      flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md`}>
        <Plus size={12} className="text-white" />
      </div>
    </motion.button>
  )
}

// ── Cart Row ──────────────────────────────────────────────────────────────────
function CartRow({ item, onQty, onDiscount, onRemove }) {
  const sub   = item.qty * item.unitPrice
  const total = sub - (item.discount || 0)
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm space-y-2">
      {/* Row 1: name + remove */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 leading-tight truncate">{item.product}</p>
          <p className="text-[11px] text-slate-400">{rs(item.unitPrice)} / sheet</p>
        </div>
        <button onClick={onRemove} className="text-slate-300 hover:text-red-400 transition-colors shrink-0 mt-0.5">
          <X size={13} />
        </button>
      </div>

      {/* Row 2: qty | disc + total */}
      <div className="flex items-center gap-2">
        {/* Qty stepper */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 shrink-0">
          <button onClick={() => onQty(Math.max(1, item.qty - 1))}
            className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center text-slate-600">
            <Minus size={10} />
          </button>
          <input
            type="number" min="1"
            value={item.qty}
            onChange={e => onQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-9 text-center text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
          />
          <button onClick={() => onQty(item.qty + 1)}
            className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center text-slate-600">
            <Plus size={10} />
          </button>
        </div>

        {/* Discount */}
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-[9px] text-slate-400 font-bold shrink-0">DISC</span>
          <input
            type="number" min="0"
            value={item.discount || ''}
            onChange={e => onDiscount(Number(e.target.value) || 0)}
            placeholder="0"
            className="w-full text-xs text-right border border-slate-200 rounded-lg px-2 py-1.5
                       focus:outline-none focus:border-brand-400 bg-slate-50 focus:bg-white min-w-0"
          />
        </div>

        {/* Total */}
        <div className="text-right shrink-0">
          {item.discount > 0 && <p className="text-[9px] text-slate-400 line-through">{rs(sub)}</p>}
          <p className="text-sm font-black text-slate-900">{rs(total)}</p>
        </div>
      </div>
    </div>
  )
}

// ── Addon pill selector ───────────────────────────────────────────────────────
function AddonPills({ label, icon: Icon, opts, value, onChange, price, onPrice }) {
  const active = value !== 'none'
  return (
    <div className={`rounded-xl border p-3 transition-colors duration-200 min-w-0
      ${active ? 'border-brand-300 bg-brand-50/50' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon size={13} className={active ? 'text-brand-500' : 'text-slate-400'} />
        <span className="text-xs font-bold text-slate-700">{label}</span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {opts.map(opt => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
              ${value === opt.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {active && (
        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-[10px] text-slate-400 font-bold shrink-0">PRICE</span>
          <input
            type="number" min="0"
            value={price}
            onChange={e => onPrice(e.target.value)}
            placeholder="Rs."
            className="w-full text-sm border border-slate-200 rounded-lg px-2.5 py-1.5
                       focus:outline-none focus:border-brand-400 bg-white min-w-0"
          />
        </div>
      )}
    </div>
  )
}

// ── History Card ──────────────────────────────────────────────────────────────
function HistoryCard({ order, onRefresh }) {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [converting, setConverting] = useState(false)
  const meta    = STATUS_META[order.status] || STATUS_META.pending
  const balance = (order.total || 0) - (order.advance || 0)

  const handleConvert = async () => {
    if (!confirm('Mark as completed and add to sales?')) return
    setConverting(true)
    await convertPhysicalOrderToSales(order).catch(console.error)
    setConverting(false)
    onRefresh()
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-black text-slate-600 shadow-inner">
            {(order.customerName || '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
            {order.phone && <p className="text-xs text-slate-400">{order.phone}</p>}
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(v => !v)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${meta.cls}`}>
            <meta.Icon size={10} /> {meta.label} <ChevronDown size={9} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden min-w-[130px]">
                  {Object.entries(STATUS_META).map(([k, m]) => (
                    <button key={k} onClick={async () => { await updatePhysicalOrderStatus(order.id, k); setMenuOpen(false); onRefresh() }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-left">
                      <m.Icon size={11} /> {m.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-4 pb-3 space-y-1">
        {(order.items || []).map((it, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="text-slate-500 truncate">{it.product}{it.qty > 1 ? ` ×${it.qty}` : ''}</span>
            <span className="font-semibold text-slate-700 shrink-0 ml-2">{rs(it.lineTotal)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/60 flex items-center justify-between gap-2 rounded-b-2xl">
        <div>
          <span className="text-sm font-black text-slate-900">{rs(order.total)}</span>
          {order.advance > 0 && <span className="ml-2 text-[11px] text-emerald-600 font-semibold">adv {rs(order.advance)}</span>}
          {balance > 0 && order.advance > 0 && <span className="ml-1 text-[11px] text-amber-600 font-semibold">due {rs(balance)}</span>}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <p className="text-[10px] text-slate-400">{order.date}</p>

            {/* Method badge */}
            {order.paymentMethod && (
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                ${order.paymentMethod === 'online' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {order.paymentMethod === 'online'
                  ? <><Smartphone size={9} /> Online</>
                  : <><Banknote size={9} /> Cash</>}
              </span>
            )}

            {/* Payment status badge */}
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full
              ${order.paymentStatus === 'pending'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-700'}`}>
              {order.paymentStatus === 'pending'
                ? <><Clock size={9} /> Pending</>
                : <><Check size={9} /> Paid</>}
            </span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {order.status !== 'completed' && (
            <button onClick={handleConvert} disabled={converting}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-500 hover:bg-brand-400 text-white transition-colors disabled:opacity-50">
              <Check size={11} /> {converting ? '…' : 'Done → Sale'}
            </button>
          )}
          <button onClick={() => { if (confirm('Delete?')) deletePhysicalOrder(order.id).then(onRefresh) }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      {order.note && (
        <div className="px-4 pb-3 -mt-1">
          <p className="text-[11px] text-slate-400 bg-white rounded-lg px-2.5 py-1.5 border border-slate-100 flex items-start gap-1.5">
            <FileText size={11} className="shrink-0 mt-0.5" />{order.note}
          </p>
        </div>
      )}
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PhysicalOrders() {
  const [rates, setRates]     = useState([])
  const [orders, setOrders]   = useState([])
  const [view, setView]       = useState('pos')
  const [mobileTab, setMobileTab] = useState('catalog') // 'catalog' | 'cart'
  const [seeding, setSeeding] = useState(false)
  const [loading, setLoading] = useState(true)

  // Cart
  const [cartItems, setCartItems]   = useState([])
  const [manualItems, setManualItems] = useState([])
  const [manual, setManual]         = useState({ label: '', price: '' })
  const [ownMat, setOwnMat]         = useState({ label: '', printCost: '' })
  const [lamination, setLamination] = useState({ type: 'none', price: '' })
  const [plotter, setPlotter]       = useState({ type: 'none', price: '' })
  const [customer, setCustomer]     = useState({ name: '', phone: '', date: today(), note: '', advance: '' })
  const [payMethod, setPayMethod]   = useState('cash')   // 'cash' | 'online'
  const [payStatus, setPayStatus]   = useState('paid')   // 'paid' | 'pending'
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([listRates(), getPhysicalOrders()])
      .then(([r, o]) => { setRates(r); setOrders(o) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleSeedRates = async () => {
    setSeeding(true)
    await seedDefaultRates().catch(console.error)
    await load()
    setSeeding(false)
  }

  const grouped = rates.reduce((acc, r) => {
    const cat = r.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(r)
    return acc
  }, {})

  // Cart ops
  const addToCart = (rate) => {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.rateId === rate.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 }
        return next
      }
      return [...prev, { rateId: rate.id, product: rate.name, qty: 1, unitPrice: rate.price, discount: 0 }]
    })
  }

  const updCart = (idx, key, val) => setCartItems(prev => {
    const next = [...prev]; next[idx] = { ...next[idx], [key]: val }; return next
  })
  const remCart = (idx) => setCartItems(prev => prev.filter((_, i) => i !== idx))

  const addManual = () => {
    if (!manual.label.trim() || !manual.price) return
    setManualItems(prev => [...prev, { product: manual.label, qty: 1, unitPrice: Number(manual.price), discount: 0 }])
    setManual({ label: '', price: '' })
  }

  // Totals
  const cartTotal   = cartItems.reduce((s, i) => s + i.qty * i.unitPrice - (i.discount || 0), 0)
  const manualTotal = manualItems.reduce((s, i) => s + i.qty * i.unitPrice - (i.discount || 0), 0)
  const lamPrice    = lamination.type !== 'none' && lamination.price ? Number(lamination.price) : 0
  const plotPrice   = plotter.type !== 'none' && plotter.price ? Number(plotter.price) : 0
  const grandTotal  = cartTotal + manualTotal + lamPrice + plotPrice
  const advance     = Number(customer.advance) || 0
  const balance     = grandTotal - advance

  const addOwnMat = () => {
    if (!ownMat.label.trim() || !ownMat.printCost) return
    setManualItems(prev => [...prev, {
      product: `Own Material — ${ownMat.label.trim()}`,
      qty: 1,
      unitPrice: Number(ownMat.printCost),
      discount: 0,
      note: 'Customer brought own material',
    }])
    setOwnMat({ label: '', printCost: '' })
  }

  const resetCart = () => {
    setCartItems([]); setManualItems([])
    setLamination({ type: 'none', price: '' })
    setPlotter({ type: 'none', price: '' })
    setCustomer({ name: '', phone: '', date: today(), note: '', advance: '' })
    setManual({ label: '', price: '' })
    setOwnMat({ label: '', printCost: '' })
    setPayMethod('cash')
    setPayStatus('paid')
  }

  const handleSave = async () => {
    if (!customer.name.trim()) return alert('Customer name is required.')
    const allItems = [
      ...cartItems.map(i => ({ product: i.product, qty: i.qty, unitPrice: i.unitPrice, discount: i.discount || 0, lineTotal: i.qty * i.unitPrice - (i.discount || 0) })),
      ...manualItems.map(i => ({ product: i.product, qty: i.qty, unitPrice: i.unitPrice, discount: i.discount || 0, lineTotal: i.qty * i.unitPrice - (i.discount || 0) })),
      ...(lamPrice > 0 ? [{ product: `Lamination — ${lamination.type === 'matte' ? 'Matte' : 'Shine'}`, qty: 1, unitPrice: lamPrice, discount: 0, lineTotal: lamPrice }] : []),
      ...(plotPrice > 0 ? [{ product: `Plotter — ${plotter.type === 'full_cut' ? 'Full Cut' : 'Half Cut'}`, qty: 1, unitPrice: plotPrice, discount: 0, lineTotal: plotPrice }] : []),
    ]
    if (!allItems.length) return alert('Add at least one item.')
    setSaving(true)
    try {
      await addPhysicalOrder({ customerName: customer.name.trim(), phone: customer.phone.trim(), date: customer.date, note: customer.note.trim(), advance, items: allItems, total: grandTotal, paymentMethod: payMethod, paymentStatus: payStatus })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      resetCart(); load()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const totalItems = cartItems.length + manualItems.length + (lamPrice > 0 ? 1 : 0) + (plotPrice > 0 ? 1 : 0)
  const pendingCount        = orders.filter(o => o.status === 'pending').length
  const paymentPendingCount = orders.filter(o => o.paymentStatus === 'pending').length

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-[1400px] mx-auto">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Counter Orders</h2>
          <p className="text-sm text-slate-400 mt-0.5">POS · Walk-in & phone orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('pos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
              ${view === 'pos' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
            <ShoppingBag size={14} /> POS
          </button>
          <button onClick={() => setView('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
              ${view === 'history' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
            <ClipboardList size={14} /> History
            {pendingCount > 0 && <span className="bg-amber-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
          </button>
        </div>
      </div>

      {/* ── POS ──────────────────────────────────────────────────────────────── */}
      {view === 'pos' && (
        <>
        {/* Mobile tab switcher */}
        <div className="flex lg:hidden gap-2 mb-3">
          <button onClick={() => setMobileTab('catalog')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all
              ${mobileTab === 'catalog' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            <Package size={14} /> Products
          </button>
          <button onClick={() => setMobileTab('cart')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all
              ${mobileTab === 'cart' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            <ShoppingCart size={14} />
            Order
            {totalItems > 0 && (
              <span className="bg-brand-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{totalItems}</span>
            )}
          </button>
        </div>

        <div className="flex gap-4 lg:h-[calc(100vh-170px)]">

          {/* LEFT — catalog */}
          <div className={`flex-1 overflow-y-auto space-y-6 pb-4 pr-1 ${mobileTab === 'cart' ? 'hidden lg:block' : ''}`}>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-7 h-7 border-[3px] border-brand-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : Object.keys(grouped).length === 0 ? (
              /* ── Empty state ── */
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Package size={28} className="text-slate-300" />
                </div>
                <div>
                  <p className="text-slate-700 font-bold text-sm">Rate List is empty</p>
                  <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto leading-relaxed">
                    Load the default Inksetters rate list, or add products manually from the Rate List page.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleSeedRates}
                    disabled={seeding}
                    className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white
                               text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {seeding ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : <Zap size={14} />}
                    {seeding ? 'Loading…' : 'Load Default Rates'}
                  </button>
                  <Link to="/admin/rates"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                    Manage Rate List <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              Object.entries(grouped).map(([cat, products]) => {
                const cfg = getCfg(cat)
                return (
                  <div key={cat}>
                    {/* Category heading */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-8 px-3.5 rounded-xl bg-gradient-to-r ${cfg.bg} flex items-center gap-2 shadow-sm`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                        <span className="text-white text-xs font-black uppercase tracking-[0.15em]">{cat}</span>
                      </div>
                      <div className="flex-1 h-px bg-slate-100" />
                      <span className="text-xs text-slate-400 font-medium">{products.length} items</span>
                    </div>
                    {/* Product cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {products.map(r => <ProductCard key={r.id} rate={r} onAdd={addToCart} />)}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* RIGHT — order panel */}
          <div className={`w-full lg:w-[310px] xl:w-[340px] shrink-0 flex flex-col rounded-2xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden min-w-0
                           ${mobileTab === 'catalog' ? 'hidden lg:flex' : 'flex'}`}>

            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
              <div>
                <p className="text-sm font-black text-slate-800">Order</p>
                <p className="text-[11px] text-slate-400">{totalItems} item{totalItems !== 1 ? 's' : ''} · {rs(grandTotal)}</p>
              </div>
              {totalItems > 0 && (
                <button onClick={resetCart} className="text-xs text-slate-400 hover:text-red-500 font-semibold transition-colors flex items-center gap-1">
                  <X size={11} /> Clear
                </button>
              )}
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-2.5">

              {/* Cart items */}
              <AnimatePresence>
                {cartItems.map((item, i) => (
                  <motion.div key={item.rateId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <CartRow
                      item={item}
                      onQty={v => updCart(i, 'qty', v)}
                      onDiscount={v => updCart(i, 'discount', v)}
                      onRemove={() => remCart(i)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Manual items */}
              {manualItems.map((item, i) => (
                <CartRow key={`m${i}`} item={item}
                  onQty={v => setManualItems(p => { const n=[...p]; n[i]={...n[i],qty:v}; return n })}
                  onDiscount={v => setManualItems(p => { const n=[...p]; n[i]={...n[i],discount:v}; return n })}
                  onRemove={() => setManualItems(p => p.filter((_,j) => j!==i))}
                />
              ))}

              {totalItems === 0 && (
                <div className="text-center py-8">
                  <Zap size={26} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Tap a product card to add</p>
                </div>
              )}

              {/* ── Addons ── */}
              <div className="space-y-2 pt-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-0.5">Add-on Services</p>

                <AddonPills
                  label="Lamination" icon={Layers}
                  opts={LAMINATION_OPTS}
                  value={lamination.type}
                  onChange={t => setLamination(a => ({ ...a, type: t, price: t === 'none' ? '' : a.price }))}
                  price={lamination.price}
                  onPrice={p => setLamination(a => ({ ...a, price: p }))}
                />

                <AddonPills
                  label="Plotter Cutting" icon={Scissors}
                  opts={PLOTTER_OPTS}
                  value={plotter.type}
                  onChange={t => setPlotter(a => ({ ...a, type: t, price: t === 'none' ? '' : a.price }))}
                  price={plotter.price}
                  onPrice={p => setPlotter(a => ({ ...a, price: p }))}
                />
              </div>

              {/* ── Own Material ── */}
              <div className="pt-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-0.5 mb-2">Customer's Own Material</p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2 min-w-0">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Package size={12} className="text-amber-600" />
                    </div>
                    <p className="text-[11px] text-amber-700 font-semibold leading-snug">
                      Customer's own material — only printing cost charged.
                    </p>
                  </div>
                  <input
                    value={ownMat.label}
                    onChange={e => setOwnMat(m => ({ ...m, label: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addOwnMat()}
                    placeholder="Material description (e.g. A4 Art Card)"
                    className="w-full text-xs border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 bg-white placeholder:text-slate-400"
                  />
                  <div className="flex gap-2 min-w-0">
                    <input
                      type="number" min="0"
                      value={ownMat.printCost}
                      onChange={e => setOwnMat(m => ({ ...m, printCost: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addOwnMat()}
                      placeholder="Print cost (Rs.)"
                      className="flex-1 text-xs border border-amber-200 rounded-lg px-2.5 py-2
                                 focus:outline-none focus:border-amber-400 bg-white min-w-0"
                    />
                    <button
                      onClick={addOwnMat}
                      className="w-9 h-9 bg-amber-500 hover:bg-amber-400 text-white rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Manual item ── */}
              <div className="pt-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-0.5 mb-2">Custom Item</p>
                <div className="flex gap-2">
                  <input value={manual.label} onChange={e => setManual(m => ({ ...m, label: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addManual()}
                    placeholder="Item name"
                    className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-400 bg-white" />
                  <input type="number" min="0" value={manual.price} onChange={e => setManual(m => ({ ...m, price: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addManual()}
                    placeholder="Rs"
                    className="w-16 text-xs border border-slate-200 rounded-xl px-2 py-2 focus:outline-none focus:border-brand-400 text-right bg-white" />
                  <button onClick={addManual}
                    className="w-8 h-8 bg-slate-900 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Customer + Totals ── */}
            <div className="border-t border-slate-200 bg-white px-3 py-3 space-y-2.5 shrink-0 min-w-0">

              {/* Inputs */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-brand-400 focus-within:bg-white transition-colors">
                  <User size={12} className="text-slate-400 shrink-0" />
                  <input value={customer.name} onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))}
                    placeholder="Customer name *"
                    className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-slate-400" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-brand-400 focus-within:bg-white transition-colors">
                    <Phone size={12} className="text-slate-400 shrink-0" />
                    <input value={customer.phone} onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))}
                      placeholder="Phone"
                      className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-slate-400 min-w-0" />
                  </div>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-brand-400 focus-within:bg-white transition-colors">
                    <PenLine size={12} className="text-slate-400 shrink-0" />
                    <input type="number" min="0" value={customer.advance} onChange={e => setCustomer(c => ({ ...c, advance: e.target.value }))}
                      placeholder="Advance"
                      className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-slate-400 min-w-0" />
                  </div>
                </div>
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-brand-400 focus-within:bg-white transition-colors">
                  <Calendar size={12} className="text-slate-400 shrink-0" />
                  <input
                    type="date"
                    value={customer.date}
                    onChange={e => setCustomer(c => ({ ...c, date: e.target.value }))}
                    className="flex-1 text-sm bg-transparent focus:outline-none text-slate-700 min-w-0"
                  />
                </div>
                <div className="flex items-start gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-brand-400 focus-within:bg-white transition-colors">
                  <FileText size={12} className="text-slate-400 shrink-0 mt-0.5" />
                  <textarea value={customer.note} onChange={e => setCustomer(c => ({ ...c, note: e.target.value }))}
                    rows={1} placeholder="Design note / deadline…"
                    className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-slate-400 resize-none" />
                </div>
              </div>

              {/* Payment method + status */}
              <div className="space-y-2.5">
                {/* Method: Cash / Online */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'cash',   label: 'Cash',   Icon: Banknote },
                      { id: 'online', label: 'Online', Icon: Smartphone },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setPayMethod(opt.id)}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold
                                    border transition-all duration-200
                                    ${payMethod === opt.id
                                      ? opt.id === 'cash'
                                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200'
                                        : 'bg-blue-500 text-white border-blue-500 shadow-sm shadow-blue-200'
                                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                    }`}
                      >
                        <opt.Icon size={15} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status: Paid / Pending */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'paid',    label: 'Paid',    Icon: Check,  activeClass: 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200' },
                      { id: 'pending', label: 'Pending', Icon: Clock,  activeClass: 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-200' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setPayStatus(opt.id)}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold
                                    border transition-all duration-200
                                    ${payStatus === opt.id
                                      ? opt.activeClass
                                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                    }`}
                      >
                        <opt.Icon size={15} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Totals breakdown */}
              <div className="bg-slate-50 rounded-xl px-3 py-2.5 space-y-1.5 border border-slate-100">
                {lamPrice > 0 && (
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Lamination ({lamination.type})</span><span className="font-semibold">{rs(lamPrice)}</span>
                  </div>
                )}
                {plotPrice > 0 && (
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Plotter ({plotter.type === 'full_cut' ? 'Full Cut' : 'Half Cut'})</span><span className="font-semibold">{rs(plotPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-slate-900 text-base border-t border-slate-200 pt-1.5 mt-1">
                  <span>Total</span><span>{rs(grandTotal)}</span>
                </div>
                {advance > 0 && (
                  <div className="flex justify-between text-xs font-semibold text-emerald-600">
                    <span>Advance paid</span><span>− {rs(advance)}</span>
                  </div>
                )}
                {balance > 0 && advance > 0 && (
                  <div className="flex justify-between text-sm font-black text-amber-600">
                    <span>Balance due</span><span>{rs(balance)}</span>
                  </div>
                )}
              </div>

              {/* Save */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={saving || saved}
                className={`w-full py-3 rounded-xl text-sm font-black transition-all duration-300 shadow-sm
                  ${saved
                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                    : 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-md disabled:opacity-50'}`}
              >
                {saved
                  ? <span className="flex items-center justify-center gap-2"><Check size={15} /> Order Saved!</span>
                  : saving ? 'Saving…' : 'Save Counter Order'}
              </motion.button>
            </div>
          </div>
        </div>{/* end flex row */}
        </>
      )}

      {/* ── HISTORY ────────────────────────────────────────────────────────── */}
      {view === 'history' && (
        <div className="space-y-4">

          {/* Payment pending alert */}
          {paymentPendingCount > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <Clock size={18} className="text-amber-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-800">
                  {paymentPendingCount} order{paymentPendingCount > 1 ? 's' : ''} with payment pending
                </p>
                <p className="text-xs text-amber-600">These customers still owe payment — look for the amber "Pending" badge below.</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-[3px] border-brand-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <ClipboardList size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No orders yet — switch to POS to create one.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {orders.map(o => <HistoryCard key={o.id} order={o} onRefresh={load} />)}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
