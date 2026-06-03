import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

function Counter({ to, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const steps = 60
    const inc = to / steps
    const interval = (duration * 1000) / steps
    const t = setInterval(() => {
      start += inc
      if (start >= to) { setCount(to); clearInterval(t) }
      else setCount(Math.floor(start))
    }, interval)
    return () => clearInterval(t)
  }, [inView, to, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const STATS = [
  { value: 500, suffix: '+',  label: 'Happy Clients'    },
  { value: 10,  suffix: 'k+', label: 'Prints Delivered' },
  { value: 6,   suffix: '',   label: 'Product Types'    },
  { value: 24,  suffix: 'hr', label: 'Avg Turnaround'   },
]

const SERVICES = [
  { title: 'Card Printing',  desc: 'Art Card, Business Card, Visiting Cards — 300gsm premium stock.', image: '/P2.jpg',      span: 'lg:col-span-2' },
  { title: 'Stickers',       desc: 'Paper, PVC Matte, PVC Shine, Transparent & Silver Matte.',        image: '/P8.png',   span: 'lg:col-span-1' },
  { title: 'Apparel Print',  desc: 'Custom T-shirts, jerseys & textile printing in any design.',       image: '/P2.webp',    span: 'lg:col-span-1' },
  { title: 'Packaging',      desc: 'Custom envelopes, boxes, paper cups — brand-ready.',               image: '/P6.png',  span: 'lg:col-span-2' },
  { title: 'Stationery',     desc: 'Brochures, letterheads, flyers & offset printing.',                image: '/services/stationery.png', span: 'lg:col-span-1' },
  { title: 'Banners',        desc: 'Vinyl & cloth banners — indoor, outdoor, any size.',               image: '/P9.png',    span: 'lg:col-span-2' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function ServicesSection() {
  return (
    <section id="workflow" className="relative bg-slate-50 text-slate-900 overflow-hidden py-24 sm:py-32">


      {/* Gradient spots */}
      <div aria-hidden className="pointer-events-none absolute top-[-6rem] left-[-4rem] w-[28rem] h-[28rem] rounded-full bg-brand-200/40 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-[-4rem] right-[-4rem] w-[24rem] h-[24rem] rounded-full bg-slate-300/40 blur-[100px]" />

      <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-14">

          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-brand-600 text-xs font-bold uppercase tracking-[0.2em] mb-3"
            >
              What We Do
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-none"
            >
              Everything you need
              <span className="text-brand-500"> to print.</span>
            </motion.h2>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden shrink-0"
          >
            {STATS.map(({ value, suffix, label }) => (
              <div key={label} className="bg-white px-6 py-5 text-center">
                <p className="text-3xl font-black text-brand-500 tabular-nums">
                  <Counter to={value} suffix={suffix} />
                </p>
                <p className="text-slate-500 text-xs mt-0.5 whitespace-nowrap">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(({ title, desc, image, span }, i) => (
            <motion.div
              key={title}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={cardVariants}
              className={`group relative bg-white border border-slate-200 rounded-2xl p-8 overflow-hidden
                          flex flex-col justify-between min-h-[210px]
                          transition-all duration-300 cursor-default
                          shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand-200
                          ${span}`}
            >
              {/* Decorative background number */}
              <span
                aria-hidden
                className="absolute -bottom-3 -right-1 text-[7rem] font-black leading-none
                           text-slate-100 group-hover:text-brand-50 select-none pointer-events-none
                           transition-colors duration-500"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Left border accent */}
              <div className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full bg-brand-400
                              scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

              {/* Content */}
              <div className="relative z-10">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand-500 mb-3">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-3">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[60%]">{desc}</p>
              </div>

              {/* Bottom row */}
              <div className="relative z-10 flex items-center justify-between mt-8">
                <div className="h-px bg-brand-400 w-6 group-hover:w-14 transition-all duration-500 ease-out" />
                <div className="w-8 h-8 rounded-full border border-slate-200
                                group-hover:border-brand-400 group-hover:bg-brand-50
                                flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:text-brand-600 transition-colors duration-300" />
                </div>
              </div>

              {/* Image — slides in from bottom-right on hover */}
              <img
                src={image}
                alt=""
                aria-hidden
                className="absolute bottom-3 right-8 w-55 h-55 object-contain drop-shadow-lg pointer-events-none
                           translate-x-8 translate-y-8 opacity-0
                           group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100
                           transition-all duration-500 ease-out"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
