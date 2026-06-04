import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Sparkles, Asterisk } from 'lucide-react'

const SHOWCASE = [
  { word: 'Cards',     src: '/P1.jpg',  bg: 'from-orange-500 to-red-600'    },
  { word: 'Stickers',  src: '/P2.jpg',  bg: 'from-fuchsia-500 to-purple-600' },
  { word: 'Apparel',   src: '/P3.jpg',  bg: 'from-slate-700 to-slate-900'   },
  { word: 'Envelopes', src: '/P4.webp', bg: 'from-amber-400 to-orange-500'  },
  { word: 'Banners',   src: '/P2.jpg',  bg: 'from-brand-400 to-green-500'   },
  { word: 'Prints',    src: '/P4.jpg',  bg: 'from-brand-400 to-green-500'   },
]

const ROTATE_MS = 3600
const ROUND = { borderRadius: '2rem' }

function ProductImage({ item }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div style={ROUND} className={`w-full h-full bg-gradient-to-br ${item.bg}`} />
  return (
    <img
      src={item.src}
      alt={item.word}
      onError={() => setFailed(true)}
      style={ROUND}
      className="w-full h-full object-cover block"
    />
  )
}

// Spinning asterisk — desktop only (mobile pe always off)
function SpinningAsterisk({ className = '', size = 28, duration = 14 }) {
  return (
    <motion.span
      aria-hidden
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
      className={`text-brand-500 inline-flex hidden sm:inline-flex ${className}`}
    >
      <Asterisk size={size} strokeWidth={2.5} />
    </motion.span>
  )
}

export default function Hero() {
  const [i, setI]           = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect mobile once on mount
    setIsMobile(window.innerWidth < 768)
    const t = setInterval(() => setI((v) => (v + 1) % SHOWCASE.length), ROTATE_MS)
    return () => clearInterval(t)
  }, [])

  const current = SHOWCASE[i]

  return (
    <section id="services" className="relative bg-white overflow-hidden pt-20 sm:pt-24">

      {/* Blob — desktop only, no continuous animation (just static) */}
      <div
        aria-hidden
        className="pointer-events-none hidden sm:block absolute -top-40 -right-32 w-[44rem] h-[44rem] rounded-full bg-brand-300/45 blur-[140px]"
      />

      {/* Grain texture — desktop only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply hidden sm:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Asterisks — desktop only */}
      <SpinningAsterisk className="absolute top-16 left-[8%]"    size={26} duration={16} />
      <SpinningAsterisk className="absolute bottom-24 left-[42%]" size={20} duration={20} />
      <SpinningAsterisk className="absolute top-1/3 right-[6%]"  size={34} duration={18} />

      <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-20 sm:pb-28 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

        {/* ── LEFT — copy ── */}
        <div className="relative z-10 lg:col-span-7">

          {/* Badge — no animation on mobile */}
          {isMobile ? (
            <div className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 rounded-full px-3 py-1 text-xs font-medium text-brand-700">
              <Sparkles size={14} />
              Where Ideas Take Shape
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 rounded-full px-3 py-1 text-sm font-medium text-brand-700"
            >
              <Sparkles size={14} />
              Where Ideas Take Shape
            </motion.div>
          )}

          <h1 className="mt-5 text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-black tracking-tighter text-slate-900 leading-[0.95]">
            {/* "We print" — static on mobile */}
            {isMobile ? (
              <span className="block">We print</span>
            ) : (
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                We print
              </motion.span>
            )}

            {/* Rotating word */}
            <span className="block relative mt-2">
              <span className="block h-[1.05em] overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={current.word}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: isMobile ? 0.4 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 inline-flex items-center"
                  >
                    <span className="relative">
                      <span className="absolute left-0 right-0 bottom-2 h-4 sm:h-6 lg:h-8 bg-brand-300/70 -z-10 rounded-sm" />
                      {current.word}.
                    </span>
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </h1>

          {/* Description — static on mobile */}
          {isMobile ? (
            <p className="mt-7 text-slate-500 text-base max-w-md">
              Cards, stickers, envelopes &amp; custom packaging — quality print solutions
              crafted for creators, by Inksetters.
            </p>
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 text-slate-500 text-lg max-w-md"
            >
              Cards, stickers, envelopes &amp; custom packaging — quality print solutions
              crafted for creators, by Inksetters.
            </motion.p>
          )}

          {/* Progress dots */}
          <div className="mt-8 flex items-center gap-2">
            {SHOWCASE.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Show ${SHOWCASE[k].word}`}
                className="group relative h-1 rounded-full bg-slate-200 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: k === i ? 48 : 16 }}
              >
                {k === i && (
                  <motion.span
                    key={`fill-${i}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }}
                    className="absolute inset-y-0 left-0 bg-slate-900"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT — card stack ── */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto w-[82%] sm:w-[70%] lg:w-full max-w-[440px] aspect-[4/5]">

            {isMobile ? (
              /* ── MOBILE: show only top card, simple crossfade — no stack, no rotate, no blur ── */
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.word}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 shadow-xl bg-slate-100 transform-gpu"
                  style={{ borderRadius: '2rem', overflow: 'hidden' }}
                >
                  <ProductImage item={current} />
                  {/* Simple overlay — no backdrop-blur on mobile */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4">
                      <div className="inline-flex items-center gap-1.5 bg-white/90 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm">
                        {current.word}
                        <ArrowUpRight size={12} />
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-300">Featured</p>
                      <p className="text-white text-xl font-bold">{current.word}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              /* ── DESKTOP: full card stack with depth/rotate effect ── */
              <>
                {SHOWCASE.map((item, idx) => {
                  const depth  = (idx - i + SHOWCASE.length) % SHOWCASE.length
                  const inStack = depth <= 2
                  const isTop   = depth === 0
                  const target  = inStack
                    ? { y: depth * -14, x: depth === 1 ? -10 : depth === 2 ? 10 : 0, rotate: depth === 0 ? 0 : depth === 1 ? -5 : 5, scale: 1 - depth * 0.05, opacity: 1, zIndex: 10 - depth }
                    : { y: 60, x: 0, rotate: 6, scale: 0.86, opacity: 0, zIndex: 0 }

                  return (
                    <motion.div
                      key={item.word}
                      initial={false}
                      animate={target}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 shadow-2xl bg-slate-100 will-change-transform transform-gpu isolate"
                      style={{ pointerEvents: isTop ? 'auto' : 'none', borderRadius: '2rem', overflow: 'hidden', clipPath: 'inset(0 round 2rem)', WebkitClipPath: 'inset(0 round 2rem)' }}
                    >
                      <ProductImage item={item} />
                      <motion.div
                        animate={{ opacity: isTop ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        <div className="absolute top-5 left-5 pointer-events-auto">
                          <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-full px-3.5 py-1.5 text-sm font-semibold text-slate-900 shadow-md">
                            {item.word}
                            <ArrowUpRight size={14} />
                          </div>
                        </div>
                        <div className="absolute top-5 right-5 flex items-center gap-2 bg-black/45 backdrop-blur-md text-white text-xs font-medium rounded-full px-3 py-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                          Live
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-300">Featured</p>
                          <p className="text-white text-2xl font-bold leading-tight">{item.word}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -right-6 -bottom-6 bg-slate-900 text-white shadow-xl rounded-2xl px-4 py-3 z-20"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-400">Quality</p>
                  <p className="text-lg font-extrabold">Premium</p>
                </motion.div>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
