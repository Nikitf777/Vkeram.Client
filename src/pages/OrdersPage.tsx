import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { getMyOrders, type OrderResponse } from '../api/orders'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

const statusColor: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  Confirmed: 'success',
  Unconfirmed: 'warning',
  Cancelled: 'error',
  Paid: 'success',
  PartiallyPaid: 'info',
  Unpaid: 'warning',
  Shipped: 'success',
  PartiallyShipped: 'info',
  Unshipped: 'warning',
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Skeleton variant="rectangular" height={400} />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">My Orders</Typography>
        <Button variant="contained" component={RouterLink} to="/orders/new">
          Create Order
        </Button>
      </Box>
      {orders.length === 0 ? (
        <Typography color="text.secondary">No orders yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Confirmation</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Shipment</TableCell>
                <TableCell align="right">Total Qty</TableCell>
                <TableCell align="right">Total Price</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((o) => (
                <TableRow
                  key={o.orderId}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/orders/${o.orderId}`)}
                >
                  <TableCell>{o.orderId}</TableCell>
                  <TableCell>
                    <Chip size="small" label={o.confirmationStatus} color={statusColor[o.confirmationStatus ?? ''] || 'default'} />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={o.paymentStatus} color={statusColor[o.paymentStatus ?? ''] || 'default'} />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={o.shipmentStatus} color={statusColor[o.shipmentStatus ?? ''] || 'default'} />
                  </TableCell>
                  <TableCell align="right">{o.totalQuantity}</TableCell>
                  <TableCell align="right">{o.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'BYN' })}</TableCell>
                  <TableCell>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}
