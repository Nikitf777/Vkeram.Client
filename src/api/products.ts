const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) throw new Error('Request failed')
  return res.json()
}

export interface ProductCharacteristic {
  id: number
  productId: string
  sizeLengthMm?: number | null
  sizeWidthMm?: number | null
  sizeHeightMm?: number | null
  weightKg?: number | null
  strengthGrade?: string | null
  color?: string | null
  brickType?: string | null
  frostResistance?: string | null
  waterAbsorption?: string | null
  thermalConductivity?: number | null
  radiationQuality?: string | null
  quantityPerPallet?: number | null
  standard?: string | null
  minimumOrderQuantity?: number | null
}

export interface ProductWithPrice {
  id: string
  name: string
  price?: number | null
  characteristics?: ProductCharacteristic | null
  previewUrl?: string | null
}

export interface ProductImageMeta {
  id: number
  productId: string
  fileName: string
  contentType: string
  createdAt: string
}

export function getProducts(include: 'None' | 'Partial' | 'Full' = 'Partial') {
  return request<ProductWithPrice[]>(`/api/Products?include=${include}&includePreviews=true`)
}

export function getProduct(id: string, includeCharacteristics = true) {
  return request<ProductWithPrice>(`/api/Products/${id}?includeCharacteristics=${includeCharacteristics}`)
}

export function getProductImages(productId: string) {
  return request<ProductImageMeta[]>(`/api/Products/${productId}/images`)
}

export function getProductImageUrl(productId: string, imageId: number) {
  return `${BASE}/api/Products/${productId}/images/${imageId}/file`
}
