import { useEffect, useMemo, useState } from 'react'
import { getSales, getExpenses } from '../lib/db'
import { rs, sum, monthLabel } from '../lib/format'

export default function Reports() {
  const [sales, setSales] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(String(new Date().getFullYear()))

  useEffect(() => {
    Promise.all([getSales(), getExpenses()]).then(([s, e]) => {
      setSales(s)
      setExpenses(e)
      setLoading(false)
    })
  }, [])

  // Years that have any data, plus the current year.
  const years = useMemo(() => {
    const set = new Set([String(new Date().getFullYear())])
    ;[...sales, ...expenses].forEach((r) => r.date && set.add(r.date.slice(0, 4)))
    return [...set].sort().reverse()
  }, [sales, expenses])

  // Build 12-month rows for the selected year.
  const rows = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const m = `${year}-${String(i + 1).padStart(2, '0')}`
      const s = sum(sales.filter((x) => x.month === m), 'total')
      const e = sum(expenses.filter((x) => x.month === m), 'amount')
      return { m, sales: s, expenses: e, profit: s - e }
    })
  }, [sales, expenses, year])

  const totSales = sum(rows, 'sales')
  const totExp = sum(rows, 'expenses')
  const totProfit = totSales - totExp

  if (loading) return <p className="text-slate-400">Loading…</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold text-slate-800">Profit &amp; Loss Report</h1>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-slate-500">Year Sales</p>
          <p className="text-2xl font-bold text-brand-600 mt-1">{rs(totSales)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-slate-500">Year Expenses</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{rs(totExp)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-slate-500">Year Net Profit</p>
          <p className={`text-2xl font-bold mt-1 ${totProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {rs(totProfit)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Month</th>
              <th className="px-4 py-2 font-medium text-right">Sales</th>
              <th className="px-4 py-2 font-medium text-right">Expenses</th>
              <th className="px-4 py-2 font-medium text-right">Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => {
              const blank = r.sales === 0 && r.expenses === 0
              return (
                <tr key={r.m} className={blank ? 'text-slate-300' : 'hover:bg-slate-50'}>
                  <td className="px-4 py-2">{monthLabel(r.m)}</td>
                  <td className="px-4 py-2 text-right">{rs(r.sales)}</td>
                  <td className="px-4 py-2 text-right">{rs(r.expenses)}</td>
                  <td className={`px-4 py-2 text-right font-semibold ${
                    blank ? '' : r.profit >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {rs(r.profit)}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-900 text-white font-bold">
              <td className="px-4 py-2.5">Total {year}</td>
              <td className="px-4 py-2.5 text-right">{rs(totSales)}</td>
              <td className="px-4 py-2.5 text-right">{rs(totExp)}</td>
              <td className="px-4 py-2.5 text-right">{rs(totProfit)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
