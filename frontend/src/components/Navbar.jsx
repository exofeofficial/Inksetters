import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers, Info, Users, ShoppingBag, Menu, X, Building2,
  CreditCard, Sticker, Shirt, Package, FileText, Megaphone, ArrowRight,
} from 'lucide-react'

const NAV_LINKS = [
  { label: 'Services',    href: '#services', icon: Layers, hasDropdown: true },
  { label: 'About',       href: '/about',    icon: Info, isPage: true },
  { label: 'Our Clients', href: '#clients',  icon: Users },
]

// Services dropdown grid — each is a category card.
const SERVICES = [
  { icon: CreditCard, title: 'Card Printing', desc: 'Business, art & visiting cards', accent: 'bg-orange-100 text-orange-600' },
  { icon: Sticker,    title: 'Stickers',      desc: 'Paper, PVC, transparent, silver', accent: 'bg-fuchsia-100 text-fuchsia-600' },
  { icon: Shirt,      title: 'Apparel Print', desc: 'Custom T-shirts & textiles',     accent: 'bg-slate-200 text-slate-700' },
  { icon: Package,    title: 'Packaging',     desc: 'Envelopes, boxes & cups',        accent: 'bg-amber-100 text-amber-700' },
  { icon: FileText,   title: 'Stationery',    desc: 'Brochures, letterheads, flyers', accent: 'bg-sky-100 text-sky-600' },
  { icon: Megaphone,  title: 'Banners',       desc: 'Vinyl & cloth, any size',        accent: 'bg-brand-100 text-brand-700' },
]

// Stagger settings for the mobile menu items.
const listVariants = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  closed: {},
}
const itemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -16 },
}

// ---------- Services dropdown panel ----------
function ServicesDropdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[640px] max-w-[92vw]"
    >
      {/* Floating arrow */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-slate-200 rotate-45" />

      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 overflow-hidden">
        {/* Soft lime glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-2 gap-1">
          {SERVICES.map(({ icon: Icon, title, desc, accent }, idx) => (
            <motion.a
              key={title}
              href="#services"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 + idx * 0.035, duration: 0.35, ease: 'easeOut' }}
              whileHover={{ x: 4 }}
              className="group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <span className={`shrink-0 grid place-items-center w-10 h-10 rounded-lg ${accent}`}>
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 font-semibold text-slate-900 text-sm">
                  {title}
                  <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-600" />
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">{desc}</span>
              </span>
            </motion.a>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="relative mt-2 border-t border-slate-100 pt-3 px-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">Custom project in mind?</p>
          <a
            href="#collections"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800"
          >
            Start an order <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

// ---------- Navbar ----------
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const closeTimer = useRef(null)

  // Hover with a small grace period so the cursor can cross the small gap
  // between the trigger and the panel without flicker.
  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setDropdownOpen(true)
  }
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 120)
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200"
    >
      <nav className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left — logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <motion.img
            src="/logo-01.png"
            alt="Inksetters"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="h-9 sm:h-10 w-auto"
          />
        </Link>

        {/* Center — links (desktop) */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href, icon: Icon, hasDropdown, isPage }) => (
            <li
              key={label}
              className="relative"
              onMouseEnter={hasDropdown ? handleEnter : undefined}
              onMouseLeave={hasDropdown ? handleLeave : undefined}
            >
              {isPage ? (
                <Link
                  to={href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ) : (
              <motion.a
                href={href}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Icon size={16} />
                {label}
                {hasDropdown && (
                  <motion.svg
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    width="10" height="10" viewBox="0 0 10 10" className="text-slate-400"
                  >
                    <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                )}
              </motion.a>
              )}

              {hasDropdown && (
                <AnimatePresence>
                  {dropdownOpen && <ServicesDropdown />}
                </AnimatePresence>
              )}
            </li>
          ))}
        </ul>

        {/* Right — CTA (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/corporate"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Building2 size={16} />
            Corporate
          </Link>
          <motion.a
            href="#collections"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors"
          >
            <ShoppingBag size={16} />
            Start Order
          </motion.a>
        </div>

        {/* Mobile toggle */}
        <motion.button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.85 }}
          className="md:hidden grid place-items-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="grid place-items-center"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-slate-200 bg-white"
          >
            <motion.div
              variants={listVariants}
              initial="closed"
              animate="open"
              className="px-4 py-3 space-y-1"
            >
              {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  variants={itemVariants}
                  onClick={() => setOpen(false)}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
                >
                  <Icon size={18} />
                  {label}
                </motion.a>
              ))}
              <motion.div variants={itemVariants}>
                <Link
                  to="/corporate"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
                >
                  <Building2 size={18} />
                  Corporate
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <a
                  href="#collections"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold rounded-xl px-4 py-3 mt-2"
                >
                  <ShoppingBag size={18} />
                  Start Order
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
