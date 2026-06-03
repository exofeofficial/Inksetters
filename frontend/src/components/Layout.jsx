import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getOrders, subscribeCorporateInquiries } from '../lib/db'
import {
  LayoutDashboard, ShoppingCart, TrendingUp, Receipt,
  BarChart3, Tag, ChevronLeft, LogOut, ExternalLink, Bell, Menu,
  ClipboardList, Building2, X, Phone, CheckCircle,
} from 'lucide-react'

const NAV = [
  { to: '/admin',                        label: 'Dashboard',           icon: LayoutDashboard, end: true },
  { to: '/admin/counter-orders',         label: 'Counter Orders',      icon: ClipboardList },
  { to: '/admin/orders',                 label: 'Online Orders',       icon: ShoppingCart,   badge: 'orders' },
  { to: '/admin/corporate-inquiries',    label: 'Corporate Inquiries', icon: Building2,      badge: 'corporate' },
  { to: '/admin/sales',                  label: 'Sales',               icon: TrendingUp },
  { to: '/admin/expenses',               label: 'Expenses',            icon: Receipt },
  { to: '/admin/reports',               label: 'Reports',              icon: BarChart3 },
  { to: '/admin/rates',                  label: 'Rate List',           icon: Tag },
]

// ── Time formatter ──────────────────────────────────────────────────────────
function timeAgo(ts) {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60)  return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, onNav, pendingOrders, corporateCount }) {
  const { logout } = useAuth()

  return (
    <div className="flex flex-col h-full select-none">

      {/* Logo */}
      <div className={`flex items-center gap-3 h-16 border-b border-white/[0.08] px-4 shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        <img
          src="/logo-01.png"
          alt="Inksetters"
          className={`brightness-0 invert object-contain transition-all duration-300 ${collapsed ? 'h-7' : 'h-8'}`}
        />
        {!collapsed && (
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-slate-600">Admin</span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV.map(({ to, label, icon: Icon, end, badge }) => {
          const count = badge === 'orders' ? pendingOrders : badge === 'corporate' ? corporateCount : 0
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNav}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl text-sm font-medium
                 transition-all duration-200 cursor-pointer overflow-hidden
                 ${collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5'}
                 ${isActive
                   ? 'bg-brand-500/15 text-brand-400'
                   : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute left-0 top-2 bottom-2 w-[3px] bg-brand-400 rounded-full"
                    />
                  )}

                  <Icon size={18} className="shrink-0 ml-0.5" />

                  {!collapsed && <span className="flex-1 truncate">{label}</span>}

                  {/* Badge (expanded) */}
                  {count > 0 && !collapsed && (
                    <span className="bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                      {count}
                    </span>
                  )}
                  {/* Badge dot (collapsed) */}
                  {count > 0 && collapsed && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-400 rounded-full" />
                  )}

                  {/* Tooltip */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs
                                    font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none
                                    whitespace-nowrap transition-opacity duration-150 z-50
                                    border border-white/10 shadow-xl">
                      {label}
                      {count > 0 && (
                        <span className="ml-1.5 bg-brand-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full">{count}</span>
                      )}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="mx-3 h-px bg-white/[0.07]" />

      {/* Bottom */}
      <div className="py-3 px-2.5 space-y-0.5 shrink-0">
        <Link
          to="/"
          target="_blank"
          className={`group relative flex items-center gap-3 rounded-xl text-sm font-medium px-3 py-2.5
                      text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all duration-200
                      ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <ExternalLink size={17} className="shrink-0 ml-0.5" />
          {!collapsed && <span>View Store</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg
                            opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap
                            transition-opacity duration-150 z-50 border border-white/10 shadow-xl">
              View Store
            </div>
          )}
        </Link>

        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium px-3 py-2.5
                      text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200
                      ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut size={17} className="shrink-0 ml-0.5" />
          {!collapsed && <span>Logout</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg
                            opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap
                            transition-opacity duration-150 z-50 border border-white/10 shadow-xl">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Bell notification dropdown ────────────────────────────────────────────────
function BellDropdown({ inquiries, onClose }) {
  const navigate = useNavigate()
  const newItems = inquiries.filter(i => i.status === 'new').slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/80 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-slate-700" />
          <span className="font-bold text-slate-800 text-sm">Notifications</span>
          {newItems.length > 0 && (
            <span className="bg-brand-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none">
              {newItems.length}
            </span>
          )}
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
          <X size={13} />
        </button>
      </div>

      {/* Items */}
      <div className="max-h-80 overflow-y-auto">
        {newItems.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
              <CheckCircle size={18} className="text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm font-medium">All caught up!</p>
            <p className="text-slate-400 text-xs mt-0.5">No new inquiries</p>
          </div>
        ) : (
          newItems.map((inq) => (
            <button
              key={inq.id}
              onClick={() => { navigate('/admin/corporate-inquiries'); onClose() }}
              className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 size={14} className="text-brand-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-800 text-sm font-bold truncate">{inq.companyName || 'Unknown Company'}</p>
                    <p className="text-slate-500 text-xs truncate">{inq.service} {inq.qty ? `• ${inq.qty} pcs` : ''}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone size={10} className="text-slate-400 shrink-0" />
                      <p className="text-slate-400 text-xs truncate">{inq.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mt-1" />
                  <span className="text-slate-400 text-[10px] whitespace-nowrap">{timeAgo(inq.createdAt)}</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={() => { navigate('/admin/corporate-inquiries'); onClose() }}
          className="w-full text-center text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors py-0.5"
        >
          View all corporate inquiries →
        </button>
      </div>
    </motion.div>
  )
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function Layout() {
  const [collapsed, setCollapsed]     = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [bellOpen, setBellOpen]       = useState(false)
  const [pendingOrders, setPendingOrders] = useState(0)
  const [inquiries, setInquiries]     = useState([])
  const bellRef = useRef(null)
  const location = useLocation()

  const pageTitle = NAV.find(n =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  )?.label ?? 'Admin'

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // One-time fetch for pending online orders count
  useEffect(() => {
    getOrders('pending')
      .then(o => setPendingOrders(o.length))
      .catch(() => {})
  }, [])

  // Real-time subscription for corporate inquiries
  useEffect(() => {
    const unsub = subscribeCorporateInquiries(setInquiries)
    return unsub
  }, [])

  // Close bell dropdown on outside click
  useEffect(() => {
    if (!bellOpen) return
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [bellOpen])

  const newInquiryCount = inquiries.filter(i => i.status === 'new').length
  const totalBadge = pendingOrders + newInquiryCount

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* ─── Desktop sidebar ─── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex flex-col fixed inset-y-0 left-0 z-40
                   bg-slate-900 border-r border-white/[0.08] overflow-hidden shrink-0"
      >
        <Sidebar
          collapsed={collapsed}
          onNav={undefined}
          pendingOrders={pendingOrders}
          corporateCount={newInquiryCount}
        />

        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute top-[18px] -right-3 w-6 h-6 bg-slate-700 hover:bg-brand-500
                     border border-slate-600 hover:border-brand-400 rounded-full
                     flex items-center justify-center text-slate-400 hover:text-white
                     transition-all duration-200 z-50 shadow-md"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronLeft size={12} />
          </motion.div>
        </button>
      </motion.aside>

      {/* ─── Mobile sidebar ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 h-screen w-60 bg-slate-900 z-50 md:hidden
                         border-r border-white/[0.08] shadow-2xl"
            >
              <Sidebar
                collapsed={false}
                onNav={() => setMobileOpen(false)}
                pendingOrders={pendingOrders}
                corporateCount={newInquiryCount}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main area ─── */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-[250ms] ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ marginLeft: 0 }}
      >
        <motion.div
          animate={{ paddingLeft: collapsed ? 64 : 240 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:block"
          style={{ height: 0 }}
        />

        <div className={`flex-1 flex flex-col md:transition-all md:duration-[250ms] ${collapsed ? 'md:ml-16' : 'md:ml-60'}`}>

          {/* Header */}
          <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-4 sm:px-6
                             bg-white/80 backdrop-blur-lg border-b border-slate-200/80 shadow-sm">
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl
                         text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-bold text-slate-800 tracking-wide">{pageTitle}</h1>
              <p className="text-[11px] text-slate-400">Inksetters · Admin Panel</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Bell button */}
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => setBellOpen(v => !v)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500
                             hover:bg-slate-100 transition-colors relative"
                >
                  <Bell size={18} />
                  {/* Red badge */}
                  {totalBadge > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-red-500 text-white
                                     text-[9px] font-black rounded-full flex items-center justify-center
                                     px-0.5 leading-none shadow-sm animate-pulse">
                      {totalBadge}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {bellOpen && (
                    <BellDropdown
                      inquiries={inquiries}
                      onClose={() => setBellOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-[11px] font-black">IN</span>
              </div>
            </div>
          </header>

          {/* Page */}
          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
