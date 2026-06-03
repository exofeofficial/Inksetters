import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ahmed Raza',
    role: 'Brand Owner, Lahore',
    text: 'Inksetters delivered our business cards perfectly. The quality was so impressive that clients kept asking where we got them printed.',
    rating: 5,
    initial: 'AR',
    color: 'bg-brand-500',
  },
  {
    id: 2,
    name: 'Sara Malik',
    role: 'Event Manager',
    text: 'Banners and stickers were ready in a single day — and delivered right on time. Inksetters will always be my first call for events.',
    rating: 5,
    initial: 'SM',
    color: 'bg-slate-700',
  },
  {
    id: 3,
    name: 'Usman Tariq',
    role: 'Clothing Brand, DHA',
    text: 'The custom jersey quality was exceptional. Colors came out exactly as designed. Couldn\'t be more satisfied with the result.',
    rating: 5,
    initial: 'UT',
    color: 'bg-brand-600',
  },
  {
    id: 4,
    name: 'Hira Fatima',
    role: 'Startup Founder',
    text: 'Packaging boxes were customized exactly to our brand. Professional finish at an affordable price — the perfect combination.',
    rating: 5,
    initial: 'HF',
    color: 'bg-slate-600',
  },
  {
    id: 5,
    name: 'Bilal Khan',
    role: 'Marketing Agency',
    text: '500 brochures ready the next day. Incredible turnaround time without compromising on quality. Will always come back.',
    rating: 5,
    initial: 'BK',
    color: 'bg-brand-500',
  },
  {
    id: 6,
    name: 'Zainab Hussain',
    role: 'Boutique Owner',
    text: 'Labels and stickers printed super clean. The transparent PVC quality elevated our product packaging to a premium feel.',
    rating: 5,
    initial: 'ZH',
    color: 'bg-slate-700',
  },
]

// Duplicate rows so they fill the wide track
const ROW_1 = [...TESTIMONIALS, ...TESTIMONIALS.slice(0, 3)]
const ROW_2 = [...TESTIMONIALS.slice(2), ...TESTIMONIALS.slice(0, 4)]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ t }) {
  return (
    <div className="w-[300px] sm:w-[360px] shrink-0 bg-white rounded-2xl border border-slate-100
                    shadow-sm p-6 flex flex-col gap-4 select-none">
      {/* Quote */}
      <svg className="w-7 h-7 text-brand-400/30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      <p className="text-slate-600 text-sm leading-relaxed flex-1">{t.text}</p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center shrink-0`}>
            <span className="text-white text-[11px] font-bold">{t.initial}</span>
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm leading-tight">{t.name}</p>
            <p className="text-slate-400 text-[11px]">{t.role}</p>
          </div>
        </div>
        <Stars />
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Row 1 slides left, Row 2 slides right as user scrolls
  const x1 = useTransform(scrollYProgress, [0, 1], ['4%', '-18%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['-12%', '8%'])

  return (
    <section
      ref={sectionRef}
      className="relative bg-white overflow-hidden py-24 sm:py-32"
    >
      {/* Gradient spots */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-[15%] w-[30rem] h-[30rem] rounded-full bg-brand-100/50 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-[10%] w-[26rem] h-[26rem] rounded-full bg-slate-200/60 blur-[100px]" />

      {/* Header */}
      <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-brand-500 text-xs font-bold uppercase tracking-[0.22em] mb-3"
            >
              Client Stories
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl font-black tracking-tighter leading-none text-slate-900"
            >
              500+ clients.
              <span className="text-brand-500"> All happy.</span>
            </motion.h2>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-5 shrink-0"
          >
            {[
              { val: '5.0★', label: 'Avg rating' },
              { val: '500+', label: 'Happy clients' },
              { val: '10k+', label: 'Prints done' },
            ].map(({ val, label }, i) => (
              <div key={label} className="flex items-center gap-5">
                {i > 0 && <div className="w-px h-10 bg-slate-200" />}
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-900">{val}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Parallax rows */}
      <div className="space-y-4">

        {/* Row 1 — slides left on scroll */}
        <div className="overflow-hidden">
          <motion.div style={{ x: x1 }} className="flex gap-4 px-6">
            {ROW_1.map((t, i) => (
              <TestimonialCard key={`r1-${t.id}-${i}`} t={t} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 — slides right on scroll */}
        <div className="overflow-hidden">
          <motion.div style={{ x: x2 }} className="flex gap-4 px-6">
            {ROW_2.map((t, i) => (
              <TestimonialCard key={`r2-${t.id}-${i}`} t={t} />
            ))}
          </motion.div>
        </div>

      </div>

      {/* Bottom CTA */}
      <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4
                     border-t border-slate-100 pt-8"
        >
          <p className="text-slate-400 text-sm">
            Join hundreds of satisfied clients across Pakistan
          </p>
          <a
            href="#collections"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800
                       text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors duration-200 group"
          >
            Start Your Order
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              className="group-hover:translate-x-0.5 transition-transform duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>

    </section>
  )
}
