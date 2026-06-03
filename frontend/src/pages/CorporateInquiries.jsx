import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Phone, Mail, Package, Calendar, Trash2,
  PhoneCall, CheckCircle2, RefreshCw, Search, Filter,
  ChevronDown, ChevronUp, MessageSquare, Hash, Clock,
  TrendingUp, AlertCircle, FileText, Tag, ExternalLink, Download,
} from 'lucide-react'
import {
  subscribeCorporateInquiries,
  updateCorporateInquiryStatus,
  deleteCorporateInquiry,
} from '../lib/db'

// Fetch file from Cloudinary and force application/pdf Content-Type
async function fetchPdfBlob(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('fetch failed')
  const raw = await res.blob()
  return new Blob([raw], { type: 'application/pdf' })
}

async function viewPdf(url) {
  try {
    const blob = await fetchPdfBlob(url)
    const blobUrl = URL.createObjectURL(blob)
    window.open(blobUrl, '_blank')
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
  } catch {
    window.open(url, '_blank')
  }
}

async function downloadFile(url, fileName) {
  try {
    const blob = await fetchPdfBlob(url)
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = fileName || 'design-file.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank')
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(ts) {
  if (!ts) return '—'
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60)   return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const STATUS_META = {
  new:        { label: 'New',        color: 'bg-amber-100 text-amber-700 border-amber-200',  dot: 'bg-amber-400', border: 'border-l-amber-400' },
  contacted:  { label: 'Contacted',  color: 'bg-sky-100 text-sky-700 border-sky-200',        dot: 'bg-sky-400',   border: 'border-l-sky-400' },
  done:       { label: 'Done',       color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400', border: 'border-l-emerald-400' },
}

const FILTERS = ['all', 'new', 'contacted', 'done']

// ── Stats Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, pulse }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
        {pulse && <span className="absolute w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75 -top-0.5 -right-0.5" />}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ── Inquiry Card ─────────────────────────────────────────────────────────────
function InquiryCard({ inq, onStatus, onDelete }) {
  const [expanded, setExpanded]   = useState(false)
  const [busy, setBusy]           = useState(false)
  const [delConfirm, setDelConfirm] = useState(false)
  const meta = STATUS_META[inq.status] ?? STATUS_META.new

  const handle = async (status) => {
    setBusy(true)
    await updateCorporateInquiryStatus(inq.id, status)
    onStatus()
    setBusy(false)
  }

  const handleDelete = async () => {
    if (!delConfirm) { setDelConfirm(true); return }
    setBusy(true)
    await deleteCorporateInquiry(inq.id)
    onDelete()
    setBusy(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${meta.border} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
    >
      {/* Main row */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">

          {/* Left info */}
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 border border-brand-100 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-brand-500" />
            </div>

            <div className="min-w-0 flex-1">
              {/* Company + status */}
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="font-black text-slate-900 text-[15px] leading-tight truncate">
                  {inq.companyName || '—'}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} ${inq.status === 'new' ? 'animate-pulse' : ''}`} />
                  {meta.label}
                </span>
              </div>

              {/* Contact person */}
              <p className="text-slate-500 text-xs mb-2">{inq.contactPerson || '—'}</p>

              {/* Tags row */}
              <div className="flex flex-wrap items-center gap-2">
                {inq.service && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-600 text-xs font-semibold rounded-lg border border-brand-100">
                    <Package size={11} />
                    {inq.service}
                  </span>
                )}
                {inq.qty && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                    <Hash size={11} />
                    {inq.qty} pcs
                  </span>
                )}
                {inq.discount && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                    <Tag size={11} />
                    Discount
                  </span>
                )}
                {inq.fileUrl && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-lg border border-sky-200">
                    <FileText size={11} />
                    PDF
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                  <Clock size={11} />
                  {timeAgo(inq.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setExpanded(v => !v)}
              className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
            >
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* Quick contact row */}
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-50">
          <a
            href={`https://wa.me/${inq.phone?.replace(/\D/g, '')}`}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100
                       text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-100 transition-colors"
          >
            <Phone size={12} />
            {inq.phone || '—'}
          </a>
          {inq.email && (
            <a
              href={`mailto:${inq.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100
                         text-sky-700 text-xs font-semibold rounded-xl border border-sky-100 transition-colors"
            >
              <Mail size={12} />
              {inq.email}
            </a>
          )}
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4 bg-slate-50/50">

              {/* Message */}
              {inq.message && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MessageSquare size={13} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Message</span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed bg-white rounded-xl px-4 py-3 border border-slate-100">
                    {inq.message}
                  </p>
                </div>
              )}

              {/* File attachment */}
              {inq.fileUrl && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileText size={13} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Design File</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-3">
                    {/* PDF icon */}
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-red-500" />
                    </div>
                    {/* Name + size */}
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 text-sm font-bold truncate">
                        {inq.fileName || 'design-file.pdf'}
                      </p>
                      <p className="text-slate-400 text-xs">PDF Document</p>
                    </div>
                    {/* View — fetch as blob with correct PDF Content-Type, open in new tab */}
                    <button
                      type="button"
                      onClick={() => viewPdf(inq.fileUrl)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200
                                 text-slate-600 text-xs font-bold rounded-xl transition-colors shrink-0"
                    >
                      <ExternalLink size={13} />
                      View
                    </button>
                    {/* Download — fetch as blob → Save As dialog */}
                    <button
                      type="button"
                      onClick={() => downloadFile(inq.fileUrl, inq.fileName)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-500 hover:bg-brand-600
                                 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                    >
                      <Download size={13} />
                      Download
                    </button>
                  </div>
                </div>
              )}

              {/* Discount badge */}
              {inq.discount && (
                <div className="flex items-center gap-1.5">
                  <Tag size={13} className="text-emerald-500" />
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-wider">Bulk Discount Applicable</span>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Calendar size={12} />
                Submitted: {formatDate(inq.createdAt)}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {inq.status !== 'contacted' && (
                  <button
                    disabled={busy}
                    onClick={() => handle('contacted')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50
                               text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    <PhoneCall size={13} />
                    Mark Contacted
                  </button>
                )}
                {inq.status !== 'done' && (
                  <button
                    disabled={busy}
                    onClick={() => handle('done')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50
                               text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    <CheckCircle2 size={13} />
                    Mark Done
                  </button>
                )}
                {inq.status !== 'new' && (
                  <button
                    disabled={busy}
                    onClick={() => handle('new')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50
                               text-slate-600 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Reset to New
                  </button>
                )}
                <button
                  disabled={busy}
                  onClick={handleDelete}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all
                             ${delConfirm
                               ? 'bg-red-500 hover:bg-red-600 text-white'
                               : 'bg-red-50 hover:bg-red-100 text-red-500 border border-red-100'
                             } disabled:opacity-50 ml-auto`}
                  onBlur={() => setDelConfirm(false)}
                >
                  <Trash2 size={13} />
                  {delConfirm ? 'Confirm Delete' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CorporateInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')

  // Real-time subscription
  useEffect(() => {
    const unsub = subscribeCorporateInquiries((data) => {
      setInquiries(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const refresh = () => {} // real-time — always fresh

  // Stats
  const total     = inquiries.length
  const newCount  = inquiries.filter(i => i.status === 'new').length
  const contacted = inquiries.filter(i => i.status === 'contacted').length
  const done      = inquiries.filter(i => i.status === 'done').length

  // Filter + search
  const shown = inquiries
    .filter(i => filter === 'all' || i.status === filter)
    .filter(i => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        (i.companyName   || '').toLowerCase().includes(q) ||
        (i.contactPerson || '').toLowerCase().includes(q) ||
        (i.phone         || '').toLowerCase().includes(q) ||
        (i.service       || '').toLowerCase().includes(q)
      )
    })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Building2 size={20} className="text-brand-500" />
            Corporate Inquiries
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">Manage and respond to corporate quote requests</p>
        </div>
        <button
          onClick={refresh}
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors shadow-sm"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total"     value={total}     icon={TrendingUp}   color="bg-slate-100 text-slate-600" />
        <StatCard label="New"       value={newCount}  icon={AlertCircle}  color="bg-amber-100 text-amber-600" pulse={newCount > 0} />
        <StatCard label="Contacted" value={contacted} icon={PhoneCall}    color="bg-sky-100 text-sky-600" />
        <StatCard label="Done"      value={done}      icon={CheckCircle2} color="bg-emerald-100 text-emerald-600" />
      </div>

      {/* ── Filter + Search bar ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by company, person, phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter size={14} className="text-slate-400 mr-0.5" />
          {FILTERS.map(f => {
            const count = f === 'all' ? total : f === 'new' ? newCount : f === 'contacted' ? contacted : done
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 capitalize
                           ${filter === f
                             ? 'bg-slate-900 text-white shadow-sm'
                             : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                           }`}
              >
                {f} {count > 0 && <span className="opacity-60">({count})</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── List ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
        </div>
      ) : shown.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} className="text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-700 mb-1">
            {search ? 'No results found' : `No ${filter === 'all' ? '' : filter} inquiries`}
          </h3>
          <p className="text-slate-400 text-sm">
            {search ? 'Try a different search term' : 'Corporate inquiries will appear here'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {shown.map(inq => (
              <InquiryCard
                key={inq.id}
                inq={inq}
                onStatus={() => {}}
                onDelete={() => {}}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
