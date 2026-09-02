import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken } from './api'

const AuthContext = createContext(null)

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (token) {
      const claims = decodeJwt(token)
      // Drop expired tokens on load.
      if (claims && (!claims.exp || claims.exp * 1000 > Date.now())) {
        setUser({ id: claims.sub, name: claims.name, email: claims.email, role: claims.role })
      } else {
        setToken(null)
      }
    }
    setReady(true)
  }, [])

  async function login(email, password) {
    const { token, user: u } = await api.login(email, password)
    setToken(token)
    setUser(u)
    return u
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
