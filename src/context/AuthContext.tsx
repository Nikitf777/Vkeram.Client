import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { me, login as apiLogin, register as apiRegister, type AuthResponse, type LoginRequest, type RegisterRequest } from '../api/auth'

interface AuthState {
  token: string | null
  userId: number | null
  buyerId: string | null
}

interface AuthContextType extends AuthState {
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function loadState(): AuthState {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const buyerId = localStorage.getItem('buyerId')
  return { token, userId: userId ? Number(userId) : null, buyerId }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadState)
  const navigate = useNavigate()

  const save = useCallback((res: AuthResponse) => {
    localStorage.setItem('token', res.token ?? '')
    localStorage.setItem('userId', String(res.userId ?? ''))
    localStorage.setItem('buyerId', res.buyerId ?? '')
    setState({ token: res.token ?? null, userId: res.userId ?? null, buyerId: res.buyerId ?? null })
  }, [])

  const login = useCallback(async (data: LoginRequest) => {
    const res = await apiLogin(data)
    save(res)
  }, [save])

  const register = useCallback(async (data: RegisterRequest) => {
    const res = await apiRegister(data)
    save(res)
  }, [save])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('buyerId')
    setState({ token: null, userId: null, buyerId: null })
    navigate('/')
  }, [navigate])

  const refreshMe = useCallback(async () => {
    try {
      const res = await me()
      save(res)
    } catch {
      logout()
    }
  }, [save, logout])

  return (
    <AuthContext.Provider value={{ ...state, isAuthenticated: !!state.token, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
