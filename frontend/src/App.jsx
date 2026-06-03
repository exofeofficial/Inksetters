import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sales from './pages/Sales'
import Expenses from './pages/Expenses'
import Rates from './pages/Rates'
import Reports from './pages/Reports'
import Orders from './pages/Orders'
import PhysicalOrders from './pages/PhysicalOrders'
import CorporateInquiries from './pages/CorporateInquiries'
import Storefront from './pages/Storefront'
import About from './pages/About'
import Corporate from './pages/Corporate'

// Owner area (mounted at /admin/*) — requires login.
function OwnerApp() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">Loading…</div>
    )
  }
  if (!user) return <Login />
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="counter-orders" element={<PhysicalOrders />} />
        <Route path="sales" element={<Sales />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="reports" element={<Reports />} />
        <Route path="rates" element={<Rates />} />
        <Route path="corporate-inquiries" element={<CorporateInquiries />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public storefront is the home page */}
      <Route path="/" element={<Storefront />} />
      <Route path="/about" element={<About />} />
      <Route path="/corporate" element={<Corporate />} />
      {/* Owner dashboard (login-gated) */}
      <Route path="/admin/*" element={<OwnerApp />} />
      {/* Anything else → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
