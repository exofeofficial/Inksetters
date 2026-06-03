// Small formatting helpers.
export const rs = (n) =>
  'Rs. ' + Number(n || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })

export const today = () => new Date().toISOString().slice(0, 10)
export const thisMonth = () => new Date().toISOString().slice(0, 7)

// "2026-06" -> "Jun 2026"
export const monthLabel = (m) => {
  if (!m) return ''
  const [y, mm] = m.split('-')
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${names[Number(mm) - 1]} ${y}`
}

export const sum = (arr, key) => arr.reduce((t, x) => t + Number(x[key] || 0), 0)
