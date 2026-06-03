import { motion } from 'framer-motion'
import { MapPin, Award, Users, Heart, ArrowRight, Printer } from 'lucide-react'

const VALUES = [
  {
    icon: Award,
    title: 'Quality First',
    desc: 'We use premium stocks and industry-grade equipment. Every print leaves our shop looking its best.',
  },
  {
    icon: Heart,
    title: 'Client Obsessed',
    desc: 'Your brand matters to us. We take the time to understand your vision and deliver exactly what you need.',
  },
  {
    icon: Users,
    title: 'Community Rooted',
    desc: 'Born in Lahore, built for Lahore. We\'re proud to serve local businesses, startups, and creatives.',
  },
  {
    icon: Printer,
    title: 'Always Innovating',
    desc: 'From DTF printing to custom packaging — we keep adding services so you never need to look elsewhere.',
  },
]

const STATS = [
  { value: '2019',  label: 'Est. Year'       },
  { value: '500+',  label: 'Happy Clients'   },
  { value: '10k+',  label: 'Prints Delivered' },
  { value: '24hr',  label: 'Avg Turnaround'  },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
})

export default function AboutSection() {
  return (
    <section id="about" className="relative bg-white overflow-hidden py-24 sm:py-32">

      {/* Gradient spots */}
      <div aria-hidden className="pointer-events-none absolute top-0 right-[15%] w-[28rem] h-[28rem] rounded-full bg-brand-100/50 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-[5%] w-[22rem] h-[22rem] rounded-full bg-slate-200/60 blur-[90px]" />

      <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Hero row ── */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-20">

          {/* Left — text */}
          <div>
            <motion.p {...fadeUp(0)} className="text-brand-500 text-xs font-bold uppercase tracking-[0.22em] mb-4">
              About Us
            </motion.p>
            <motion.h2 {...fadeUp(0.08)}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-none text-slate-900 mb-6">
              More than just
              <span className="text-brand-500"> a print shop.</span>
            </motion.h2>
            <motion.p {...fadeUp(0.14)} className="text-slate-500 text-base leading-relaxed mb-4">
              Inksetters started with a single mission — to bring professional-grade printing within reach of every
              business in Lahore. From a humble counter setup, we've grown into a full-service print studio trusted
              by hundreds of brands, startups, and event managers across the city.
            </motion.p>
            <motion.p {...fadeUp(0.18)} className="text-slate-500 text-base leading-relaxed mb-8">
              We believe every print is a statement. Whether it's a visiting card, a custom jersey, or a towering
              vinyl banner — we put the same care and precision into every single job.
            </motion.p>

            <motion.div {...fadeUp(0.22)} className="flex items-center gap-2 text-slate-500 text-sm mb-8">
              <MapPin size={15} className="text-brand-500 shrink-0" />
              <span>Based in <span className="font-semibold text-slate-700">Lahore, Pakistan</span></span>
            </motion.div>

            <motion.a
              {...fadeUp(0.26)}
              href="https://wa.me/923398000112"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white
                         font-bold px-6 py-3.5 rounded-2xl transition-all duration-200 text-sm
                         hover:-translate-y-0.5 hover:shadow-lg"
            >
              Say Hello
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </motion.a>
          </div>

          {/* Right — visual */}
          <motion.div {...fadeUp(0.1)} className="relative">

            {/* Main image / graphic card */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 aspect-[4/3] shadow-2xl">
              <img
                src="/logo-01.png"
                alt="Inksetters"
                className="absolute inset-0 w-full h-full object-contain p-14 opacity-20"
              />
              {/* Overlay pattern */}
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <img src="/logo-01.png" alt="Inksetters" className="h-14 w-auto brightness-0 invert mb-6 opacity-90" />
                <p className="text-white/60 text-sm font-medium tracking-widest uppercase">
                  The Trendsetters of Inked Creations
                </p>
                <div className="mt-6 w-12 h-px bg-brand-400" />
                <p className="text-brand-400 text-xs font-bold tracking-[0.2em] uppercase mt-4">Lahore, Pakistan</p>
              </div>
            </div>

            {/* Floating stat pill */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-5 -left-5 bg-white border border-slate-100 rounded-2xl
                         shadow-xl px-5 py-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <Award size={18} className="text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Established</p>
                <p className="text-xl font-black text-slate-900">2019</p>
              </div>
            </motion.div>

            {/* Floating client count */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-5 -right-5 bg-slate-900 rounded-2xl
                         shadow-xl px-5 py-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center shrink-0">
                <Users size={18} className="text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Happy Clients</p>
                <p className="text-xl font-black text-white">500<span className="text-brand-400">+</span></p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Stats strip ── */}
        <motion.div
          {...fadeUp(0.2)}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden mb-20"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="bg-white px-6 py-7 text-center hover:bg-slate-50 transition-colors">
              <p className="text-3xl sm:text-4xl font-black text-brand-500">{value}</p>
              <p className="text-slate-400 text-xs mt-1 font-medium">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Values grid ── */}
        <div>
          <motion.div {...fadeUp(0)} className="text-center mb-10">
            <p className="text-brand-500 text-xs font-bold uppercase tracking-[0.22em] mb-3">Our Values</p>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900">
              What we stand for
            </h3>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                {...fadeUp(0.08 + i * 0.07)}
                className="group relative bg-white border border-slate-100 rounded-2xl p-6
                           hover:border-brand-200 hover:shadow-lg hover:-translate-y-1
                           transition-all duration-300 overflow-hidden"
              >
                {/* Hover accent */}
                <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-brand-400 rounded-full
                                scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                <div className="w-11 h-11 rounded-xl bg-brand-50 group-hover:bg-brand-100
                                flex items-center justify-center mb-5 transition-colors duration-300">
                  <Icon size={20} className="text-brand-500" />
                </div>
                <h4 className="font-black text-slate-900 text-base mb-2">{title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
