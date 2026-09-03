const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '')

const LOCAL_API_URL = 'http://localhost:4000/api'
const PRODUCTION_API_URL = '/api'

// VITE_API_URL overrides this value for other environments. In production,
// Vercel proxies /api to Render, so requests stay same-origin.
const API_URL = configuredApiUrl || (import.meta.env.DEV ? LOCAL_API_URL : PRODUCTION_API_URL)

const TOKEN_KEY = 'nextera_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text }
    }
  }

  if (!res.ok) {
    const message = data?.detail || data?.error || `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  login: (email, password) =>
    request('/login', { method: 'POST', body: { email, password }, auth: false }),

  getDashboard: () => request('/dashboard'),

  getProducts: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString()
    return request(`/products${qs ? `?${qs}` : ''}`)
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (body) => request('/products', { method: 'POST', body }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  getCategories: () => request('/categories'),

  stockIn: (body) => request('/inventory/stock-in', { method: 'POST', body }),
  stockOut: (body) => request('/inventory/stock-out', { method: 'POST', body }),
  adjustment: (body) => request('/inventory/adjustment', { method: 'POST', body }),
  getHistory: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString()
    return request(`/inventory/history${qs ? `?${qs}` : ''}`)
  },
}
