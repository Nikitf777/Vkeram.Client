import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { me, type AuthResponse } from '../api/auth'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

export default function AccountPage() {
  const { logout } = useAuth()
  const [data, setData] = useState<AuthResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    me()
      .then(setData)
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [logout])

  if (loading) return <Skeleton variant="rectangular" height={200} />
  if (!data) return null

  return (
    <Paper sx={{ p: 3, maxWidth: 500 }}>
      <Typography variant="h5" gutterBottom>My Account</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography><strong>User ID:</strong> {data.userId}</Typography>
        <Typography><strong>Buyer ID:</strong> {data.buyerId ?? '-'}</Typography>
      </Box>
    </Paper>
  )
}
