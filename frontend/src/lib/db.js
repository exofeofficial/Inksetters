// Firestore data layer for Inksetters: rates, sales, expenses.
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../firebase'

export const ratesCol = collection(db, 'rates')
export const salesCol = collection(db, 'sales')
export const expensesCol = collection(db, 'expenses')
export const ordersCol = collection(db, 'orders')

// "YYYY-MM" helper from a "YYYY-MM-DD" date string.
export const monthOf = (dateStr) => (dateStr || '').slice(0, 7)

// ---- Rates ----
export async function listRates() {
  const snap = await getDocs(query(ratesCol, orderBy('name')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
export const addRate = (data) => addDoc(ratesCol, { ...data, createdAt: serverTimestamp() })
export const updateRate = (id, data) => updateDoc(doc(db, 'rates', id), data)
export const deleteRate = (id) => deleteDoc(doc(db, 'rates', id))

// Default rate list taken from the Inksetters shop board.
export const DEFAULT_RATES = [
  { name: 'Art Card 13x19', detail: '300gms', price: 120, category: 'Card' },
  { name: 'Art Card 12.5x18', detail: '300gms / 250gms', price: 100, category: 'Card' },
  { name: 'Art Paper 12.5x18', detail: '', price: 80, category: 'Paper' },
  { name: 'Matte Paper 12.5x18', detail: '', price: 80, category: 'Paper' },
  { name: 'Offset Paper 12.5x18', detail: '', price: 70, category: 'Paper' },
  { name: 'Paper Sticker 13x19', detail: '', price: 120, category: 'Sticker' },
  { name: 'Transparent Sticker', detail: '', price: 120, category: 'Sticker' },
  { name: 'PVC Matte Sticker', detail: '', price: 180, category: 'Sticker' },
  { name: 'PVC Shine Sticker', detail: '', price: 180, category: 'Sticker' },
  { name: 'Silver Matte Sticker', detail: '', price: 250, category: 'Sticker' },
]

export async function seedDefaultRates() {
  const batch = writeBatch(db)
  for (const r of DEFAULT_RATES) {
    batch.set(doc(ratesCol), { ...r, createdAt: serverTimestamp() })
  }
  await batch.commit()
}

// ---- Sales ----
export const addSale = (data) =>
  addDoc(salesCol, { ...data, month: monthOf(data.date), createdAt: serverTimestamp() })
export const updateSale = (id, data) =>
  updateDoc(doc(db, 'sales', id), { ...data, month: monthOf(data.date) })
export const deleteSale = (id) => deleteDoc(doc(db, 'sales', id))

// ---- Expenses ----
export const EXPENSE_CATEGORIES = [
  'Electricity Bill',
  'Internet Bill',
  'Rent',
  'Salary',
  'Ink',
  'Paper / Material',
  'Maintenance',
  'Other',
]
export const addExpense = (data) =>
  addDoc(expensesCol, { ...data, month: monthOf(data.date), createdAt: serverTimestamp() })
export const updateExpense = (id, data) =>
  updateDoc(doc(db, 'expenses', id), { ...data, month: monthOf(data.date) })
export const deleteExpense = (id) => deleteDoc(doc(db, 'expenses', id))

// ---- Orders (online storefront) ----
// Public create (customer placing an order); owner reads/updates/deletes.
export const addOrder = (data) =>
  addDoc(ordersCol, {
    ...data,
    date: data.date || new Date().toISOString().slice(0, 10),
    status: 'pending',
    createdAt: serverTimestamp(),
  })

export async function getOrders(status) {
  const snap = await getDocs(query(ordersCol, orderBy('createdAt', 'desc')))
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return status ? rows.filter((o) => o.status === status) : rows
}

export const updateOrderStatus = (id, status) =>
  updateDoc(doc(db, 'orders', id), { status })
export const deleteOrder = (id) => deleteDoc(doc(db, 'orders', id))

// Accept an order: turn each item into a sale entry, then mark order completed.
export async function convertOrderToSales(order) {
  const date = order.date || new Date().toISOString().slice(0, 10)
  const batch = writeBatch(db)
  for (const it of order.items) {
    batch.set(doc(salesCol), {
      date,
      month: monthOf(date),
      product: it.product,
      qty: Number(it.qty),
      unitPrice: Number(it.unitPrice),
      discount: 0,
      total: Number(it.lineTotal),
      note: `Online order — ${order.customerName || ''}`.trim(),
      createdAt: serverTimestamp(),
    })
  }
  batch.update(doc(db, 'orders', order.id), { status: 'completed' })
  await batch.commit()
}

// ---- Corporate Inquiries (public inquiry form) ----
export const corporateInquiriesCol = collection(db, 'corporateInquiries')

export const addCorporateInquiry = (data) =>
  addDoc(corporateInquiriesCol, {
    ...data,
    status: 'new',
    createdAt: serverTimestamp(),
  })

export const getCorporateInquiries = async () => {
  const snap = await getDocs(query(corporateInquiriesCol, orderBy('createdAt', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// Returns an unsubscribe function — call it in useEffect cleanup.
export const subscribeCorporateInquiries = (callback) =>
  onSnapshot(
    query(corporateInquiriesCol, orderBy('createdAt', 'desc')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )

export const updateCorporateInquiryStatus = (id, status) =>
  updateDoc(doc(db, 'corporateInquiries', id), { status, updatedAt: serverTimestamp() })

export const deleteCorporateInquiry = (id) =>
  deleteDoc(doc(db, 'corporateInquiries', id))

// ---- Physical Orders (walk-in / counter orders) ----
export const physicalOrdersCol = collection(db, 'physicalOrders')

export const addPhysicalOrder = (data) =>
  addDoc(physicalOrdersCol, {
    ...data,
    date: data.date || new Date().toISOString().slice(0, 10),
    status: 'pending',
    createdAt: serverTimestamp(),
  })

export async function getPhysicalOrders() {
  const snap = await getDocs(query(physicalOrdersCol, orderBy('createdAt', 'desc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export const updatePhysicalOrderStatus = (id, status) =>
  updateDoc(doc(db, 'physicalOrders', id), { status })

export const deletePhysicalOrder = (id) => deleteDoc(doc(db, 'physicalOrders', id))

export async function convertPhysicalOrderToSales(order) {
  const date = order.date || new Date().toISOString().slice(0, 10)
  const batch = writeBatch(db)
  for (const it of order.items) {
    batch.set(doc(salesCol), {
      date,
      month: monthOf(date),
      product: it.product,
      qty: Number(it.qty),
      unitPrice: Number(it.unitPrice),
      discount: 0,
      total: Number(it.lineTotal),
      note: `Counter order — ${order.customerName || ''}`.trim(),
      createdAt: serverTimestamp(),
    })
  }
  batch.update(doc(db, 'physicalOrders', order.id), { status: 'completed' })
  await batch.commit()
}

// ---- Queries ----
// Fetch sales/expenses, optionally filtered to a single "YYYY-MM" month.
export async function getSales(month) {
  const q = month
    ? query(salesCol, where('month', '==', month))
    : query(salesCol, orderBy('date', 'desc'))
  const snap = await getDocs(q)
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return rows.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

export async function getExpenses(month) {
  const q = month
    ? query(expensesCol, where('month', '==', month))
    : query(expensesCol, orderBy('date', 'desc'))
  const snap = await getDocs(q)
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return rows.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}
