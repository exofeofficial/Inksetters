import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Package, Shirt, FileText, CreditCard, Megaphone,
  ArrowRight, CheckCircle, Phone, Mail, Zap, Users, Award, Clock,
  ChevronRight, Star, Send, ChevronDown, CheckCircle2, MapPin,
  UploadCloud, X, Tag, AlertTriangle,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'
import { addCorporateInquiry } from '../lib/db'

// ── Data ──────────────────────────────────────────────────────────────────────
const SERVICE_OPTS = [
  'Business Cards',
  'Uniform & Apparel',
  'Branded Packaging',
  'Stationery Kits',
  'Event Materials / Banners',
  'PVC ID Cards',
  'Multiple Services',
  'Other',
]

const SERVICES = [
  {
    icon: CreditCard,
    title: 'Business Cards',
    desc: 'Premium 300gsm art cards for your entire team. Bulk pricing with consistent quality across every piece.',
    tag: 'Most Popular',
    color: 'from-amber-400 to-orange-400',
    light: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Shirt,
    title: 'Uniform & Apparel',
    desc: 'Branded T-shirts, jerseys, polo shirts, and workwear. DTF or screen print — any quantity.',
    tag: null,
    color: 'from-sky-400 to-blue-500',
    light: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Package,
    title: 'Branded Packaging',
    desc: 'Custom boxes, bags, and envelopes with your logo. Elevate your unboxing experience.',
    tag: null,
    color: 'from-emerald-400 to-teal-500',
    light: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: FileText,
    title: 'Stationery Kits',
    desc: 'Letterheads, envelopes, notepads, and brochures — complete branded stationery for your office.',
    tag: null,
    color: 'from-violet-400 to-purple-500',
    light: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Megaphone,
    title: 'Event Materials',
    desc: 'Banners, roll-ups, standees, and signage for exhibitions, launches, and corporate events.',
    tag: null,
    color: 'from-rose-400 to-pink-500',
    light: 'bg-rose-50 text-rose-600',
  },
  {
    icon: CreditCard,
    title: 'PVC ID Cards',
    desc: 'Durable PVC cards for staff IDs, membership cards, and loyalty programs.',
    tag: null,
    color: 'from-brand-400 to-brand-600',
    light: 'bg-brand-50 text-brand-600',
  },
]

const BENEFITS = [
  { icon: Zap,   title: 'Fast Turnaround',    desc: '48–72 hr standard delivery for bulk orders. Rush available.' },
  { icon: Award, title: 'Consistent Quality', desc: 'Same premium finish on piece 1 and piece 1,000.' },
  { icon: Users, title: 'Dedicated Support',  desc: 'One point of contact for your entire order from start to finish.' },
  { icon: Clock, title: 'Flexible MOQ',       desc: 'No unreasonable minimums. We work with your actual needs.' },
]

const STATS = [
  { val: '500+', label: 'Corporate Clients', color: 'text-brand-400' },
  { val: '10k+', label: 'Bulk Orders Done',  color: 'text-sky-400' },
  { val: '48hr', label: 'Avg Delivery',      color: 'text-emerald-400' },
  { val: '100%', label: 'Satisfaction',      color: 'text-amber-400' },
]

const PROCESS = [
  { step: '01', title: 'Share Your Brief',  desc: 'Tell us what you need — quantity, material, size, design files.' },
  { step: '02', title: 'Get a Quote',       desc: 'We send a detailed quote within 2 hours. No hidden costs.' },
  { step: '03', title: 'Approve & Print',   desc: 'Confirm the proof, we start production immediately.' },
  { step: '04', title: 'Receive & Enjoy',   desc: 'Delivered to your door or picked up from our studio.' },
]

const CLIENTS = [
  'Tech Startups', 'Retail Brands', 'Event Agencies',
  'Real Estate Firms', 'Schools & Colleges', 'Restaurants & Cafes',
  'Healthcare Clinics', 'Fashion Labels', 'NGOs & Non-profits',
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
})

