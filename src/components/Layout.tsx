import { Link as RouterLink, Outlet } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { isAuthenticated, companyName, logout } = useAuth()

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#860A1F' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ mr: 4, fontWeight: 700, letterSpacing: 1 }}>
            VKERAM
          </Typography>
          <Button color="inherit" component={RouterLink} to="/products">
            Products
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/account">
                {companyName ?? 'My Account'}
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
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
