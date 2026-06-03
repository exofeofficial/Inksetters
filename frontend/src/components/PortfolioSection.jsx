import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CATS = ['All', 'Cards', 'Stickers', 'Apparel', 'Packaging', 'Banners']

const TICKER = [
  'Business Cards', '✦', 'PVC Stickers', '✦', 'Custom Apparel', '✦',
  'Vinyl Banners', '✦', 'Branded Packaging', '✦', 'Art Cards', '✦',
  'Cloth Banners', '✦', 'Letterheads', '✦', 'Flyers', '✦',
]

// Add images to frontend/public/portfolio/
const ITEMS = [
  { id: 1, src: '/Portfolio/P1.webp', cat: 'Cards',     title: 'Premium Business Cards', sub: '300gsm Art Card'      },
  { id: 2, src: '/Portfolio/P8.webp', cat: 'Stickers',  title: 'PVC Shine Stickers',     sub: 'Waterproof finish'    },
  { id: 3, src: '/Portfolio/P4.webp', cat: 'Cards',   title: 'Visiting Cards',    sub: 'Matte lamination'    },
  { id: 4, src: '/Portfolio/P4.webp', cat: 'Apparel',     title: 'Custom Jersey Print',          sub: 'Sublimation print'     },
  { id: 5, src: '/Portfolio/P3.webp', cat: 'Packaging', title: 'Custom Branded Box',     sub: 'Corrugated board'     },
  { id: 6, src: '/Portfolio/P6.webp', cat: 'Banners',   title: 'Vinyl Outdoor Banner',   sub: '13oz flex'            },
  { id: 7, src: '/Portfolio/P7.webp', cat: 'Stickers',  title: 'Transparent Stickers',   sub: 'Clear PVC'            },
  { id: 8, src: '/Portfolio/P2.webp', cat: 'Apparel',   title: 'T-shirt Printing',       sub: 'DTF print'            },
  { id: 9, src: '/Portfolio/P9.webp', cat: 'Banners',   title: 'Cloth Banner Print',     sub: 'Indoor / outdoor'     },
]

function GalleryCard({ item, hero = false, num }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-slate-200 cursor-pointer w-full h-full
                     ${hero ? 'min-h-[360px] sm:min-h-[460px]' : 'min-h-[180px]'}`}>
      <img
        src={item.src}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover
                   transition-transform duration-700 ease-out group-hover:scale-[1.08]"
      />

      {/* Base gradient for hero always visible */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent
                       transition-opacity duration-500
                       ${hero ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

      {/* Number */}
      <span className="absolute top-4 left-4 text-white/30 text-xs font-bold tracking-widest
                       group-hover:text-white/70 transition-colors duration-300">
        {num}
      </span>

      {/* Category pill */}
      <div className="absolute top-4 right-4
                      opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0
                      transition-all duration-300">
        <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/25
                         text-white text-[10px] font-bold uppercase tracking-wider">
          {item.cat}
        </span>
      </div>

      {/* Bottom info */}
      <div className={`absolute bottom-0 left-0 right-0 p-5
                       transition-all duration-400 ease-out
                       ${hero
                         ? 'translate-y-0 opacity-100'
                         : 'translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                       }`}>
        <p className="text-white/55 text-xs font-medium mb-1.5 tracking-wide">{item.sub}</p>
        <p className={`text-white font-black leading-tight ${hero ? 'text-2xl sm:text-3xl' : 'text-base'}`}>
          {item.title}
        </p>
        {hero && (
          <div className="flex items-center gap-2 mt-3">
            <div className="w-5 h-px bg-brand-400" />
            <span className="text-brand-300 text-[11px] font-semibold tracking-widest uppercase">Inksetters</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PortfolioSection() {
  const [active, setActive] = useState('All')

  const visible = active === 'All' ? ITEMS : ITEMS.filter((i) => i.cat === active)
  const [hero, ...rest] = visible

  return (
    <section className="relative bg-slate-50 overflow-hidden">

      {/* Gradient spots */}
      <div aria-hidden className="pointer-events-none absolute top-20 left-[15%] w-[30rem] h-[30rem] rounded-full bg-brand-200/30 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-20 right-[10%] w-[24rem] h-[24rem] rounded-full bg-slate-300/40 blur-[90px]" />

      {/* Auto-scroll ticker */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-white py-3.5">
        <motion.div
          animate={{ x: '-50%' }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
          className="flex gap-8 whitespace-nowrap w-max"
        >
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="text-slate-400 text-sm font-medium">{item}</span>
          ))}
        </motion.div>
      </div>

      <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">

        {/* Header + filters */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-500 text-xs font-bold uppercase tracking-[0.22em] mb-3"
            >
              Portfolio
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl font-black tracking-tighter leading-none text-slate-900"
            >
              Work that
              <span className="text-brand-500"> wows.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="flex gap-2 flex-wrap"
          >
            {CATS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                  ${active === cat
                    ? 'bg-slate-900 text-white shadow-sm scale-[1.03]'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-800'
                  }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Gallery */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {hero ? (
              <>
                {/* Hero row */}
                <div className="grid lg:grid-cols-3 gap-4 mb-4">
                  {/* Hero card */}
                  <div className="lg:col-span-2">
                    <GalleryCard item={hero} hero num="01" />
                  </div>

                  {/* Side stack */}
                  <div className="grid grid-rows-2 gap-4 min-h-[360px] sm:min-h-[460px]">
                    {rest.slice(0, 2).map((item, i) => (
                      <GalleryCard key={item.id} item={item} num={`0${i + 2}`} />
                    ))}
                    {rest.length === 0 && <div className="rounded-2xl bg-slate-100" />}
                    {rest.length === 1 && <div className="rounded-2xl bg-slate-100" />}
                  </div>
                </div>

                {/* Bottom grid */}
                {rest.length > 2 && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {rest.slice(2).map((item, i) => (
                      <div key={item.id} className="aspect-[4/3]">
                        <GalleryCard item={item} num={String(i + 4).padStart(2, '0')} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                No items in this category yet.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-8">
          <p className="text-slate-400 text-sm">
            <span className="text-slate-800 font-semibold">{visible.length}</span> of{' '}
            <span className="text-slate-800 font-semibold">{ITEMS.length}</span> projects
          </p>
          <a
            href="https://wa.me/923000000000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600
                       hover:text-brand-500 transition-colors group"
          >
            Request full portfolio
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              className="group-hover:translate-x-0.5 transition-transform duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}
