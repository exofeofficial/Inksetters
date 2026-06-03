import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'

const NAV = [
  { label: 'Card Printing',  href: '#workflow' },
  { label: 'Stickers',       href: '#workflow' },
  { label: 'Apparel Print',  href: '#workflow' },
  { label: 'Packaging',      href: '#workflow' },
  { label: 'Stationery',     href: '#workflow' },
  { label: 'Banners',        href: '#workflow' },
]

const PAGES = [
  { label: 'About Us',      href: '/about'       },
  { label: 'Corporate',     href: '/corporate'   },
  { label: 'Our Work',      href: '#portfolio' },
  { label: 'Clients',       href: '#clients'  },
  { label: 'Testimonials',  href: '#'         },
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: '#',
    icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  },
  {
    label: 'Facebook',
    href: '#',
    icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/923000000000',
    icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
})

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 overflow-hidden">

      {/* ── CTA BAND ── */}
      <div className="relative border-b border-white/10 overflow-hidden">
        {/* Glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[50rem] h-[20rem] rounded-full bg-brand-500/15 blur-[80px]" />
        </div>

        <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28
                        flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

          <motion.div {...fadeUp(0)} className="max-w-xl">
            <p className="text-brand-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">
              Start Today
            </p>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none text-white">
              Let's print
              <br />
              <span className="text-brand-400">something</span>
              <br />
              great.
            </h2>
          </motion.div>

          <motion.div {...fadeUp(0.15)} className="flex flex-col gap-4 shrink-0">
            <a
              href="https://wa.me/923000000000"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 bg-brand-500 hover:bg-brand-400
                         text-white font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200
                         hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
            <div className="flex items-center gap-3 pl-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-slate-400 text-xs">Trusted by 500+ clients across Lahore</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── MAIN INFO ── */}
      <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <div className="relative grid grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Brand */}
          <motion.div {...fadeUp(0)} className="col-span-2 lg:col-span-1">
            <img src="/logo-01.png" alt="Inksetters" className="h-10 w-auto object-contain brightness-0 invert" />
            <p className="text-slate-500 text-sm leading-relaxed mt-4 max-w-[200px]">
              Pakistan's trusted print Company quality, speed & honesty.
            </p>

            <div className="mt-6 space-y-2.5">
              {[
                { icon: <MapPin size={14} />, val: 'Lahore, Pakistan'    },
                { icon: <Phone size={14} />, val: '+92 300 0000000'      },
                { icon: <Mail  size={14} />, val: 'hello@inksetters.pk'  },
              ].map(({ icon, val }) => (
                <div key={val} className="flex items-center gap-2.5">
                  <span className="text-brand-400 shrink-0">{icon}</span>
                  <span className="text-slate-500 text-sm">{val}</span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2 mt-6">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-brand-500/20
                             border border-white/10 hover:border-brand-500/50
                             flex items-center justify-center text-slate-500 hover:text-brand-400
                             transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div {...fadeUp(0.08)}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-5">Services</p>
            <ul className="space-y-3">
              {NAV.map(({ label, href }) => (
                <li key={label}>
                  <a href={href}
                    className="text-slate-500 text-sm hover:text-brand-400 transition-colors duration-200 flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-3 h-px bg-brand-400 transition-all duration-300 overflow-hidden" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div {...fadeUp(0.14)}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-5">Company</p>
            <ul className="space-y-3">
              {PAGES.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith('/') ? (
                    <Link to={href}
                      className="text-slate-500 text-sm hover:text-brand-400 transition-colors duration-200 flex items-center gap-1.5 group">
                      <span className="w-0 group-hover:w-3 h-px bg-brand-400 transition-all duration-300 overflow-hidden" />
                      {label}
                    </Link>
                  ) : (
                  <a href={href}
                    className="text-slate-500 text-sm hover:text-brand-400 transition-colors duration-200 flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-3 h-px bg-brand-400 transition-all duration-300 overflow-hidden" />
                    {label}
                  </a>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/[0.07]">
        <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Inksetters · All rights reserved
          </p>
        </div>
      </div>

    </footer>
  )
}
