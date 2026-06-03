import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getSales, getExpenses, getOrders, getPhysicalOrders } from '../lib/db'
import { rs, today, thisMonth, sum, monthLabel } from '../lib/format'
import {
  TrendingUp, TrendingDown, Receipt, Wallet,
  ShoppingCart, ArrowUpRight, Package, Layers,
  CircleDollarSign, AlertCircle, Banknote, Smartphone, CheckCircle,
} from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
})

export default function Dashboard() {
  const month = thisMonth()
  const [sales, setSales]           = useState([])
  const [expenses, setExpenses]     = useState([])
  const [orders, setOrders]         = useState([])
  const [physOrders, setPhysOrders] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([getSales(month), getExpenses(month), getOrders(), getPhysicalOrders()])
      .then(([s, e, o, p]) => { setSales(s); setExpenses(e); setOrders(o); setPhysOrders(p) })
      .finally(() => setLoading(false))
  }, [month])

  const todayStr   = today()
  const salesMonth = sum(sales, 'total')
  const expMonth   = sum(expenses, 'amount')
  const profit     = salesMonth - expMonth
  const salesToday = sum(sales.filter(s => s.date === todayStr), 'total')
  const pending    = orders.filter(o => o.status === 'pending').length

  // Payment breakdown from counter orders
  const cashOrders   = physOrders.filter(o => o.paymentMethod === 'cash'   || !o.paymentMethod)
  const onlineOrders = physOrders.filter(o => o.paymentMethod === 'online')
  const cashTotal    = cashOrders.reduce((s, o) => s + (o.total || 0), 0)
  const onlineTotal  = onlineOrders.reduce((s, o) => s + (o.total || 0), 0)
  const paymentsGrand = cashTotal + onlineTotal
  const onlinePct    = paymentsGrand > 0 ? Math.round((onlineTotal / paymentsGrand) * 100) : 0
  const cashPct      = paymentsGrand > 0 ? Math.round((cashTotal / paymentsGrand) * 100) : 0
  const profitPct  = salesMonth > 0 ? Math.round((profit / salesMonth) * 100) : 0

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 border-[3px] border-brand-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* ── Hero banner ── */}
      <motion.div
        {...fadeUp(0)}
        className="relative rounded-2xl overflow-hidden bg-slate-900 px-6 py-7 sm:px-8"
      >
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-64 h-32 bg-brand-500/20 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-28 bg-brand-500/10 blur-[50px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">
              {monthLabel(month)}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back!
            </h2>
            <p className="text-slate-400 text-sm mt-1">Here's what's happening with Inksetters today.</p>
          </div>

          {/* Today's quick stat */}
          <div className="shrink-0 bg-white/8 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">
            <p className="text-slate-400 text-xs font-medium mb-1">Today's Revenue</p>
            <p className="text-2xl font-black text-white">{rs(salesToday)}</p>
            <p className="text-slate-500 text-[11px] mt-0.5">{todayStr}</p>
          </div>
        </div>

        {/* Pending orders alert */}
        {pending > 0 && (
          <Link
            to="/admin/orders"
            className="relative mt-4 flex items-center justify-between gap-3
                       bg-amber-500/15 border border-amber-500/25 rounded-xl px-4 py-2.5
                       hover:bg-amber-500/20 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle size={15} className="text-amber-400 shrink-0" />
              <span className="text-amber-300 text-sm font-semibold">
                {pending} new order{pending > 1 ? 's' : ''} waiting for your review
              </span>
            </div>
            <ArrowUpRight size={14} className="text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        )}
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Monthly Sales */}
        <motion.div {...fadeUp(0.06)} className="col-span-2 sm:col-span-1 xl:col-span-1
          relative bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-5 overflow-hidden shadow-lg shadow-brand-500/20">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-4 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Wallet size={17} className="text-white" />
            </div>
            <p className="text-white/70 text-xs font-medium">Monthly Sales</p>
            <p className="text-white text-2xl font-black mt-0.5 tracking-tight">{rs(salesMonth)}</p>
            <p className="text-white/50 text-[11px] mt-1">{sales.length} transactions</p>
          </div>
        </motion.div>

        {/* Expenses */}
        <motion.div {...fadeUp(0.1)} className="relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-3xl" />
          <div className="relative">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center mb-4">
              <Receipt size={17} className="text-red-500" />
            </div>
            <p className="text-slate-400 text-xs font-medium">Expenses</p>
            <p className="text-slate-900 text-2xl font-black mt-0.5 tracking-tight">{rs(expMonth)}</p>
            <p className="text-slate-400 text-[11px] mt-1">{expenses.length} entries</p>
          </div>
        </motion.div>

        {/* Net Profit */}
        <motion.div {...fadeUp(0.13)} className={`relative rounded-2xl p-5 border shadow-sm overflow-hidden
          ${profit >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
          <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-20
            ${profit >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <div className="relative">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4
              ${profit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {profit >= 0
                ? <TrendingUp size={17} className="text-emerald-600" />
                : <TrendingDown size={17} className="text-red-500" />
              }
            </div>
            <p className={`text-xs font-medium ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>Net Profit</p>
            <p className={`text-2xl font-black mt-0.5 tracking-tight ${profit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {rs(profit)}
            </p>
            <div className={`inline-flex items-center gap-1 text-[11px] font-semibold mt-1 px-2 py-0.5 rounded-full
              ${profit >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {profitPct}% margin
            </div>
          </div>
        </motion.div>

        {/* Orders */}
        <motion.div {...fadeUp(0.16)} className="relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-3xl" />
          <div className="relative">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <ShoppingCart size={17} className="text-blue-500" />
            </div>
            <p className="text-slate-400 text-xs font-medium">Total Orders</p>
            <p className="text-slate-900 text-2xl font-black mt-0.5 tracking-tight">{orders.length}</p>
            {pending > 0
              ? <p className="text-amber-500 text-[11px] font-semibold mt-1">{pending} pending</p>
              : <p className="text-slate-400 text-[11px] mt-1 flex items-center gap-1"><CheckCircle size={11} className="text-emerald-400" /> All cleared</p>
            }
          </div>
        </motion.div>
      </div>

      {/* ── Payment breakdown ── */}
      <motion.div {...fadeUp(0.16)} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5 flex-wrap">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">Payment Breakdown</p>
            <p className="text-2xl font-black text-slate-900">{rs(paymentsGrand)}</p>
            <p className="text-xs text-slate-400 mt-0.5">{physOrders.length} counter orders total</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Banknote size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Cash</p>
                <p className="text-base font-black text-slate-900">{rs(cashTotal)}</p>
                <p className="text-[11px] text-emerald-500 font-semibold">{cashOrders.length} orders · {cashPct}%</p>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Smartphone size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Online</p>
                <p className="text-base font-black text-slate-900">{rs(onlineTotal)}</p>
                <p className="text-[11px] text-blue-500 font-semibold">{onlineOrders.length} orders · {onlinePct}%</p>
              </div>
            </div>
          </div>

          {paymentsGrand > 0 && (
            <div className="w-full sm:w-36 shrink-0">
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cashPct}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-emerald-400 rounded-l-full"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${onlinePct}%` }}
                  transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-blue-400 rounded-r-full"
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5"><Banknote size={10} /> Cash {cashPct}%</span>
                <span className="text-[10px] text-blue-500 font-bold flex items-center gap-0.5">{onlinePct}% <Smartphone size={10} /> Online</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Bottom row ── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Top products */}
        <motion.div {...fadeUp(0.18)} className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Top Products</h3>
              <p className="text-xs text-slate-400 mt-0.5">{monthLabel(month)}</p>
            </div>
            <Layers size={16} className="text-slate-300" />
          </div>
          <TopProducts sales={sales} />
        </motion.div>

        {/* Quick actions */}
        <motion.div {...fadeUp(0.22)} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-800">Quick Actions</h3>
          </div>
          <div className="space-y-2.5">
            {[
              { to: '/admin/sales',    label: 'Add New Sale',     icon: CircleDollarSign, color: 'bg-brand-50 text-brand-600 hover:bg-brand-100 border-brand-100' },
              { to: '/admin/expenses', label: 'Log Expense',      icon: Receipt,          color: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100' },
              { to: '/admin/orders',   label: 'Manage Orders',    icon: ShoppingCart,     color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100' },
              { to: '/admin/rates',    label: 'Update Rate List', icon: Package,          color: 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200' },
            ].map(({ to, label, icon: Icon, color }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border
                            font-medium text-sm transition-all duration-200
                            hover:-translate-y-0.5 hover:shadow-sm ${color}`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="flex-1">{label}</span>
                <ArrowUpRight size={13} className="opacity-40" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  )
}

function TopProducts({ sales }) {
  const map = {}
  for (const s of sales) {
    map[s.product] = map[s.product] || { qty: 0, total: 0 }
    map[s.product].qty   += Number(s.qty   || 0)
    map[s.product].total += Number(s.total || 0)
  }
  const rows = Object.entries(map)
    .map(([product, v]) => ({ product, ...v }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)

  if (!rows.length) return (
    <p className="text-sm text-slate-400 py-8 text-center">No sales recorded this month.</p>
  )

  const max = rows[0]?.total || 1

  return (
    <div className="space-y-3.5">
      {rows.map((r, i) => (
        <div key={r.product} className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-300 w-4 shrink-0 tabular-nums">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-slate-700 truncate">{r.product}</span>
              <span className="text-sm font-black text-slate-900 ml-3 shrink-0">{rs(r.total)}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(r.total / max) * 100}%` }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full ${i === 0 ? 'bg-brand-400' : 'bg-slate-300'}`}
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-400 shrink-0">×{r.qty}</span>
        </div>
      ))}
    </div>
  )
}
