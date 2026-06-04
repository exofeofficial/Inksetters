import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { listRates, addRate, updateRate, deleteRate, seedDefaultRates } from '../lib/db'
import { rs } from '../lib/format'
import { Plus, Trash2, Zap, Check, Tag, Search } from 'lucide-react'

const CATEGORIES = ['Card', 'Paper', 'Sticker', 'Other']

const CAT_STYLE = {
  Card:    { bg: 'bg-amber-50',   border: 'border-amber-100', dot: 'bg-amber-400',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700'   },
  Paper:   { bg: 'bg-sky-50',     border: 'border-sky-100',   dot: 'bg-sky-400',     text: 'text-sky-700',     badge: 'bg-sky-100 text-sky-700'       },
  Sticker: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-100',dot:'bg-fuchsia-400', text: 'text-fuchsia-700', badge: 'bg-fuchsia-100 text-fuchsia-700'},
  Other:   { bg: 'bg-slate-50',   border: 'border-slate-200', dot: 'bg-slate-400',   text: 'text-slate-600',   badge: 'bg-slate-100 text-slate-600'   },
}
const getStyle = (c) => CAT_STYLE[c] || CAT_STYLE.Other

const empty = { name: '', detail: '', price: '', category: 'Card' }

// Inline price edit — saves on blur/Enter
function PriceCell({ rate, onSave }) {
  const [val, setVal] = useState(String(rate.price))
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(false)

  const commit = () => {
    if (!dirty) return
    onSave(rate.id, val)
    setDirty(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="flex items-center gap-1.5 justify-end">
      <span className="text-xs text-slate-400">Rs.</span>
      <input
        type="number" min="0"
        value={val}
        onChange={e => { setVal(e.target.value); setDirty(true); setSaved(false) }}
        onBlur={commit}
        onKeyDown={e => e.key === 'Enter' && commit()}
        className={`w-20 text-right text-sm font-bold rounded-xl px-2.5 py-1.5 border transition-colors focus:outline-none
          ${dirty ? 'border-brand-400 bg-brand-50' : 'border-slate-200 bg-white'}`}
      />
      <AnimatePresence>
        {saved && (
          <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Check size={14} className="text-emerald-500" />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Rates() {
  const [rates, setRates]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [seeding, setSeeding]   = useState(false)
  const [form, setForm]         = useState(empty)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch]     = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [saved, setSaved]       = useState(false)

  const load = async () => { setLoading(true); setRates(await listRates()); setLoading(false) }
  useEffect(() => { load() }, [])

  const filtered = rates.filter(r => {
    const matchCat  = filterCat === 'All' || r.category === filterCat
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // Group filtered by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter(r => r.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  const onAdd = async (e) => {
    e.preventDefault()
    if (!form.name || form.price === '') return
    await addRate({ ...form, price: Number(form.price) })
    setForm(empty)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setShowForm(false)
    load()
  }

  const onPriceChange = async (id, price) => {
    await updateRate(id, { price: Number(price) })
    setRates(prev => prev.map(r => r.id === id ? { ...r, price: Number(price) } : r))
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteRate(id)
    load()
  }

  const onSeed = async () => {
    if (!confirm('Load the default Inksetters rate list?')) return
    setSeeding(true)
    await seedDefaultRates()
    await load()
    setSeeding(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Rate List</h2>
          <p className="text-sm text-slate-400 mt-0.5">{rates.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          {rates.length === 0 && !loading && (
            <button onClick={onSeed} disabled={seeding}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-60">
              <Zap size={14} /> {seeding ? 'Loading…' : 'Load Default Rates'}
            </button>
          )}
          <button onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map(cat => {
          const count = rates.filter(r => r.category === cat).length
          const s = getStyle(cat)
          return (
            <button key={cat} onClick={() => setFilterCat(filterCat === cat ? 'All' : cat)}
              className={`rounded-2xl px-4 py-3.5 text-left border transition-all duration-200
                ${filterCat === cat ? `${s.bg} ${s.border} ring-2 ring-offset-1 ring-brand-400` : 'bg-white border-slate-100 hover:border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                <p className={`text-[11px] font-bold uppercase tracking-wider ${filterCat === cat ? s.text : 'text-slate-400'}`}>{cat}</p>
              </div>
              <p className="text-xl font-black text-slate-900">{count}</p>
              <p className="text-[11px] text-slate-400 font-medium">products</p>
            </button>
          )
        })}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={onAdd}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <p className="font-black text-slate-800 text-sm">Add New Product</p>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xs font-semibold">Cancel</button>
            </div>
            <div className="p-5 grid sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Product Name *</label>
                <input type="text" required placeholder="e.g. Art Card 13x19" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-slate-50 focus:bg-white transition-colors" />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Detail (gsm / size)</label>
                <input type="text" placeholder="e.g. 300gms" value={form.detail}
                  onChange={e => setForm({ ...form, detail: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-slate-50 focus:bg-white transition-colors" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-slate-50 appearance-none">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Price (Rs) *</label>
                <input type="number" min="0" required placeholder="0" value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-slate-50 text-right" />
              </div>
              <div className="sm:col-span-1 flex items-end">
                <button type="submit"
                  className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl py-2.5 text-sm transition-colors flex items-center justify-center gap-1">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Search + filter bar */}
      {rates.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[160px] border border-slate-200 rounded-xl px-3 py-2 bg-white focus-within:border-brand-400 transition-colors">
            <Search size={13} className="text-slate-400 shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
              className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-slate-400" />
          </div>
          <div className="flex gap-1.5">
            {['All', ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors
                  ${filterCat === cat ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-[3px] border-brand-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : rates.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center">
          <Tag size={28} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-600 font-bold text-sm mb-1">Rate List is empty</p>
          <p className="text-slate-400 text-xs mb-4">Load the default Inksetters rates or add manually.</p>
          <button onClick={onSeed} disabled={seeding}
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60">
            <Zap size={14} /> {seeding ? 'Loading…' : 'Load Default Rates'}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([cat, items]) => {
            const s = getStyle(cat)
            return (
              <div key={cat}>
                {/* Category heading */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                    <p className={`text-xs font-black uppercase tracking-[0.15em] ${s.text}`}>{cat}</p>
                  </div>
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{items.length} items</span>
                </div>

                {/* Product rows */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="divide-y divide-slate-50">
                    <AnimatePresence>
                      {items.map(r => (
                        <motion.div key={r.id}
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${s.bg} border ${s.border}`}>
                            <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{r.name}</p>
                            {r.detail && <p className="text-[11px] text-slate-400">{r.detail}</p>}
                          </div>
                          <PriceCell rate={r} onSave={onPriceChange} />
                          <button onClick={() => onDelete(r.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                            <Trash2 size={13} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-[11px] text-slate-400 text-center">
        Tip — click on any price to edit it, press Enter or click away to save.
      </p>
    </div>
  )
}
