import { Link as RouterLink, Outlet } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#860A1F' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ mr: 4, fontWeight: 700, letterSpacing: 1 }}>
            ОАО «Керамика»
          </Typography>
          <Button color="inherit" component={RouterLink} to="/products">
            Товары
          </Button>
          <Button color="inherit" component={RouterLink} to="/orders">
            Заказы
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/account">
                Мой аккаунт
              </Button>
              <Button color="inherit" onClick={logout}>
                Выйти
              </Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Войти
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  )
}
