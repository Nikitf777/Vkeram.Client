import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, type ProductWithPrice } from '../api/products'
import { createOrder, fetchAllowBooking, fetchAllowDelivery } from '../api/orders'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

interface ProductEntry {
  productId: string
  quantity: number
}

interface ReservationEntry {
  key: number
  date: string
  time: string
  products: ProductEntry[]
}

interface DeliveryEntry {
  key: number
  dateTime: string
  products: ProductEntry[]
}

let nextKey = 1

export default function CreateOrderPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<ProductWithPrice[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [reservations, setReservations] = useState<ReservationEntry[]>([])
  const [deliveries, setDeliveries] = useState<DeliveryEntry[]>([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [allowBooking, setAllowBooking] = useState<boolean | null>(null)
  const [allowDelivery, setAllowDelivery] = useState<boolean | null>(null)

  useEffect(() => {
    getProducts('None')
      .then(setProducts)
      .catch(() => {})
      .finally(() => setProductsLoading(false))
    fetchAllowBooking().then(setAllowBooking).catch(() => setAllowBooking(false))
    fetchAllowDelivery().then(setAllowDelivery).catch(() => setAllowDelivery(false))
  }, [])

  const addReservation = () =>
    setReservations((prev) => [...prev, { key: nextKey++, date: '', time: '', products: [{ productId: '', quantity: 1 }] }])

  const addDelivery = () =>
    setDeliveries((prev) => [...prev, { key: nextKey++, dateTime: '', products: [{ productId: '', quantity: 1 }] }])

  const updateReservation = (key: number, field: 'date' | 'time', value: string) =>
    setReservations((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)))

  const updateDelivery = (key: number, value: string) =>
    setDeliveries((prev) => prev.map((d) => d.key === key ? { ...d, dateTime: value } : d))

  const removeReservation = (key: number) =>
    setReservations((prev) => prev.filter((r) => r.key !== key))

  const removeDelivery = (key: number) =>
    setDeliveries((prev) => prev.filter((d) => d.key !== key))

  const addProductToRes = (key: number) =>
    setReservations((prev) => prev.map((r) => r.key === key ? { ...r, products: [...r.products, { productId: '', quantity: 1 }] } : r))

  const addProductToDel = (key: number) =>
    setDeliveries((prev) => prev.map((d) => d.key === key ? { ...d, products: [...d.products, { productId: '', quantity: 1 }] } : d))

  const updateResProduct = (resKey: number, idx: number, field: 'productId' | 'quantity', value: string | number) =>
    setReservations((prev) => prev.map((r) => r.key === resKey ? { ...r, products: r.products.map((p, i) => i === idx ? { ...p, [field]: value } : p) } : r))

  const updateDelProduct = (delKey: number, idx: number, field: 'productId' | 'quantity', value: string | number) =>
    setDeliveries((prev) => prev.map((d) => d.key === delKey ? { ...d, products: d.products.map((p, i) => i === idx ? { ...p, [field]: value } : p) } : d))

  const removeResProduct = (resKey: number, idx: number) =>
    setReservations((prev) => prev.map((r) => r.key === resKey ? { ...r, products: r.products.filter((_, i) => i !== idx) } : r))

  const removeDelProduct = (delKey: number, idx: number) =>
    setDeliveries((prev) => prev.map((d) => d.key === delKey ? { ...d, products: d.products.filter((_, i) => i !== idx) } : d))

  const handleSubmit = async () => {
    setError('')
    if (reservations.length === 0 && deliveries.length === 0) {
      setError('Add at least one reservation or delivery.')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        reservations: reservations.map((r) => ({
          startTime: new Date(`${r.date}T${r.time}`).toISOString(),
          products: r.products.map((p) => ({ productId: p.productId, quantity: p.quantity })),
        })),
        deliveries: deliveries.map((d) => ({
          deliveryTime: new Date(d.dateTime).toISOString(),
          products: d.products.map((p) => ({ productId: p.productId, quantity: p.quantity })),
        })),
      }
      const result = await createOrder(payload)
      if (result.success) {
        navigate('/orders')
      } else {
        setError(result.message || 'Order creation failed.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order creation failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (allowBooking === null || allowDelivery === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!allowBooking && !allowDelivery) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>Create Order</Typography>
        <Alert severity="info">Orders are currently unavailable.</Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Create Order</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {allowBooking && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Reservations</Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={addReservation}>Add Reservation</Button>
          </Box>
          {reservations.length === 0 && <Typography color="text.secondary" variant="body2">No reservations added.</Typography>}
          <Stack spacing={2}>
            {reservations.map((r) => (
              <Box key={r.key} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Date"
                    type="date"
                    size="small"
                    value={r.date}
                    onChange={(e) => updateReservation(r.key, 'date', e.target.value)}
                    slotProps={{ htmlInput: { min: new Date().toISOString().split('T')[0] } }}
                  />
                  <TextField
                    label="Time"
                    type="time"
                    size="small"
                    value={r.time}
                    onChange={(e) => updateReservation(r.key, 'time', e.target.value)}
                  />
                  <IconButton color="error" onClick={() => removeReservation(r.key)}><DeleteIcon /></IconButton>
                </Box>
                <Stack spacing={1}>
                  {r.products.map((p, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        select
                        label="Product"
                        size="small"
                        sx={{ minWidth: 200 }}
                        value={p.productId}
                        onChange={(e) => updateResProduct(r.key, idx, 'productId', e.target.value)}
                      >
                {productsLoading && <MenuItem disabled>Loading...</MenuItem>}
                {products.filter((p) => p.price != null).map((prod) => (
                  <MenuItem key={prod.id} value={prod.id}>
                    {prod.name} (${prod.price!.toFixed(2)})
                  </MenuItem>
                ))}
                      </TextField>
                      <TextField
                        label="Qty"
                        type="number"
                        size="small"
                        sx={{ width: 100 }}
                        value={p.quantity}
                        onChange={(e) => updateResProduct(r.key, idx, 'quantity', Math.max(1, Number(e.target.value)))}
                        slotProps={{ htmlInput: { min: 1 } }}
                      />
                      {r.products.length > 1 && (
                        <IconButton size="small" color="error" onClick={() => removeResProduct(r.key, idx)}><DeleteIcon /></IconButton>
                      )}
                    </Box>
                  ))}
                  <Button size="small" onClick={() => addProductToRes(r.key)}>+ Add Product</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {allowDelivery && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Deliveries</Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={addDelivery}>Add Delivery</Button>
          </Box>
          {deliveries.length === 0 && <Typography color="text.secondary" variant="body2">No deliveries added.</Typography>}
          <Stack spacing={2}>
            {deliveries.map((d) => (
              <Box key={d.key} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Date & Time"
                    type="datetime-local"
                    size="small"
                    value={d.dateTime}
                    onChange={(e) => updateDelivery(d.key, e.target.value)}
                  />
                  <IconButton color="error" onClick={() => removeDelivery(d.key)}><DeleteIcon /></IconButton>
                </Box>
                <Stack spacing={1}>
                  {d.products.map((p, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        select
                        label="Product"
                        size="small"
                        sx={{ minWidth: 200 }}
                        value={p.productId}
                        onChange={(e) => updateDelProduct(d.key, idx, 'productId', e.target.value)}
                      >
                {productsLoading && <MenuItem disabled>Loading...</MenuItem>}
                {products.filter((p) => p.price != null).map((prod) => (
                  <MenuItem key={prod.id} value={prod.id}>
                    {prod.name} (${prod.price!.toFixed(2)})
                  </MenuItem>
                ))}
                      </TextField>
                      <TextField
                        label="Qty"
                        type="number"
                        size="small"
                        sx={{ width: 100 }}
                        value={p.quantity}
                        onChange={(e) => updateDelProduct(d.key, idx, 'quantity', Math.max(1, Number(e.target.value)))}
                        slotProps={{ htmlInput: { min: 1 } }}
                      />
                      {d.products.length > 1 && (
                        <IconButton size="small" color="error" onClick={() => removeDelProduct(d.key, idx)}><DeleteIcon /></IconButton>
                      )}
                    </Box>
                  ))}
                  <Button size="small" onClick={() => addProductToDel(d.key)}>+ Add Product</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      <Button variant="contained" size="large" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Order'}
      </Button>
    </Box>
  )
}