// ── WhatsApp notification via CallMeBot (free service) ────────────────────────
// Setup (one-time): Save contact "CallMeBot" with number +34 644 77 57 57 on WhatsApp,
// then send the message: "I allow callmebot to send me messages"
// They will reply with your API key. Add it to .env.local as:
//   VITE_CALLMEBOT_API_KEY=your_key_here
function notifyAdmin(data) {
  const apiKey = import.meta.env.VITE_CALLMEBOT_API_KEY
  if (!apiKey) return
  const text = [
    '🏢 *New Corporate Inquiry!*',
    `Company: ${data.companyName}`,
    `Contact: ${data.contactPerson}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : null,
    `Service: ${data.service}`,
    data.qty ? `Qty: ${data.qty}` : null,
    data.message ? `Note: ${data.message}` : null,
    '→ Check admin panel',
  ].filter(Boolean).join('\n')
  // Use no-cors mode — request is sent, response is opaque (we don't need it)
  fetch(
    `https://api.callmebot.com/whatsapp.php?phone=923227831753&text=${encodeURIComponent(text)}&apikey=${apiKey}`,
    { mode: 'no-cors' }
  ).catch(() => {})
}

// ── Cloudinary unsigned upload ─────────────────────────────────────────────
// IMPORTANT: PDFs must be uploaded to the *raw* endpoint, NOT image.
// Cloudinary blocks delivery of PDF/ZIP files stored as the "image" resource
// type on free/standard plans → that causes "Failed to load PDF document".
// Raw delivery has no such restriction and serves the bytes as-is.
//
// Cloudinary preset must be configured as:
//   Signing mode : Unsigned
//   Resource type: Raw  (or "Auto")  — Settings → Upload Presets → Edit
//   Transformations: NONE  ← image transforms corrupt PDFs
async function uploadToCloudinary(file) {
  const cloud  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!cloud || !preset) throw new Error('Cloudinary not configured')

  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', preset)

  // Upload as RAW so the PDF is delivered without Cloudinary's image-PDF block.
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/raw/upload`, { method: 'POST', body: fd })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message || 'Upload failed')
  // Raw secure_url is the correct delivery URL — return it as-is.
  return json.secure_url
}

const MIN_QTY_MAP = { 'Business Cards': 1000 }
const DISCOUNT_THRESHOLD = 500

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Corporate() {
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    service: '',
    qty: '',
    message: '',
  })
  const [file, setFile]         = useState(null)   // { raw: File, name, size }
  const [uploadPct, setUploadPct] = useState(0)
  const [status, setStatus]     = useState('idle') // idle | sending | done | error
  const fileRef = useRef()

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const minQty  = MIN_QTY_MAP[form.service] ?? 1
  const qty     = Number(form.qty)
  const qtyErr  = form.service && form.qty && qty < minQty
  const discount = qty >= DISCOUNT_THRESHOLD

  const pickFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') { alert('Only PDF files are allowed.'); return }
    if (f.size > 20 * 1024 * 1024)   { alert('File must be smaller than 20 MB.'); return }
    setFile({ raw: f, name: f.name, size: (f.size / 1024).toFixed(0) + ' KB' })
  }

  const onDrop = (e) => {
    e.preventDefault()
    pickFile(e.dataTransfer.files[0])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (qtyErr) return
    setStatus('sending')
    setUploadPct(0)
    try {
      let fileUrl = null
      if (file) {
        setUploadPct(30)
        fileUrl = await uploadToCloudinary(file.raw)
        setUploadPct(70)
      }
      const data = {
        companyName:   form.companyName.trim(),
        contactPerson: form.contactPerson.trim(),
        phone:         form.phone.trim(),
        email:         form.email.trim(),
        service:       form.service,
        qty:           form.qty,
        discount,
        message:       form.message.trim(),
        ...(fileUrl ? { fileUrl, fileName: file.name } : {}),
      }
      await addCorporateInquiry(data)
      setUploadPct(100)
      notifyAdmin(data)
      setStatus('done')
      setForm({ companyName: '', contactPerson: '', phone: '', email: '', service: '', qty: '', message: '' })
      setFile(null)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO + FORM ── */}
      <section className="relative bg-slate-900 overflow-hidden">
        {/* Blobs — desktop only, mobile pe remove (blur is killer on mobile GPU) */}
        <div aria-hidden className="pointer-events-none hidden sm:block absolute top-0 left-[8%] w-[44rem] h-[44rem] rounded-full bg-brand-500/8 blur-[130px]" />
        <div aria-hidden className="pointer-events-none hidden sm:block absolute bottom-0 right-[5%] w-[32rem] h-[32rem] rounded-full bg-sky-500/5 blur-[110px]" />
        {/* Grid — desktop only */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025] hidden sm:block"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />

        <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px] gap-10 xl:gap-24 items-start py-24 sm:py-28 lg:py-32">

            {/* ── LEFT — no animations on mobile (plain div), sm+ gets fade ── */}
            <div className="pt-2">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/25 rounded-full px-4 py-1.5 mb-8">
                <Building2 size={13} className="text-brand-400" />
                <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.18em]">Corporate Solutions</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tighter leading-none text-white mb-6">
                Print at scale.
                <span className="block text-brand-400">Built for business.</span>
              </h1>

              {/* Description */}
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg mb-8 sm:mb-10">
                From 50 business cards to 5,000 branded uniforms — Inksetters delivers consistent,
                premium-quality prints for businesses of every size across Lahore.
              </p>

              {/* Benefits list */}
              <ul className="space-y-4 mb-10">
                {BENEFITS.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={16} className="text-brand-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">{title}</p>
                      <p className="text-slate-500 text-sm leading-snug mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 sm:mb-10">
                {STATS.map(({ val, label, color }) => (
                  <div key={label} className="bg-white/5 border border-white/8 rounded-2xl p-3 sm:p-4 text-center">
                    <p className={`text-xl sm:text-2xl font-black ${color}`}>{val}</p>
                    <p className="text-slate-500 text-xs mt-1 font-medium">{label}</p>
                  </div>
                ))}
              </div>

              {/* Contact details */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <a href="https://wa.me/923398000112" target="_blank" rel="noreferrer"
                   className="flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-brand-400" />
                  </div>
                  +92 339 8000112
                </a>
                <a href="mailto:info.inksetters@gmail.com"
                   className="flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center shrink-0">
                    <Mail size={14} className="text-brand-400" />
                  </div>
                  info.inksetters@gmail.com
                </a>
                <span className="flex items-center gap-2 text-slate-500 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-slate-500" />
                  </div>
                  Lahore, Pakistan
                </span>
              </div>
            </div>

            {/* ── RIGHT — Form — no animation wrapper (content shows instantly) ── */}
            <div className="lg:sticky lg:top-8">
              <AnimatePresence mode="wait">
                {status === 'done' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white rounded-3xl p-10 text-center shadow-2xl shadow-black/30"
                  >
                    <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-500/30">
                      <CheckCircle2 size={30} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Inquiry Received!</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-7">
                      Thank you! Our team will get back to you within 2 hours.
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-7">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" className="text-amber-400" />
                      ))}
                    </div>
                    <button
                      onClick={() => setStatus('idle')}
                      className="bg-slate-900 hover:bg-slate-700 text-white text-sm font-bold rounded-xl px-6 py-2.5 transition-colors"
                    >
                      Submit another inquiry
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={onSubmit}
                    className="bg-white rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/30"
                  >
                    {/* Form header */}
                    <div className="mb-7">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                        <span className="text-brand-500 text-[11px] font-black uppercase tracking-[0.18em]">Free Quote • No Commitment</span>
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                        Get a Corporate Quote
                      </h2>
                      <p className="text-slate-400 text-sm mt-1.5">
                        Fill the form — we'll respond within 2 hours.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Company + Contact Person */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field
                          label="Company Name *"
                          type="text"
                          placeholder="e.g. Acme Corp"
                          value={form.companyName}
                          onChange={set('companyName')}
                          required
                        />
                        <Field
                          label="Contact Person *"
                          type="text"
                          placeholder="e.g. Ali Hassan"
                          value={form.contactPerson}
                          onChange={set('contactPerson')}
                          required
                        />
                      </div>

                      {/* Phone + Email */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field
                          label="WhatsApp / Phone *"
                          type="tel"
                          placeholder="+92 300 xxxxxxx"
                          value={form.phone}
                          onChange={set('phone')}
                          required
                        />
                        <Field
                          label="Email Address"
                          type="email"
                          placeholder="you@company.com"
                          value={form.email}
                          onChange={set('email')}
                        />
                      </div>

                      {/* Service */}
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">
                          Service Required *
                        </label>
                        <div className="relative">
                          <select
                            required
                            value={form.service}
                            onChange={set('service')}
                            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition pr-10 cursor-pointer"
                          >
                            <option value="" disabled>Select a service…</option>
                            {SERVICE_OPTS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        {/* Min qty hint for Business Cards */}
                        {form.service === 'Business Cards' && (
                          <p className="flex items-center gap-1 mt-1.5 text-amber-600 text-[11px] font-semibold">
                            <AlertTriangle size={11} />
                            Minimum order: 1,000 business cards
                          </p>
                        )}
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">
                          Quantity {minQty > 1 ? `(min ${minQty.toLocaleString()})` : ''}
                        </label>
                        <input
                          type="number"
                          placeholder={minQty > 1 ? `Min ${minQty.toLocaleString()} pcs` : 'e.g. 500'}
                          value={form.qty}
                          onChange={set('qty')}
                          min={minQty}
                          className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400
                                     focus:outline-none focus:ring-2 transition
                                     ${qtyErr
                                       ? 'border-red-300 focus:ring-red-300 focus:border-red-400'
                                       : 'border-slate-200 focus:ring-brand-400 focus:border-brand-400'
                                     }`}
                        />
                        <AnimatePresence mode="wait">
                          {qtyErr ? (
                            <motion.p
                              key="err"
                              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="flex items-center gap-1.5 mt-1.5 text-red-500 text-[11px] font-semibold"
                            >
                              <AlertTriangle size={11} />
                              Minimum {minQty.toLocaleString()} pieces required for {form.service}
                            </motion.p>
                          ) : discount && form.qty ? (
                            <motion.div
                              key="disc"
                              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="flex items-center gap-1.5 mt-1.5"
                            >
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[11px] font-black rounded-full border border-emerald-200">
                                <Tag size={10} />
                                Bulk Discount Applied!
                              </span>
                              <span className="text-slate-400 text-[11px]">orders above 500 pcs get a discount</span>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">
                          Requirements / Notes
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Size, design notes, deadline, special requirements…"
                          value={form.message}
                          onChange={set('message')}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition resize-none"
                        />
                      </div>

                      {/* PDF Upload */}
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">
                          Design File (PDF)
                        </label>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={e => pickFile(e.target.files[0])}
                        />
                        {file ? (
                          <div className="flex items-center gap-3 bg-brand-50 border border-brand-200 rounded-xl px-4 py-3">
                            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
                              <FileText size={16} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-800 text-sm font-bold truncate">{file.name}</p>
                              <p className="text-slate-400 text-xs">{file.size}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = '' }}
                              className="w-7 h-7 rounded-lg hover:bg-brand-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shrink-0"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div
                            onDrop={onDrop}
                            onDragOver={e => e.preventDefault()}
                            onClick={() => fileRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-xl px-4 py-5
                                       flex flex-col items-center gap-1.5 cursor-pointer
                                       hover:bg-brand-50/50 transition-all duration-200 group"
                          >
                            <UploadCloud size={22} className="text-slate-300 group-hover:text-brand-400 transition-colors" />
                            <p className="text-slate-500 text-xs font-semibold group-hover:text-brand-600 transition-colors">
                              Click or drag & drop PDF
                            </p>
                            <p className="text-slate-400 text-[11px]">Max 20 MB • Optional</p>
                          </div>
                        )}
                      </div>

                      {status === 'error' && (
                        <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5 border border-red-100">
                          Something went wrong. Please try again or contact us on WhatsApp.
                        </p>
                      )}

                      {/* Upload progress bar */}
                      {status === 'sending' && file && uploadPct < 100 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-400">
                            <span>Uploading file…</span><span>{uploadPct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-brand-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadPct}%` }}
                              transition={{ duration: 0.4 }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={status === 'sending' || qtyErr}
                        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-black rounded-xl py-4 flex items-center justify-center gap-2.5 transition-all duration-200 text-[15px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/30 active:translate-y-0"
                      >
                        {status === 'sending' ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                            {file && uploadPct < 70 ? 'Uploading file…' : 'Submitting…'}
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Submit Inquiry
                            <ArrowRight size={15} className="opacity-80" />
                          </>
                        )}
                      </button>

                      {/* Trust badges */}
                      <div className="flex items-center justify-center gap-4 pt-0.5">
                        {['No hidden fees', 'Free proof', 'Bulk discounts'].map((t) => (
                          <div key={t} className="flex items-center gap-1 text-slate-400 text-[11px]">
                            <CheckCircle size={11} className="text-brand-400 shrink-0" />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="relative py-24 sm:py-32 bg-slate-50 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute top-0 right-[10%] w-[26rem] h-[26rem] rounded-full bg-brand-100/50 blur-[110px]" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-[5%] w-[22rem] h-[22rem] rounded-full bg-slate-200/60 blur-[90px]" />

        <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.p {...fadeUp(0)} className="text-brand-500 text-xs font-bold uppercase tracking-[0.22em] mb-3">What We Offer</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900">
              Everything your brand needs
            </motion.h2>
            <motion.p {...fadeUp(0.14)} className="text-slate-400 text-base mt-3 max-w-lg mx-auto">
              Full-range printing solutions tailored for corporate accounts — with bulk pricing and zero compromise on quality.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(({ icon: Icon, title, desc, tag, color, light }, i) => (
              <motion.div
                key={title} {...fadeUp(0.07 + i * 0.06)}
                className="group relative bg-white border border-slate-100 rounded-2xl p-6
                           hover:border-slate-200 hover:shadow-xl hover:-translate-y-1
                           transition-all duration-300 overflow-hidden"
              >
                {tag && (
                  <span className="absolute top-4 right-4 bg-brand-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {tag}
                  </span>
                )}
                <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${color} rounded-full
                                 scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${light}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1.5 mt-4 text-brand-500 text-xs font-bold group-hover:gap-2.5 transition-all duration-200">
                  Get Quote <ChevronRight size={13} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-24 sm:py-32 bg-white overflow-hidden relative">
        <div aria-hidden className="pointer-events-none absolute top-0 left-[20%] w-[28rem] h-[28rem] rounded-full bg-brand-50 blur-[100px]" />

        <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p {...fadeUp(0)} className="text-brand-500 text-xs font-bold uppercase tracking-[0.22em] mb-4">Why Inksetters</motion.p>
              <motion.h2 {...fadeUp(0.08)} className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 mb-4 leading-none">
                The corporate print
                <span className="text-brand-500"> partner you need.</span>
              </motion.h2>
              <motion.p {...fadeUp(0.14)} className="text-slate-500 text-base leading-relaxed mb-8">
                We understand that corporate clients need reliability above everything else.
                Deadlines are real, brand consistency matters, and every print reflects your company.
                That's why we take every bulk order as seriously as you do.
              </motion.p>
              <motion.div {...fadeUp(0.2)}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Trusted By</p>
                <div className="flex flex-wrap gap-2">
                  {CLIENTS.map((c, i) => (
                    <motion.span
                      key={c}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.25 + i * 0.04 }}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full
                                 hover:bg-brand-50 hover:text-brand-600 transition-colors duration-200"
                    >
                      {c}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title} {...fadeUp(0.1 + i * 0.08)}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-white hover:border-brand-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-brand-500" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">{title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-20 sm:py-28 bg-slate-900 overflow-hidden relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[56rem] h-[20rem] rounded-full bg-brand-500/8 blur-[100px]" />
        </div>

        <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.p {...fadeUp(0)} className="text-brand-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">How It Works</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="text-4xl sm:text-5xl font-black tracking-tighter text-white">
              Simple. Fast. Done.
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300"
              >
                {i < PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-5 h-px bg-brand-500/30 z-10" />
                )}
                <span className="text-[3.5rem] font-black leading-none text-brand-500/20 select-none block mb-3">{step}</span>
                <h3 className="font-black text-white text-base mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA nudge */}
          <motion.div {...fadeUp(0.3)} className="text-center mt-14">
            <p className="text-slate-500 text-sm mb-4">Ready to get started?</p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/30 text-sm"
            >
              Fill the Inquiry Form
              <ArrowRight size={15} />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  )
}

// ── Reusable input ──
function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition"
      />
    </div>
  )
}
