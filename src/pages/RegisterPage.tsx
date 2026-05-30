import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [inviteCode, setInviteCode] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactName, setContactName] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ inviteCode, companyName, contactEmail, contactName, password, phone: phone || undefined })
      navigate('/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>Register</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Invite Code" required value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
      <TextField label="Company Name" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      <TextField label="Contact Email" type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
      <TextField label="Contact Name" required value={contactName} onChange={(e) => setContactName(e.target.value)} />
      <TextField label="Password" type="password" required slotProps={{ htmlInput: { minLength: 8 } }} value={password} onChange={(e) => setPassword(e.target.value)} />
      <TextField label="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
      <Typography sx={{ textAlign: 'center' }} variant="body2">
        Already have an account?{' '}
        <Link component={RouterLink} to="/login">Login</Link>
      </Typography>
    </Box>
  )
}
