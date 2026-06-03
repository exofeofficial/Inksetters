import { useEffect, useState } from 'react'
import { getOrders, convertOrderToSales, deleteOrder, updateOrderStatus } from '../lib/db'
import { rs } from '../lib/format'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [busy, setBusy] = useState(null)

  const load = async () => {
    setLoading(true)
    setOrders(await getOrders())
    setLoading(false)
  }
  useEffect(() => {
    load()
  }, [])

  const shown = filter === 'all' ? orders : orders.filter((o) => o.status === filter)
  const pendingCount = orders.filter((o) => o.status === 'pending').length

  const accept = async (o) => {
    if (!confirm(`Accept order from ${o.customerName || 'customer'} and add to Sales?`)) return
    setBusy(o.id)
    await convertOrderToSales(o)
    await load()
    setBusy(null)
  }

  const reject = async (o) => {
    setBusy(o.id)
    await updateOrderStatus(o.id, 'cancelled')
    await load()
    setBusy(null)
  }

  const remove = async (id) => {
    if (!confirm('Delete this order permanently?')) return
    await deleteOrder(id)
    load()
  }

  const badge = (s) =>
    ({
      pending: 'bg-amber-100 text-amber-700',
      completed: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-slate-200 text-slate-500',
    })[s] || 'bg-slate-100 text-slate-600'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold text-slate-800">
          Online Orders
          {pendingCount > 0 && (
            <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-2 py-0.5 align-middle">
              {pendingCount} new
            </span>
          )}
        </h1>
        <div className="flex gap-1">
          {['pending', 'completed', 'cancelled', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : shown.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-slate-400">
          No {filter !== 'all' ? filter : ''} orders.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {shown.map((o) => (
            <div key={o.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-slate-800">{o.customerName || 'Unknown'}</p>
                  <p className="text-sm text-slate-500">{o.phone}</p>
                  <p className="text-xs text-slate-400">{o.date}</p>
                </div>
                <span className={`text-xs font-medium rounded-full px-2.5 py-1 capitalize ${badge(o.status)}`}>
                  {o.status}
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-sm border-t border-slate-100 pt-3">
                {o.items?.map((it, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="text-slate-600">{it.product} <span className="text-slate-400">× {it.qty}</span></span>
                    <span className="font-medium text-slate-700">{rs(it.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              {o.note && <p className="mt-2 text-xs text-slate-500 italic">“{o.note}”</p>}

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-900">{rs(o.total)}</span>
                <div className="flex gap-2">
                  {o.status === 'pending' && (
                    <>
                      <button
                        onClick={() => accept(o)}
                        disabled={busy === o.id}
                        className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg px-3 py-1.5"
                      >
                        {busy === o.id ? '…' : 'Accept → Sale'}
                      </button>
                      <button
                        onClick={() => reject(o)}
                        disabled={busy === o.id}
                        className="text-slate-500 hover:text-slate-700 text-sm px-2"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <button onClick={() => remove(o.id)} className="text-red-500 hover:text-red-700 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
