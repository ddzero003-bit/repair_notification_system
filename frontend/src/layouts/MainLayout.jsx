import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, Typography, Button, Container, Stack,
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'

export default function MainLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      {/* ── Header / Navbar ── */}
      <AppBar
        position="sticky"
        elevation={0}
        color="inherit"
        sx={{
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          zIndex: 1100,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2, minHeight: { xs: 64, md: 72 } }}>
            {/* Logo & Brand */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: '#dbeafe',
                    transform: 'scale(1.03)',
                  },
                }}
              >
                <BuildRoundedIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '0.975rem', sm: '1.075rem' },
                    color: '#0f172a',
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                  }}
                >
                  ระบบแจ้งซ่อมสาธารณูปโภค
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    display: 'block',
                    mt: 0.25,
                  }}
                >
                  เทศบาลตำบลสงเปลือย · จังหวัดกาฬสินธุ์
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* Desktop Navigation */}
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <Button
                component={Link}
                to="/check-status"
                startIcon={<SearchRoundedIcon sx={{ fontSize: 19 }} />}
                sx={{
                  fontWeight: location.pathname === '/check-status' ? 700 : 600,
                  fontSize: '0.9rem',
                  color: location.pathname === '/check-status' ? '#2563eb' : '#475569',
                  backgroundColor: location.pathname === '/check-status' ? '#eff6ff' : 'transparent',
                  borderRadius: '10px',
                  px: 2,
                  py: 1,
                  '&:hover': { backgroundColor: '#f1f5f9', color: '#0f172a' },
                }}
              >
                ตรวจสอบสถานะคำขอ
              </Button>

              <Button
                component={Link}
                to="/line-oa"
                variant="contained"
                startIcon={<ChatBubbleRoundedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  backgroundColor: '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  borderRadius: '10px',
                  px: 2.25,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' },
                }}
              >
                แจ้งซ่อมผ่าน LINE OA
              </Button>

              <Box sx={{ width: '1px', height: 24, backgroundColor: '#e2e8f0', mx: 0.5 }} />

              <Button
                component={Link}
                to="/login"
                startIcon={<LockOutlinedIcon sx={{ fontSize: 17 }} />}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: '#64748b',
                  borderRadius: '10px',
                  px: 1.5,
                  py: 1,
                  '&:hover': { color: '#0f172a', backgroundColor: '#f8fafc' },
                }}
              >
                สำหรับเจ้าหน้าที่
              </Button>
            </Stack>

            {/* Mobile Hamburger Button */}
            <IconButton
              onClick={handleDrawerToggle}
              aria-label="เปิดเมนู"
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                color: '#334155',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 290,
            p: 2.5,
            backgroundColor: '#ffffff',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
              }}
            >
              <BuildRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
              เมนูหลัก
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleDrawerToggle}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List disablePadding>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to="/line-oa"
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '10px',
                py: 1.25,
                '&:hover': { backgroundColor: '#1d4ed8' },
              }}
            >
              <ChatBubbleRoundedIcon sx={{ mr: 1.5, fontSize: 19 }} />
              <ListItemText
                primary="แจ้งซ่อมผ่าน LINE OA"
                primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to="/check-status"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                py: 1.25,
              }}
            >
              <SearchRoundedIcon sx={{ mr: 1.5, fontSize: 20, color: '#2563eb' }} />
              <ListItemText
                primary="ตรวจสอบสถานะคำขอ"
                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mt: 2 }}>
            <ListItemButton
              component={Link}
              to="/login"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                py: 1.25,
              }}
            >
              <LockOutlinedIcon sx={{ mr: 1.5, fontSize: 18, color: '#64748b' }} />
              <ListItemText
                primary="เข้าสู่ระบบเจ้าหน้าที่"
                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* ── Main Content ── */}
      <Box component="main" sx={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Outlet />
      </Box>

      {/* ── Modern Minimal Footer ── */}
      <Box
        component="footer"
        sx={{
          borderTop: '1px solid #e2e8f0',
          py: { xs: 4, md: 5 },
          backgroundColor: '#f8fafc',
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.6fr 1fr 1fr 1.6fr' },
              gap: { xs: 3, md: 4 },
              mb: 4,
            }}
          >
            {/* Col 1: หน่วยงาน */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    backgroundColor: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb',
                  }}
                >
                  <BuildRoundedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                  ระบบแจ้งซ่อมสาธารณูปโภค
                </Typography>
              </Box>
              <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.7, maxWidth: 360 }}>
                กองช่าง สำนักงานเทศบาลตำบลสงเปลือย อำเภอนามน จังหวัดกาฬสินธุ์
                มุ่งมั่นให้บริการประชาชนอย่างรวดเร็ว โปร่งใส และตรวจสอบได้ในทุกขั้นตอน
              </Typography>
            </Box>

            {/* Col 2: บริการออนไลน์ */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1.5 }}>
                บริการออนไลน์
              </Typography>
              <Stack spacing={1}>
                <Typography
                  component={Link}
                  to="/line-oa"
                  variant="body2"
                  sx={{ color: '#475569', textDecoration: 'none', '&:hover': { color: '#2563eb' } }}
                >
                  แจ้งซ่อมผ่าน LINE OA
                </Typography>
                <Typography
                  component={Link}
                  to="/check-status"
                  variant="body2"
                  sx={{ color: '#475569', textDecoration: 'none', '&:hover': { color: '#2563eb' } }}
                >
                  ตรวจสอบสถานะคำขอ
                </Typography>
              </Stack>
            </Box>

            {/* Col 3: สำหรับเจ้าหน้าที่ */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1.5 }}>
                สำหรับเจ้าหน้าที่
              </Typography>
              <Stack spacing={1}>
                <Typography
                  component={Link}
                  to="/login"
                  variant="body2"
                  sx={{ color: '#475569', textDecoration: 'none', '&:hover': { color: '#2563eb' } }}
                >
                  เข้าสู่ระบบเจ้าหน้าที่
                </Typography>
              </Stack>
            </Box>

            {/* Col 4: ข้อมูลการติดต่อ */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1.5 }}>
                ติดต่อเทศบาล
              </Typography>
              <Stack spacing={1.25}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 18, color: '#2563eb', mt: 0.2, flexShrink: 0 }} />
                  <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.5, fontSize: '0.85rem' }}>
                    เลขที่ 304 หมู่ 5 ต.สงเปลือย อ.นามน จ.กาฬสินธุ์ 46230
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneRoundedIcon sx={{ fontSize: 17, color: '#2563eb', flexShrink: 0 }} />
                  <Typography
                    component="a"
                    href="tel:043019758"
                    variant="body2"
                    sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem', '&:hover': { color: '#2563eb' } }}
                  >
                    โทร: 043-019758
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MailOutlineRoundedIcon sx={{ fontSize: 17, color: '#2563eb', flexShrink: 0 }} />
                  <Typography
                    component="a"
                    href="mailto:saraban_05460202@dla.go.th"
                    variant="body2"
                    sx={{
                      color: '#475569',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      wordBreak: 'break-all',
                      '&:hover': { color: '#2563eb' },
                    }}
                  >
                    E-Mail: saraban_05460202@dla.go.th
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#e2e8f0', mb: 3 }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 1.5,
            }}
          >
            <Typography variant="caption" color="#64748b" sx={{ fontSize: '0.8rem' }}>
              © 2026 ระบบแจ้งซ่อมสาธารณูปโภค · เทศบาลตำบลสงเปลือย
            </Typography>
            <Typography variant="caption" color="#94a3b8" sx={{ fontSize: '0.75rem' }}>
              บริการประชาชนด้วยหัวใจ พัฒนาคุณภาพชีวิตชุมชน
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}