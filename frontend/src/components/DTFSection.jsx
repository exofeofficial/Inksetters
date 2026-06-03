import { motion } from 'framer-motion'
import { Shirt, Zap, Palette, Package, ArrowRight, CheckCircle } from 'lucide-react'

const FEATURES = [
  { icon: Shirt,    title: 'Any Fabric',     desc: 'Cotton, polyester, blends — DTF works on all.' },
  { icon: Palette,  title: 'Vivid Colors',   desc: 'Full-color prints with sharp detail & rich vibrancy.' },
  { icon: Zap,      title: 'No Minimums',    desc: 'Single piece or bulk — same premium quality.' },
  { icon: Package,  title: 'Fast Turnaround', desc: 'Ready within 24 hrs on most standard orders.' },
]

const ITEMS = [
  'T-shirts', 'Hoodies', 'Jerseys', 'Caps', 'Tote Bags',
  'Polo Shirts', 'Jackets', 'Uniforms', 'Sportswear', 'Kids Wear',
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
})

export default function DTFSection() {
  return (
    <section className="relative bg-slate-900 overflow-hidden py-24 sm:py-32">

      {/* Gradient blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-20 left-[10%] w-[30rem] h-[30rem] rounded-full bg-brand-500/12 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-[5%] w-[26rem] h-[26rem] rounded-full bg-brand-500/8 blur-[90px]" />
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[20rem] rounded-full bg-brand-400/5 blur-[120px]" />

      <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top row — heading + CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16">
          <div className="max-w-2xl">
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/25 rounded-full px-4 py-1.5 mb-5">
              <Shirt size={13} className="text-brand-400" />
              <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.18em]">DTF Printing</span>
            </motion.div>

            <motion.h2 {...fadeUp(0.08)}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none text-white">
              Print on
              <span className="block text-brand-400">anything.</span>
            </motion.h2>

            <motion.p {...fadeUp(0.15)} className="text-slate-400 text-base sm:text-lg leading-relaxed mt-5 max-w-lg">
              Direct-to-Film printing delivers brilliant, wash-proof designs on any garment —
              from a single custom tee to 1,000 team jerseys.
            </motion.p>
          </div>

          <motion.a
            {...fadeUp(0.2)}
            href="https://wa.me/923398000112"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 bg-brand-500 hover:bg-brand-400 text-white
                       font-bold px-8 py-4 rounded-2xl transition-all duration-200 text-base
                       hover:shadow-xl hover:shadow-brand-500/25 hover:-translate-y-0.5 shrink-0 self-start lg:self-end"
          >
            Get a Quote
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </motion.a>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              {...fadeUp(0.1 + i * 0.07)}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/10
                         hover:border-brand-500/30 rounded-2xl p-5 transition-all duration-300 overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 group-hover:bg-brand-500/25
                                flex items-center justify-center mb-4 transition-colors duration-300">
                  <Icon size={18} className="text-brand-400" />
                </div>
                <h3 className="text-white font-bold text-sm leading-tight mb-1.5">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main visual band */}
        <motion.div
          {...fadeUp(0.25)}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900
                     border border-white/10 p-8 sm:p-10 lg:p-12"
        >
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-brand-500/10" />
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-brand-500/15" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-500/5 blur-[60px]" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-10">

            {/* Left — big stat + checklist */}
            <div className="flex-1">
              <p className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">Why DTF?</p>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-6xl sm:text-7xl font-black text-white leading-none tracking-tighter">100%</span>
                <span className="text-slate-400 text-sm leading-snug mb-2 max-w-[140px]">wash-proof & crack-proof guarantee</span>
              </div>

              <div className="space-y-2.5">
                {[
                  'No weeding or heat transfer mess',
                  'Prints on dark & light fabrics equally',
                  'Works on curved & uneven surfaces',
                  'Same-day print available on demand',
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 + i * 0.07, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle size={15} className="text-brand-400 shrink-0" />
                    <span className="text-slate-300 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-48 bg-white/10 shrink-0" />

            {/* Right — what we print */}
            <div className="flex-1">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">We Print On</p>
              <div className="flex flex-wrap gap-2">
                {ITEMS.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.04, duration: 0.35 }}
                    className="px-3.5 py-1.5 rounded-full bg-white/8 border border-white/10
                               text-slate-300 text-xs font-semibold hover:bg-brand-500/15
                               hover:border-brand-500/30 hover:text-brand-300 transition-all duration-200 cursor-default"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>

              {/* Mini price note */}
              <div className="mt-6 inline-flex items-center gap-2.5 bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-3">
                <Zap size={14} className="text-brand-400 shrink-0" />
                <p className="text-slate-300 text-xs leading-snug">
                  Starting from <span className="text-brand-400 font-black text-sm">Rs. 350</span> per piece · No setup fee
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
