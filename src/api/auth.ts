const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export interface AuthResponse {
  success: boolean
  message: string
  userId?: number
  buyerId?: string
  token?: string
}

export interface RegisterRequest {
  inviteCode: string
  contactEmail: string
  contactName: string
  password: string
  phone?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export function register(data: RegisterRequest) {
  return request<AuthResponse>('/api/Auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function login(data: LoginRequest) {
  return request<AuthResponse>('/api/Auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function me() {
  return request<AuthResponse>('/api/Auth/me')
}
