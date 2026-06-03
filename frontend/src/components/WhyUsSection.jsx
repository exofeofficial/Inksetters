import { motion } from 'framer-motion'
import { Zap, ShieldCheck, Layers, Headphones } from 'lucide-react'

const BENEFITS = [
  {
    icon: Zap,
    title: 'Fast Turnaround',
    desc: 'Same-day & 24hr delivery options available on most products.',
    num: '01',
  },
  {
    icon: ShieldCheck,
    title: 'Premium Quality',
    desc: '300gsm+ stocks, vibrant inks, and sharp finishes — every time.',
    num: '02',
  },
  {
    icon: Layers,
    title: 'Any Quantity',
    desc: "Whether it's 1 card or 10,000 banners — we handle it all.",
    num: '03',
  },
  {
    icon: Headphones,
    title: 'Design Support',
    desc: 'Need artwork help? Our team assists with file prep and layout.',
    num: '04',
  },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function WhyUsSection() {
  return (
    <section className="relative bg-white overflow-hidden py-24 sm:py-32">


      {/* Gradient spots */}
      <div aria-hidden className="pointer-events-none absolute top-[-4rem] right-[10%] w-[26rem] h-[26rem] rounded-full bg-brand-100/60 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-[-4rem] left-[5%] w-[22rem] h-[22rem] rounded-full bg-slate-200/60 blur-[90px]" />

      <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
          <div>
            <motion.p {...fadeUp(0)} className="text-brand-500 text-xs font-bold uppercase tracking-[0.22em] mb-3">
              Why Inksetters
            </motion.p>
            <motion.h2
              {...fadeUp(0.08)}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-none text-slate-900"
            >
              Built for print.
              <br />
              <span className="text-brand-500">Made for you.</span>
            </motion.h2>
          </div>

          <motion.p {...fadeUp(0.15)} className="text-slate-400 text-base leading-relaxed max-w-xs lg:text-right">
            Lahore's trusted print partner — quality, speed & honesty, every time.
          </motion.p>
        </div>

        {/* Benefits — 4 columns with dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-100 rounded-3xl overflow-hidden">
          {BENEFITS.map(({ icon: Icon, title, desc, num }, i) => (
            <motion.div
              key={title}
              {...fadeUp(0.1 + i * 0.07)}
              className="group relative p-8 lg:p-10
                         border-b border-slate-100 sm:last:border-b-0
                         sm:[&:nth-child(odd)]:border-r sm:border-slate-100
                         lg:border-b-0 lg:[&:not(:last-child)]:border-r
                         hover:bg-slate-50 transition-colors duration-300 overflow-hidden"
            >
              {/* Large background number */}
              <span
                aria-hidden
                className="absolute -top-2 -right-2 text-[6rem] font-black leading-none
                           text-slate-50 group-hover:text-brand-50 select-none pointer-events-none
                           transition-colors duration-500"
              >
                {num}
              </span>

              {/* Small number badge */}
              <p className="text-brand-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
                {num}
              </p>

              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-brand-50 group-hover:bg-brand-100
                              flex items-center justify-center mb-6 transition-colors duration-300">
                <Icon size={20} className="text-brand-500" />
              </div>

              {/* Text */}
              <h3 className="font-black text-slate-900 text-lg leading-tight mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>

              {/* Bottom line on hover */}
              <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-brand-400
                              scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          {...fadeUp(0.4)}
          className="mt-6 bg-slate-900 rounded-3xl px-8 sm:px-12 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <p className="text-white font-black text-2xl sm:text-3xl tracking-tight leading-tight">
              Ready to print? <span className="text-brand-400">Let's go.</span>
            </p>
            <p className="text-slate-400 text-sm mt-1.5">
              Browse our product catalog and place your order in minutes.
            </p>
          </div>

          <a
            href="#collections"
            className="shrink-0 inline-flex items-center gap-2.5 bg-brand-500 hover:bg-brand-400
                       text-white font-bold px-7 py-4 rounded-2xl transition-colors duration-200 text-sm group"
          >
            Start Your Order
            <svg
              width="16" height="16" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2.5}
              className="group-hover:translate-x-1 transition-transform duration-200"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  )
}
