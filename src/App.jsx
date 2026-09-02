import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './lib/auth'
import { ToastProvider } from './lib/toast'
import Website from './pages/Website'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProductsPage from './pages/ProductsPage'
import InventoryHistory from './pages/InventoryHistory'
import AppLayout from './components/app/AppLayout'
import ProtectedRoute from './components/app/ProtectedRoute'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Website page="home" />} />
            <Route path="/collection" element={<Website page="collection" />} />
            <Route path="/about" element={<Website page="about" />} />
            <Route path="/why-us" element={<Website page="why" />} />
            <Route path="/contact" element={<Website page="contact" />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="history" element={<InventoryHistory />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
