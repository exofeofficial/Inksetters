import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send, ChevronDown } from 'lucide-react'
import { addOrder } from '../lib/db'

const SERVICES = [
  'Card Printing',
  'Stickers',
  'Apparel Print',
  'Packaging',
  'Stationery',
  'Banners',
  'Other',
]

const TRUST = [
  { icon: CheckCircle2, text: 'Fast turnaround — same or next day' },
  { icon: CheckCircle2, text: 'Premium quality materials' },
  { icon: CheckCircle2, text: 'Custom sizes & bulk orders welcome' },
  { icon: CheckCircle2, text: 'Free design consultation' },
]

const CONTACT = [
  { icon: Phone,   label: 'Call / WhatsApp', value: '+92 300 0000000' },
  { icon: Mail,    label: 'Email',           value: 'info@inksetters.com' },
  { icon: MapPin,  label: 'Location',        value: 'Lahore, Pakistan' },
  { icon: Clock,   label: 'Hours',           value: 'Mon–Sat  9 am – 8 pm' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
})

export default function ContactSection() {
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    service: '',
    qty: '',
    note: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | done | error

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await addOrder({
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        note: `Service: ${form.service} | Qty: ${form.qty || '—'} | ${form.note.trim()}`,
        items: [{ product: form.service, qty: Number(form.qty) || 1, unitPrice: 0, lineTotal: 0 }],
        total: 0,
      })
      setStatus('done')
      setForm({ customerName: '', phone: '', service: '', qty: '', note: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative bg-white overflow-hidden py-24 sm:py-32">
      {/* top border accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent" />

      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT ── */}
          <div>
            <motion.p {...fadeUp(0)} className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-3">
              Get In Touch
            </motion.p>

            <motion.h2 {...fadeUp(0.08)} className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 leading-tight mb-5">
              Let's bring your<br />
              <span className="text-brand-500">vision to print.</span>
            </motion.h2>

            <motion.p {...fadeUp(0.14)} className="text-slate-500 text-base leading-relaxed mb-10 max-w-md">
              Fill out the form and our team will get back to you within a few hours.
              Whether it's a small batch or a bulk order — we've got you covered.
            </motion.p>

            {/* Trust list */}
            <motion.ul {...fadeUp(0.18)} className="space-y-3 mb-12">
              {TRUST.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-slate-700 text-sm">
                  <Icon size={17} className="text-brand-500 shrink-0" />
                  {text}
                </li>
              ))}
            </motion.ul>

            {/* Contact details */}
            <motion.div {...fadeUp(0.22)} className="grid sm:grid-cols-2 gap-4">
              {CONTACT.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                    <p className="text-sm text-slate-800 font-semibold mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT — FORM ── */}
          <motion.div {...fadeUp(0.1)}>
            {status === 'done' ? (
              <div className="rounded-3xl border border-brand-200 bg-brand-50 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-400 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={30} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Request Received!</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto mb-6">
                  Shukriya! Hamari team jald hi aap se rabta karegi.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl px-6 py-2.5 transition-colors"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-5"
              >
                <h3 className="text-xl font-black text-slate-900">Request a Quote</h3>
                <p className="text-slate-400 text-sm -mt-2">Free • No commitment</p>

                {/* Name + Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Full Name *"
                    type="text"
                    placeholder="e.g. Ali Hassan"
                    value={form.customerName}
                    onChange={set('customerName')}
                    required
                  />
                  <Field
                    label="Phone / WhatsApp *"
                    type="tel"
                    placeholder="+92 300 xxxxxxx"
                    value={form.phone}
                    onChange={set('phone')}
                    required
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Service Required *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={form.service}
                      onChange={set('service')}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition pr-10"
                    >
                      <option value="" disabled>Select a service…</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Qty */}
                <Field
                  label="Approximate Quantity"
                  type="number"
                  placeholder="e.g. 500"
                  value={form.qty}
                  onChange={set('qty')}
                  min="1"
                />

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Additional Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Size, design notes, deadline, or any special requirements…"
                    value={form.note}
                    onChange={set('note')}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors text-sm tracking-wide"
                >
                  {status === 'sending' ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Request
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  We respond within a few hours during business hours.
                </p>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ── Reusable input field ──
function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition"
      />
    </div>
  )
}
