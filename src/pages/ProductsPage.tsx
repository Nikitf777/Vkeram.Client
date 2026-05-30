import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import { getProducts, type ProductWithPrice } from '../api/products'

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProducts('Partial')
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Grid container spacing={3}>
      {products.map((p) => (
        <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ display: 'flex', height: '100%' }}>
            {p.previewUrl ? (
              <CardMedia
                component="img"
                sx={{ width: 140, objectFit: 'contain', flexShrink: 0, p: 1 }}
                image={p.previewUrl}
                alt={p.name}
              />
            ) : (
              <Box sx={{ width: 140, flexShrink: 0, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">No image</Typography>
              </Box>
            )}
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{p.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {p.price != null ? `$${p.price.toFixed(2)}` : 'Price unavailable'}
              </Typography>
              {p.characteristics && (
                <Box sx={{ mt: 1 }}>
                  {p.characteristics.color && <Typography variant="body2">Color: {p.characteristics.color}</Typography>}
                  {p.characteristics.brickType && <Typography variant="body2">Type: {p.characteristics.brickType}</Typography>}
                  {p.characteristics.strengthGrade && <Typography variant="body2">Strength: {p.characteristics.strengthGrade}</Typography>}
                  {p.characteristics.weightKg != null && <Typography variant="body2">Weight: {p.characteristics.weightKg} kg</Typography>}
                  {p.characteristics.sizeLengthMm != null && p.characteristics.sizeWidthMm != null && p.characteristics.sizeHeightMm != null && (
                    <Typography variant="body2">Size: {p.characteristics.sizeLengthMm}×{p.characteristics.sizeWidthMm}×{p.characteristics.sizeHeightMm} mm</Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
