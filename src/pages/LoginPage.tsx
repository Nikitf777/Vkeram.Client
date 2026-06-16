import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>Войти</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Пароль" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Вход...' : 'Войти'}</Button>
      <Typography sx={{ textAlign: 'center' }} variant="body2">
        Нет аккаунта?{' '}
        <Link component={RouterLink} to="/register">Зарегистрироваться</Link>
      </Typography>
    </Box>
  )
}
