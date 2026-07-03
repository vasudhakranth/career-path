import { createContext, useContext, useEffect, useState } from 'react'
import { login as loginRequest, register as registerRequest, getCurrentUser, setAuthToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('edumind_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      setAuthToken(token)
      getCurrentUser()
        .then((res) => setUser(res.data))
        .catch(() => {
          setUser(null)
          setAuthToken(null)
          localStorage.removeItem('edumind_token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async ({ email, password }) => {
    const response = await loginRequest({ email, password })
    const accessToken = response.data.access_token
    localStorage.setItem('edumind_token', accessToken)
    setAuthToken(accessToken)
    setToken(accessToken)
    setUser(response.data.user)
    return response
  }

  const register = async ({ name, email, password }) => {
    const response = await registerRequest({ name, email, password })
    const accessToken = response.data.access_token
    localStorage.setItem('edumind_token', accessToken)
    setAuthToken(accessToken)
    setToken(accessToken)
    setUser(response.data.user)
    return response
  }

  const refreshUser = async () => {
    if (!token) return
    try {
      const response = await getCurrentUser()
      setUser(response.data)
    } catch {
      setUser(null)
      setAuthToken(null)
      localStorage.removeItem('edumind_token')
      setToken(null)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setAuthToken(null)
    localStorage.removeItem('edumind_token')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
