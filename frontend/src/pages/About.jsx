import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Award, Users, Heart, Printer, ArrowRight, Phone, Mail, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'

const VALUES = [
  {
    icon: Award,
    title: 'Quality First',
    desc: 'We use premium stocks and industry-grade equipment. Every print leaves our shop looking its best.',
    color: 'bg-amber-50 text-amber-500',
  },
  {
    icon: Heart,
    title: 'Client Obsessed',
    desc: 'Your brand matters to us. We take the time to understand your vision and deliver exactly what you need.',
    color: 'bg-rose-50 text-rose-500',
  },
  {
    icon: Users,
    title: 'Community Rooted',
    desc: "Born in Lahore, built for Lahore. We're proud to serve local businesses, startups, and creatives.",
    color: 'bg-sky-50 text-sky-500',
  },
  {
    icon: Printer,
    title: 'Always Innovating',
    desc: 'From DTF printing to custom packaging — we keep adding services so you never need to look elsewhere.',
    color: 'bg-brand-50 text-brand-500',
  },
]

const STATS = [
  { value: '2019', label: 'Established'      },
  { value: '500+', label: 'Happy Clients'    },
  { value: '10k+', label: 'Prints Delivered' },
  { value: '24hr', label: 'Avg Turnaround'   },
]

const SERVICES_LIST = [
  'Art Card & Business Card Printing',
  'PVC, Paper & Transparent Stickers',
  'DTF Custom Apparel & Jerseys',
  'Branded Packaging & Boxes',
  'Brochures, Flyers & Stationery',
  'Vinyl & Cloth Banners',
  'Lamination & Plotter Cutting',
  'Screen Printing',
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
})

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-slate-900 overflow-hidden pt-28 pb-24 sm:pt-36 sm:pb-32">
        {/* Blobs */}
        <div aria-hidden className="pointer-events-none absolute top-0 left-[20%] w-[34rem] h-[34rem] rounded-full bg-brand-500/10 blur-[100px]" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-[10%] w-[26rem] h-[26rem] rounded-full bg-brand-500/8 blur-[90px]" />

        <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/25 rounded-full px-4 py-1.5 mb-6"
            >
              <MapPin size={13} className="text-brand-400" />
              <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.18em]">Lahore, Pakistan</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none text-white mb-6"
            >
              More than just
              <span className="block text-brand-400">a print shop.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.6 }}
              className="text-slate-400 text-lg leading-relaxed max-w-xl"
            >
              Inksetters is Lahore's trusted print studio — delivering quality prints with speed,
              honesty, and a passion for great design since 2019.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="relative py-24 sm:py-32 bg-white overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute top-0 right-[10%] w-[26rem] h-[26rem] rounded-full bg-brand-100/50 blur-[110px]" />

        <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <div>
              <motion.p {...fadeUp(0)} className="text-brand-500 text-xs font-bold uppercase tracking-[0.22em] mb-4">Our Story</motion.p>
              <motion.h2 {...fadeUp(0.08)} className="text-4xl sm:text-5xl font-black tracking-tighter leading-none text-slate-900 mb-6">
                Built from
                <span className="text-brand-500"> passion.</span>
              </motion.h2>
              <motion.div {...fadeUp(0.14)} className="space-y-4 text-slate-500 text-base leading-relaxed">
                <p>
                  Inksetters started with a single mission — to bring professional-grade printing within reach of
                  every business in Lahore. From a humble counter setup, we've grown into a full-service print
                  studio trusted by hundreds of brands, startups, and event managers across the city.
                </p>
                <p>
                  We believe every print is a statement. Whether it's a visiting card, a custom jersey, or a
                  towering vinyl banner — we put the same care and precision into every single job.
                </p>
                <p>
                  Today, Inksetters offers one of the widest ranges of printing services under one roof in Lahore,
                  backed by fast turnaround times and a team that genuinely cares about your brand.
                </p>
              </motion.div>
            </div>

            {/* Right — branded card */}
            <motion.div {...fadeUp(0.1)} className="relative">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 aspect-[4/3] shadow-2xl">
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                  <img src="/logo-01.png" alt="Inksetters" className="h-14 w-auto brightness-0 invert mb-6 opacity-90" />
                  <p className="text-white/50 text-sm font-medium tracking-widest uppercase">The Trendsetters of Inked Creations</p>
                  <div className="mt-5 w-10 h-px bg-brand-400" />
                  <p className="text-brand-400 text-xs font-bold tracking-[0.2em] uppercase mt-4">Est. 2019 · Lahore</p>
                </div>
              </div>

              {/* Floating pills */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -bottom-5 -left-5 bg-white border border-slate-100 rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Award size={18} className="text-brand-500" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Established</p>
                  <p className="text-xl font-black text-slate-900">2019</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -top-5 -right-5 bg-slate-900 rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center shrink-0">
                  <Users size={18} className="text-brand-400" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Happy Clients</p>
                  <p className="text-xl font-black text-white">500<span className="text-brand-400">+</span></p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label} {...fadeUp(i * 0.07)}
                className="bg-white px-6 py-8 text-center hover:bg-slate-50 transition-colors"
              >
                <p className="text-4xl font-black text-brand-500">{value}</p>
                <p className="text-slate-400 text-xs mt-1 font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="relative py-24 sm:py-32 bg-white overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-[10%] w-[24rem] h-[24rem] rounded-full bg-slate-100/80 blur-[90px]" />

        <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.p {...fadeUp(0)} className="text-brand-500 text-xs font-bold uppercase tracking-[0.22em] mb-3">Our Values</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900">
              What we stand for
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title} {...fadeUp(0.08 + i * 0.08)}
                className="group relative bg-white border border-slate-100 rounded-2xl p-6
                           hover:border-brand-200 hover:shadow-xl hover:-translate-y-1
                           transition-all duration-300 overflow-hidden"
              >
                <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-brand-400 rounded-full
                                scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${color}`}>
                  <Icon size={20} />
                </div>
                <h4 className="font-black text-slate-900 text-base mb-2">{title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES LIST ── */}
      <section className="bg-slate-900 py-20 overflow-hidden relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[50rem] h-[20rem] rounded-full bg-brand-500/8 blur-[100px]" />
        </div>

        <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12">
            <div className="lg:w-72 shrink-0">
              <motion.p {...fadeUp(0)} className="text-brand-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">What We Offer</motion.p>
              <motion.h2 {...fadeUp(0.08)} className="text-3xl sm:text-4xl font-black tracking-tighter text-white leading-tight">
                All under
                <span className="text-brand-400"> one roof.</span>
              </motion.h2>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES_LIST.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.45 }}
                  className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors"
                >
                  <CheckCircle size={15} className="text-brand-400 shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{s}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-white">
        <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp(0)}
            className="relative bg-slate-900 rounded-3xl px-8 sm:px-14 py-14 text-center overflow-hidden"
          >
            <div aria-hidden className="pointer-events-none absolute top-0 left-1/4 w-[30rem] h-[15rem] rounded-full bg-brand-500/10 blur-[80px]" />
            <div className="relative">
              <p className="text-brand-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Ready to Work Together?</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-4">
                Let's create something <span className="text-brand-400">great.</span>
              </h2>
              <p className="text-slate-400 text-base mb-8 max-w-md mx-auto">
                Reach out on WhatsApp or browse our services — we're always happy to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://wa.me/923398000112"
                  target="_blank" rel="noreferrer"
                  className="group inline-flex items-center gap-2.5 bg-brand-500 hover:bg-brand-400 text-white
                             font-bold px-7 py-4 rounded-2xl transition-all duration-200 text-sm hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/25"
                >
                  <Phone size={16} />
                  WhatsApp Us
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-semibold text-sm transition-colors"
                >
                  View Our Services
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  )
}
