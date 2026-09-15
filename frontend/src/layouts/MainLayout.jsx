import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Box, Typography, Button, Container, Stack } from '@mui/material'

const navItems = [
  { label: 'ตรวจสอบสถานะคำขอ', path: '/check-status' },
]

export default function MainLayout() {
  const location = useLocation()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      {/* Header bar */}
      <AppBar
        position="sticky"
        elevation={0}
        color="inherit"
        sx={{
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2, minHeight: 64 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 1,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: '#1b3752',
                }}
              >
                ระบบแจ้งซ่อมสาธารณูปโภค
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#64748b',
                  display: { xs: 'none', sm: 'inline' },
                }}
              >
                เทศบาลตำบลสงเปลือย
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }} />

            <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    fontSize: '0.875rem',
                    color: location.pathname === item.path ? '#1b3752' : '#64748b',
                    borderRadius: '6px',
                    px: 1.5,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>


          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          borderTop: '1px solid #e2e8f0',
          py: 3,
          mt: 8,
          backgroundColor: '#f8fafc',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1.5}
          >
            <Typography variant="body2" color="text.secondary">
              กองช่าง เทศบาลตำบลสงเปลือย อำเภอกมลาไสย จังหวัดกาฬสินธุ์
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ระบบรับแจ้งเหตุไฟฟ้าสาธารณะและประปาหมู่บ้าน
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}