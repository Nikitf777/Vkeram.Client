const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

async function authRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Not authenticated')
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export interface ProductReservationInfo {
  productId: string
  productName: string
  quantity: number
  price: number
  totalPrice: number
}

export interface ReservationInfo {
  startTime: string
  endTime: string
  products?: ProductReservationInfo[] | null
}

export interface DeliveryInfo {
  deliveryTime: string
  products?: ProductReservationInfo[] | null
}

export interface OrderResponse {
  success: boolean
  message: string
  orderId?: number | null
  confirmationStatus?: string | null
  paymentStatus?: string | null
  shipmentStatus?: string | null
  userId?: number | null
  createdAt?: string | null
  reservations?: ReservationInfo[] | null
  deliveries?: DeliveryInfo[] | null
  totalPrice: number
  totalQuantity: number
}

export interface ReservationSlotInfo {
  startTime: string
  endTime: string
}

export interface OrderProductRequest {
  productId: string
  quantity: number
}

export interface CreateOrderRequest {
  startTime: string
  products: OrderProductRequest[]
}

export interface CreateDeliveryRequest {
  deliveryTime: string
  products: OrderProductRequest[]
}

export interface CreateOrderPayload {
  reservations: CreateOrderRequest[]
  deliveries: CreateDeliveryRequest[]
}

export function getMyOrders() {
  return authRequest<OrderResponse[]>('/api/Orders')
}

export function getMyOrderById(orderId: number) {
  return authRequest<OrderResponse>(`/api/Orders/${orderId}`)
}

export function getReservationSlots(from?: string, to?: string) {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const qs = params.toString()
  return authRequest<ReservationSlotInfo[]>(`/api/Orders/reservations${qs ? '?' + qs : ''}`)
}

export function createOrder(payload: CreateOrderPayload) {
  return authRequest<OrderResponse>('/api/Orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
